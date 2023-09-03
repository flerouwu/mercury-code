use std::fs::File;
use std::io::{BufReader, Read, Write};
use std::ops::Index;
use std::path::PathBuf;
use std::sync::Mutex;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, command, Manager, State};
use uuid::Uuid;

pub(crate) struct EditorState {
    pub open_folder: Option<PathBuf>,
    pub editors: Vec<Editor>,

    /// UUID of the current editor. None if no editor is active.
    pub current_editor: Option<String>,
}

impl EditorState {
    pub(crate) fn default() -> EditorState {
        EditorState {
            open_folder: None,
            editors: vec![],
            current_editor: None,
        }
    }
}

#[derive(Clone, Serialize, Deserialize)]
pub(crate) struct Editor {
    pub uuid: String,
    pub name: Option<String>,
    pub path: Option<PathBuf>,
    pub content: Option<String>,
    pub unsaved: bool,
}

impl Editor {
    /// Attempts to create an Editor from a PathBuf
    /// TODO: Add proper error handling for file permissions
    pub fn from_file(path: PathBuf) -> Editor {
        if !path.is_file() { panic!("path is not a file") }

        let file = File::open(&path).expect("unable to open file");
        let mut buffered = BufReader::new(file);
        let mut contents = String::new();

        let result = buffered.read_to_string(&mut contents);
        let mut was_error = false;
        if result.is_err() {
            contents = format!("Error while loading file: {:?}", result.err());
            was_error = true;
        }

        Editor {
            uuid: Uuid::new_v4().to_string(),
            name: Some((*path.file_name().unwrap().to_str().unwrap().to_owned()).parse().unwrap()),
            path: Some(path.to_path_buf()),
            content: Some(contents),
            unsaved: was_error,
        }
    }

    /// Creates a new Editor struct, with a name
    pub fn new(name: String) -> Editor {
        Editor {
            uuid: Uuid::new_v4().to_string(),
            name: Some(name),
            path: None,
            content: None,
            unsaved: true,
        }
    }

    /// Attempts to create the `self.path` file, write `self.edited_content` to it, and then clears edited content.
    ///
    /// This will panic if:
    /// - path is None
    /// - unable to create the file
    /// - unable to write to the file
    ///
    /// TODO: Allow saving of an empty `content`?
    pub fn save(&mut self) {
        let mut file = File::create(self.path.clone().expect("path is None")).expect("unable to create file");
        file.write_all(self.content.clone().expect("content is None").as_ref()).expect("unable to write to file");
        self.unsaved = false;
    }
}

/*
 * Tauri Commands
 */

/// Creates a new blank editor with a name.
#[command]
pub(crate) fn editors_new(handle: AppHandle, state: State<'_, Mutex<EditorState>>, name: String) -> Editor {
    println!("[NEW] A new editor was created with name {}", &name);

    let editor = Editor::new(name);
    let mut lock = state.lock().unwrap();
    lock.editors.push(editor.clone());
    handle.emit_all("editors_all_update", ()).expect("unable to emit event");

    editor
}

/// Creates a new editor with the path to a file.
#[command]
pub(crate) fn editors_from_file(handle: AppHandle, state: State<'_, Mutex<EditorState>>, path: String) -> Editor {
    println!("[NEW] A new editor was created from file {}", &path);

    let editor = Editor::from_file(PathBuf::from(path));
    let mut lock = state.lock().unwrap();
    lock.editors.push(editor.clone());
    handle.emit_all("editors_all_update", ()).expect("unable to emit event");

    editor
}

/// Returns all the editors.
#[command]
pub(crate) fn editors_get_all(state: State<'_, Mutex<EditorState>>) -> Vec<Editor> {
    let lock = state.lock().unwrap();

    println!("[GET] All editors were retrieved.");
    lock.editors.to_vec()
}

/// Sets all editors to the value provided.
#[command]
pub(crate) fn editors_set_all(handle: AppHandle, state: State<'_, Mutex<EditorState>>, editors: Vec<Editor>) {
    let mut lock = state.lock().unwrap();
    lock.editors = editors;
    handle.emit_all("editors_all_update", ()).expect("unable to emit event");

    println!("[SET] All editors were replaced.");
}

/// Gets the current editor.
#[command]
pub(crate) fn editors_get_current(state: State<'_, Mutex<EditorState>>) -> Option<Editor> {
    let lock = state.lock().unwrap();
    lock.current_editor.as_ref()?;

    let editor = lock.editors.iter()
        .find(|e| e.uuid.eq_ignore_ascii_case(&lock.current_editor.clone().unwrap()))
        .cloned();

    println!("[GET] Current Editor");
    editor
}

/// Sets the current editor.
#[command]
pub(crate) fn editors_set_current(handle: AppHandle, state: State<'_, Mutex<EditorState>>, uuid: Option<String>) {
    let mut lock = state.lock().unwrap();

    println!("[SET] Current editor was set to {:?}", &uuid);
    lock.current_editor = uuid; // FIXME: Not setting state??
    handle.emit_all("editors_current_update", ()).expect("unable to emit event");
}

/// Updates an editor by it's UUID
#[command]
pub(crate) fn editors_update_editor(handle: AppHandle, state: State<'_, Mutex<EditorState>>, editor: Editor) {
    let mut lock = state.lock().unwrap();
    let index = lock.editors.iter()
        .position(|e| e.uuid.eq_ignore_ascii_case(&editor.uuid))
        .expect("editor uuid isn't in the vector");

    println!("[UPDATE] Editor {} was updated.", &editor.uuid);
    lock.editors[index] = editor;
    handle.emit_all("editors_all_update", ()).expect("unable to emit event");

}

/// Saves the editor provided by `editor`
#[command]
pub(crate) fn editors_save_editor(handle: AppHandle, state: State<'_, Mutex<EditorState>>, uuid: String) {
    let lock = state.lock().unwrap();
    let editor = lock.editors.iter()
        .find(|e| e.uuid.eq_ignore_ascii_case(&uuid))
        .cloned();

    editor.unwrap().save();
    handle.emit_all("editors_all_update", ()).expect("unable to emit event");

    println!("[SAVE] Editor {} was saved.", uuid);
}
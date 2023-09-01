use tauri::{AppHandle, command, State};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_fs::FsExt;
use crate::EditorState;

#[command]
pub(crate) fn open_folder(app: AppHandle, editor: State<EditorState>) -> Option<String> {
    let dialog = app.dialog().file();
    let path = dialog.blocking_pick_folder();

    return match path.is_some() {
        true => {
            let buf = path.expect("Unable to get path from pick_folder");
            let mut folder_lock = editor.open_folder.lock().expect("Unable to acquire lock");
            let folder = folder_lock.insert(buf);
            Some(folder.to_str().expect("Unable to convert pathbuf to str").to_owned())
        },
        false => None
    }
}

#[command]
pub(crate) fn get_open_folder(editor: State<EditorState>) -> Option<String> {
    let folder_lock = editor.open_folder.lock().unwrap();

    return match folder_lock.is_some() {
        true => Some(folder_lock
            .clone()
            .expect("Unable to get path")
            .to_str()
            .expect("Unable to convert pathbuf to str")
            .to_owned()),
        false => None
    }
}

#[command]
pub(crate) fn close_folder(editor: State<EditorState>) {
    let mut lock = editor.open_folder.lock().expect("Unable to lock open_folder").as_mut();
    lock = None;
}

#[command]
pub(crate) fn allow_fs_scope(handle: AppHandle, path: String) -> bool {
    let _ = handle.fs_scope().allow_directory(&path, true);
    handle.fs_scope().is_allowed(&path)
}
use std::sync::Mutex;
use tauri::{AppHandle, command, Manager, State};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_fs::FsExt;
use crate::EditorState;

#[command]
pub(crate) fn open_folder(handle: AppHandle, state: State<'_, Mutex<EditorState>>) -> Option<String> {
    let dialog = handle.dialog().file();
    let path = dialog.blocking_pick_folder();

    return match path.is_some() {
        true => {
            let buf = path.expect("Unable to get path from pick_folder");
            let mut lock = state.lock().unwrap();
            let folder = lock.open_folder.insert(buf);
            handle.emit_all("workspace_folder_update", ()).expect("unable to emit event");

            let final_folder = folder.to_str().expect("Unable to convert pathbuf to str").to_owned();
            println!("[FOLDER_OPEN] {}", final_folder);
            Some(final_folder)
        },
        false => None
    }
}

#[command]
pub(crate) fn get_open_folder(state: State<'_, Mutex<EditorState>>) -> Option<String> {
    let lock = state.lock().unwrap();

    println!("[GET] Open Folder");
    return match lock.open_folder.is_some() {
        true => Some(lock.open_folder
            .clone()
            .expect("Unable to get path")
            .to_str()
            .expect("Unable to convert pathbuf to str")
            .to_owned()),
        false => None
    }
}

#[command]
pub(crate) fn close_folder(handle: AppHandle, state: State<'_, Mutex<EditorState>>) {
    let mut lock = state.lock().unwrap();
    lock.open_folder = None;
    handle.emit_all("workspace_folder_update", ()).expect("unable to emit event");

    println!("[SET] Open Folder was set to None");
}

#[command]
pub(crate) fn allow_fs_scope(handle: AppHandle, path: String) -> bool {
    let _ = handle.fs_scope().allow_directory(&path, true);

    println!("[FS_SCOPE] Allowed for {}", path);
    handle.fs_scope().is_allowed(&path)
}

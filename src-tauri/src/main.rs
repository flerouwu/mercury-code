// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::path::PathBuf;
use std::sync::Mutex;
use tauri_plugin_fs::FsExt;

mod cmd;

pub(crate) struct EditorState {
    pub open_folder: Mutex<Option<PathBuf>>,
    pub open_files: Mutex<Vec<PathBuf>>,
}

impl EditorState {
    pub(crate) fn default() -> EditorState {
        EditorState {
            open_folder: Mutex::new(None),
            open_files: Mutex::new(vec![]),
        }
    }
}

fn main() {
    let app = tauri::Builder::default()
        // Plugins
        .plugin(tauri_plugin_app::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_window::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())

        // States
        .manage(EditorState::default())

        // Commands
        .invoke_handler(tauri::generate_handler![
            cmd::get_open_folder,
            cmd::open_folder,
            cmd::close_folder,
            cmd::allow_fs_scope,
        ])

        // Run
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    // Run app
    app.run(|_handle, event| match event {
        _ => {}
    })
}

// Prevents additional console window on Windows in release
#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::sync::Mutex;
use crate::commands::{cmd, editors};
use crate::commands::editors::EditorState;

mod commands;

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
        .manage(Mutex::new(EditorState::default()))

        // Commands
        .invoke_handler(tauri::generate_handler![
            cmd::get_open_folder,
            cmd::open_folder,
            cmd::close_folder,
            cmd::allow_fs_scope,

            editors::editors_new,
            editors::editors_from_file,
            editors::editors_get_all,
            editors::editors_set_all,
            editors::editors_get_current,
            editors::editors_set_current,
            editors::editors_save_editor,
            editors::editors_update_editor,
        ])

        // Run
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    // Run app
    app.run(|_handle, event| match event {
        _ => {}
    })
}

[type-editor]: ./editors.rs#L24

# Tauri API Commands

## General

| Command                        | Return Value   | Description                                                                       |
|:-------------------------------|:---------------|:----------------------------------------------------------------------------------|
| `open_folder()`                | Option<String> | Prompts the user with a folder dialog to open a folder.                           |
| `get_open_folder()`            | Option<String> | Returns the currently opened folder.                                              |
| `close_folder()`               |                | Closes the current folder.                                                        |
| `allow_fs_scope(path: String)` | bool           | Allows a directory through the tauri_plugin_fs crate. Returns true if successful. |

## Editors

| Command                                     | Return Value                  | Description                                                                                        |
|:--------------------------------------------|:------------------------------|:---------------------------------------------------------------------------------------------------|
| `editors_new(name: String)`                 | [Editor][type-editor]         | Creates a new blank editor.                                                                        |
| `editors_from_file(path: String)`           | [Editor][type-editor]         | Creates a new editor with the content from a file.                                                 |
| `editors_get_all()`                         | Vec<[Editor][type-editor]>    | Gets all editors that are in the state.                                                            |   
| `editors_set_all(editors: Vec<Editors>)`    |                               | Sets the vector of editors to the one provided. This does not keep the previous editors!           | 
| `editors_get_current()`                     | Option<[Editor][type-editor]> | Gets the current editor (or None if no current).                                                   |
| `editors_set_current(uuid: Option<String>)` |                               | Sets the current editor by it's UUID (or use None to remove it).                                   |
| `editors_save_editor(uuid: String)`         |                               | Saves an editor by it's UUID.                                                                      |
| `editors_update_editor(editor: Editor`      |                               | Updates an editor. **Note:** the editor to be updated should have the same UUID. Panics otherwise. |
# Events

List of all events that are sent via the Tauri event system (`@tauri-apps/api/event`).

## Editor Updates

| Name                      | Reason                                                                                       |
|:--------------------------|:---------------------------------------------------------------------------------------------|
| `editors_all_update`      | The vector of editors has been changed in some way (cleared, item added, item removed, etc.) |
| `editors_current_update`  | The current editor has been changed.                                                         |
| `workspace_folder_update` | The workspace folder has been changed (such as a folder being opened).                       |
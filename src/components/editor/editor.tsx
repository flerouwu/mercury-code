import { FILE_ASSOCIATIONS } from "@/data/file-associations"
import { ViewUpdate } from "@codemirror/view"
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night"
import CodeMirror from "@uiw/react-codemirror"
import { useCallback } from "react"
import { Extension } from "@codemirror/state"
import { useHotkeys } from "react-hotkeys-hook"
import { invoke } from "@tauri-apps/api/tauri"
import { writeTextFile } from "@tauri-apps/plugin-fs"

export interface EditorProps {
	uuid: string // UUID
	name: string
	path?: string
	savedContent?: string,
	content?: string
	needsToSave: boolean
}

export function Editor({
	uuid,
	name,
	path,
	content,
	savedContent,
	needsToSave,
	onUpdate,
}: EditorProps & { onUpdate: (editor: EditorProps) => void }) {
	// Save hotkey
	useHotkeys("ctrl+s", () => {
		if (path == undefined) {
			// Request save file path
			alert("Cannot request the save file path! (it's not implemented lmao)")
		} else {
			writeTextFile(path!!, content!!).then(() => {
				needsToSave = false;
				savedContent = content;
				onUpdate({ uuid, name, path, savedContent, content, needsToSave })
				alert("Saved file!")
			}).catch((err) => {
				alert("Failed to save file! Error: " + err)
			})
		}
	}, { preventDefault: true }, [])

	// Language Detection
	const filename = path?.split("/").findLast(() => true)
	const language = filename
		? FILE_ASSOCIATIONS.find((assoc) =>
			assoc.extensions.map((ext) => ext.test(filename)).length > 0)
		: undefined

	const extensions: Extension[] = []
	if (language != undefined) extensions.push(language.language)

	// On Change callback
	const onChange = useCallback((value: string, view: ViewUpdate) => {
		content = value
		needsToSave = true
		onUpdate({ uuid, name, path, content, needsToSave })
	}, [])

	return (
		<CodeMirror
			value={content ?? savedContent}
			extensions={extensions}
			theme={tokyoNight}
			onChange={onChange}
			placeholder="Start typing..."
		/>
	)
}

import { FILE_ASSOCIATIONS } from "@/data/file-associations"
import { EditorState, Extension } from "@codemirror/state"
import { EditorView, ViewUpdate } from "@codemirror/view"
import { invoke } from "@tauri-apps/api/tauri"
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night"
import CodeMirror, { Statistics } from "@uiw/react-codemirror"
import { useCallback, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { ScrollArea } from "../ui/scroll-area"
import { useTheme } from "next-themes"
import { useToast } from "../ui/use-toast"
import { Slot } from "@radix-ui/react-slot"

export interface EditorProps {
	uuid: string // UUID
	name?: string
	path?: string
	content?: string
	unsaved: boolean
}

export function Editor({
	uuid,
	name,
	path,
	content,
	unsaved,
}: EditorProps) {
	// #region Language Detection
	// TODO: Use regex? to detect language based on content, rather than file name.
	const filename = path?.split("/").pop(); // Use pop() to get the last part of the path
	const language = filename
		? FILE_ASSOCIATIONS.find((assoc) =>
			assoc.extensions.some((ext) => ext.test(filename))
		)
		: undefined;

	const extensions: Extension[] = []
	if (language != undefined) extensions.push(language.language)
	// #endregion

	// #region On Change callback
	let changeTimeout: NodeJS.Timeout | undefined // prevents weird bugs, and only updates the backend every second
	const onChange = useCallback((value: string, view: ViewUpdate) => {
		if (changeTimeout) clearTimeout(changeTimeout)
		content = value
		unsaved = true

		changeTimeout = setTimeout(() => {
			invoke("editors_update_editor", { uuid: uuid, editor: { uuid, name, path, content, unsaved } })
		}, 1000)
	}, [])
	// #endregion

	// #region Editor
	const [stats, setStats] = useState<Statistics | null>(null)
	const onCreateEditor = useCallback((data: Statistics) => {
		setStats(data)
	}, [])
	// #endregion

	return (
		<div className="grid h-full grid-rows-2" style={{ gridTemplateRows: "1fr min-content" }}>
			<ScrollArea>
				<CodeMirror
					value={content ?? undefined}
					extensions={extensions}
					theme={"dark"}
					onChange={onChange}
					onStatistics={onCreateEditor}
					placeholder="Start typing..."
					autoFocus
				/>
			</ScrollArea>

			<div className="flex flex-row items-center justify-between w-full h-10 p-1 border-t bg-background">
				{/* Left */}
				<div className="flex flex-row gap-4">
					{/* Line / Column Count */}
					<span>Line {stats?.line.number} Column {(stats?.selection.ranges[0].head ?? 0) - (stats?.line.from ?? 0) + 1}</span>
				</div>

				i love refrigerators

				{/* Right */}
				<div className="flex flex-row gap-4">
					{/* Language */}
					<span>{language?.name ?? "Text"}</span>
				</div>
			</div>
		</div>
	)
}

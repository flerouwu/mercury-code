import { tauriCommands, useTauri } from "@/hooks/use-tauri"
import { X } from "lucide-react"
import { useCallback, useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog"
import { TabsTrigger } from "../ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { EditorProps } from "./editor"
import { useLog } from "@/hooks/use-log"

export function EditorTab({
	editor,
}: {
	editor: EditorProps
}) {
	const { data: editors, setData: setEditors, updateData: updateEditors, dispatchData: dispatchEditors } = useTauri<EditorProps[]>(tauriCommands.allEditors)
	const { data: current, setData: setCurrent, dispatchData: dispatchCurrent } = useTauri<string | null>(tauriCommands.currentEditor)
	const [dialogOpen, setDialogOpen] = useState<boolean>(false)

	/// Function to edit values and close tabs
	const closeTab = useCallback(() => {
		setDialogOpen(false)

		const newEditors = editors != null ? [...editors.filter((e) => e.uuid != editor.uuid)] : []
		console.log("New Editors:", newEditors)
		setEditors(newEditors) // Update frontend
		dispatchEditors(newEditors) // Dispatch to Tauri

		setCurrent(null) // Update frontend
		dispatchCurrent(null) // Dispatch to Tauri
	}, [editors])

	console.log(`EditorTab(${editor.uuid}): `, editor)

	return (
		<Tooltip key={editor.uuid}>
			<TooltipTrigger>
				<TabsTrigger value={editor.uuid} onClick={() => {
					useLog(`EditorTab(${editor.uuid})`, "blue", "Setting to current and dispatching...")
					setCurrent(editor.uuid)
					dispatchCurrent(editor.uuid)
				}} className="p-1.5">
					{editor.unsaved ? "*" : ""}
					{editor.name}

					<Dialog open={dialogOpen} onOpenChange={(open) => {
						if (editor.unsaved) return setDialogOpen(open)
						else closeTab()
					}}>
						<DialogTrigger className="flex">
							<Button variant="ghost" size="icon" className="w-4 h-4 p-0 ml-2 rounded-sm">
								<X />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>Do you want to save your changes?</DialogHeader>
							<DialogDescription>Your changes will be lost if you continue.</DialogDescription>
							<DialogFooter>
								<Button variant="ghost" onClick={() => setDialogOpen(false)}>
									Cancel
								</Button>
								<Button onClick={() => alert("Not implemented!")}>Save</Button>
								<Button
									variant="destructive"
									onClick={closeTab}
								>
									Don't Save
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</TabsTrigger>
			</TooltipTrigger>
			<TooltipContent side="bottom">{editor.path ?? "Unsaved"}</TooltipContent>
		</Tooltip>
	)
}

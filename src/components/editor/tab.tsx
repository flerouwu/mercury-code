import { Dispatch, useCallback, useContext, useState } from "react"
import { EditorProps } from "./editor"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { TabsTrigger } from "../ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { EditorsContext } from "@/app/providers"

export function EditorTab({
	editor,
	setCurrentEditor,
}: {
	editor: EditorProps
	setCurrentEditor: Dispatch<string | null>
}) {
	const { editors, setEditors } = useContext(EditorsContext)
	const [dialogOpen, setDialogOpen] = useState<boolean>(false)

	const closeTab = useCallback(() => {
		setDialogOpen(false)

		delete editors!![editor.uuid]
		setEditors!!(editors!!)
		setCurrentEditor(null)
	}, [])

	return (
		<Tooltip key={editor.uuid}>
			<TooltipTrigger>
				<TabsTrigger value={editor.uuid} onClick={() => setCurrentEditor(editor.uuid)} className="p-1.5">
					{editor.needsToSave ? "*" : ""}
					{editor.name}

					<Dialog open={dialogOpen} onOpenChange={(open) => {
						if (editor.needsToSave) return setDialogOpen(open)
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

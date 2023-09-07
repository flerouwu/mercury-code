"use client"

import { Editor, EditorProps } from "@/components/editor/editor"
import { EditorTab } from "@/components/editor/tab"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { tauriCommands, useTauri } from "@/hooks/use-tauri"
import { invoke } from "@tauri-apps/api/tauri"
import { Plus } from "lucide-react"
import { useCallback } from "react"

export default function App() {
  const { data: editors, setData: setEditors, updateData: updateEditors, dispatchData: dispatchEditors } = useTauri<EditorProps[]>(tauriCommands.allEditors)
  const { data: current, setData: setCurrent, updateData: updateCurrent, dispatchData: dispatchCurrent } = useTauri<string | null>(tauriCommands.currentEditor)
  const { toast } = useToast()

  return (
    <TooltipProvider>
      <Tabs className="w-full h-full">
        <TabsList className="justify-start w-full border-b rounded-none">
          <Button
            variant="ghost"
            size="icon"
            className="mr-1"
            onClick={() => {
              invoke<EditorProps>("editors_new", { name: "Untitled" }).then((editor) => {
                updateEditors()

                console.log("New Editor: ", editor);
                setCurrent(editor.uuid)
                dispatchCurrent(editor.uuid) // Dispatch to Tauri
              }).catch((err) => {
                toast({
                  title: "Error Creating New Editor",
                  description: err,
                  variant: "destructive",
                })
              })
            }}
          >
            <Plus />
          </Button>

          <TabsTrigger value="mercury:get-started" onClick={() => {
            setCurrent(null)
            dispatchCurrent(null)
          }}>
            Getting Started
          </TabsTrigger>

          {Object.values(editors ?? []).map((editor) => (
            <EditorTab editor={editor} />
          ))}
        </TabsList>

        <TabsContent value="mercury:get-started">
          <main className="flex flex-col justify-center w-full h-full p-8">
            <h1 className="text-3xl font-bold">Get Started</h1>
            <p className="w-1/3">Open a folder, some files, or configure settings in the sidebar.</p>
          </main>
        </TabsContent>

        {Object.values(editors ?? []).map((editor) => (
          <TabsContent key={editor.uuid} value={editor.uuid} className="h-full mt-0">
            <Editor {...editor} />
          </TabsContent>
        ))}
      </Tabs>
    </TooltipProvider>
  )
}
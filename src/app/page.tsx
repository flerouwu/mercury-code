"use client"

import { Editor, EditorProps } from "@/components/editor/editor"
import { EditorTab } from "@/components/editor/tab"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Plus } from "lucide-react"
import { useCallback, useContext } from "react"
import { v4 as uuid } from "uuid"
import { CurrentEditorContext, EditorsContext } from "./providers"

export default function App() {
  const { editors, setEditors } = useContext(EditorsContext)
  const { currentEditor, setCurrentEditor } = useContext(CurrentEditorContext)

  const onEditorUpdate = useCallback((editor: EditorProps) => {
    editors[editor.uuid] = editor
    setEditors(editors)
  }, [])

  return (
    <TooltipProvider>
      <Tabs value={currentEditor ?? "mercury:get-started"} className="w-full h-full">
        <TabsList className="justify-start w-full border-b rounded-none">
          <Button
            variant="ghost"
            size="icon"
            className="mr-1"
            onClick={() => {
              const newEditor = {
                uuid: uuid(),
                name: "Untitled",
                needsToSave: true,
              }

              editors[newEditor.uuid] = newEditor
              setEditors(editors)
              setCurrentEditor(newEditor.uuid)
            }}
          >
            <Plus />
          </Button>

          <TabsTrigger value="mercury:get-started" onClick={() => setCurrentEditor(null)}>
            Getting Started
          </TabsTrigger>

          {Object.values(editors).map((editor) => (
            <EditorTab editor={editor} setCurrentEditor={setCurrentEditor} />
          ))}
        </TabsList>

        <TabsContent value="mercury:get-started">
          <main className="flex flex-col justify-center w-full h-full p-8">
            <h1 className="text-3xl font-bold">Get Started</h1>
            <p className="w-1/3">Open a folder, some files, or configure settings in the sidebar.</p>
          </main>
        </TabsContent>

        {Object.values(editors).map((editor) => (
          <TabsContent key={editor.uuid} value={editor.uuid} className="h-full mt-0">
            <Editor {...editor} onUpdate={onEditorUpdate} />
          </TabsContent>
        ))}
      </Tabs>
    </TooltipProvider>
  )
}
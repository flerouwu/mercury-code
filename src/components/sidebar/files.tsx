"use client"

import { invoke } from "@tauri-apps/api/tauri"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { DirectoryProps, FileCard, FolderCard } from "./file-cards"
import { TooltipProvider } from "../ui/tooltip"
import { FileEntry, readDir } from "@tauri-apps/plugin-fs"
import { ScrollArea } from "../ui/scroll-area"
import { tauriCommands, useTauri } from "@/hooks/use-tauri"
import { useToast } from "../ui/use-toast"

export const mapAndSortFiles = (files: FileEntry[]): DirectoryProps[] => {
  return files
    .map((entry) => ({
      name: entry.name,
      location: entry.path,
      children: entry.children && mapAndSortFiles(entry.children),
    }))
    .sort((a, b) => {
      if (a.children == undefined && b.children == undefined)
        return (a.name ?? a.location).localeCompare(b.name ?? b.location)
      else if (a.children == undefined) return 1
      else if (b.children == undefined) return -1

      return 0
    }) as DirectoryProps[]
}

export function FilesSidebar() {
  const { data: folder } = useTauri<string | null>(tauriCommands.openFolder)

  if (folder == null) return <ChooseFolder />
  else return <FileList />
}

function FileList() {
  const { data: folder } = useTauri<string | null>(tauriCommands.openFolder)
  const [files, setFiles] = useState<DirectoryProps[]>([])

  useEffect(() => {
    console.log("Trying to allow fs scope to " + folder)
    invoke("allow_fs_scope", { path: folder }).then((success) => {
      if (success == false) {
        return
      }

      readDir(folder!!, { recursive: false }).then((files) => {
        setFiles(mapAndSortFiles(files))
      })
    })
  }, [folder])

  return (
    <TooltipProvider>
      <ScrollArea className="flex flex-col w-full h-full">
        {files.map((file) => {
          if (file.children != undefined) {
            return <FolderCard key={file.location} files={file.children} name={file.name} location={file.location} />
          } else {
            return <FileCard key={file.location} name={file.name} location={file.location} />
          }
        })}
      </ScrollArea>
    </TooltipProvider>
  )
}

function ChooseFolder() {
  const { toast } = useToast()

  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="text-xl font-semibold">No Workspace</h3>
      <p>Open a folder or file below.</p>

      <div className="flex flex-col gap-4 py-8">
        <Button
          variant="secondary"
          onClick={() => {
            invoke("open_folder") // result is handled by events
          }}
        >
          Open Folder
        </Button>

        <Button variant="secondary" onClick={() => toast({
          title: "Not Implemented",
          description: "You cannot load individual files yet.",
          variant: "destructive",
        })}>
          Open File
        </Button>
      </div>
    </div>
  )
}

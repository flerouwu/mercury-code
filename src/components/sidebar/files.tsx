"use client"

import { invoke } from "@tauri-apps/api/tauri"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { DirectoryProps, FileCard, FolderCard } from "./file-cards"
import { TooltipProvider } from "../ui/tooltip"
import { FileEntry, readDir } from "@tauri-apps/plugin-fs"
import { ScrollArea } from "../ui/scroll-area"

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
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)

  useEffect(() => {
    invoke("get_open_folder").then((res) => setCurrentFolder(res as string))
  }, [])

  if (currentFolder == null) return <ChooseFolder onSelect={(folder) => setCurrentFolder(folder)} />
  else return <FileList folder={currentFolder} />
}

function FileList({ folder }: { folder: string }) {
  const [files, setFiles] = useState<DirectoryProps[]>([])

  useEffect(() => {
    console.log("Trying to allow fs scope to " + folder)
    invoke("allow_fs_scope", { path: folder }).then((success) => {
      if (success == false) {
        alert("Unable to allow fs scope!")
        return
      }

      readDir(folder, { recursive: false }).then((files) => {
        setFiles(mapAndSortFiles(files))
      })
    })
  }, [])

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

function ChooseFolder({ onSelect }: { onSelect: (folder: string) => void }) {
  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="text-xl font-semibold">No Workspace</h3>
      <p>Open a folder or file below.</p>

      <div className="flex flex-col gap-4 py-8">
        <Button
          variant="secondary"
          onClick={() => {
            invoke("open_folder").then((folder) => onSelect(folder as string))
          }}
        >
          Open Folder
        </Button>

        <Button variant="secondary" onClick={() => alert("Doesn't do anything!")}>
          Open File
        </Button>
      </div>
    </div>
  )
}

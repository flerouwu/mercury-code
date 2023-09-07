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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { FilePlus, FolderPlus } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { createDir, writeTextFile } from "@tauri-apps/plugin-fs"
import path from "path"

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

export function FilesSidebar_NewFile() {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [name, setName] = useState<string | null>(null)
  const { data: folder } = useTauri<string | null>(tauriCommands.openFolder)
  const { toast } = useToast()

  if (folder == null) return <button disabled className="p-1 text-gray-600 rounded-lg"><FilePlus size={22} /></button>

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger className="p-1 rounded-lg hover:bg-accent">
        <FilePlus size={22} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New File</DialogTitle>
          <DialogDescription>{folder}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="file-name" className="text-right">
              File Name
            </Label>
            <Input id="file-name" placeholder="main.rs" className="col-span-3" onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={() => {
            setOpen(false)
            if (name == null || folder == null) {
              toast({
                title: "Name or Folder is Invalid",
                description: "Make sure that a folder is open."
              })
              return
            }

            writeTextFile(path.join(folder, name), "")
          }}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function FilesSidebar_NewFolder() {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [name, setName] = useState<string | null>(null)
  const { data: folder } = useTauri<string | null>(tauriCommands.openFolder)
  const { toast } = useToast()

  if (folder == null) return <button disabled className="p-1 text-gray-600 rounded-lg"><FolderPlus size={22} /></button>

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger className="p-1 rounded-lg hover:bg-accent">
        <FolderPlus size={22} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>{folder}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="folder-name" className="text-right">
              Folder Name
            </Label>
            <Input id="folder-name" placeholder="Cool Folder" className="col-span-3" onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={() => {
            setOpen(false)
            if (name == null || folder == null) {
              toast({
                title: "Name or Folder is Invalid",
                description: "Make sure that a folder is open."
              })
              return
            }

            createDir(path.join(folder, name))
          }}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

import { readDir, readTextFile } from "@tauri-apps/plugin-fs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { DEFAULT_ICON, DIRECTORY_CLOSE_ICON, DIRECTORY_OPEN_ICON, ICONS } from "@/data/file-icons"
import { useContext, useState } from "react"
import { mapAndSortFiles } from "./files"
import { EditorProps } from "../editor/editor"
import { v4 } from "uuid"
import { invoke } from "@tauri-apps/api/tauri"
import { CurrentEditorContext, EditorsContext } from "@/app/providers"

export interface FileProps {
  name: string
  location: string
}

export interface DirectoryProps extends FileProps {
  children?: DirectoryProps[]
}

export function FileCard({ name, location }: FileProps) {
  const { editors, setEditors } = useContext(EditorsContext)
  const { setCurrentEditor } = useContext(CurrentEditorContext)

  const icon =
    ICONS.find((icon) => icon.extensions.map((reg) => reg.test(name)).filter((v) => v == true).length > 0) ||
    DEFAULT_ICON

  return (
    <li className="list-none">
      <button className="w-full p-1 pl-2 text-left hover:bg-accent" onClick={() => {
        const editor: EditorProps = {
          uuid: v4(),
          name: name,
          path: location,
          needsToSave: false,
        }

        // Read content from disk
        readTextFile(location).then((contents) => {
          editor.savedContent = contents

          editors[editor.uuid] = editor
          setEditors(editors)
          setCurrentEditor(editor.uuid)
        })
      }}>
        <Tooltip>
          <TooltipTrigger className="flex flex-row items-center w-full gap-2">
            {icon.icon ?? <img className="w-6 h-6" src={icon.src} />}
            <span className="text-left line-clamp-1">{name}</span>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={5}>
            {location}
          </TooltipContent>
        </Tooltip>
      </button>
    </li>
  )
}

interface FolderProps {
  name: string
  location: string
  files: DirectoryProps[]
}

export function FolderCard({ name, location }: FolderProps) {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [files, setFiles] = useState<DirectoryProps[]>([])

  return (
    <li className="list-none">
      <Collapsible
        onOpenChange={(open) => {
          setOpen(open)
          if (open == true) {
            // Search for files
            readDir(location, { recursive: false }).then((entries) => {
              setFiles(mapAndSortFiles(entries))
            })
          }
        }}
      >
        <CollapsibleTrigger className="w-full p-1 pl-2 text-left hover:bg-accent">
          <Tooltip>
            <TooltipTrigger className="flex flex-row items-center w-full gap-2">
              {isOpen
                ? DIRECTORY_OPEN_ICON.icon ?? <img className="w-6 h-6" src={DIRECTORY_OPEN_ICON.src} />
                : DIRECTORY_CLOSE_ICON.icon ?? <img className="w-6 h-6" src={DIRECTORY_CLOSE_ICON.src} />}
              <span className="text-left line-clamp-1">{name}</span>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={5}>
              {location}
            </TooltipContent>
          </Tooltip>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <ul className="pl-4">
            {files.map((file) => {
              if (file.children != undefined) {
                return (
                  <FolderCard key={file.location} files={file.children} name={file.name} location={file.location} />
                )
              } else {
                return <FileCard key={file.location} name={file.name} location={file.location} />
              }
            })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}

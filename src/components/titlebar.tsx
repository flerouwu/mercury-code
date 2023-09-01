"use client"

import { useCallback } from "react"
import { Orbit } from "lucide-react"
import { WindowTitlebar } from "tauri-controls"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

import { AboutDialog } from "./about-dialog"
import { TitlebarThemeModeToggle } from "./titlebar-theme-mode-toggle"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { invoke } from "@tauri-apps/api"

export function Titlebar() {
  const closeWindow = useCallback(async () => {
    const { appWindow } = await import("@tauri-apps/plugin-window")
    appWindow.close()
  }, [])

  return (
    <WindowTitlebar
    // controlsOrder="left"
    // className="pl-0"
    // windowControlsProps={{ platform: "windows", justify: false }}
    >
      <Menubar className="pl-2 border-b border-none rounded-none lg:pl-3">
        <MenubarMenu>
          {/* App Logo */}
          <div className="inline-flex items-center text-orange-500 h-fit w-fit">
            <Orbit className="w-5 h-5" />
          </div>
        </MenubarMenu>

        {/* Application */}
        <MenubarMenu>
          <MenubarTrigger className="font-bold">Mercury Code</MenubarTrigger>
          <Dialog modal={false}>
            <MenubarContent>
              <DialogTrigger asChild>
                <MenubarItem>About App</MenubarItem>
              </DialogTrigger>

              <MenubarSeparator />

              {/* Preferences */}
              <MenubarItem>
                Preferences... <MenubarShortcut>⌘,</MenubarShortcut>
              </MenubarItem>

              <MenubarSeparator />

              {/* Close Actions */}
              <MenubarItem>Close Editor</MenubarItem>
              <MenubarItem onClick={() => invoke("close_folder")}>Close Folder</MenubarItem>
              <MenubarItem>Reload Project</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => closeWindow()}>Quit Application</MenubarItem>
            </MenubarContent>

            <AboutDialog />
          </Dialog>
        </MenubarMenu>

        {/* File */}
        <MenubarMenu>
          <MenubarTrigger className="relative">File</MenubarTrigger>
          <MenubarContent>
            {/* New Menu */}
            <MenubarSub>
              <MenubarSubTrigger>New</MenubarSubTrigger>
              <MenubarSubContent className="w-[230px]">
                <MenubarItem>
                  File <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Folder <MenubarShortcut>⇧⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Project <MenubarShortcut>⌥⌘N</MenubarShortcut>
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>

            {/* Open Menu */}
            <MenubarSub>
              <MenubarSubTrigger>Open</MenubarSubTrigger>
              <MenubarSubContent className="w-[230px]">
                <MenubarItem>
                  File <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Folder <MenubarShortcut>⇧⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Project <MenubarShortcut>⌥⌘N</MenubarShortcut>
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>

            {/* Recents Menu */}
            <MenubarSub>
              <MenubarSubTrigger>Recents</MenubarSubTrigger>
              <MenubarSubContent className="w-[230px]">
                <MenubarItem>
                  Restore Closed Editor <MenubarShortcut>⇧⌘T</MenubarShortcut>
                </MenubarItem>

                <MenubarSeparator />

                <MenubarItem>Lorem ipsum dolor sit amet.txt</MenubarItem>
                <MenubarItem>Lorem ipsum.mercury-project</MenubarItem>
                <MenubarItem>Lorem ipsum dolor sit.md</MenubarItem>
                <MenubarItem>Lorem ipsum dolor sit amet.txt</MenubarItem>
                <MenubarItem>Lorem ipsum dolor sit amet.txt</MenubarItem>
                <MenubarItem>Lorem ipsum dolor sit amet.txt</MenubarItem>

                <MenubarSeparator />

                <MenubarItem>More...</MenubarItem>
                <MenubarItem>Clear Recents</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>

            <MenubarSeparator />

            {/* Save Section Menu */}
            <MenubarItem>
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Save As <MenubarShortcut>⇧⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Save All <MenubarShortcut>⌥⌘S</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            {/* Share Menu */}
            <MenubarItem>Start Share Session</MenubarItem>
            <MenubarItem disabled>Stop Share Session</MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Session Guests</MenubarSubTrigger>
              <MenubarSubContent>
                {["Jimmy", "Bob", "Sandra", "Anonymous4278"].map((guest) => (
                  <MenubarSub key={guest}>
                    <MenubarSubTrigger>{guest}</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>Info</MenubarItem>
                      <MenubarItem>Chat</MenubarItem>

                      <MenubarSeparator />

                      <MenubarItem>Follow</MenubarItem>
                      <MenubarItem>Goto</MenubarItem>
                      <MenubarItem>Summon</MenubarItem>

                      <MenubarSeparator />

                      <MenubarItem>Kick from Session</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                ))}
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>Open Chat</MenubarItem>

            <MenubarSeparator />

            {/* Misc */}
            <MenubarCheckboxItem checked>Autosave</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Edit */}
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            {/* Quick Actions */}
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Redo <MenubarShortcut>⌘Y</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            {/* Clipboard */}
            <MenubarItem disabled>
              Cut <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Copy <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Paste <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            {/* Find / Replace */}
            <MenubarItem disabled>
              Find & Replace <MenubarShortcut>⌘F</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Search in Files <MenubarShortcut>⇧⌘F</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            {/* Selection */}
            <MenubarItem>
              Select All <MenubarShortcut>⌘A</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Deselect All <MenubarShortcut>⇧⌘A</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            {/* Comments */}
            <MenubarItem>
              Toggle Comment <MenubarShortcut>⇧⌘A</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Toggle Block Comment <MenubarShortcut>⇧⌘A</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* View */}
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            {/* Theme */}
            <TitlebarThemeModeToggle />

            <MenubarSeparator />

            {/* Misc */}
            <MenubarCheckboxItem>Show Playing Next</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>Show Lyrics</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset disabled>
              Show Status Bar
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Hide Sidebar</MenubarItem>
            <MenubarItem disabled inset>
              Enter Full Screen
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </WindowTitlebar>
  )
}

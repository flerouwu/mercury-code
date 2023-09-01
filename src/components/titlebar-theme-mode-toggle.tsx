"use client"

import * as React from "react"
import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import {
  MenubarSubContent,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
} from "@/components/ui/menubar"

export function TitlebarThemeModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <MenubarSub>
      <MenubarSubTrigger>Theme</MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarRadioGroup value={theme}>
          <MenubarRadioItem value="light" onClick={() => setTheme("light")}>
            <SunIcon className="w-4 h-4 mr-2" />
            <span>Light</span>
          </MenubarRadioItem>
          <MenubarRadioItem value="dark" onClick={() => setTheme("dark")}>
            <MoonIcon className="w-4 h-4 mr-2" />
            <span>Dark</span>
          </MenubarRadioItem>
          <MenubarRadioItem value="system" onClick={() => setTheme("system")}>
            <LaptopIcon className="w-4 h-4 mr-2" />
            <span>System</span>
          </MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarSubContent>
    </MenubarSub>
  )
}

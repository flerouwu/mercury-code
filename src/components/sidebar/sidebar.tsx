"use client"

import { Files, GitBranch, LucideIcon, Settings2, UserCircle2 } from "lucide-react"
import React, { useState } from "react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "../ui/navigation-menu"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { cn } from "@/lib/utils"
import { FilesSidebar, FilesSidebar_NewFile, FilesSidebar_NewFolder } from "./files"

interface SidebarMenu {
  top: SidebarItem[]
  bottom: SidebarItem[]
}

interface SidebarItem {
  icon: LucideIcon
  name: string
  hotkey?: string
  content: JSX.Element
  /** Elements that are shown next to the title of the item. */
  additionalItems?: JSX.Element[]
}

const items: SidebarMenu = {
  top: [
    {
      icon: Files,
      name: "Files",
      content: <FilesSidebar />,
      additionalItems: [
        <FilesSidebar_NewFile key="files_newfile" />,
        <FilesSidebar_NewFolder key="files_newfolder" />
      ]
    },
    {
      icon: GitBranch,
      name: "Source Control",
      content: <div></div>,
    },
  ],
  bottom: [
    {
      icon: UserCircle2,
      name: "Accounts",
      content: <div></div>,
    },
    {
      icon: Settings2,
      name: "Settings",
      content: <div></div>,
    },
  ],
}

export function Sidebar() {
  let [activePage, setActivePage] = useState<SidebarItem | null>(items.top[0])

  return (
    <div className="flex flex-row">
      {/* Icons */}
      <div className="flex flex-col items-center justify-between h-full p-1 border-r">
        <TooltipProvider delayDuration={0}>
          {/* Top Half */}
          <NavigationMenu orientation="vertical" className="flex-none">
            <NavigationMenuList className="flex-col">
              {items.top.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activePage == item ? "secondary" : "ghost"}
                        onClick={() => setActivePage(item != activePage ? item : null)}
                      >
                        <item.icon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  </Tooltip>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Bottom Half */}
          <NavigationMenu orientation="vertical" className="flex-none">
            <NavigationMenuList className="flex-col">
              {items.bottom.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activePage == item ? "secondary" : "ghost"}
                        onClick={() => setActivePage(item != activePage ? item : null)}
                      >
                        <item.icon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  </Tooltip>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </TooltipProvider>
      </div>

      {/* Page */}
      <div className={cn(activePage == null ? "w-0" : "w-64 border-r", "ease-in-out duration-500")}>
        <header className="flex flex-row items-center justify-between h-10 p-2 border-b">
          <span className="flex flex-row items-center gap-1">
            {activePage && <activePage.icon size={18} strokeWidth={3} />} {activePage?.name}
          </span>
          <span className="flex flex-row items-center gap-1">
            {activePage && activePage.additionalItems}
          </span>
        </header>

        {activePage?.content}
      </div>
    </div>
  )
}

import "@/styles/globals.css"
import { Metadata } from "next"

import { fontMono, fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Titlebar } from "@/components/titlebar"
import { StyleSwitcher } from "@/components/sidebar/style-switcher"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Providers } from "./providers"

interface ExamplesLayoutProps {
  children: React.ReactNode
}

export default function MyApp({ children }: ExamplesLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-black overflow-clip">
      <head />
      <body className="font-sans antialiased bg-transparent overflow-clip scrollbar-none">
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="h-screen overflow-clip">
              <Titlebar />

              <div
                className={cn(
                  "h-screen overflow-auto border-t bg-background pb-10",
                  // "scrollbar-none"
                  //"scrollbar scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-md",
                  "flex",
                )}
              >
                <Sidebar />
                {children}
              </div>
            </div>
            <TailwindIndicator />
          </ThemeProvider>
        </Providers>
        <StyleSwitcher />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  icons: {
    shortcut: ["#"],
  },
}
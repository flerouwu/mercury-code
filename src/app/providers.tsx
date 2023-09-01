"use client"

import { EditorProps } from "@/components/editor/editor"
import { Dispatch, createContext, useState } from "react"

export const EditorsContext = createContext<{
  editors: Record<string, EditorProps>,
  setEditors: Dispatch<Record<string, EditorProps>>
}>(undefined as any)

export const CurrentEditorContext = createContext<{
  /** UUID of the current editor. */
  currentEditor: string | null,
  setCurrentEditor: Dispatch<string | null>
}>(undefined as any)

export function Providers({ children }: { children: JSX.Element | JSX.Element[] }) {
	const [ editors, setEditors ] = useState<Record<string, EditorProps>>({})
	const [ currentEditor, setCurrentEditor ] = useState<string | null>(null)

	return (
		<EditorsContext.Provider value={{ editors, setEditors }}>
			<CurrentEditorContext.Provider value={{ currentEditor, setCurrentEditor }}>
				{children}
			</CurrentEditorContext.Provider>
		</EditorsContext.Provider>
	)
}
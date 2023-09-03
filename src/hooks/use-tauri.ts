import { EditorProps } from "@/components/editor/editor"
import { InvokeArgs, invoke } from "@tauri-apps/api/tauri"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useLog } from "./use-log"
import { UnlistenFn, listen } from "@tauri-apps/api/event"

/**
 * Big object of all available commands from Tauri backend.
 * This helps prevent redeclaring the options every time it's used.
 */
export const tauriCommands: Record<"allEditors" | "currentEditor" | "openFolder", UseTauriProps<any>> = {
  // const { data: editors, setData: setEditors, dispatchData: dispatchEditors } = useTauri<EditorProps[]>(tauriCommands.allEditors)
  allEditors: {
    getter: { command: "editors_get_all" },
    setter: { command: "editors_set_all", args: (data: EditorProps[]) => ({ editors: data }) },
    updateEvent: "editors_all_update",
  },

  // const { data: current, setData: setCurrent, updateData: updateCurrent, dispatchData: dispatchCurrent } = useTauri<string | null>(tauriCommands.currentEditor)
  currentEditor: {
    getter: { command: "editors_get_current" },
    setter: { command: "editors_set_current", args: (data: string | null) => ({ uuid: data }) },
    updateEvent: "editors_current_update",
  },

  // const { data: folder, updateData: updateFolder } = useTauri<string | null>(tauriCommands.openFolder)
  openFolder: {
    getter: { command: "get_open_folder" },
    updateEvent: "workspace_folder_update",
  },
}

interface UseTauriProps<T> {
  getter: { command: string; args?: InvokeArgs }
  setter?: { command: string; args?: (data: T) => InvokeArgs }

  /** The event name to listen to, so that the data on the frontend stays in sync with the backend. */
  updateEvent?: string
}

export function useTauri<T>(props: UseTauriProps<T>): {
  data: T | null
  setData: Dispatch<SetStateAction<T | null>>

  /**
   * Retrieves data from the Tauri backend and updates `data`.
   */
  updateData: () => Promise<void>

  /**
   * Dispatches data from the frontend into Tauri's backend.
   * 
   * @param newDate The data to be sent to the backend. Why is this required? Because React setState() doesn't update immediately.
   */
  dispatchData: (newData: T) => Promise<void>
} {
  const [data, setData] = useState<T | null>(null)

  /**
   * Updates the data, by fetching it from the backend.
   */
  const updateData = async () => {
    useLog("useTauri[Frontend <= Tauri](UpdateData)", "teal", `Updating ${props.getter.command}`)
    const start = Date.now()

    setData(await invoke(props.getter.command, props.getter.args))

    useLog("useTauri[Frontend <= Tauri](UpdateData)", "teal", `[SUCCESS] Updated! Took ${Date.now() - start}ms`)
  }

  /**
   * Dispatches data in `data` to Tauri via props.setter.
   */
  const dispatchData = async (newData: T) => {
    if (props.setter != undefined) {
      useLog("useTauri[Frontend => Tauri](DispatchData)", "lime", `Dispatching ${props.setter.command}`)
      const start = Date.now()

      useLog("useTauri[TEST](DispatchData)", "red", `Data:`, data);
      await invoke(props.setter.command, props.setter.args != undefined ? props.setter.args(newData) : undefined)

      useLog("useTauri[Frontend => Tauri](DispatchData)", "lime", `[SUCCESS] Dispatched! Took ${Date.now() - start}ms`)
    }
  }

  // Listener to update the data
  useEffect(() => {
    // Initial data
    updateData().then(() => {
      useLog("useTauri(InitialData)", "orange", data)
    })

    // Update Events
    if (props.updateEvent == undefined) return

    let unlisten: UnlistenFn | undefined = undefined
    listen(props.updateEvent, () => {
      useLog("useTauri(UpdateEvent)", "magenta", `Recieved event to update ${props.updateEvent}`)
      updateData()
    }).then((func) => (unlisten = func))

    return () => unlisten && unlisten()
  }, [])

  // Test
  useEffect(() => {
    useLog("useTauri[TEST]()", "red", "Data was updated!", data)
  }, [data])

  return { data, setData, updateData, dispatchData }
}

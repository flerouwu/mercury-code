import { File, Folder, FolderOpen } from "lucide-react"
import { ReactElement } from "react"

interface Icon {
  name: string
  extensions: RegExp[]
  icon?: ReactElement<any, any>
  src?: string
}

const lucideIconSize = 18

export const DEFAULT_ICON: Icon = {
  name: "default",
  extensions: [/\.txt$/i],
  icon: <File size={lucideIconSize} />,
}

// #region Directory Icons

export const DIRECTORY_CLOSE_ICON: Icon = {
  name: "directory-close",
  extensions: [],
  icon: <Folder size={lucideIconSize} />,
}

export const DIRECTORY_OPEN_ICON: Icon = {
  name: "directory-open",
  extensions: [],
  icon: <FolderOpen size={lucideIconSize} />,
}

// #endregion

// TODO: Integrate this with `file-associations.ts`
export const ICONS: Icon[] = [
  /* {
		name: "rust",
		extensions: [/\.rs$/i],
		src: "https://raw.githubusercontent.com/jesseweed/seti-ui/master/icons/rust.svg"
	} */
]

import { cpp } from "@codemirror/lang-cpp"
import { html } from "@codemirror/lang-html"
import { java } from "@codemirror/lang-java"
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript"
import { json } from "@codemirror/lang-json"
import { less } from "@codemirror/lang-less"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { php } from "@codemirror/lang-php"
import { python } from "@codemirror/lang-python"
import { rust } from "@codemirror/lang-rust"
import { sass } from "@codemirror/lang-sass"
import { sql } from "@codemirror/lang-sql"
import { xml } from "@codemirror/lang-xml"
import { LanguageSupport } from "@codemirror/language"
import { clojure } from "@nextjournal/lang-clojure"
import { csharp } from "@replit/codemirror-lang-csharp"
import { m } from "@tauri-apps/api/path-f8d71c21"

interface FileAssociation {
  id: string
  name: string
  extensions: RegExp[]
  language: LanguageSupport
}

export const FILE_ASSOCIATIONS: FileAssociation[] = [
  {
    id: "cpp",
    name: "C++",
    extensions: [/\.c$/i, /\.cpp$/i, /\.h$/i, /\.hpp$/i],
    language: cpp(),
  },
  {
    id: "html",
    name: "HTML",
    extensions: [/\.html$/i, /\.htm$/i, /\.shtml$/i, /\.shtm$/i],
    language: html({
      autoCloseTags: true,
      matchClosingTags: true,
      selfClosingTags: true,
    }),
  },
	{
		id: "java",
		name: "Java",
		extensions: [/\.java$/i],
		language: java()
	},
  {
    id: "javascript",
    name: "JavaScript",
    extensions: [/\.js$/i],
    language: javascript({ jsx: false, typescript: false }),
  },
  {
    id: "javascript-react",
    name: "JavaScript with React",
    extensions: [/\.jsx$/i],
    language: javascript({ jsx: true, typescript: false }),
  },
  {
    id: "typescript",
    name: "TypeScript",
    extensions: [/\.ts$/i, /\.d.ts$/i],
    language: javascript({ jsx: false, typescript: true }),
  },
  {
    id: "typescript-react",
    name: "TypeScript with React",
    extensions: [/\.tsx$/i],
    language: javascript({ jsx: true, typescript: true }),
  },
	{
		id: "json",
		name: "JSON",
		extensions: [/\.json$/i, /\.hjson$/i, /\.json5$/i, /\.jsonc$/i, /\.prettierrc$/i],
		language: json()
	},
	{
		id: "markdown",
		name: "Markdown",
		extensions: [/\.md$/i],
		language: markdown({ base: markdownLanguage })
	},
	{
		id: "php",
		name: "php",
		extensions: [/\.php$/i],
		language: php()
	},
	{
		id: "python",
		name: "Python",
		extensions: [/\.py$/i, /\.pyw$/i],
		language: python()
	},
	{
		id: "rust",
		name: "Rust",
		extensions: [/\.rs$/i],
		language: rust()
	},
	{
		id: "sql",
		name: "SQL",
		extensions: [/\.sql$/i],
		language: sql({ upperCaseKeywords: true })
	},
	{
		id: "xml",
		name: "XML",
		extensions: [/\.xml$/i, /\.xaml$/i],
		language: xml()
	},
	{
		id: "css",
		name: "CSS",
		extensions: [/\.css$/i, /\.less$/i],
		language: less()
	},
	{
		id: "scss",
		name: "SCSS",
		extensions: [/\.scss$/i],
		language: sass()
	},
	{
		id: "sass",
		name: "SASS",
		extensions: [/\.sass$/i],
		language: sass({ indented: true })
	},
	{
		id: "clojure",
		name: "Clojure",
		extensions: [/\.clj$/i],
		language: clojure()
	},
	{
		id: "csharp",
		name: "C#",
		extensions: [/\.cs$/i],
		language: csharp()
	}
]

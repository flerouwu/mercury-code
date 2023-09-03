export function useLog(label: string, background: string, ...message: any[]) {
	console.log(`%c ${label} `, `background: ${background}; color: black; font-weight: 600; padding: 1px; border-radius: 5px;`, ...message)
}
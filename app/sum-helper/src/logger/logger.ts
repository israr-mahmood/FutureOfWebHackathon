type LogFunction = ((...args: any[]) => void) & { [key: string]: LogFunction }

export default class Logger {
	#enabled = new Set<string>(['app.index'])
	#socket = new WebSocket('ws://localhost:50000/ws')

	constructor() {
		if (typeof window !== 'undefined') {
			window.addEventListener('beforeunload', () => {
				this.#socket.close()
			})
		}
		this.#socket.onmessage = (event)=>{
			/*
			 expecting event.data to be:
			 {
			 	"path": "a.b.c",
			 	enabled: boolean
			 }
			 */
			const { path, enabled } = event.data as { path: string; enabled: boolean }
			if (enabled) {
				this.#enabled.add(path)
			} else {
				this.#enabled.delete(path)
			}
		}
	}

	get log() {
		const enabled = this.#enabled

		const createHandler = (currentPath: string[] = []) => ({
			get(_target: any, prop: string) {
				return new Proxy((() => {}) as LogFunction, createHandler([...currentPath, prop]))
			},
			apply(_target: any, _thisArg: any, args: any[]) {
				const messages =
					args.length === 0 ? [''] : args.map((arg) => (arg === undefined ? '' : arg))
				const path = currentPath.join('.')
				const logIsEnabled = enabled.has(path)

				if (logIsEnabled) {
					console.log(`${path}`, ...messages)
					this.#socket.send(JSON.stringify({ path, messages }))
				}
			},
		})

		const handler = createHandler()
		return new Proxy((() => {}) as LogFunction, handler) as LogFunction
	}
}

// const logger = new Logger()
// const { log } = logger
// log.a.b.c('message')

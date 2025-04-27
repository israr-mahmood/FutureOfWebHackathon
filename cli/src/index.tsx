#!/usr/bin/env node
import { Box, render, Text, useApp, useInput } from 'ink'
import { useEffect, useState } from 'react'
import WebSocket from 'ws'
import { z } from 'zod'
// Clear the terminal before rendering
process.stdout.write('\x1Bc')

const socket = new WebSocket('ws://localhost:50000/ws')

const defaultConfig: Record<string, boolean> = {
	a: false,
	'a.b': false,
	'a.b.c': false,
}

const LogStream = ({ logs }: { logs: { path: string; message: string }[] }) => {
	return (
		<Box flexDirection='column' flexGrow={1}>
			{logs.map((log) => (
				<Text key={Math.random()}>
					{log.path}: {log.message}
				</Text>
			))}
		</Box>
	)
}

const Toggles = ({ config }: { config: Record<string, boolean> }) => {
	return (
		<Box flexDirection='column' flexGrow={1}>
			<Text bold>Feature Toggles:</Text>
			{Object.entries(config).map(([key, value]) => (
				<Text key={Math.random()}>
					{key}: {value ? 'enabled' : 'disabled'}
				</Text>
			))}
		</Box>
	)
}

const useLogs = () => {
	const [logs, setLogs] = useState<{ path: string; message: string }[]>([])
	const addLog = (path: string, message: string) => {
		setLogs([...logs, { path, message }])
	}

	return { logs, addLog }
}

const useConfig = () => {
	const [config, setConfig] = useState<Record<string, boolean>>(defaultConfig)
	const setFlag = (path: string, value: boolean) => {
		setConfig({ ...config, [path]: value })
	}
	return { config, setFlag }
}

const App = () => {
	const { exit } = useApp()
	const [view, setView] = useState<'logs' | 'toggles'>('logs')
	const { logs, addLog } = useLogs()
	const { config, setFlag } = useConfig()
	useEffect(() => {
		socket.on('message', (wsData) => {
			console.log(wsData.toString())
			const { data, success } = z
				.discriminatedUnion('type', [
					z.object({ type: z.literal('NEW_LOG'), path: z.string(), message: z.string() }),
					z.object({ type: z.literal('SET_FLAG'), path: z.string(), isEnabled: z.boolean() }),
				])
				.safeParse(JSON.parse(wsData.toString()))

			if (!success) {
				console.error('Invalid message', wsData.toString())
				return
			}

			const { type, path } = data

			switch (type) {
				case 'NEW_LOG':
					addLog(path, data.message)
					break
				case 'SET_FLAG':
					setFlag(path, data.isEnabled)
					break
			}
		})
		return () => {
			socket.close()
		}
	}, [])

	const switchView = (newView: 'logs' | 'toggles') => {
		if (newView !== view) {
			// Clear screen and scrollback buffer
			process.stdout.write('\x1B[2J\x1B[3J\x1B[H')
			setView(newView)
		}
	}

	// useInput((input, key) => {
	// 	if (key.escape) {
	// 		setView('logs')
	// 	}
	// })

	useInput((input, key) => {
		if (input === '1') {
			switchView('toggles')
		}

		if (input === '2') {
			switchView('logs')
		}
	})

	useEffect(() => {
		const handleExit = () => {
			exit()
		}

		process.on('SIGTERM', handleExit)
		process.on('SIGINT', handleExit)

		return () => {
			process.off('SIGTERM', handleExit)
			process.off('SIGINT', handleExit)
		}
	}, [exit])

	return (
		<Box flexDirection='column' flexGrow={1} height={'100%'}>
			{view === 'logs' && <LogStream logs={logs} />}
			{view === 'toggles' && <Toggles config={config} />}
			<Box marginTop={1}>
				<Text dimColor>(1) toggles (2) logs</Text>
			</Box>
		</Box>
	)
}

const { waitUntilExit } = render(<App />)
waitUntilExit().then(() => process.exit(0))

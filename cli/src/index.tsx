#!/usr/bin/env node
import { Box, render, Text, useApp, useInput } from 'ink'
import { useEffect, useState } from 'react'

// Clear the terminal before rendering
process.stdout.write('\x1Bc')

const config = {
	a: {
		enabled: true,
		b: {
			enabled: true,
			c: {
				enabled: true,
			},
		},
	},
	feat1: {
		enabled: true,
		feat2: {
			enabled: true,
			feat3: {
				enabled: true,
			},
		},
	},
}

const LogStream = () => {
	return (
		<Box>
			<Text>LogStream</Text>
		</Box>
	)
}

const Toggles = () => {
	return (
		<Box>
			<Text>Toggles</Text>
		</Box>
	)
}

const useLogs = () => {
	const [logs, setLogs] = useState<string[]>([])
	const addLog = (log: string) => {
		setLogs([...logs, log])
	}

	return { logs, addLog }
}


const App = () => {
	const { exit } = useApp()
	const [view, setView] = useState<'logs' | 'toggles'>('logs')

	// useInput((input, key) => {
	// 	if (key.escape) {
	// 		setView('logs')
	// 	}
	// })

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

	if (view === 'logs') {
		return <LogStream />
	}

	if (view === 'toggles') {
		return <Toggles />
	}
}

const { waitUntilExit } = render(<App />)
waitUntilExit().then(() => process.exit(0))

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
		<Box flexDirection='column'>
			<Text>LogStream</Text>
			<Text>LogStream</Text>
			<Text>LogStream</Text>
			<Text>LogStream</Text>
			<Text>LogStream</Text>
			<Text>LogStream</Text>
			<Text>LogStream</Text>
			<Text>LogStream</Text>
			<Text>LogStream</Text>
			<Text>LogStream</Text>
			<Text>LogStream</Text>
			<Text>LogStream</Text>
			<Text>LogStream</Text>
		</Box>
	)
}

const Toggles = () => {
	const renderToggles = (obj: any, prefix = '') => {
		return Object.entries(obj).map(([key, value]) => {
			if (typeof value === 'object') {
				return (
					<Box key={key} flexDirection='column' marginLeft={1}>
						<Text>
							{prefix}
							{key}
						</Text>
						{renderToggles(value, prefix + '  ')}
					</Box>
				)
			}
			return (
				<Text key={key}>
					{prefix}
					{key}: {value?.toString() ?? Math.random()}
				</Text>
			)
		})
	}

	return (
		<Box flexDirection='column'>
			<Text bold>Feature Toggles:</Text>
			{renderToggles(config)}
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

	const switchView = (newView: 'logs' | 'toggles') => {
		if (newView !== view) {
			process.stdout.write('\x1Bc')
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
		<Box flexDirection='column'>
			{view === 'logs' && <LogStream />}
			{view === 'toggles' && <Toggles />}
			<Box marginTop={1}>
				<Text dimColor>(1) toggles (2) logs </Text>
			</Box>
		</Box>
	)
}

const { waitUntilExit } = render(<App />)
waitUntilExit().then(() => process.exit(0))

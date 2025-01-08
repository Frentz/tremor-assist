import { ScrollView, Text, YStack, XStack } from 'tamagui'
import { useRef, useEffect } from 'react'
import { useInputLogStore } from '../store/inputLogStore'
import { invoke } from '@tauri-apps/api/core'

export interface InputLogEntry {
  timestamp: number
  type: 'mouse_move' | 'mouse_press' | 'mouse_release' | 'keyboard_press' | 'keyboard_release'
  details: string
}

interface InputLogProps {
  logs: InputLogEntry[]
}

function formatLogEntry(log: InputLogEntry): string {
  const time = new Date(log.timestamp).toISOString().split('T')[1].slice(0, 12)
  switch (log.type) {
    case 'keyboard_press':
      return `[${time}] Key Press: ${log.details.replace('key: ', '')}`
    case 'keyboard_release':
      return `[${time}] Key Release: ${log.details.replace('key: ', '')}`
    case 'mouse_move':
      return `[${time}] Mouse Move: ${log.details}`
    case 'mouse_press':
      return `[${time}] Mouse Press: ${log.details}`
    case 'mouse_release':
      return `[${time}] Mouse Release: ${log.details}`
    default:
      return `[${time}] ${log.type}: ${log.details}`
  }
}

function getEventColor(type: InputLogEntry['type']): string {
  if (type.startsWith('keyboard_')) {
    return '$blue10'
  }
  if (type === 'mouse_move') {
    return '$gray10'
  }
  return '$green10'
}

const formatTime = () => {
  const now = new Date();
  return `[${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(3, '0')}]`;
}

const log = (msg: string) => {
  console.log(`${formatTime()} ${msg}`);
}

export function InputLog({ logs }: InputLogProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { clearLogs } = useInputLogStore()

  const handleClear = async () => {
    await invoke('log_event', { message: 'Input logs cleared' });
    clearLogs();
  };

  useEffect(() => {
    if (!containerRef.current) return

    let isResizing = false
    let startY = 0
    let startHeight = 0

    const onMouseDown = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      
      // Only start resize if clicking near the bottom edge
      if (e.clientY >= rect.bottom - 10 && e.clientY <= rect.bottom + 10) {
        isResizing = true
        startY = e.clientY
        startHeight = rect.height
        document.body.style.cursor = 'row-resize'
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const deltaY = e.clientY - startY
      const newHeight = Math.max(200, startHeight + deltaY) // Minimum height of 200px
      if (containerRef.current) {
        containerRef.current.style.height = `${newHeight}px`
      }
    }

    const onMouseUp = () => {
      isResizing = false
      document.body.style.cursor = ''
    }

    containerRef.current.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      containerRef.current?.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <YStack
      ref={containerRef}
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor="$background"
      padding="$4"
      height={400}
      position="relative"
      style={{ resize: 'vertical', overflow: 'hidden' }}
    >
      <XStack justifyContent="space-between" alignItems="center" mb="$2">
        <Text fontWeight="bold">Input Log</Text>
        <Text
          color="$blue10"
          cursor="pointer"
          opacity={0.8}
          hoverStyle={{ opacity: 1 }}
          onPress={handleClear}
        >
          Clear
        </Text>
      </XStack>
      <ScrollView style={{ flex: 1 }}>
        <YStack space="$2">
          {logs.map((log, index) => (
            <Text 
              key={`${log.timestamp}-${index}`}
              fontSize="$2"
              opacity={0.9}
              color={getEventColor(log.type)}
            >
              {formatLogEntry(log)}
            </Text>
          ))}
        </YStack>
      </ScrollView>
      <YStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height={10}
        style={{ cursor: 'row-resize' }}
      />
    </YStack>
  )
} 
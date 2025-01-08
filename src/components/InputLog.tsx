import { ScrollView, Text, YStack } from 'tamagui'

export interface InputLogEntry {
  timestamp: number
  type: 'mouse_move' | 'mouse_click' | 'mouse_release' | 'keyboard_press' | 'keyboard_release'
  details: string
}

interface InputLogProps {
  logs: InputLogEntry[]
}

function formatLogEntry(log: InputLogEntry): string {
  const time = new Date(log.timestamp).toISOString().split('T')[1]
  switch (log.type) {
    case 'keyboard_press':
      return `[${time}] Key Press: ${log.details.replace('key: ', '')}`
    case 'keyboard_release':
      return `[${time}] Key Release: ${log.details.replace('key: ', '')}`
    case 'mouse_move':
      return `[${time}] Mouse Move: ${log.details}`
    case 'mouse_click':
      return `[${time}] Mouse Click: ${log.details}`
    case 'mouse_release':
      return `[${time}] Mouse Release: ${log.details}`
    default:
      return `[${time}] ${log.type}: ${log.details}`
  }
}

export function InputLog({ logs }: InputLogProps) {
  return (
    <YStack
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor="$background"
      padding="$4"
      height={400}
    >
      <Text mb="$2" fontWeight="bold">Input Log</Text>
      <ScrollView style={{ flex: 1 }}>
        <YStack space="$2">
          {logs.map((log, index) => (
            <Text 
              key={`${log.timestamp}-${index}`}
              fontSize="$2"
              opacity={0.9}
              color={log.type.startsWith('keyboard') ? '$blue10' : undefined}
            >
              {formatLogEntry(log)}
            </Text>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  )
} 
import { ScrollView, Text, YStack } from 'tamagui'

export interface InputLogEntry {
  timestamp: number
  type: 'mouse_move' | 'mouse_click' | 'keyboard'
  details: string
}

interface InputLogProps {
  logs: InputLogEntry[]
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
            >
              {`[${new Date(log.timestamp).toISOString().split('T')[1]}] ${log.type}: ${log.details}`}
            </Text>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  )
} 
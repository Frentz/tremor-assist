import { useEffect, useState } from 'react'
import { TamaguiProvider, Theme, YStack, XStack, Button, Text, Switch } from 'tamagui'
import config from '../tamagui.config'

function App() {
  const [isDark, setIsDark] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  return (
    <TamaguiProvider config={config}>
      <Theme name={isDark ? 'dark' : 'light'}>
        <YStack
          f={1}
          backgroundColor="$background"
          padding="$4"
          space="$4"
        >
          <XStack
            justifyContent="space-between"
            alignItems="center"
            padding="$2"
          >
            <Text
              fontFamily="$heading"
              fontSize="$8"
              color="$color"
            >
              Tremor Assist
            </Text>
            <XStack space="$2" alignItems="center">
              <Text color="$color">Dark Mode</Text>
              <Switch
                checked={isDark}
                onCheckedChange={setIsDark}
                size="$3"
              />
            </XStack>
          </XStack>

          <YStack space="$4" flex={1} justifyContent="center" alignItems="center">
            <Button
              size="$6"
              theme={isRunning ? 'red' : 'blue'}
              onPress={() => setIsRunning(!isRunning)}
            >
              {isRunning ? 'Stop Assistance' : 'Start Assistance'}
            </Button>

            <Text
              color="$color"
              opacity={0.7}
              textAlign="center"
            >
              {isRunning
                ? 'Mouse movement assistance is active'
                : 'Click to start mouse movement assistance'}
            </Text>
          </YStack>
        </YStack>
      </Theme>
    </TamaguiProvider>
  )
}

export default App

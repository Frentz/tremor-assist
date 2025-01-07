import { useState } from 'react'
import { TamaguiProvider, Theme, YStack, XStack, Button, Text } from 'tamagui'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import config from '../tamagui.config'

function App() {
  const [isDark, setIsDark] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  return (
    <TamaguiProvider config={config}>
      <Theme name={isDark ? 'dark' : 'light'}>
        <YStack
          f={1}
          bg="$background"
          p="$4"
          space="$4"
        >
          <XStack
            jc="space-between"
            ai="center"
            py="$2"
          >
            <Text
              color="$color"
              fontSize="$8"
              fontWeight="$8"
            >
              Tremor Assist
            </Text>
            <Button
              size="$3"
              circular
              chromeless
              onPress={() => setIsDark(!isDark)}
              icon={
                isDark ? 
                <MoonIcon width={22} height={22} style={{ color: 'white' }} /> :
                <SunIcon width={22} height={22} style={{ color: 'black' }} />
              }
            />
          </XStack>

          <YStack f={1} jc="center" ai="center" space="$4">
            <Button
              size="$5"
              theme={isRunning ? 'red' : 'blue'}
              onPress={() => setIsRunning(!isRunning)}
              pressStyle={{ scale: 0.97 }}
              animation="quick"
            >
              {isRunning ? 'Stop Assistance' : 'Start Assistance'}
            </Button>

            <Text
              theme="alt2"
              size="$3"
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

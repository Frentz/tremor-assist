import { useEffect, useState } from 'react'
import { TamaguiProvider, Theme, YStack, XStack, Button, Text, Switch, Label } from 'tamagui'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { InputLog } from './components/InputLog'
import { useInputLogStore } from './store/inputLogStore'
import config from '../tamagui.config'

type InputEventType = 'mouse_move' | 'mouse_click' | 'keyboard'

export default function App() {
  const [isDark, setIsDark] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const { 
    logs, 
    addLog, 
    isMouseLoggingEnabled,
    isKeyboardLoggingEnabled,
    toggleMouseLogging,
    toggleKeyboardLogging 
  } = useInputLogStore()

  // Test logging - will be replaced with actual input events
  useEffect(() => {
    if (!isMouseLoggingEnabled && !isKeyboardLoggingEnabled) return

    const interval = setInterval(() => {
      const events: InputEventType[] = []
      if (isMouseLoggingEnabled) {
        events.push('mouse_move', 'mouse_click')
      }
      if (isKeyboardLoggingEnabled) {
        events.push('keyboard')
      }
      
      if (events.length === 0) return
      
      const event = events[Math.floor(Math.random() * events.length)]
      const details = event === 'mouse_move' 
        ? `x: ${Math.floor(Math.random() * 1000)}, y: ${Math.floor(Math.random() * 1000)}`
        : event === 'mouse_click'
          ? `button: ${Math.random() > 0.5 ? 'left' : 'right'}`
          : `key: ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
      
      addLog(event, details)
    }, 1000)

    return () => clearInterval(interval)
  }, [addLog, isMouseLoggingEnabled, isKeyboardLoggingEnabled])

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
            paddingVertical="$2"
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

          <YStack space="$4">
            <Button
              size="$5"
              theme={isRunning ? 'red' : 'blue'}
              onPress={() => setIsRunning(!isRunning)}
              pressStyle={{ scale: 0.97 }}
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

            <XStack space="$4" justifyContent="center">
              <XStack space="$2" alignItems="center">
                <Switch
                  id="mouse-logging"
                  checked={isMouseLoggingEnabled}
                  onCheckedChange={toggleMouseLogging}
                >
                  <Switch.Thumb />
                </Switch>
                <Label htmlFor="mouse-logging" theme="alt2">
                  Mouse Logging
                </Label>
              </XStack>

              <XStack space="$2" alignItems="center">
                <Switch
                  id="keyboard-logging"
                  checked={isKeyboardLoggingEnabled}
                  onCheckedChange={toggleKeyboardLogging}
                >
                  <Switch.Thumb />
                </Switch>
                <Label htmlFor="keyboard-logging" theme="alt2">
                  Keyboard Logging
                </Label>
              </XStack>
            </XStack>

            <InputLog logs={logs} />
          </YStack>
        </YStack>
      </Theme>
    </TamaguiProvider>
  )
}

import { useEffect, useState } from 'react'
import { TamaguiProvider, Theme, YStack, XStack, Button, Text, Switch, Label } from 'tamagui'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { InputLog } from './components/InputLog'
import { useInputLogStore } from './store/inputLogStore'
import config from '../tamagui.config'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

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

  useEffect(() => {
    if (!isRunning) {
      console.log('[React] Input tracking stopped');
      invoke('stop_input_tracking').catch(error => {
        console.error('[React] Error stopping input tracking:', error);
      });
      return;
    }

    const setupInputTracking = async () => {
      try {
        console.log('[React] Starting input tracking...');
        await invoke('start_input_tracking');
        console.log('[React] Input tracking started successfully');

        const unlisten = await listen('input_event', (event: any) => {
          console.log('[React] Received event:', JSON.stringify(event, null, 2));
          const { event_type, details } = event.payload;
          
          if (
            (event_type === 'keyboard' && !isKeyboardLoggingEnabled) ||
            ((event_type === 'mouse_move' || event_type === 'mouse_click') && !isMouseLoggingEnabled)
          ) {
            console.log('[React] Event filtered out due to logging settings:', event_type);
            return;
          }

          console.log('[React] Adding event to log:', event_type, details);
          addLog(event_type, details);
        });

        return () => {
          console.log('[React] Cleaning up event listener');
          unlisten();
        };
      } catch (error) {
        console.error('[React] Error setting up input tracking:', error);
      }
    };

    setupInputTracking();
  }, [isRunning, isMouseLoggingEnabled, isKeyboardLoggingEnabled, addLog]);

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

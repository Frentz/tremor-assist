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

  const formatTime = () => {
    const now = new Date();
    return `[${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(3, '0')}]`;
  }

  const log = (msg: string) => {
    console.log(`${formatTime()} ${msg}`);
  }

  const { 
    logs, 
    addLog, 
    isMouseLoggingEnabled,
    isKeyboardLoggingEnabled,
    toggleMouseLogging,
    toggleKeyboardLogging 
  } = useInputLogStore()

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const cleanup = async () => {
      if (unlisten) {
        await unlisten();
        unlisten = undefined;
      }
      
      await invoke('stop_input_tracking').catch(error => {
        log(`Error stopping input tracking: ${error}`);
      });
    };

    const setupInputTracking = async () => {
      try {
        await cleanup();

        if (!isRunning) return;

        await invoke('start_input_tracking');

        unlisten = await listen('input_event', (event: any) => {
          const { event_type, details } = event.payload;
          
          // Filter events based on type and logging settings
          const isKeyboardEvent = event_type.startsWith('keyboard_');
          const isMouseEvent = event_type.startsWith('mouse_');
          
          if (
            (isKeyboardEvent && !isKeyboardLoggingEnabled) ||
            (isMouseEvent && !isMouseLoggingEnabled)
          ) {
            return;
          }

          addLog(event_type, details);
        });
      } catch (error) {
        log(`Error setting up input tracking: ${error}`);
      }
    };

    setupInputTracking();
    return () => {
      cleanup();
    };
  }, [isRunning, isMouseLoggingEnabled, isKeyboardLoggingEnabled, addLog]);

  const handleMouseLoggingToggle = async () => {
    await invoke('set_mouse_logging', { enabled: !isMouseLoggingEnabled });
    toggleMouseLogging();
  };

  const handleKeyboardLoggingToggle = async () => {
    await invoke('set_keyboard_logging', { enabled: !isKeyboardLoggingEnabled });
    toggleKeyboardLogging();
  };

  const handleThemeToggle = () => {
    log(`Theme switched to ${!isDark ? 'dark' : 'light'} mode`);
    setIsDark(!isDark);
  };

  const handleAssistanceToggle = () => {
    log(`Assistance ${!isRunning ? 'started' : 'stopped'}`);
    setIsRunning(!isRunning);
  };

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
              onPress={handleThemeToggle}
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
              onPress={handleAssistanceToggle}
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
                  onCheckedChange={handleMouseLoggingToggle}
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
                  onCheckedChange={handleKeyboardLoggingToggle}
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

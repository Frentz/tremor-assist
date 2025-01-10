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
  const [isSuppressing, setIsSuppressing] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

  // New mouse suppression controls
  const handleSuppressionToggle = async () => {
    try {
      await invoke('toggle_mouse_suppression', { enabled: !isSuppressing });
      setIsSuppressing(!isSuppressing);
      log(`Mouse suppression ${!isSuppressing ? 'enabled' : 'disabled'}`);
    } catch (error) {
      log(`Error toggling suppression: ${error}`);
    }
  };

  const handleEmergencyStop = async () => {
    try {
      await invoke('emergency_stop');
      setIsSuppressing(false);
      log('Emergency stop triggered');
    } catch (error) {
      log(`Error triggering emergency stop: ${error}`);
    }
  };

  const updateMousePosition = async () => {
    try {
      const pos = await invoke<{ x: number, y: number }>('get_mouse_position');
      setMousePosition(pos);
    } catch (error) {
      log(`Error getting mouse position: ${error}`);
    }
  };

  // Update mouse position periodically when suppression is active
  useEffect(() => {
    let interval: number | undefined;
    if (isSuppressing) {
      interval = window.setInterval(updateMousePosition, 16); // ~60fps
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSuppressing]);

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

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupEmergencyStopListener = async () => {
      unlisten = await listen('emergency_stop_triggered', () => {
        setIsSuppressing(false);
        log('Emergency stop triggered via keyboard shortcut');
      });
    };

    setupEmergencyStopListener().catch(error => {
      log(`Error setting up emergency stop listener: ${error}`);
    });

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const handleMouseLockToggle = async () => {
    try {
      await invoke('toggle_mouse_lock', { enable: !isSuppressing });
      setIsSuppressing(!isSuppressing);
      log(`Mouse suppression ${!isSuppressing ? 'enabled' : 'disabled'}`);
    } catch (error) {
      log(`Error toggling mouse suppression: ${error}`);
    }
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

            {/* Mouse Suppression Controls */}
            <YStack space="$2" backgroundColor="$backgroundStrong" padding="$4" borderRadius="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <Text color="$color" fontWeight="bold">Mouse Suppression</Text>
                <Button
                  size="$3"
                  theme="red"
                  onPress={handleEmergencyStop}
                  disabled={!isSuppressing}
                >
                  Emergency Stop
                </Button>
              </XStack>
              
              <XStack space="$2" alignItems="center">
                <Switch
                  id="mouse-lock-toggle"
                  checked={isSuppressing}
                  onCheckedChange={handleMouseLockToggle}
                >
                  <Switch.Thumb />
                </Switch>
                <Label htmlFor="mouse-lock-toggle" theme="alt2">
                  {isSuppressing ? 'Suppression Active' : 'Suppression Disabled'}
                </Label>
              </XStack>

              {isSuppressing && (
                <Text theme="alt2" size="$2">
                  Mouse Position: X: {mousePosition.x}, Y: {mousePosition.y}
                </Text>
              )}
            </YStack>

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

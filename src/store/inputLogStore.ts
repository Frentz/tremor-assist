import { create } from 'zustand'
import { InputLogEntry } from '../components/InputLog'

const MAX_LOG_ENTRIES = 1000

interface InputLogState {
  logs: InputLogEntry[]
  isMouseLoggingEnabled: boolean
  isKeyboardLoggingEnabled: boolean
  addLog: (type: InputLogEntry['type'], details: string) => void
  clearLogs: () => void
  toggleMouseLogging: () => void
  toggleKeyboardLogging: () => void
}

export const useInputLogStore = create<InputLogState>((set) => ({
  logs: [],
  isMouseLoggingEnabled: true,
  isKeyboardLoggingEnabled: false,
  addLog: (type, details) => set((state) => {
    // Only add logs if the corresponding logging is enabled
    if (
      ((type === 'keyboard_press' || type === 'keyboard_release') && !state.isKeyboardLoggingEnabled) ||
      ((type === 'mouse_move' || type === 'mouse_click' || type === 'mouse_release') && !state.isMouseLoggingEnabled)
    ) {
      return state
    }
    
    return {
      logs: [
        {
          timestamp: Date.now(),
          type,
          details,
        },
        ...state.logs,
      ].slice(0, MAX_LOG_ENTRIES),
    }
  }),
  clearLogs: () => set({ logs: [] }),
  toggleMouseLogging: () => set((state) => ({ 
    isMouseLoggingEnabled: !state.isMouseLoggingEnabled,
    logs: [] // Clear logs when toggling
  })),
  toggleKeyboardLogging: () => set((state) => ({ 
    isKeyboardLoggingEnabled: !state.isKeyboardLoggingEnabled,
    logs: [] // Clear logs when toggling
  })),
})) 
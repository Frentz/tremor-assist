# Development Guide

## Prerequisites
- Node.js >= 18.0.0
- Yarn >= 1.22.0
- Rust >= 1.75.0
- Tauri CLI >= 2.2.1

## Project Structure
```
tremor-assist/
├── src/                 # Frontend React code
│   ├── components/      # React components
│   │   └── InputLog/   # Input visualization
│   ├── store/          # Zustand state management
│   │   └── inputLogStore/ # Input logging state
│   └── theme/          # Tamagui theme configuration
├── src-tauri/          # Rust backend code
│   ├── src/            # Main Rust source code
│   └── plugins/        # Tauri plugins
└── .notes/             # Project documentation
```

## Core Systems

### Input Tracking
- Uses custom fork of `rdev` for improved macOS compatibility
- Events throttled to ~60fps for performance
- Supports mouse movement and click events
- Full keyboard event support on all platforms
- Clean start/stop functionality
- Event filtering based on type (mouse/keyboard)
- Console logging with timestamps
- Component interaction logging

### Event Logging
- Unified timestamp format [HH:MM:SS.mmm]
- Separate mouse/keyboard logging toggles
- Resizable log visualization
- Manual log clearing
- Event type filtering
- Console and UI synchronization
- Thread-safe event emission

### UI Components
- Built with Tamagui for consistent theming
- Supports dark/light mode
- Input log visualization with event type coloring
- Theme-aware styling
- Resizable containers
- Clear button for logs

### State Management
- Zustand for global state
- Input log store with history management
- Theme state management
- Input type toggles (mouse/keyboard)
- Logging state persistence

## Development Workflow
1. Start development server: `yarn tauri dev`
2. Make changes to React code in `src/`
3. Make changes to Rust code in `src-tauri/`
4. Test changes locally
5. Update documentation in `.notes/`
6. Create pull request

## Logging Guidelines
1. Use consistent timestamp format [HH:MM:SS.mmm]
2. Log all component interactions
3. Include both console and UI logging
4. Filter events based on user preferences
5. Maintain thread safety in logging
6. Keep logs concise and informative
7. Correlate UI and console events

## Platform-Specific Notes

### macOS
- Uses fufesou's rdev fork for keyboard stability
- Requires accessibility permissions
- Handles modifier keys properly
- Stable keyboard event capture
- Consistent event logging

### Windows
- Uses standard rdev implementation
- Native input capture support
- Full keyboard compatibility
- Platform-specific event handling

## Performance Guidelines
- Keep input processing under 5ms
- Throttle high-frequency events
- Use async/await for I/O operations
- Profile performance-critical code
- Efficient log management
- Optimize event filtering

## Testing
- Test UI components in both themes
- Verify input tracking accuracy
- Test keyboard input extensively
- Check memory usage with long sessions
- Test on both Windows and macOS
- Verify logging functionality
- Test event filtering
- Check log visualization 
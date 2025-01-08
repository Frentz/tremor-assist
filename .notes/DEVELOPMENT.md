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
│   ├── store/          # Zustand state management
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

### UI Components
- Built with Tamagui for consistent theming
- Supports dark/light mode
- Input log visualization with event type coloring
- Theme-aware styling

### State Management
- Zustand for global state
- Input log store with history management
- Theme state management
- Input type toggles (mouse/keyboard)

## Development Workflow
1. Start development server: `yarn tauri dev`
2. Make changes to React code in `src/`
3. Make changes to Rust code in `src-tauri/`
4. Test changes locally
5. Update documentation in `.notes/`
6. Create pull request

## Platform-Specific Notes

### macOS
- Uses fufesou's rdev fork for keyboard stability
- Requires accessibility permissions
- Handles modifier keys properly
- Stable keyboard event capture

### Windows
- Uses standard rdev implementation
- Native input capture support
- Full keyboard compatibility

## Performance Guidelines
- Keep input processing under 5ms
- Throttle high-frequency events
- Use async/await for I/O operations
- Profile performance-critical code

## Testing
- Test UI components in both themes
- Verify input tracking accuracy
- Test keyboard input extensively
- Check memory usage with long sessions
- Test on both Windows and macOS 
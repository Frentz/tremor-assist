# Technical Architecture

## Overview
Tremor Assist is built as a cross-platform desktop application using Tauri, combining a React frontend with a Rust backend for optimal performance and native capabilities.

## Component Structure

### Frontend (`src/`)
```
src/
├── components/         # React components
│   ├── InputLog.tsx   # Input event visualization
│   └── ...
├── store/             # State management
│   ├── inputLogStore.ts # Input logging state
│   └── ...
├── hooks/             # Custom React hooks
└── App.tsx            # Main application component
```

### Backend (`src-tauri/src/`)
```
src-tauri/src/
├── lib.rs            # Core functionality & logging
└── main.rs           # Application entry point
```

## Core Systems

### 1. Input Capture & Processing
- Uses custom fork of rdev for stable input capture
- Platform-specific optimizations for macOS and Windows
- Complete keyboard event support across platforms
- Raw event buffering with minimal latency
- Requires accessibility permissions
- Event filtering and type-based processing
- Separate mouse/keyboard logging toggles
- Console logging with timestamps

### 2. Event Logging System
- Unified timestamp format [HH:MM:SS.mmm]
- Component interaction logging
- Input event filtering by type
- Resizable log visualization
- Manual log clearing
- Thread-safe event emission
- Console and UI synchronization

### 3. Movement Processing
- Raw movement data analysis
- Profile-based tremor filtering
- Movement pattern recognition
- Adaptive smoothing algorithms

### 4. Output Generation
- Uses Enigo 0.3.0 for synthetic mouse events
- Clean movement output
- Direct OS integration

## Data Flow
1. Input events captured by rdev
2. Events processed and filtered by type
3. Events logged to console and UI if enabled
4. Movement data analyzed
5. Clean movement calculated
6. Synthetic movement generated
7. UI updated with event visualization

## Performance Considerations
- Target latency: < 5ms
- Event loop optimization
- Memory usage monitoring
- CPU usage optimization
- Thread safety in event handling
- Event throttling at 60fps
- Efficient log management

## Security Model
- OS-level permission management
- Local-only processing
- Secure state persistence
- Protected input handling
- Safe event logging

## Platform-Specific Architecture

### macOS
- Uses fufesou's rdev fork for keyboard stability
- Enhanced event handling for system integration
- Proper modifier key support
- Accessibility permission management
- Consistent event logging

### Windows
- Standard rdev implementation
- Native input capture system
- Full keyboard compatibility
- Platform-specific event handling

## Known Technical Limitations
1. Permission system complexity
2. Thread safety considerations
3. Window focus edge cases
4. Smoothing algorithm trade-offs
5. Event throttling requirements

## Future Technical Improvements
1. Enhanced thread safety
2. Improved permission handling
3. Better error recovery
4. Performance optimizations
5. Advanced log filtering
6. Log persistence options

## Development Requirements
- TypeScript strict mode
- Rust safety guidelines
- Comprehensive testing
- Performance benchmarking
- Consistent logging practices

## Resources
- [Tauri 2.2.0 Documentation](https://tauri.app/v2/docs/)
- [Enigo 0.3.0 API Reference](https://docs.rs/enigo/0.3.0/enigo/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/) 
- [Tamagui 1.121.6](https://tamagui.dev/docs/intro/introduction/)
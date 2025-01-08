# Technical Architecture

## Overview
Tremor Assist is built as a cross-platform desktop application using Tauri, combining a React frontend with a Rust backend for optimal performance and native capabilities.

## Component Structure

### Frontend (`src/`)
```
src/
├── components/         # React components
├── store/             # State management
├── hooks/             # Custom React hooks
└── App.tsx            # Main application component
```

### Backend (`src-tauri/src/`)
```
src-tauri/src/
├── lib.rs            # Core functionality
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

### 2. Movement Processing
- Raw movement data analysis
- Profile-based tremor filtering
- Movement pattern recognition
- Adaptive smoothing algorithms

### 3. Output Generation
- Uses Enigo 0.3.0 for synthetic mouse events
- Clean movement output
- Direct OS integration

## Data Flow
1. Input events captured by rdev
2. Events processed and filtered by type
3. Movement data analyzed
4. Clean movement calculated
5. Synthetic movement generated
6. UI updated with event visualization

## Performance Considerations
- Target latency: < 5ms
- Event loop optimization
- Memory usage monitoring
- CPU usage optimization
- Thread safety in event handling

## Security Model
- OS-level permission management
- Local-only processing
- Secure state persistence
- Protected input handling

## Platform-Specific Architecture

### macOS
- Uses fufesou's rdev fork for keyboard stability
- Enhanced event handling for system integration
- Proper modifier key support
- Accessibility permission management

### Windows
- Standard rdev implementation
- Native input capture system
- Full keyboard compatibility

## Known Technical Limitations
1. Permission system complexity
2. Thread safety considerations
3. Window focus edge cases
4. Smoothing algorithm trade-offs

## Future Technical Improvements
1. Enhanced thread safety
2. Improved permission handling
3. Better error recovery
4. Performance optimizations

## Development Requirements
- TypeScript strict mode
- Rust safety guidelines
- Comprehensive testing
- Performance benchmarking

## Resources
- [Tauri 2.2.0 Documentation](https://tauri.app/v2/docs/)
- [Enigo 0.3.0 API Reference](https://docs.rs/enigo/0.3.0/enigo/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/) 
- [Tamagui 1.121.6](https://tamagui.dev/docs/intro/introduction/)
# Technical Architecture

## Overview
Tremor Assist is built as a cross-platform desktop application using Tauri, combining a React frontend with a Rust backend for optimal performance and native capabilities.

## Component Structure

### Frontend (`src/`)
```
src/
├── components/
├── store/
├── hooks/
└── App.tsx                   # Main application component
```

### Backend (`src-tauri/src/`)
```
src-tauri/src/
├── lib.rs          # Core functionality
└── main.rs         # Application entry point
```

## Core Systems (Updated)

### 1. Input Capture & Suppression
- Uses macOS CGEvent tap for direct input capture
- Complete suppression of original mouse movement
- Raw event buffering with minimal latency
- Requires accessibility permissions

### 2. Movement Processing
- Raw movement data analysis
- Profile-based tremor filtering
- Movement pattern recognition
- Adaptive smoothing algorithms

### 3. Output Generation
- Uses Enigo 0.3.0 for synthetic mouse events
- Clean movement output
- Direct OS integration

## Data Flow (Updated)
1. Mouse movement intercepted by CGEvent tap
2. Original input suppressed
3. Movement data processed through filters
4. Clean movement calculated
5. Synthetic movement generated via Enigo
6. UI updated with movement visualization

## Performance Considerations
- Target latency: < 5ms
- Event loop optimization
- Memory usage monitoring
- CPU usage optimization
- Thread safety in mouse control

## Security Model
- OS-level permission management
- Local-only processing
- Secure state persistence
- Protected mouse control access

## Known Technical Limitations
1. Permission system complexity
2. Thread safety on macOS
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
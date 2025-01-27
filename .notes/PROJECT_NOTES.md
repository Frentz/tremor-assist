# Project Notes

## Overview
Tremor Assist is a cross-platform desktop application designed to help users with tremors by providing adaptive mouse movement assistance. The application is built using Tauri 2.2.0, combining a React frontend with a Rust backend for optimal performance.

## Current State
- Phase 1 (Foundation) is complete
- Phase 2 (Core Functionality) is in progress
  - Emergency stop system implemented
  - Thread-safe state management added
  - Input logging system fully functional
  - Mouse/keyboard event capture working
  - Theme system implemented
  - UI components responsive
  - Position tracking system operational
- Next major focus: Mouse input suppression implementation

### Recent Changes
1. feat(safety): implement emergency stop system with thread-safe state management and UI improvements
2. Added keyboard shortcuts as critical safety feature for mouse suppression
3. Updated next steps to focus on mouse input suppression and artificial movement
4. Updated documentation with completed logging features
5. Improved logging system with clear button and console output

## Architecture

### Frontend
- React with TypeScript
- Tamagui UI framework (v1.121.6)
- Zustand for state management
- Heroicons for icons
- Theme support (dark/light)

### Backend
- Rust using Tauri 2.2.0
- rdev for input capture (using fufesou's fork for better macOS support)
- Enigo 0.3.0 for synthetic events
- Thread-safe event handling
- Performance optimized (< 5ms latency target)

### Core Systems
1. Input Capture & Processing
   - Platform-specific optimizations
   - Event filtering and throttling (60fps)
   - Thread-safe event emission
   - Permission management
   - Error recovery
   - Emergency stop functionality
   - Position tracking system

2. Event Logging System
   - Unified timestamp format [HH:MM:SS.mmm]
   - Component interaction logging
   - Resizable log visualization
   - Manual log clearing
   - Event type filtering
   - Console and UI synchronization
   - Emergency stop event logging

3. Movement Processing (Planned)
   - Raw movement data analysis
   - Profile-based tremor filtering
   - Movement pattern recognition
   - Adaptive smoothing algorithms
   - Performance monitoring

4. Output Generation (Planned)
   - Synthetic mouse events via Enigo
   - Clean movement output
   - Direct OS integration
   - Thread-safe movement queue

## Development Environment

### Prerequisites
- Node.js >= 18.0.0
- Yarn >= 1.22.0
- Rust >= 1.75.0
- Tauri CLI >= 2.2.1

### Project Structure
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

### Development Workflow
1. Start development server: `yarn tauri dev`
2. Make changes to React code in `src/`
3. Make changes to Rust code in `src-tauri/`
4. Test changes locally
5. Update documentation in `.notes/`
6. Create pull request

## Security Measures

### Input Handling
- Local-only processing
- No keylogging or data storage
- Secure event handling
- Protected accessibility permissions
- Safe keyboard event processing

### Data Protection
- No cloud connectivity
- No data collection
- Local-only storage
- Memory-safe implementation
- Secure state management

### System Integration
- Minimal system permissions
- Sandboxed execution
- Proper resource cleanup
- Safe thread management
- Protected system calls

## Platform-Specific Implementation

### macOS
- Uses fufesou's rdev fork for keyboard stability
- CGEvent tap for mouse events (planned)
- Requires accessibility permissions
- Handles modifier keys properly
- Consistent event logging

### Windows
- Standard rdev implementation
- SetWindowsHookEx for mouse events (planned)
- Native input capture support
- Full keyboard compatibility
- Platform-specific event handling

## Contributing Guidelines

### Code Standards
- TypeScript strict mode
- Rust safety practices
- Thread-safe implementation
- Proper error handling
- Consistent logging format

### Git Commit Format
```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance
```

### Pull Request Process
1. Update CHANGELOG.md
2. Ensure tests pass
3. Update documentation
4. Request review
5. Address feedback

## Next Steps

### Immediate Tasks
1. Implement mouse input suppression
   - Platform-specific event hooks
     - macOS: CGEvent tap implementation
     - Windows: SetWindowsHookEx setup
   - Position tracking system
     - Delta calculation
     - Movement validation
     - State synchronization
   - Safety controls and shortcuts
     - Emergency stop hotkeys
     - Visual indicators
     - State management
   - Emergency disable functionality
     - Thread-safe state handling
     - UI feedback
     - Position reset

2. Develop artificial movement generation
   - Movement queue system
     - Thread-safe queue implementation
     - Priority handling
     - Performance optimization
   - Delta-based calculations
     - Movement smoothing
     - Acceleration handling
     - Position validation
   - Smooth transitions
     - Interpolation system
     - State management
     - Performance monitoring
   - Integration with Enigo
     - Event generation
     - Error handling
     - Platform specifics

3. Create keyboard shortcut system
   - Core action bindings
     - Emergency stop (Escape)
     - Toggle suppression
     - Clear logs
     - Theme switch
   - Safety controls
     - Conflict detection
     - Priority handling
     - State management
   - Configuration interface
     - Shortcut editor
     - Validation system
     - Persistence
   - Platform-specific bindings
     - macOS modifiers
     - Windows compatibility
     - Error handling

4. Build settings interface
   - Profile management
     - Create/edit/delete
     - Import/export
     - Validation
   - Calibration controls
     - Sensitivity adjustment
     - Pattern learning
     - Testing interface
   - Performance monitoring
     - Latency tracking
     - Resource usage
     - Event statistics
   - Configuration persistence
     - Local storage
     - State management
     - Migration handling

5. Implement movement smoothing
   - Basic algorithm implementation
     - Moving average
     - Kalman filter
     - Pattern detection
   - Parameter adjustment UI
     - Sensitivity controls
     - Visual feedback
     - Real-time preview
   - Performance optimization
     - Algorithm efficiency
     - Memory usage
     - Thread safety
   - Pattern recognition
     - Movement analysis
     - Adaptation system
     - Learning capabilities

## Technical Requirements

### Performance
- Target latency: < 5ms
- Event throttling at 60fps
- Efficient log management
   - Thread-safe operations
- Memory optimization

### Security
- OS-level permission management
- Local-only processing
- Protected input handling
- Safe event logging
- Secure state persistence

### Platform Support
- macOS: CGEvent tap for mouse events
- Windows: SetWindowsHookEx for mouse events
- Cross-platform: Position tracking and delta calculation
- Consistent keyboard support
- Unified event handling

## Known Issues & Limitations
1. Permission system complexity
   - Different requirements per platform
   - User experience challenges
   - Permission persistence
   - Error handling needs

2. Thread safety considerations
   - Complex state management
   - Race condition potential
   - Resource sharing
   - Performance impact
   - Error recovery

3. Window focus edge cases
   - Focus tracking reliability
   - Platform-specific behavior
   - Event handling consistency
   - State synchronization

4. Smoothing algorithm trade-offs
   - Latency vs smoothness
   - Memory vs performance
   - Accuracy vs responsiveness
   - Adaptation complexity

5. Event throttling requirements
   - Performance balancing
   - Event prioritization
   - Queue management
   - Resource utilization

6. Platform-specific quirks
   - macOS: Modifier key handling
   - Windows: Event hook reliability
   - Input device variations
   - System-level constraints

## Future Enhancements
1. Machine learning integration
   - Pattern recognition
   - Adaptive smoothing
   - User profiling

2. Cloud features
   - Profile sync
   - Settings backup
   - Usage analytics

3. Advanced functionality
   - Plugin system
   - Custom algorithms
   - Extended configuration

4. Community features
   - Profile sharing
   - Custom presets
   - User feedback

5. Mobile support
   - Touch input
   - Mobile UI
   - Cross-device sync

## Development Guidelines
1. Follow TypeScript strict mode
2. Maintain thread safety
3. Implement proper error handling
4. Use consistent logging practices
5. Add comprehensive testing
6. Monitor performance metrics
7. Document public APIs
8. Follow accessibility guidelines

## Resources
- [Tauri 2.2.0 Documentation](https://tauri.app/v2/docs/)
- [Enigo 0.3.0 API Reference](https://docs.rs/enigo/0.3.0/enigo/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [Tamagui 1.121.6](https://tamagui.dev/docs/intro/introduction/)
- [rdev Repository](https://github.com/fufesou/rdev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Rust Documentation](https://doc.rust-lang.org/book/)

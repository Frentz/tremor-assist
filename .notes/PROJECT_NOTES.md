# Tremor Assist - Project Documentation

## Recent Changes
### Git History
- 9355c46: fix: keyboard input handling on macOS - Switched to fufesou's rdev for better compatibility, updated docs, enhanced error handling
- e2d1c1e: feat: implement real hardware input tracking with rdev
- f725a02: docs: update changelog for v0.3.0
- 6d6f0c0: feat: add input logging interface with type toggles
- 951114d: docs: add development, contributing, and security documentation

## Project Overview
Tremor Assist is an accessibility-focused desktop application designed to help users with tremors use computers more effectively. The application provides real-time mouse movement assistance with adaptive smoothing algorithms.

## Technology Stack
### Frontend
- React 19.0.0 with TypeScript 5.7.2
- Tamagui 1.121.6 for UI components and theming
- Zustand 5.0.2 for state management
- Vite 6.0.7 for build tooling
- Heroicons 2.2.0 for icons

### Backend
- Rust (2021 edition)
- Tauri 2.2.0 for desktop integration
- Custom fork of rdev for input capture
- Enigo 0.3.0 for mouse control
- Serde for serialization

### Development Tools
- Yarn for package management
- TypeScript in strict mode
- Vite for development server
- Tauri CLI 2.2.2

## Core Architecture
### Frontend (`src/`)
#### Components
- React components for UI
- Tamagui theme integration
- Custom hooks for input tracking
- Dark/light theme support

#### State Management
- Zustand stores for application state
- Tamagui theme context
- Input log state
- Settings persistence

### Backend (`src-tauri/`)
#### Core Systems
- Input capture using rdev
- Event processing and filtering
- Mouse movement smoothing
- IPC with frontend

#### Performance Optimizations
- Event throttling at 60fps
- Thread-safe event emission
- Memory-safe implementation
- Error recovery system

## Security Implementation
### Core Principles
1. Local-only Processing
   - No cloud connectivity
   - No data collection
   - Memory-safe implementation
   - Protected configuration

2. System Integration
   - Minimal permissions
   - Sandboxed execution
   - Safe thread management
   - Protected system calls

3. Input Security
   - No keylogging
   - Secure event handling
   - Protected accessibility permissions
   - Safe keyboard processing

### Platform-Specific Security
#### macOS
- Accessibility permissions for input
- Protected modifier key access
- Secure event monitoring
- Custom rdev fork for stability

#### Windows
- Input device access permissions
- Protected input monitoring
- Secure event capture
- Safe thread management

## Development Status
### Current Phase
Currently in Phase 2: Core Functionality. Phase 1 (Foundation) has been completed with the following achievements:
- ✅ Project setup with Tauri 2.2.0
- ✅ Basic UI implementation with Tamagui
- ✅ Theme system implementation
- ✅ Input logging system
- ✅ Hardware input capture
- ✅ Cross-platform keyboard support
- ✅ Event visualization

### Next Priorities
1. Mouse movement smoothing algorithm implementation
2. Smoothing parameter adjustment UI
3. User profiles system
4. Settings persistence
5. Performance optimization

### Active Tasks
#### Mouse Control System
- Implement CGEvent tap for macOS
- Create Windows input capture system
- Build input event buffer
- Implement input suppression

#### Frontend
- Create settings interface using Tamagui Form components
- Add movement visualization with Tamagui animations
- Build profile management UI
- Implement performance monitoring view

## Implementation Details
### Input Capture System
- Using custom fork of rdev for improved macOS compatibility
- Event throttling at ~60fps for performance
- Thread-safe event emission to frontend
- Error recovery system in place

### UI Implementation
#### Component Structure
- TamaguiProvider for theme and styling context
- Theme component for dark/light mode switching
- YStack and XStack for layout management
- Custom InputLog component for event visualization

#### Core Components
1. App.tsx
   - Main application container
   - Theme switching logic
   - Input tracking controls
   - Event listener setup
   - Logging toggles

2. InputLog.tsx
   - Event visualization component
   - Scrollable log display
   - Color-coded event types
   - Timestamp formatting
   - Event type filtering

3. State Management
   - Zustand store for input logs
   - Maximum 1000 log entries
   - Separate mouse/keyboard logging flags
   - Automatic log clearing on toggle

#### Theme System
- Dark/light mode support using Tamagui themes
- System preference detection with useColorScheme
- Theme-aware components with Tamagui tokens
- Custom color tokens from @tamagui/themes
- Inter font integration for consistent typography
- Responsive design using Tamagui Stack
- Type-safe theme configuration
- Shorthand style props support

#### Typography
- Inter font family
- Consistent font scaling
- Type-safe font configuration
- Responsive text components

#### Layout System
- Stack-based layout using YStack/XStack
- Responsive spacing system
- Theme-aware borders and shadows
- Flexible container components

### State Management
#### Input Log Store
- Zustand-based state management
- Type-safe interfaces
- Event filtering logic
- Performance optimizations
- Clear log functionality

#### Theme State
- Theme state handled by Tamagui
- System preference integration
- Persistent theme selection
- Theme-aware styling

#### Event Handling
- Event type filtering
- Throttled updates
- Memory-efficient storage
- Type-safe event processing

## Known Issues and Inconsistencies
1. Keyboard input handling on macOS required switch to custom rdev fork
2. Event throttling needed for performance optimization
3. Documentation needs updating for recent macOS compatibility changes
4. Package.json lists React 19.0.0 which isn't officially released yet
5. Some Tauri features not explicitly specified in Cargo.toml

## Future Roadmap
### Phase 3: Advanced Features
- Adaptive smoothing
- Pattern recognition
- User calibration
- Performance metrics
- Analytics system

### Phase 4: Polish
- Onboarding experience
- Help documentation
- Keyboard shortcuts
- System tray integration

### Phase 5: Testing & Release
- Unit test suite
- Integration tests
- Performance testing
- User testing
- Security audit

## Development Guidelines
1. Follow Rust safety practices
2. Implement proper error handling
3. Use type-safe interfaces
4. Validate all input
5. Handle permissions properly
6. Test security features
7. Maintain theme consistency
8. Keep performance under 5ms latency
9. Document all changes
10. Follow semantic versioning 

## Build Configuration
### Vite Setup
- React plugin for JSX compilation
- Tamagui plugin integration
- Component extraction optimization
- Platform-specific build targets
- Development server configuration
- HMR with WebSocket support
- Source map generation for debugging
- Environment variable handling

### Build Targets
- Windows: Chrome 105+
- macOS: Safari 13+
- ES2021 support
- Debug build optimizations
- Production minification
- Source map generation

### Development Server
- Fixed port (1420)
- Strict port enforcement
- HMR on port 1421
- Ignored src-tauri directory
- Environment variable prefixing
- Debug mode support

### Optimization
- Tamagui component extraction
- Conditional minification
- Platform-specific targets
- Source map generation
- Development mode features 

### TypeScript Configuration
#### Main Configuration
- Target: ES2020
- Strict type checking
- React JSX support
- Module bundler resolution
- JSON module support
- Isolated modules
- No emit (Vite handles compilation)

#### Linting Rules
- Strict mode enabled
- No unused locals
- No unused parameters
- No fallthrough cases
- Class fields definition

#### Node Configuration
- Composite project setup
- ESNext module system
- Bundler module resolution
- Synthetic default imports
- Vite config inclusion

### Type Safety
- Strict null checks
- Strict function types
- Strict property initialization
- No implicit any
- No implicit this
- Strict bind call apply 
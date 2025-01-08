# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Input log visualization with resizable container
- Mouse and keyboard input logging toggles
- Dark/light theme support
- Clear button for input logs
- Console logging with timestamps
- Component interaction logging
- Emergency stop functionality
  - Escape key shortcut for immediate suppression disable
  - Emergency stop button in UI
  - Debounce mechanism to prevent multiple triggers
  - Thread-safe state management
  - Frontend state synchronization
- Mouse position tracking system
  - Thread-safe position management
  - Original position storage
  - Real-time position updates
- Improved error handling and logging
  - Comprehensive error messages
  - Thread-safe logging system
  - Event debouncing

### Fixed
- Keyboard input handling on macOS using fufesou's rdev fork
- Duplicate keyboard event logging
- Input log clearing behavior
- Mouse event filtering when logging is disabled
- Console logging format consistency
- UI responsiveness during emergency stop
- Multiple emergency stop triggers
- State synchronization between frontend and backend
- Thread safety in mouse control system

### Changed
- Improved input tracking status messages
- Enhanced console logging with timestamps
- More concise log messages
- Better correlation between UI and console events
- Improved documentation
  - Added comprehensive method documentation
  - Updated architecture documentation
  - Enhanced code comments
- Enhanced thread safety
  - Added proper Arc wrapping
  - Implemented LazyLock for static initialization
  - Improved state management

## [0.4.1] - 2024-01-07

### Fixed
- Fixed keyboard input causing app to close on macOS
- Improved keyboard event handling stability
- Updated rdev dependency to use fixed fork

### Changed
- Switched to fufesou's rdev fork for better macOS compatibility
- Improved input event handling architecture
- Enhanced error handling for input events

## [0.4.0] - 2024-01-07

### Added
- Real hardware input tracking using rdev
- Mouse movement and click event capture
- Event throttling for optimal performance (~60fps)
- Start/stop functionality for input tracking
- Clean event cleanup on tracking stop

### Dependencies Added
- rdev: ^0.5.3

## [0.3.0] - 2024-01-08

### Added
- Real hardware input tracking with rdev
- Input logging interface with type toggles
- Development, contributing, and security documentation

### Changed
- Updated keyboard input handling for better macOS compatibility
- Enhanced error handling and recovery system
- Improved documentation structure

### Dependencies Added
- zustand: ^5.0.2

## [0.2.0] - 2024-01-07

### Added
- Integrated Tamagui UI framework for consistent theming
- Added dark/light mode support with theme toggle
- Implemented minimalistic UI design
- Added Heroicons for improved iconography
- Created basic app layout with theme-aware components

### Dependencies Added
- tamagui: ^1.121.6
- @tamagui/core: ^1.121.6
- @tamagui/config: ^1.121.6
- @heroicons/react: ^2.2.0
- @fontsource/inter: ^5.1.1

## [0.1.0] - 2024-01-07

### Added
- Initial project setup using Tauri 2.2.0
- React 19.0.0 with TypeScript template
- Vite 6.0.7 as build tool
- Basic Tauri window configuration
- Development environment setup with hot reload

### Dependencies
#### Core Dependencies
- React: ^19.0.0
- React DOM: ^19.0.0
- @tauri-apps/api: ^2.2.0
- @tauri-apps/plugin-opener: ^2.2.3

#### Development Dependencies
- TypeScript: ^5.7.2
- Vite: ^6.0.7
- @vitejs/plugin-react: ^4.3.4
- @types/react: ^19.0.3
- @types/react-dom: ^19.0.2
- @tauri-apps/cli: ^2.2.2

### Development Setup
- Configured TypeScript compiler options
- Set up Vite development server
- Integrated Tauri development environment
- Enabled hot module replacement (HMR) 
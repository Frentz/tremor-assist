# Changelog

## [Unreleased]

### Added
- Input logging system with mouse and keyboard event tracking
- Resizable input log container for better visualization
- Manual clear functionality for input logs
- Console logging system with consistent timestamp format
- Theme toggle with dark/light mode support
- Mouse and keyboard logging toggles
- Error recovery system for input tracking

### Fixed
- Keyboard input handling on macOS using fufesou's rdev fork
- Duplicate keyboard event logging
- Inconsistent keyboard release events
- Mouse event throttling for better performance
- Input log clearing behavior
- Console logging format and consistency

### Changed
- Switched to fufesou's rdev for better macOS compatibility
- Improved input tracking status messages
- Enhanced error handling and recovery
- Updated documentation for recent changes
- Optimized event throttling parameters

## [0.3.0] - 2024-01-08

### Added
- Real hardware input tracking with rdev
- Input logging interface with type toggles
- Development, contributing, and security documentation

### Changed
- Updated keyboard input handling for macOS
- Enhanced error handling and recovery system
- Improved documentation structure

## [0.2.0] - 2024-01-07

### Added
- Basic UI implementation with Tamagui
- Theme system with dark/light mode
- Input visualization components
- Event filtering system

## [0.1.0] - 2024-01-06

### Added
- Initial project setup with Tauri 2.2.0
- Basic application structure
- Core input capture system 
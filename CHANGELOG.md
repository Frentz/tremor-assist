# Changelog

## [Unreleased]
### Added
- Console logging for UI interactions
  - Clear button logging
  - Theme switching logging
  - Input type toggle logging
  - Assistance toggle logging
- Resizable input log container
  - Drag handle for resizing
  - Minimum height constraint
  - Smooth resize interaction
- Improved console logging system
  - Consistent timestamp format [HH:MM:SS.mmm]
  - Event filtering based on tracking state
  - Thread-safe logging implementation

### Changed
- Removed automatic log clearing on toggle
- Enhanced event filtering logic
- Improved timestamp formatting consistency
- Updated documentation for recent changes

### Fixed
- Keyboard input handling on macOS using fufesou's rdev fork
- Mouse event logging state management
- Console logging synchronization
- Input log UI responsiveness

## [0.3.0] - 2024-01-08
### Added
- Real hardware input tracking with rdev
- Input logging interface with type toggles
- Basic mouse movement assistance
- Theme system integration
- Error recovery system

### Changed
- Switched to Tauri 2.2.0
- Updated to React 19.0.0
- Improved documentation structure
- Enhanced error handling

### Fixed
- macOS compatibility issues
- Input event handling
- Theme switching bugs
- Performance bottlenecks 
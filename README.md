# Tremor Assist

An accessibility-focused desktop application designed to help users with tremors use computers more effectively. The application provides real-time mouse movement assistance with adaptive smoothing algorithms.

## Features

- Real-time input tracking with minimal latency
- Separate mouse and keyboard logging toggles
- Resizable input log visualization
- Dark/light theme support
- Clear and concise console logging
- Adaptive mouse movement assistance (coming soon)

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn 1.22+
- Rust (latest stable)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tremor-assist.git
cd tremor-assist
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn tauri dev
```

## Development

- Built with Tauri 2.2.0 and React
- Uses Tamagui for UI components
- Implements custom fork of rdev for input handling
- Follows strict TypeScript configuration

### Project Structure

- `src/` - Frontend React application
- `src-tauri/` - Rust backend code
- `.notes/` - Project documentation
- `src/components/` - React components
- `src/store/` - State management

## Documentation

- [Mission Statement](.notes/MISSION.md)
- [Architecture](.notes/ARCHITECTURE.md)
- [Development Guide](.notes/DEVELOPMENT.md)
- [Contributing](.notes/CONTRIBUTING.md)
- [Security](.notes/SECURITY.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tauri](https://tauri.app) for the framework
- [Tamagui](https://tamagui.dev) for UI components
- [rdev](https://github.com/fufesou/rdev) for input handling

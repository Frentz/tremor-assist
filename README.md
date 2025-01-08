# Tremor Assist

A desktop application built with Tauri to assist users with hand tremors by providing mouse movement smoothing. Our mission is to help individuals with tremors use computers more effectively through intelligent, adaptive assistance.

## Documentation Guide
Start here to understand the project:
1. 📋 [Mission & Vision](./.notes/MISSION.md)
2. 🚀 [Development Roadmap](./.notes/MILESTONES.md)
3. ✅ [Current Tasks](./.notes/TASKS.md)
4. 🔧 [Technical Architecture](./.notes/ARCHITECTURE.md)
5. 💻 [Development Guide](./.notes/DEVELOPMENT.md)
6. 👥 [Contributing Guidelines](./.notes/CONTRIBUTING.md)
7. 🔒 [Security Policy](./.notes/SECURITY.md)
8. 📝 [Version History](./CHANGELOG.md)

## Key Features
- Real-time hardware input tracking with visual feedback
- Stable keyboard input handling across platforms
- High-performance event processing (~60fps)
- Toggleable mouse and keyboard logging
- Cross-platform support (Windows, macOS)
- Privacy-focused: all processing happens locally
- Dark/light theme support
- Clean, modern UI with Tamagui

## Quick Links
- **Getting Started**: See [Development Guide](./.notes/DEVELOPMENT.md) for setup and guidelines
- **Current Status**: Check [Current Tasks](./.notes/TASKS.md) for active development
- **Architecture**: Review [Technical Architecture](./.notes/ARCHITECTURE.md) for technical details
- **Security**: Review [Security Policy](./.notes/SECURITY.md) before contributing

## Technical Overview
- Frontend: React 19 + TypeScript + Tamagui 1.121.6
- Backend: Rust + Tauri 2.2.0
- Input Tracking: Custom rdev fork for improved stability
- State Management: Zustand 5.0.2
- Build System: Vite + Tauri CLI

## Platform Support
- **macOS**: Full support with stable keyboard input
- **Windows**: Native input handling support

## License
MIT License - See [LICENSE](./LICENSE) file for details

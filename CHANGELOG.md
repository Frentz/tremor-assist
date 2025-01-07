# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
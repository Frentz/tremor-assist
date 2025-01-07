# Development Guide

## Prerequisites
- Node.js >= 18
- Yarn >= 1.22.0
- Rust >= 1.75.0
- Tauri CLI >= 2.2.1

## Setup Instructions

1. **Clone the Repository**
```bash
git clone https://github.com/Frentz/tremor-assist.git
cd tremor-assist
```

2. **Install Dependencies**
```bash
yarn install
```

3. **Development**
```bash
yarn tauri dev
```

4. **Building**
```bash
yarn tauri build
```

## Project Structure
- `src/` - Frontend React code
- `src-tauri/` - Rust backend code
- `.notes/` - Project documentation
- `public/` - Static assets

## Development Guidelines

### UI Development
- Use Tamagui components for consistent theming
- Support both light and dark themes
- Maintain < 5ms latency for mouse operations
- Follow accessibility guidelines

### State Management
- Use Zustand for global state
- Implement type-safe state updates
- Follow immutability patterns

### Backend Development
- Follow Rust safety guidelines
- Implement proper error handling
- Maintain thread safety
- Document public APIs

### Testing
- Write unit tests for components
- Add integration tests for critical paths
- Test both themes
- Verify accessibility

### Performance
- Monitor latency
- Profile memory usage
- Test on both platforms
- Optimize render cycles

## Troubleshooting
See [CONTRIBUTING.md](./CONTRIBUTING.md) for common issues and solutions. 
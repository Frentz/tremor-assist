# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| 0.1.x   | :x:                |

## Security Considerations

### Mouse Input Handling
- All mouse input is processed locally
- No data is sent to external servers
- Input validation on all mouse events
- Proper error handling for input failures

### System Permissions
- Minimal required permissions
- Clear permission request dialogs
- Secure permission storage
- Regular permission audits

### Data Storage
- Local storage only
- No cloud synchronization
- Encrypted user preferences
- Secure state management

### Application Security
- Input sanitization
- Memory safety (Rust)
- Thread safety
- Error boundaries
- Crash recovery

## Reporting a Vulnerability

1. **DO NOT** create a public issue
2. Email security@tremor-assist.com
3. Include detailed description
4. Provide steps to reproduce
5. Wait for acknowledgment (24-48 hours)

## Security Best Practices

### Development
- Keep dependencies updated
- Follow Rust safety guidelines
- Implement proper error handling
- Use type-safe interfaces
- Regular security audits

### Building
- Sign all releases
- Verify dependencies
- Check for vulnerabilities
- Test on all platforms

### Distribution
- Secure download channels
- Verify package signatures
- Clear update process
- Version verification

## Incident Response

1. Immediate assessment
2. User notification if needed
3. Fix implementation
4. Security patch release
5. Post-mortem analysis

## Updates and Patches
- Regular security updates
- Automated vulnerability scanning
- Dependency updates
- Quick patch releases

## Contact
For security concerns, email:
security@tremor-assist.com 
# Nia Auth Service

A robust, production-ready authentication service built with Rust, gRPC, SurrealDB, and Redis. This service provides comprehensive authentication functionality including user registration, login, session management, password reset, and advanced security features.

## Features

### Core Authentication
- **User Registration** with email verification
- **Secure Login** with multiple authentication methods
- **JWT-based Authentication** with access and refresh tokens
- **Session Management** with Redis-backed distributed sessions
- **Password Management** with secure hashing (Argon2)

### Security Features
- **Rate Limiting** with multiple strategies (IP, user, geolocation, time-based)
- **Brute Force Protection** with automatic IP/account blocking
- **Password Strength Validation** with configurable requirements
- **Account Lockout** after failed login attempts
- **Secure Token Management** with proper expiration and revocation

### Advanced Features
- **Multi-session Support** with session tracking and management
- **Email Integration** for password reset and verification
- **Comprehensive Logging** with structured logging and monitoring
- **Health Checks** and monitoring endpoints
- **Automatic Cleanup** of expired data

## Architecture

The service follows a clean architecture pattern with the following layers:

```
┌─────────────────┐
│   gRPC Handlers │  ← API Layer
├─────────────────┤
│   Services      │  ← Business Logic Layer
├─────────────────┤
│   Repositories  │  ← Data Access Layer
├─────────────────┤
│   Database      │  ← Data Storage (SurrealDB + Redis)
└─────────────────┘
```

### Components

- **Handlers**: gRPC service implementations
- **Services**: Business logic and orchestration
- **Models**: Data structures and validation
- **Repositories**: Database operations and queries
- **Database**: SurrealDB for persistence, Redis for caching

## Quick Start

### Prerequisites

- Rust 1.70+
- SurrealDB
- Redis
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nia-backend/services/auth-service
   ```

2. **Install dependencies**
   ```bash
   cargo build
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start dependencies**
   ```bash
   # Using Docker Compose
   docker-compose up -d surrealdb redis
   
   # Or start manually
   surrealdb start --user root --pass root memory
   redis-server
   ```

5. **Run the service**
   ```bash
   cargo run
   ```

The service will start on `0.0.0.0:50051` by default.

## Configuration

The service can be configured using environment variables. See `.env.example` for all available options.

### Key Configuration Options

- `JWT_SECRET`: Secret key for JWT signing (change in production!)
- `JWT_EXPIRY_HOURS`: Access token expiration time
- `REFRESH_TOKEN_EXPIRY_DAYS`: Refresh token expiration time
- `MAX_LOGIN_ATTEMPTS`: Maximum failed login attempts before lockout
- `RATE_LIMIT_REQUESTS_PER_MINUTE`: Rate limiting threshold

## API Reference

The service exposes a gRPC API with the following main endpoints:

### Authentication
- `Register` - Create a new user account
- `Login` - Authenticate user and return tokens
- `Logout` - Invalidate user session
- `RefreshToken` - Get new access token using refresh token

### Token Management
- `VerifyToken` - Validate access token
- `ValidateSession` - Check session validity

### Password Management
- `ChangePassword` - Update user password
- `ResetPassword` - Initiate password reset
- `ConfirmPasswordReset` - Complete password reset

### Session Management
- `GetActiveSessions` - List user's active sessions
- `RevokeSession` - Invalidate specific session
- `RevokeAllSessions` - Invalidate all user sessions

### Account Management
- `DeactivateAccount` - Temporarily disable account
- `DeleteAccount` - Permanently delete account

### Health & Monitoring
- `HealthCheck` - Service health status

## Security Features

### Rate Limiting
The service implements multiple rate limiting strategies:

- **Basic Rate Limiting**: Per-IP request limits
- **Adaptive Rate Limiting**: Dynamic limits based on activity
- **Geolocation-based**: Different limits by country
- **Time-based**: Varying limits by time of day
- **User Agent-based**: Stricter limits for suspicious agents

### Brute Force Protection
- Automatic IP blocking after multiple failed attempts
- Account lockout with configurable duration
- Progressive delays for repeated failures
- Suspicious activity detection

### Password Security
- Argon2 password hashing
- Configurable password strength requirements
- Password history tracking (future feature)
- Secure password reset flow

## Database Schema

### Users Table
```sql
CREATE user SET
    id = <uuid>,
    email = <string>,
    username = <string>,
    password_hash = <string>,
    display_name = <string>,
    bio = <string>,
    avatar_url = <string>,
    email_verified = <bool>,
    account_active = <bool>,
    roles = <array<string>>,
    created_at = <datetime>,
    updated_at = <datetime>,
    last_login = <datetime>,
    failed_login_attempts = <number>,
    locked_until = <datetime>
```

### Sessions Table
```sql
CREATE session SET
    id = <uuid>,
    user_id = <uuid>,
    client_ip = <string>,
    user_agent = <string>,
    created_at = <datetime>,
    last_activity = <datetime>,
    expires_at = <datetime>,
    is_active = <bool>
```

### Refresh Tokens Table
```sql
CREATE refresh_token SET
    id = <uuid>,
    user_id = <uuid>,
    session_id = <uuid>,
    token_hash = <string>,
    created_at = <datetime>,
    expires_at = <datetime>,
    is_revoked = <bool>
```

## Development

### Running Tests
```bash
cargo test
```

### Code Generation
The gRPC code is automatically generated during build. To regenerate:
```bash
cargo build
```

### Database Migrations
Database schema is automatically initialized on startup. For manual schema updates, modify the `init_schema` function in `src/db/mod.rs`.

## Production Deployment

### Security Checklist
- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable TLS/SSL
- [ ] Configure proper firewall rules
- [ ] Set up monitoring and alerting
- [ ] Configure log aggregation
- [ ] Set up backup procedures

### Performance Tuning
- Configure Redis memory limits
- Tune SurrealDB performance settings
- Set appropriate connection pool sizes
- Monitor and adjust rate limits
- Configure log levels for production

### Monitoring
The service provides health check endpoints and structured logging. Key metrics to monitor:

- Authentication success/failure rates
- Rate limiting triggers
- Database connection health
- Token refresh patterns
- Session activity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

Built with ❤️ using Rust, gRPC, SurrealDB, and Redis.
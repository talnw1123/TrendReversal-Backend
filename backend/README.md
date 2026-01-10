# Trend Reversal Backend API

Backend API for Financial Trend-Reversal Visualization Mobile App.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for PostgreSQL & Redis)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start PostgreSQL & Redis with Docker
docker-compose up -d

# Run in development mode
npm run start:dev
```

### Available Scripts

```bash
npm run start:dev    # Development with hot-reload
npm run start:debug  # Debug mode
npm run build        # Build for production
npm run start:prod   # Run production build
npm run lint         # Lint code
npm run test         # Run tests
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs

## 🏗️ Project Structure

```
src/
├── common/              # Shared utilities
│   ├── decorators/      # Custom decorators (@Auth, @CurrentUser)
│   ├── filters/         # Exception filters
│   └── interceptors/    # Response interceptors
│
├── config/              # Configuration files
│
├── modules/
│   ├── auth/            # JWT Authentication
│   ├── users/           # User management
│   ├── assets/          # Financial assets (stocks, crypto, forex)
│   ├── predictions/     # ML API integration (reversal points)
│   └── notifications/   # Push notifications
│
├── app.module.ts
└── main.ts
```

## 🔑 Authentication

The API uses JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## 📡 Main Endpoints

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login

### Users
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/me` - Update profile
- `POST /api/v1/users/me/favorites/:symbol` - Add favorite asset

### Assets
- `GET /api/v1/assets` - List assets (with filtering)
- `GET /api/v1/assets/:symbol` - Get asset details
- `GET /api/v1/assets/trending` - Top volume assets
- `GET /api/v1/assets/gainers` - Top gainers
- `GET /api/v1/assets/losers` - Top losers

### Predictions (ML API)
- `POST /api/v1/predictions` - Get prediction with reversal points
- `GET /api/v1/predictions/reversal-points/:symbol` - Get reversal points
- `GET /api/v1/predictions/batch` - Get batch reversal points

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `POST /api/v1/notifications/devices` - Register device for push
- `PATCH /api/v1/notifications/:id/read` - Mark as read

## 🔧 Environment Variables

See `.env.example` for all available configuration options.

## 📦 Tech Stack

- **NestJS** - Backend framework
- **TypeORM** - Database ORM
- **PostgreSQL** - Main database
- **Redis** - Caching
- **Passport + JWT** - Authentication
- **Swagger** - API documentation

# REST API Template

A Node.js 20 REST API boilerplate built with TypeScript, Express, Sequelize, and SQLite.

## Features

- User signup, login, profile update, and soft deactivation
- JWT bearer authentication and ownership authorization
- Password hashing with bcrypt
- Zod request validation and consistent JSON errors
- Sequelize migrations tracked by Umzug
- Vitest and Supertest integration tests using in-memory SQLite
- Strict TypeScript, ESLint, and `.rest` request examples

## Requirements

- Node.js 20
- npm

## Setup

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

The server defaults to `http://localhost:3000`. Use the files under `requests/` with the VS Code REST Client extension, JetBrains HTTP Client, or another compatible client.

## API

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/signup` | No | Create an active user and return a JWT |
| `POST` | `/api/v1/auth/login` | No | Authenticate an active user and return a JWT |
| `PATCH` | `/api/v1/users/:id` | Bearer JWT | Update the authenticated user's name, email, or password |
| `PATCH` | `/api/v1/users/:id/deactivate` | Bearer JWT | Soft-deactivate the authenticated user |
| `GET` | `/health` | No | Health check |

Only the owner can update or deactivate an account. Password changes require `currentPassword`. Deactivated users remain in the database, cannot log in, and cannot use previously issued tokens.

Successful responses wrap content in `data`; failures use this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {}
  }
}
```

## Scripts

```bash
npm run dev              # development server with watch mode
npm run build            # compile TypeScript to dist/
npm start                # run the compiled server
npm run typecheck        # strict type checking
npm run lint             # lint source and tests
npm test                 # run tests once
npm run test:coverage    # generate coverage
npm run db:migrate       # apply pending database migrations
npm run db:migrate:undo  # revert the latest migration
```

## Structure

```text
src/
├── config/       # environment, database, and migration setup
├── controllers/  # HTTP request/response adapters
├── middleware/   # authentication, validation, and errors
├── migrations/   # versioned database schema changes
├── models/       # Sequelize models
├── routes/       # versioned Express routes
├── services/     # authentication and user business logic
├── types/        # TypeScript declaration augmentation
├── utils/        # shared errors and async helpers
├── validators/   # Zod schemas and inferred input types
├── app.ts        # Express application (without network binding)
└── server.ts     # database connection and HTTP listener
```

For production, provide a strong `JWT_SECRET`, apply migrations as a deployment step, and run `npm run build && npm start`.

## Docker deployment

Build the production image:

```bash
docker build -t rest-api-template .
```

Run it with a persistent SQLite volume and a strong JWT secret:

```bash
docker run --name rest-api-template \
  -p 3000:3000 \
  -e JWT_SECRET='replace-with-at-least-32-random-characters' \
  -v rest-api-data:/app/data \
  rest-api-template
```

The container applies pending migrations before starting the API, runs as the non-root `node` user, and exposes its health check at `GET /health`. The named volume preserves the SQLite database across container replacements.

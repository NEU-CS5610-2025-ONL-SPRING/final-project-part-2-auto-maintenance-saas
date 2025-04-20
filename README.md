# Auto Maintenance SaaS

Car maintenance scheduling app with user and admin features.

## Features

- Browse and book auto services
- Search vehicles by make/model
- Manage appointments
- Admin dashboard for services/appointments

## Stack

- **Frontend**: React, Material UI
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL (production), SQLite (development)

## Quick Start

```bash
# Install dependencies
cd api && npm install
cd ../client && npm install

# Configure environment
cp api/.env.example api/.env
cp client/.env.example client/.env

# Initialize database
cd api && npx prisma db push

# Start development servers
cd api && npm run dev
cd ../client && npm start
```

## Deployment

- https://final-project-part-2-auto-maintenance.onrender.com

See [RENDER_DEPLOY.md](RENDER_DEPLOY.md) for deployment details.

## License

MIT

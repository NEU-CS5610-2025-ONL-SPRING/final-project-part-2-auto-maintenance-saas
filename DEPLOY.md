# Deployment Guide

## Local Development

```bash
# API setup
cd api
npm install
cp .env.example .env
npx prisma db push
npm run dev

# Client setup
cd ../client
npm install
cp .env.example .env
npm start
```

## Production Deployment

### Backend (API)

#### Render.com (Recommended)

1. Connect GitHub repository
2. Create a new Web Service
3. Select `api` as root directory
4. Build command: `npm install && npx prisma generate`
5. Start command: `npm start`
6. Add environment variables

#### Database

1. Create PostgreSQL database on Render
2. Add connection string to environment variables

### Frontend (Client)

#### Vercel (Recommended)

1. Connect GitHub repository
2. Select `client` as root directory
3. Add environment variables:
   - `REACT_APP_API_BASE_URL=https://your-api-url.render.com`

## Deployment with render.yaml

For automatic deployment with Render Blueprints:

1. Ensure the `render.yaml` file is in your repository
2. Connect your repository to Render
3. Choose "Blueprint" deployment option

## Common Issues

- CORS: Ensure API has correct client URL
- Authentication: Check JWT_SECRET is set
- Database: Verify connection string

For detailed logs: Check Render/Vercel dashboards

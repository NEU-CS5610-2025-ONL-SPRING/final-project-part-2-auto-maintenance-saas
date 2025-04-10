# Deployment Guide

This document provides step-by-step instructions for deploying the Auto Maintenance SaaS application in both development and production environments.

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Setup and Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/auto-maintenance-saas.git
   cd auto-maintenance-saas
   ```

2. **Backend Setup**

   ```bash
   # Navigate to the API directory
   cd api

   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration using a text editor

   # Initialize the database
   npx prisma migrate dev --name init

   # Start the development server
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   # Open a new terminal and navigate to the client directory
   cd client

   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration using a text editor

   # Start the development server
   npm start
   ```

4. **Accessing the Application**
   - Backend API: [http://localhost:3001](http://localhost:3001)
   - Frontend: [http://localhost:3000](http://localhost:3000)

## Production Deployment

### Backend Deployment (Node.js Server)

#### Option 1: Heroku Deployment

1. **Create a Heroku Account and Install Heroku CLI**

   - Sign up at [Heroku](https://signup.heroku.com/)
   - Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login to Heroku**

   ```bash
   heroku login
   ```

3. **Create a New Heroku App**

   ```bash
   heroku create auto-maintenance-api
   ```

4. **Add a PostgreSQL Database**

   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Configure Environment Variables**

   ```bash
   heroku config:set JWT_SECRET=your-secure-jwt-secret
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=https://your-frontend-url.com
   ```

6. **Deploy Backend to Heroku**

   ```bash
   # From the root directory
   git subtree push --prefix api heroku main
   ```

7. **Run Database Migrations**
   ```bash
   heroku run npx prisma migrate deploy
   ```

#### Option 2: DigitalOcean Deployment

1. **Create a Droplet or App Platform Project**

   - Sign up at [DigitalOcean](https://www.digitalocean.com/)
   - Create a new App Platform project or Droplet

2. **Configure the App**

   - Select GitHub as your source
   - Select your repository and set the root directory to `/api`
   - Configure environment variables in the app settings

3. **Add a Database**

   - Add a new PostgreSQL database component
   - Link it to your application

4. **Deploy the App**
   - Click "Deploy to Production"

### Frontend Deployment

#### Option 1: Netlify Deployment

1. **Build the Frontend**

   ```bash
   cd client
   npm run build
   ```

2. **Create a Netlify Account**

   - Sign up at [Netlify](https://app.netlify.com/signup)
   - Install Netlify CLI: `npm install -g netlify-cli`

3. **Login to Netlify**

   ```bash
   netlify login
   ```

4. **Initialize Netlify Site**

   ```bash
   netlify init
   ```

5. **Configure Environment Variables**

   - Go to Site settings > Build & deploy > Environment
   - Add `REACT_APP_API_BASE_URL` with your backend URL

6. **Deploy to Netlify**
   ```bash
   netlify deploy --prod
   ```

#### Option 2: Vercel Deployment

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy the Frontend**

   ```bash
   cd client
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to the project settings on Vercel
   - Add `REACT_APP_API_BASE_URL` with your backend URL

## Database Management in Production

### Connecting to the Database

```bash
# For Heroku
heroku pg:psql

# For other providers, use the connection string provided
```

### Running Migrations in Production

```bash
# For Heroku
heroku run npx prisma migrate deploy

# For other environments
npx prisma migrate deploy
```

## Monitoring and Maintenance

### Checking Logs

```bash
# Heroku logs
heroku logs --tail

# Netlify logs
netlify sites:list
netlify api getLogs --site=your-site-id
```

### Updating the Application

1. Push changes to your Git repository
2. Redeploy following the steps above

## Common Issues and Troubleshooting

1. **CORS Issues**

   - Ensure `CLIENT_URL` environment variable is correctly set on the backend
   - Verify CORS configuration in `api/src/index.js`

2. **Database Connection Issues**

   - Check your database URL in the environment variables
   - Ensure the database is running and accessible

3. **Authentication Problems**

   - Verify JWT_SECRET is properly set
   - Check that cookies are being sent with credentials

4. **Build Failures**
   - Check build logs for specific errors
   - Ensure all dependencies are properly installed

## Security Considerations

1. Always use HTTPS in production
2. Set a strong JWT_SECRET
3. Implement rate limiting for API endpoints
4. Regularly update dependencies with `npm audit fix`

## Scaling Considerations

As your user base grows:

1. Consider upgrading your database plan
2. Implement caching for frequently accessed data
3. Use a CDN for static assets
4. Consider containerization with Docker for easier scaling

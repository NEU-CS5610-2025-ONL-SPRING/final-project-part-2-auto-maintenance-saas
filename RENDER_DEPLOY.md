# Auto-Deploy with Render.com

This project is configured for automatic deployment on Render.com using the `render.yaml` configuration file.

## Services Defined

1. **Backend API (`auto-maintenance-api`)**

   - Node.js web service
   - Automatically builds and deploys the Express API
   - Connected to PostgreSQL database
   - Health check endpoint at `/api/health`

2. **Frontend Client (`auto-maintenance-client`)**

   - Static web service for the React frontend
   - Automatically builds the React app
   - Configured with proper routing for single-page application

3. **PostgreSQL Database (`auto-maintenance-db`)**
   - Starter plan database
   - Connection string automatically provided to the backend

## How to Use Auto-Deploy

1. **Fork/Clone the Repository**

   - Make sure your repository includes the `render.yaml` file

2. **Connect to Render.com**

   - Login to your Render.com account
   - Go to Dashboard -> "New" -> "Blueprint"
   - Connect your GitHub/GitLab account
   - Select the repository with this project
   - Render will automatically detect the `render.yaml` file and offer to deploy the defined services

3. **Configure Deployment**

   - Review the services and settings
   - Click "Apply Blueprint"
   - Render will automatically create and deploy all services

4. **Verify Deployment**
   - Check that all services are successfully deployed
   - Visit the frontend URL to access your application
   - Test the backend API endpoints

## Manual Configuration

If you need to make adjustments to the deployment:

1. **Edit Environment Variables**

   - You can add/modify environment variables through the Render dashboard
   - For sensitive data, use Render's environment variable system rather than hardcoding values

2. **Database Management**

   - Access your database from the Render dashboard
   - You can run migrations manually if needed
   - The database connection string is automatically provided to the backend service

3. **Scaling**
   - You can scale up your services as needed from the Render dashboard
   - Consider upgrading the database plan for production workloads

## Troubleshooting

If you encounter issues with your deployment:

1. **Check Logs**

   - View logs for each service in the Render dashboard
   - Look for build errors or runtime exceptions

2. **Health Check Failures**

   - Ensure the `/api/health` endpoint is working
   - Check that your server is starting properly

3. **Database Connection Issues**

   - Verify that the database connection is working
   - Check for network policies or firewall issues

4. **Frontend Routing**
   - Make sure the SPA routing is configured correctly
   - The `/* -> /index.html` rewrite rule should handle client-side routing

## Local Development

For local development, you can continue to use your existing setup as described in the main README.md file.

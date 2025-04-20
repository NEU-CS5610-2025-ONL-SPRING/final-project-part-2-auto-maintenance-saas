# Auto-Deploy with Render.com

## Services

- **Backend API**: Node.js web service
- **Frontend Client**: Static site (React)
- **Database**: PostgreSQL

## Quick Deploy Steps

1. Add `render.yaml` to repository root
2. Login to Render.com → Dashboard → New → Blueprint
3. Connect GitHub repository
4. Apply Blueprint
5. All services deploy automatically

## Environment Variables

- Backend environment variables set automatically
- Database connection handled automatically
- Frontend URL provided to backend automatically

## Managing Deployment

- **Database**: Access via Render dashboard
- **Logs**: View in service details page
- **Scaling**: Adjust in service settings

## Troubleshooting

- **Health Check**: Ensure `/api/health` endpoint works
- **Database**: Check connection string
- **Frontend**: Verify routing configuration

For local development, follow instructions in README.md

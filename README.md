# Auto Maintenance SaaS Application

A full-stack application for scheduling and managing car maintenance services.

## Features

- View available maintenance services with pricing
- Search for car models via NHTSA Vehicle API
- Book appointments with available time slots
- Calculate service costs based on selected services
- Manage your appointments as a user
- Admin dashboard for managing all appointments and services

## Technology Stack

### Frontend

- React
- Material UI
- React Router
- Date-fns

### Backend

- Node.js with Express
- Prisma ORM
- SQLite database (can be configured for PostgreSQL in production)
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/auto-maintenance-saas.git
   cd auto-maintenance-saas
   ```

2. Install dependencies for both client and server

   ```
   # Install API dependencies
   cd api
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables

   ```
   # API directory
   cd api
   cp .env.example .env
   # Edit .env with your configuration

   # Client directory
   cd ../client
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Initialize the database

   ```
   cd api
   npx prisma migrate dev
   ```

5. Start the development servers

   ```
   # Start API server (from api directory)
   npm run dev

   # Start client server (from client directory)
   npm start
   ```

## Deployment

For detailed deployment instructions for both development and production environments, please refer to the [DEPLOY.md](DEPLOY.md) file.

Quick reference:

- Frontend: Netlify or Vercel recommended
- Backend: Heroku or DigitalOcean recommended
- Database: PostgreSQL for production

## Project Structure

```
auto-maintenance-saas/
├── api/                  # Backend code
│   ├── prisma/           # Database schema and migrations
│   ├── src/              # Source code
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes (auth, services, vehicles, appointments)
│   │   └── utils/        # Utility functions
│   ├── .env.example      # Example environment variables
│   └── package.json      # Backend dependencies
├── client/               # Frontend code
│   ├── public/           # Public assets
│   ├── src/              # Source code
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context
│   │   ├── pages/        # Page components
│   │   └── utils/        # Utility functions
│   ├── .env.example      # Example environment variables
│   └── package.json      # Frontend dependencies
├── accessibility_reports/
│   └── accessibility_report.md # Consolidated accessibility report
├── DEPLOY.md             # Detailed deployment instructions
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## Accessibility

This application has been built with accessibility in mind, following WCAG 2.1 guidelines. The accessibility reports can be found in the `accessibility_reports` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- NHTSA for providing the Vehicle API
- Material UI for the component library
- All contributors to this project

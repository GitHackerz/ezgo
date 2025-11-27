# EZGO Web Dashboard - Environment Variables

Copy this file to `.env.local` and update with your values:

```bash
# Backend API URL
SERVER_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-in-production

# Database (if needed for direct access)
DATABASE_URL=postgresql://postgres:password@localhost:5432/ezgo?schema=public
```

## Setup Instructions

1. Copy this file: `cp ENV_SETUP.md .env.local`
2. Update the values in `.env.local`
3. Restart the development server

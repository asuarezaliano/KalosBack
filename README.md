# Kalos Backend

This is the backend for the Kalos project. Below you'll find instructions for setting up and running the project.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Prisma CLI (will be installed in the next steps)

## Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/asuarezaliano/KalosBack.git
cd kalos-backend
```

2. Install dependencies:
```bash
npm install
# or if using yarn
yarn install
```

3. Install Prisma globally (if not already installed):
```bash
npm install -g prisma
# or if using yarn
yarn global add prisma
```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables as needed:
```env

## Database and Prisma

The project is configured with:
- SQLite as the database (file: `prisma/dev.db`)
- Models defined for:
  - Transfer (money transfers)
  - Analytics (analysis)
  - CurrencyAmount (amounts per currency)

### Prisma Setup and Commands

Before running any Prisma commands, ensure Prisma CLI is installed:
```bash
# Check Prisma CLI installation
prisma -v

# If you see "command not found", install it globally:
npm install -g prisma
# or using yarn
yarn global add prisma
```

1. Apply migrations:
```bash
npx prisma migrate dev
```

2. View the database with Prisma Studio:
```bash
npx prisma studio
```

3. Generate Prisma client:
```bash
npx prisma generate
```

Note: If you encounter any "command not found" errors when using `prisma` or `npx prisma`, try closing and reopening your terminal after installation.

## Project Structure

```
kalos-backend/
├── src/
│   ├── controllers/    # Application controllers
│   ├── routes/         # API routes
│   ├── models/         # Data models
│   └── middleware/     # Custom middleware
├── prisma/
│   ├── schema.prisma   # Prisma schema
│   ├── dev.db         # SQLite database
│   └── migrations/    # Database migrations
└── ...
```

## Additional Notes

- The SQLite database is created automatically when running migrations
- Models include:
  - Transfer: For managing transfers with amounts and currencies
  - Analytics: For statistics tracking
  - CurrencyAmount: For tracking amounts by currency type
- Supported currencies are USD and EUR

## Troubleshooting

If you encounter any errors:

1. Make sure you've run all migrations:
```bash
npx prisma migrate reset --force
npx prisma generate
```

2. If the database is corrupted, you can delete the `prisma/dev.db` file and run the migrations again

3. To verify the database status, use Prisma Studio:
```bash
npx prisma studio
```

## Contact

To report issues or suggestions, please create an issue in the repository.

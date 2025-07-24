# CookScan

A web application that extracts recipe information from food images.

## Tech Stack

- **Framework**: Next.js 15.4 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS

## Setup

### Prerequisites

- Node.js 18+
- Docker Desktop
- npm or yarn

### Environment Setup

1. **Clone the repository**
```bash
git clone [repository-url]
cd cook-scan
```

2. **Install dependencies**
```bash
npm install
```

3. **Start PostgreSQL**
```bash
docker compose up -d
```

4. **Set environment variables**
Create `.env.local` file with:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/cookscan_dev
```

5. **Setup database**
```bash
npm run db:migrate:dev
```

6. **Start development server**
```bash
npm run dev
```

Application will be available at http://localhost:3000

## Development Commands

### Application
- `npm run dev` - Start development server (Turbopack)
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run lint check

### Database (Development)
- `npm run db:migrate:dev` - Run migrations
- `npm run db:push:dev` - Push schema changes directly
- `npm run db:reset:dev` - Reset database
- `npm run db:studio:dev` - Open Prisma Studio
- `npm run db:seed:dev` - Seed database
- `npm run db:migrate:status` - Check migration status

### Database (Production)
- `npm run db:migrate:prod` - Production migration
- `npm run db:migrate:deploy` - Safe deploy
- `npm run db:studio:prod` - Production Prisma Studio

### Common Commands
- `npm run db:generate` - Generate Prisma Client
- `npm run db:format` - Format schema
- `npm run db:validate` - Validate schema

## Project Structure

```
cook-scan/
├── prisma/           # Prisma schema
├── public/           # Static files
├── src/
│   └── app/         # Next.js App Router
├── docker-compose.yml # PostgreSQL configuration
└── package.json
```

## Docker Environment

PostgreSQL is managed with Docker:
- Port: 5433 (host) → 5432 (container)
- Database: cookscan_dev
- User: postgres
- Password: postgres

### Docker Operations
```bash
# Start
docker compose up -d

# Stop
docker compose down

# Check logs
docker compose logs -f postgres
```

## Troubleshooting

### Migration fails
1. Check if PostgreSQL is running
2. Verify .env.local file is correctly configured
3. Check container status with `docker ps`

### Build errors
1. Regenerate Prisma Client with `npm run db:generate`
2. Delete node_modules and reinstall
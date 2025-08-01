# Development Commands

## Essential Commands

### Development Server
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Production build
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint (Next.js rules)
```

### Database Operations (Development)
```bash
npm run db:migrate:dev     # Run migrations
npm run db:push:dev        # Push schema changes directly
npm run db:reset:dev       # Reset database
npm run db:studio:dev      # Open Prisma Studio GUI
npm run db:seed:dev        # Seed database
npm run db:generate        # Generate Prisma Client
npm run db:format          # Format Prisma schema
npm run db:validate        # Validate Prisma schema
```

### Docker Commands
```bash
docker compose up -d       # Start PostgreSQL
docker compose down        # Stop PostgreSQL
docker compose logs -f postgres  # Check logs
```

## Environment Setup
1. Ensure `.env.local` exists with:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/cookscan_dev
   ```

2. Run migrations before starting:
   ```bash
   npm run db:migrate:dev
   ```

## Git Commands (Darwin/macOS)
```bash
git status              # Check status
git diff                # View changes
git add .               # Stage all changes
git commit -m "message" # Commit changes
git push                # Push to remote
git log --oneline -10   # View recent commits
```

## File Operations (Darwin/macOS)
```bash
ls -la                  # List files with details
cd <directory>          # Change directory
grep -r "pattern" .     # Search in files
find . -name "*.tsx"    # Find files by name
open .                  # Open current directory in Finder
```
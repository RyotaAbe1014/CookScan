# CLAUDE.md

This file provides guidance for Claude Code (claude.ai/code) and other AI assistants when working with the CookScan repository.

## Project Overview

CookScan is a recipe extraction and management web application that uses AI to extract recipe information from images (screenshots, photos, handwritten notes) and converts them into structured JSON data. The project uses OCR and LLM technology to parse and structure recipe data.

**Key Features:**
- AI-powered recipe extraction from images
- User authentication and profile management
- Recipe versioning and history tracking
- Tag-based organization with categories
- Source attribution for recipes
- OCR processing history

## Repository Structure

This is a **monorepo** with two main applications:

```
CookScan/
├── cook-scan/          # Main Next.js production application
├── sample/             # Sample/prototype application
│   ├── backend/        # Hono + Mastra backend
│   ├── frontend/       # React + Vite frontend
│   └── docs/           # Documentation
├── docker-compose.yml  # PostgreSQL 16 service
└── CLAUDE.md          # This file
```

### cook-scan/ (Main Production Application)

The primary Next.js 15 full-stack application with:
- **prisma/** - Database schema and migrations
- **public/** - Static assets
- **src/**
  - **app/** - Next.js App Router pages and API routes
    - `(auth)/` - Protected routes (dashboard, recipes, tags)
    - `(auth-setup)/` - Profile setup flow
    - `(public)/` - Public routes (login)
  - **features/** - Feature-based modules (auth, recipes, profile)
  - **lib/** - Shared libraries (Prisma client)
  - **mastra/** - AI workflow implementation
  - **types/** - TypeScript type definitions
  - **utils/** - Utility functions (Supabase integration)

### sample/ (Prototype Application)

A simpler reference implementation with:
- **backend/** - Hono-based API server (AWS Lambda compatible)
- **frontend/** - React + Vite + Material-UI SPA
- **docs/** - Additional documentation

## Technology Stack

### Main Application (cook-scan/)

**Frontend:**
- Framework: Next.js 15.5.6 (App Router, React Server Components)
- React: 19.1.0
- Styling: Tailwind CSS v4
- Build Tool: Turbopack (via Next.js)
- TypeScript: v5

**Backend:**
- Framework: Next.js API Routes
- Database: PostgreSQL 16 (via Docker)
- ORM: Prisma 6.12.0
- Auth: Supabase Auth (@supabase/ssr, @supabase/supabase-js)

**AI/ML:**
- Framework: Mastra v0.18.0 (@mastra/core v0.24.0)
- Image Processing: Google Gemini 2.5 Flash
- Text Processing: OpenAI GPT-4o
- AI SDK: Vercel AI SDK v5.0.0

### Sample Application

**Frontend:**
- React 19.1.0 + Vite 7.0.4
- UI Library: Material-UI (MUI) v7.2.0
- Routing: React Router DOM v7.7.0

**Backend:**
- Framework: Hono v4.8.5
- Database: lowdb v7.0.1 (JSON file storage)
- Deployment: AWS Lambda compatible

## Development Commands

### Main Application (cook-scan/)

```bash
# Development server (with Turbopack)
npm run dev

# Production build
npm run build
npm run start

# Database operations (uses .env.migration for local dev)
npm run db:generate      # Generate Prisma Client
npm run db:migrate:dev   # Run migrations (development)
npm run db:push:dev      # Push schema changes
npm run db:seed:dev      # Seed database
npm run db:reset:dev     # Reset database
npm run db:studio:dev    # Open Prisma Studio (dev)
npm run db:studio:prod   # Open Prisma Studio (prod)

# Docker operations
docker-compose up -d     # Start PostgreSQL
docker-compose down      # Stop PostgreSQL
docker-compose ps        # Check status
```

### Sample Application

**Backend (sample/backend/):**
```bash
npm run dev              # Development server (port 3001)
npm run build            # Build for AWS Lambda
npm run deploy           # Deploy to AWS
```

**Frontend (sample/frontend/):**
```bash
npm run dev              # Development server
npm run build            # Production build
npm run lint             # Run ESLint
```

**Mastra (sample/backend/mastra/):**
```bash
npm run dev              # Development mode
npm run build            # Build
npm run start            # Start server
```

## Architecture

### AI Workflow (Mastra)

The core recipe extraction uses a **two-step workflow**:

```typescript
cookScanWorkflow:
  Step 1: imageToTextStep (Google Gemini 2.5 Flash)
    - Extract text from image using OCR
    - Input: File (image)
    - Output: Extracted text string

  Step 2: convertTextToRecipeStep (OpenAI GPT-4o)
    - Convert text to structured recipe
    - Input: Text string
    - Output: Structured recipe JSON
```

**Agents:**
1. `imageToTextAgent` - OCR specialist (uses GPT-4o for agent, Gemini for workflow)
   - Location: `src/mastra/agents/image-to-text-agent.ts`
   - Extracts all text from images including handwriting and labels

2. `convertTextToRecipeAgent` - Recipe structuring specialist (GPT-4o)
   - Location: `src/mastra/agents/convert-text-to-recipe-agent.ts`
   - Parses text into structured recipe format with validation

### Database Schema (PostgreSQL via Prisma)

**Core Tables:**

1. **users** - User management (Supabase Auth integration)
   - Links to Supabase via `authId`
   - Relations: recipes, tagCategories, ocrProcessingHistory, recipeVersions

2. **recipes** - Main recipe table
   - Fields: title, userId, parentRecipeId, imageUrl, memo
   - Relations: ingredients, steps, recipeTags, sourceInfo, ocrProcessingHistory

3. **ingredients** - Recipe ingredients
   - Fields: name, unit, notes
   - Many-to-one with recipe

4. **steps** - Cooking steps
   - Fields: orderIndex, instruction, timerSeconds
   - Ordered list per recipe

5. **tag_categories** - Tag organization
   - System and user-defined categories
   - Optional userId (null for system)

6. **tags** - Recipe tags
   - Belongs to category
   - System and user-defined

7. **recipe_tags** - Many-to-many relationship
   - Composite key: [recipeId, tagId]

8. **ocr_processing_history** - OCR processing logs
   - Stores raw OCR and structured data as JSON
   - One-to-one with recipe

9. **recipe_versions** - Version control
   - Stores recipe snapshots as JSON
   - Tracks changes with changeNote

10. **source_infos** - Recipe source metadata
    - sourceType, sourceName, sourceUrl, pageNumber

**Data Models:**

```typescript
interface Recipe {
  id: string;
  title: string;
  userId: string;
  parentRecipeId?: string;
  imageUrl?: string;
  memo?: string;
  ingredients: Ingredient[];
  steps: Step[];
  recipeTags: RecipeTag[];
  sourceInfo?: SourceInfo;
  ocrProcessingHistory?: OcrProcessingHistory;
  createdAt: Date;
  updatedAt: Date;
}

interface Ingredient {
  id: string;
  recipeId: string;
  name: string;
  unit?: string;
  notes?: string;
}

interface Step {
  id: string;
  recipeId: string;
  orderIndex: number;
  instruction: string;
  timerSeconds?: number;
}
```

### API Endpoints

#### Main Application (cook-scan/)

**API Routes:**
- `POST /recipes/extract` - Extract recipe from image (uses Mastra workflow)

**Protected Pages:**
- `GET /dashboard` - User dashboard
- `GET /recipes` - Recipe list
- `GET /recipes/[id]` - Recipe detail
- `GET /recipes/[id]/edit` - Edit recipe
- `GET /recipes/upload` - Upload interface
- `GET /tags` - Tag management
- `GET /profile/setup` - Profile setup

**Public Pages:**
- `GET /login` - Login page
- `GET /auth/confirm` - Auth confirmation callback

#### Sample Application (backend/)

**REST API:**
```
GET  /api/health              # Health check
POST /api/recipes/extract     # Extract recipe (?save=true to persist)
GET  /api/recipes             # List all recipes
GET  /api/recipes/:id         # Get specific recipe
POST /api/recipes             # Create recipe
PUT  /api/recipes/:id         # Update recipe
DELETE /api/recipes/:id       # Delete recipe
```

**Request/Response Example:**
```typescript
// Extract recipe
POST /api/recipes/extract?save=true
Content-Type: multipart/form-data
Body: { image: File }

Response: {
  success: true,
  recipe: {
    title: string,
    ingredients: [{ name: string, unit: string }],
    steps: [{ instruction: string, timerSeconds: number | null }],
    memo: string | null
  }
}
```

### Feature-Based Architecture

Code is organized by feature, not layer:

```
features/
├── auth/           # Authentication logic
│   └── actions.ts  # Server Actions
├── profile/        # User profile management
│   └── setup/
└── recipes/        # Recipe CRUD operations
    ├── upload/     # Upload & extract
    ├── edit/       # Edit functionality
    ├── detail/     # Detail view
    └── delete/     # Delete functionality
```

### Next.js Route Groups

Uses parentheses for route organization without affecting URLs:
- `(auth)` - Authenticated routes with auth layout
- `(auth-setup)` - Profile setup flow
- `(public)` - Public routes

### Server Actions Pattern

All mutations use Next.js Server Actions (`'use server'`):
- `/src/features/recipes/upload/actions.ts`
- `/src/features/recipes/edit/actions.ts`
- `/src/features/auth/actions.ts`

## Development Conventions

### Code Style

1. **TypeScript Strict Mode**: Always enabled
2. **Path Aliases**: Use `@/*` for imports from `src/`
   ```typescript
   import { prisma } from '@/lib/prisma'
   import { RecipeWithRelations } from '@/types/recipe'
   ```

3. **File Naming**:
   - React components: PascalCase (e.g., `RecipeDisplay.tsx`)
   - Utilities/helpers: camelCase (e.g., `createClient.ts`)
   - Server Actions: `actions.ts`
   - API routes: `route.ts`

4. **Component Organization**:
   - Prefer Server Components by default
   - Use `'use client'` only when necessary (hooks, events)
   - Keep client components small and focused

### Database Conventions

1. **Migrations**: Always use migrations for schema changes
   ```bash
   npm run db:migrate:dev -- --name descriptive_migration_name
   ```

2. **Environment Files**:
   - `.env` - Main application (Supabase, API keys)
   - `.env.migration` - Local database for migrations (localhost PostgreSQL)

3. **Prisma Client**: Always regenerate after schema changes
   ```bash
   npm run db:generate
   ```

4. **Seeding**: Use seed scripts for development data
   ```bash
   npm run db:seed:dev
   ```

### Error Handling

1. **API Routes**: Return structured error responses
   ```typescript
   return NextResponse.json(
     { success: false, error: 'Error message' },
     { status: 400 }
   )
   ```

2. **Server Actions**: Throw errors or return result objects
   ```typescript
   if (!user) {
     throw new Error('Unauthorized')
   }
   ```

3. **Client Components**: Use error boundaries and try-catch

### Security Practices

1. **Authentication**: All protected routes check Supabase session
2. **Authorization**: Verify user ownership before mutations
3. **Input Validation**: Use Zod schemas for all inputs
4. **SQL Injection**: Use Prisma (parameterized queries)
5. **XSS**: React escapes by default, be careful with dangerouslySetInnerHTML

### AI/ML Best Practices

1. **API Keys**: Store in environment variables, never commit
2. **Error Handling**: Gracefully handle AI service failures
3. **Rate Limiting**: Implement for production deployments
4. **Cost Management**: Monitor API usage
5. **Model Selection**:
   - Use Gemini 2.5 Flash for OCR (cost-effective)
   - Use GPT-4o for structured output (reliable)

## Environment Variables

### Main Application (.env)

```env
# Database
DATABASE_URL="postgresql://user:pass@host:port/dbname"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# AI APIs
GOOGLE_API_KEY="your-google-api-key"
OPENAI_API_KEY="your-openai-api-key"
```

### Local Development (.env.migration)

```env
# Local PostgreSQL for migrations
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/cookscan_dev"
```

### Sample Application (.env)

```env
# AI APIs
OPENAI_API_KEY="your-openai-api-key"
GOOGLE_GENERATIVE_AI_API_KEY="your-google-api-key"

# AWS (for deployment)
AWS_REGION="ap-northeast-1"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
```

## Common Tasks

### Adding a New Feature

1. Create feature directory in `src/features/`
2. Add types to `src/types/`
3. Create server actions if needed
4. Add API routes if needed
5. Create UI components
6. Update database schema if needed (with migration)

### Modifying Database Schema

1. Edit `prisma/schema.prisma`
2. Create migration:
   ```bash
   npm run db:migrate:dev -- --name your_migration_name
   ```
3. Regenerate Prisma Client:
   ```bash
   npm run db:generate
   ```
4. Update TypeScript types in `src/types/`

### Adding a New AI Agent

1. Create agent file in `src/mastra/agents/`
2. Define agent with model and instructions
3. Register in `src/mastra/index.ts`
4. Add to workflow if needed

### Debugging

**Database:**
```bash
npm run db:studio:dev  # Open Prisma Studio
```

**Logs:**
- Server: Check terminal output
- Client: Check browser console
- AI: Check Mastra logs (pino logger)

**Docker:**
```bash
docker-compose logs postgres  # View PostgreSQL logs
docker-compose ps             # Check container status
```

## Testing

### Manual Testing

1. **Recipe Extraction**:
   - Upload various image types (handwritten, printed, screenshots)
   - Verify OCR accuracy
   - Check structured data format

2. **Database**:
   - Test CRUD operations
   - Verify relationships (foreign keys)
   - Check version history

3. **Authentication**:
   - Test login/logout flow
   - Verify protected routes
   - Check user isolation

### Development Data

Use seed scripts to populate development database:
```bash
npm run db:seed:dev
```

## Troubleshooting

### Database Connection Issues

1. Check PostgreSQL is running:
   ```bash
   docker-compose ps
   ```

2. Verify connection string in `.env.migration`

3. Check port availability (5433)

### Migration Errors

1. Check Prisma schema syntax
2. Verify database is accessible
3. Review migration files in `prisma/migrations/`
4. Reset if necessary:
   ```bash
   npm run db:reset:dev
   ```

### Build Errors

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Regenerate Prisma Client:
   ```bash
   npm run db:generate
   ```

### AI Service Errors

1. Verify API keys in `.env`
2. Check API rate limits and quotas
3. Review error messages from Mastra logs
4. Test with simpler inputs

## Deployment

### Main Application

**Vercel (Recommended):**
1. Connect GitHub repository
2. Set environment variables
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Deploy

**Database:**
- Use managed PostgreSQL (Supabase, Neon, Railway)
- Run migrations: `npx prisma migrate deploy`

### Sample Application

**Backend (AWS Lambda):**
```bash
cd sample/backend
npm run build
npm run deploy
```

**Frontend (Static Hosting):**
```bash
cd sample/frontend
npm run build
# Deploy dist/ to S3, Netlify, or Vercel
```

## Key Files Reference

### Configuration Files

- `/cook-scan/prisma/schema.prisma` - Database schema
- `/cook-scan/next.config.ts` - Next.js configuration
- `/cook-scan/tailwind.config.ts` - Tailwind CSS configuration
- `/cook-scan/tsconfig.json` - TypeScript configuration
- `/cook-scan/eslint.config.mjs` - ESLint configuration
- `/docker-compose.yml` - PostgreSQL setup

### Core Application Files

- `/cook-scan/src/lib/prisma.ts` - Prisma client instance
- `/cook-scan/src/utils/supabase/server.ts` - Supabase server client
- `/cook-scan/src/utils/supabase/client.ts` - Supabase client-side client
- `/cook-scan/src/mastra/index.ts` - Mastra configuration
- `/cook-scan/src/mastra/workflows/cook-scan-workflow.ts` - Main workflow

### Sample Application Files

- `/sample/backend/src/index.ts` - Hono API server
- `/sample/backend/src/routes/recipes.ts` - Recipe endpoints
- `/sample/backend/mastra/src/mastra/index.ts` - Mastra setup
- `/sample/frontend/src/App.tsx` - React app root

## Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Mastra Documentation**: https://mastra.ai/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## Notes for AI Assistants

1. **Database Changes**: Always create migrations, never use `db push` for production
2. **Type Safety**: Leverage Prisma types and TypeScript strict mode
3. **Server vs Client**: Be mindful of Next.js component boundaries
4. **Authentication**: Always verify user session before data access
5. **AI Costs**: Be aware of API costs when modifying AI workflows
6. **Monorepo**: Remember this is a monorepo - changes may affect multiple apps
7. **Environment**: Use correct `.env` file for the context (main app vs migrations)
8. **Feature Organization**: Follow feature-based structure for new code
9. **Error Handling**: Provide user-friendly error messages
10. **Security**: Validate all inputs, especially user-generated content

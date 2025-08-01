# CookScan Project Structure

## Directory Layout
```
cook-scan/
├── prisma/              # Database schema and migrations
│   └── schema.prisma    # Prisma schema definition
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── (auth)/     # Authenticated routes
│   │   │   ├── dashboard/
│   │   │   ├── recipes/
│   │   │   │   └── upload/   # Multi-step upload flow
│   │   │   └── layout.tsx
│   │   ├── (auth-setup)/     # Profile setup flow
│   │   │   └── profile/setup/
│   │   ├── (public)/         # Public routes
│   │   │   └── login/
│   │   ├── auth/            # Auth endpoints
│   │   │   └── confirm/
│   │   ├── error/
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── actions/            # Server actions
│   │   ├── auth.ts         # Auth actions
│   │   └── recipe.ts       # Recipe CRUD
│   ├── lib/               # Shared libraries
│   │   ├── auth-utils.ts
│   │   └── prisma.ts      # Prisma client
│   ├── utils/             # Utilities
│   │   └── supabase/      # Supabase client setup
│   └── middleware.ts      # Auth middleware
├── docker-compose.yml     # PostgreSQL setup
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── eslint.config.mjs
```

## Key Patterns
- Route groups for organization: (auth), (public), (auth-setup)
- Server actions in dedicated files
- Middleware for auth protection
- Supabase for authentication
- Prisma for database operations
- Component-level state management
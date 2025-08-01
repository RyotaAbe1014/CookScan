# CookScan Project Overview

## Purpose
CookScan is a web application that extracts recipe information from food images. Users can upload food images and the app will process them to extract recipe details like ingredients and cooking steps.

## Tech Stack
- **Framework**: Next.js 15.4 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (running in Docker on port 5433)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Auth**: Supabase
- **State Management**: React hooks (useState, useRouter)
- **Validation**: Zod

## Key Features
- User authentication with Supabase
- Profile setup flow
- Recipe image upload
- Recipe data extraction from images
- Recipe management (create, read, update, delete)

## Architecture
- Uses Next.js App Router with clear route groups:
  - `(public)` - Login page
  - `(auth)` - Authenticated pages (dashboard, recipes)
  - `(auth-setup)` - Profile setup flow
- Server actions pattern for backend operations
- TypeScript with strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
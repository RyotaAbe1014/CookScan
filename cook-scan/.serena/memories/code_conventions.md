# Code Style and Conventions

## TypeScript Configuration
- Strict mode enabled
- Target: ES2017
- Module resolution: bundler
- JSX: preserve

## Component Conventions
- Functional components with TypeScript
- Props interfaces named as `Props` or `{ComponentName}Props`
- Default exports for page components
- Named exports for utility functions and actions

## File Organization
- Components in camelCase: `recipe-form.tsx`
- Pages in `page.tsx` files
- Server actions in `actions.ts` files
- Types in dedicated `types.ts` files
- Utils in `lib/` or `utils/` directories

## Styling
- Tailwind CSS utility classes
- Japanese UI text (ボタン, レシピタイトル, etc.)
- Consistent spacing with Tailwind's spacing scale
- Shadow utilities for cards/containers

## State Management
- React hooks (useState, useRouter)
- Form state managed locally in components
- Navigation with Next.js router

## Error Handling
- Loading states with `isPending`/`isSubmitting`
- Error states displayed to users
- Zod schemas for validation

## Comments
- Japanese comments for TODOs and explanations
- Minimal commenting, code should be self-documenting
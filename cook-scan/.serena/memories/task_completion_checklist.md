# Task Completion Checklist

When completing any coding task in CookScan, always run these commands:

## 1. Code Quality Check
```bash
npm run lint
```
- Fix any ESLint errors or warnings
- Ensure TypeScript types are correct

## 2. Database Schema Validation (if schema changed)
```bash
npm run db:validate
npm run db:generate
```

## 3. Test the Application
```bash
npm run dev
```
- Manually test the implemented feature
- Check browser console for errors
- Verify UI renders correctly

## 4. Git Commit
Before committing:
- Run `git status` to review changes
- Ensure no sensitive data in `.env.local` is committed
- Use descriptive commit messages in Japanese or English
- Follow existing commit style (✨ feat:, 🐛 fix:, etc.)

## Notes
- No automated tests are configured yet
- No formatter (Prettier) is set up
- Focus on TypeScript correctness and ESLint compliance
- Always regenerate Prisma Client after schema changes
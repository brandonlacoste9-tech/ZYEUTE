# Contributing to Zyeuté

Thank you for your interest in contributing to Zyeuté! This document provides guidelines and processes for contributing to the project.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Celebrate diversity in the Quebec tech community

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/yourusername/Zyeute.git`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Install dependencies**: `npm install`
5. **Set up environment**: Copy `.env.example` to `.env.local` and fill in your keys
6. **Run migrations**: See [Database Setup](#database-setup) below

## 📝 Commit Message Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples:
```bash
feat(auth): add Google OAuth integration
fix(premium): resolve subscription webhook handling
docs(readme): update deployment instructions
```

## 🔍 Code Standards

### TypeScript
- Use TypeScript for all new code
- Avoid `any` types - use proper type definitions
- Follow the existing code style

### React Components
- Use functional components with hooks
- Keep components focused and reusable
- Use TypeScript interfaces for props

### Styling
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain Quebec-themed design language

### File Naming
- Components: `PascalCase.tsx` (e.g., `ProfileCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `quebecFeatures.ts`)
- Pages: `PascalCase.tsx` (e.g., `Feed.tsx`)

## 🗄️ Database Setup

Run migrations in order using the provided script:

```bash
# Using the setup script (recommended)
npm run db:migrate

# Or manually in Supabase SQL Editor:
# Run each migration file in order:
# 001_moderation_system.sql
# 002_achievements.sql
# 003_creator_subscriptions.sql
# 004_live_streaming.sql
# 005_daily_challenges.sql
# 006_marketplace.sql
# 007_email_system.sql
# 007_fix_rls_001_critical.sql
```

## 🧪 Testing

Before submitting a PR:

1. **Test locally**: `npm run dev`
2. **Type check**: `npm run type-check`
3. **Build**: `npm run build` (should complete without errors)
4. **Test your changes**: Manually test the feature you're adding/fixing

## 📦 Pull Request Process

1. **Update your branch**: `git pull origin main`
2. **Write clear commit messages**: Follow the conventions above
3. **Keep PRs focused**: One feature or fix per PR
4. **Add description**: Explain what your PR does and why
5. **Reference issues**: Link to related issues if applicable

### PR Checklist:
- [ ] Code follows project style guidelines
- [ ] TypeScript types are properly defined
- [ ] No console errors or warnings
- [ ] Documentation updated if needed
- [ ] Migration files added if database changes are made
- [ ] Environment variables documented in `.env.example`

## 🔐 Security

- **Never commit API keys or secrets**
- Use environment variables for all sensitive data
- Check `.gitignore` before committing
- Report security vulnerabilities privately via GitHub Issues

## 📚 Documentation

- Update README.md if adding new features
- Add JSDoc comments for complex functions
- Update SETUP_GUIDE.md for setup changes
- Document new environment variables in `.env.example`

## 🎯 Areas for Contribution

- **Bug fixes**: Check GitHub Issues for reported bugs
- **Features**: Discuss major features in Issues first
- **Documentation**: Improve clarity and completeness
- **Performance**: Optimize slow queries or components
- **Accessibility**: Improve a11y compliance
- **Localization**: Add Quebec French translations

## ❓ Getting Help

Need help getting started or have questions?

1. **GitHub Issues**: [Open an issue](https://github.com/brandonlacoste9-tech/Zyeute/issues) for:
   - Questions about setup or configuration
   - Bug reports
   - Feature requests
   - General questions about contributing

2. **Documentation**:
   - Check `SETUP_GUIDE.md` for setup instructions
   - Review `STRIPE_WEBHOOK_SETUP.md` for payment integration
   - Browse existing documentation in the repository

3. **Examples**:
   - Review closed Pull Requests to see examples of contributions
   - Check existing code for patterns and conventions

4. **Before asking**:
   - Search existing Issues to see if your question was already answered
   - Check the documentation files
   - Review the codebase for similar implementations

## 🙏 Thank You!

Your contributions help make Zyeuté better for the Quebec community. Merci beaucoup! 🇨🇦⚜️


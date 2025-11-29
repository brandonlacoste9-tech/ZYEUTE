# Changelog

All notable changes to Zyeuté will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Netlify deployment configuration with `netlify.toml`
- SPA routing support with `public/_redirects`
- ESLint configuration for code quality standards
- Prettier configuration for consistent code formatting
- GitHub Actions workflow for CI/CD pipeline
- Daily health check workflow (`.github/workflows/daily-health-check.yml`)
  - Scheduled to run daily at 6:00 UTC
  - Can be triggered manually via workflow_dispatch
  - Checks project health by running npm install and health-check script if present
  - Securely passes SUPABASE_SERVICE_ROLE_KEY from GitHub Secrets
  - Includes comprehensive audit comments for security and maintenance
- This CHANGELOG file to track project changes

### Changed
- Nothing yet

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Nothing yet

### Security
- Added security headers in Netlify configuration

---

## [1.0.0] - 2025-11-29

### Added
- Initial release of Zyeuté - L'app sociale du Québec 🇨🇦⚜️
- Social media features: posts, stories, comments, likes (feu 🔥)
- AI-powered tools: Ti-Guy Artiste, Ti-Guy Studio, Ti-Guy Assistant
- Premium subscriptions: Zyeuté VIP (Bronze, Silver, Gold)
- Marketplace for tickets, crafts, services, and merch
- Gamification: achievements, daily challenges, leaderboards
- Location features: Quebec regions and Montreal neighborhood tagging
- Virtual gifts: poutine, caribou, fleur-de-lys, and more
- Live streaming capabilities
- Content moderation system
- Creator revenue and payout system
- Email campaign management

### Technical
- Built with React 18 + TypeScript + Vite
- Styled with Tailwind CSS v4
- Backend powered by Supabase (PostgreSQL)
- Payment processing with Stripe
- AI features with OpenAI (GPT-4, DALL-E 3)
- Deployed on Vercel

---

## How to Use This Changelog

### For Contributors
When making changes:
1. Add your changes under the `[Unreleased]` section
2. Use the appropriate category (Added, Changed, Fixed, etc.)
3. Write clear, concise descriptions
4. Include issue/PR numbers when applicable

### Categories
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

### Example Entry
```markdown
### Added
- New virtual gift: beaver emoji 🦫 (#123)
- Support for Gaspésie region tagging (#124)

### Fixed
- Fixed story expiration not working correctly (#125)
```

### Release Process
When creating a new release:
1. Move items from `[Unreleased]` to a new version section
2. Add the release date in YYYY-MM-DD format
3. Follow semantic versioning (MAJOR.MINOR.PATCH)
4. Create a git tag for the release

---

**Fait au Québec, pour le Québec** 🇨🇦⚜️

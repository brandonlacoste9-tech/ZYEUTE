# Zyeuté Documentation

This directory contains automatically generated API documentation for the Zyeuté codebase.

## 📚 Generated Documentation

- **[API.md](./API.md)** - Complete API documentation with components, services, hooks, types, and utilities

## 🔄 Regenerating Documentation

To regenerate the documentation after code changes:

```bash
npm run docs
```

Or directly:

```bash
npx tsx scripts/generate-docs.ts
```

## 📖 Documentation Generator

The documentation is generated using a custom TypeScript script that:

1. **Scans** the `src/` directory for TypeScript/TSX files
2. **Extracts** JSDoc comments and type definitions
3. **Analyzes** component props, function signatures, and exports
4. **Generates** beautiful Markdown documentation

### Features

- ✅ Automatic JSDoc extraction
- ✅ TypeScript type analysis
- ✅ Component props documentation
- ✅ Function signatures and return types
- ✅ Dependency tracking
- ✅ Example code extraction
- ✅ Categorized by type (components, services, hooks, etc.)

## 📝 Writing Documentation

To ensure your code is properly documented:

1. **Add JSDoc comments** above exported functions/components:

```typescript
/**
 * Button component for Zyeuté
 * 
 * A gold-themed button with multiple variants.
 * 
 * @example
 * <Button variant="primary">Click me</Button>
 */
export const Button = ({ variant, children }: ButtonProps) => {
  // ...
};
```

2. **Document props** using TypeScript interfaces:

```typescript
export interface ButtonProps {
  /** Button variant style */
  variant?: 'primary' | 'outline';
  /** Button content */
  children: React.ReactNode;
}
```

3. **Use @example tags** for usage examples:

```typescript
/**
 * Format number with K/M suffixes
 * @param num - Number to format
 * @returns Formatted string
 * @example formatNumber(1234) => "1 234"
 */
export function formatNumber(num: number): string {
  // ...
}
```

## 🔧 Configuration

Edit `scripts/docs-config.json` to customize:

- Source directory
- Output directory
- Include/exclude patterns
- Section visibility
- Documentation title and description

## 📊 Statistics

The current documentation includes:

- **285** documented exports
- **Components**: React components with props
- **Services**: API services and utilities
- **Hooks**: Custom React hooks
- **Types**: TypeScript interfaces and types
- **Utilities**: Helper functions

## 🚀 Integration

### CI/CD

Add to your CI pipeline to keep docs up-to-date:

```yaml
- name: Generate Documentation
  run: npm run docs
- name: Commit Documentation
  run: |
    git add docs/
    git commit -m "docs: update API documentation" || exit 0
```

### Pre-commit Hook

Generate docs before committing:

```bash
#!/bin/sh
npm run docs
git add docs/API.md
```

## 📖 Additional Resources

- [Documentation Generator README](../scripts/README-DOCS-GENERATOR.md) - Detailed guide
- [Configuration File](../scripts/docs-config.json) - Generator settings
- [Generator Script](../scripts/generate-docs.ts) - Source code

---

*Last generated: See timestamp in [API.md](./API.md)*

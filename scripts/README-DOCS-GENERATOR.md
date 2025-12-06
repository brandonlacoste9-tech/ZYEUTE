# 📚 Documentation Generator

A comprehensive documentation generator for Zyeuté that scans the codebase, extracts JSDoc comments, analyzes component structure, and generates beautiful Markdown documentation with examples and TypeScript type definitions.

## Features

- ✅ **JSDoc Extraction**: Automatically extracts JSDoc comments from your code
- ✅ **Type Analysis**: Analyzes TypeScript interfaces, types, and function signatures
- ✅ **Component Detection**: Identifies React components, services, hooks, and utilities
- ✅ **Props Documentation**: Extracts and documents component props with types
- ✅ **Example Extraction**: Captures `@example` tags from JSDoc
- ✅ **Dependency Tracking**: Lists imported dependencies for each module
- ✅ **Beautiful Markdown**: Generates well-formatted, readable documentation
- ✅ **Categorized Sections**: Organizes documentation by type (components, services, hooks, etc.)

## Usage

### Basic Usage

```bash
# Using tsx (recommended)
npx tsx scripts/generate-docs.ts

# Or using node with tsx loader
node --loader tsx scripts/generate-docs.ts
```

### Output

The generator creates documentation in `./docs/API.md` by default.

## Configuration

Edit `scripts/docs-config.json` to customize:

```json
{
  "sourceDir": "./src",           // Source directory to scan
  "outputDir": "./docs",          // Output directory for docs
  "includePatterns": [            // Files to include
    "**/*.ts",
    "**/*.tsx"
  ],
  "excludePatterns": [            // Files to exclude
    "**/*.test.ts",
    "**/*.spec.ts"
  ],
  "title": "Zyeuté API Documentation",
  "description": "Your description here",
  "sections": {                   // Which sections to generate
    "components": true,
    "services": true,
    "hooks": true,
    "types": true,
    "utils": true
  }
}
```

## Writing Good Documentation

### JSDoc Comments

The generator extracts JSDoc comments. Write comprehensive comments:

```typescript
/**
 * Button component for Zyeuté
 * 
 * A gold-themed button with multiple variants and sizes.
 * Supports loading states and icons.
 * 
 * @example
 * <Button variant="primary" size="lg">
 *   Click me
 * </Button>
 */
export const Button = ({ variant, size, children }: ButtonProps) => {
  // ...
};
```

### Props Documentation

Document props using TypeScript interfaces:

```typescript
/**
 * Button component props
 */
export interface ButtonProps {
  /** Button variant style */
  variant?: 'primary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Button content */
  children: React.ReactNode;
}
```

### Function Documentation

Document functions with JSDoc:

```typescript
/**
 * Format number with K/M suffixes (Quebec style with spaces)
 * @param num - Number to format
 * @returns Formatted string
 * @example formatNumber(1234) => "1 234"
 * @example formatNumber(1500) => "1.5K"
 */
export function formatNumber(num: number): string {
  // ...
}
```

### Examples

Use `@example` tags to provide usage examples:

```typescript
/**
 * Generate a caption for an image
 * @param topic - Image topic or description
 * @param tone - Caption tone (default: 'fun')
 * @returns Generated caption string
 * @example
 * const caption = await generateCaption('Une poutine', 'fun');
 * console.log(caption); // "Wow! C'est vraiment malade! 🔥 #Quebec"
 */
export async function generateCaption(topic: string, tone: string = 'fun'): Promise<string> {
  // ...
}
```

## Generated Documentation Structure

The generated documentation includes:

1. **Header**: Title, description, and generation date
2. **Table of Contents**: Links to all sections
3. **Components Section**: React components with props, examples, and dependencies
4. **Services Section**: Service functions and utilities
5. **Hooks Section**: Custom React hooks
6. **Types Section**: TypeScript interfaces and type definitions
7. **Utilities Section**: Utility functions and helpers

Each entry includes:
- **Description**: From JSDoc comments
- **Source Path**: File location
- **Props/Parameters**: Table with types and descriptions
- **Exports**: Function signatures and return types
- **Examples**: Code examples from `@example` tags
- **Dependencies**: Imported modules

## Examples

### Component Documentation

```markdown
### `Button`

Gold-themed Button component for Zyeuté

**Source:** `src/components/Button.tsx`

#### Props

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `variant` | `'primary' \| 'outline' \| 'ghost'` | Yes | Button variant style |
| `size` | `'sm' \| 'md' \| 'lg'` | Yes | Button size |
| `children` | `React.ReactNode` | No | Button content |

#### Examples

```typescript
<Button variant="primary" size="lg">
  Click me
</Button>
```
```

### Service Documentation

```markdown
### `generateCaption`

Generate a caption for an image or topic

**Source:** `src/services/openaiService.ts`

#### Exports

- **`generateCaption`**: `(topic: string, tone?: string) => Promise<string>`

#### Returns

- **Type**: `Promise<string>`
- **Description**: Generated caption string

#### Examples

```typescript
const caption = await generateCaption('Une poutine', 'fun');
console.log(caption); // "Wow! C'est vraiment malade! 🔥 #Quebec"
```
```

## Troubleshooting

### No documentation generated

- Check that your source files have JSDoc comments
- Verify the `sourceDir` path is correct
- Ensure files match the `includePatterns`

### Missing props/types

- Make sure interfaces are exported
- Check that interface names include "Props" or "Config"
- Verify TypeScript types are properly formatted

### Examples not showing

- Use `@example` tags in JSDoc comments
- Ensure examples are on the same line or properly formatted

## Integration

### Add to package.json

```json
{
  "scripts": {
    "docs": "tsx scripts/generate-docs.ts",
    "docs:watch": "nodemon --watch src --exec npm run docs"
  }
}
```

### CI/CD Integration

Generate docs as part of your build process:

```yaml
# GitHub Actions example
- name: Generate Documentation
  run: npm run docs
- name: Commit Documentation
  run: |
    git add docs/
    git commit -m "docs: update API documentation" || exit 0
```

## Advanced Usage

### Custom Sections

Modify the generator to add custom sections by editing `scripts/generate-docs.ts`.

### Multiple Output Formats

Extend the generator to support HTML, JSON, or other formats.

### Live Documentation

Use tools like [MkDocs](https://www.mkdocs.org/) or [Docusaurus](https://docusaurus.io/) to host the generated Markdown.

## Contributing

To improve the documentation generator:

1. Add better TypeScript parsing
2. Support more JSDoc tags
3. Improve example extraction
4. Add support for more file types
5. Enhance Markdown formatting

## License

Part of the Zyeuté project.

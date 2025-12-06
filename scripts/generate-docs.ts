#!/usr/bin/env node
/**
 * Documentation Generator for Zyeuté
 * 
 * Scans the codebase, extracts JSDoc comments, analyzes component structure,
 * and generates beautiful Markdown documentation with examples and TypeScript types.
 * 
 * Usage: npx tsx scripts/generate-docs.ts
 *        or: node --loader tsx scripts/generate-docs.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Types
// ============================================================================

interface DocConfig {
  sourceDir: string;
  outputDir: string;
  includePatterns: string[];
  excludePatterns: string[];
  title: string;
  description: string;
  sections: {
    components: boolean;
    services: boolean;
    hooks: boolean;
    types: boolean;
    utils: boolean;
  };
}

interface JSDocComment {
  description: string;
  tags: Array<{
    tag: string;
    name?: string;
    type?: string;
    description: string;
  }>;
  examples: string[];
}

interface ComponentInfo {
  name: string;
  filePath: string;
  relativePath: string;
  type: 'component' | 'service' | 'hook' | 'type' | 'util';
  jsdoc?: JSDocComment;
  props?: {
    name: string;
    type: string;
    optional: boolean;
    defaultValue?: string;
    description?: string;
  }[];
  exports: Array<{
    name: string;
    type: string;
    signature?: string;
  }>;
  dependencies: string[];
  examples: string[];
  interfaces: Array<{
    name: string;
    props: ComponentInfo['props'];
  }>;
}

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_CONFIG: DocConfig = {
  sourceDir: './src',
  outputDir: './docs',
  includePatterns: ['**/*.ts', '**/*.tsx'],
  excludePatterns: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/node_modules/**'],
  title: 'Zyeuté API Documentation',
  description: 'Comprehensive documentation for Zyeuté components, services, hooks, and utilities.',
  sections: {
    components: true,
    services: true,
    hooks: true,
    types: true,
    utils: true,
  },
};

// ============================================================================
// JSDoc Parser (Regex-based)
// ============================================================================

function parseJSDocComment(comment: string): JSDocComment {
  const result: JSDocComment = {
    description: '',
    tags: [],
    examples: [],
  };

  if (!comment) return result;

  // Remove comment markers
  const cleanComment = comment
    .replace(/^\/\*\*?\s*/, '')
    .replace(/\s*\*\/$/, '')
    .replace(/^\s*\*\s?/gm, '')
    .trim();

  const lines = cleanComment.split('\n');
  const descriptionLines: string[] = [];
  let currentTag: { tag: string; name?: string; type?: string; description: string } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Tag detection
    const tagMatch = trimmed.match(/^@(\w+)(?:\s+(.+))?$/);
    if (tagMatch) {
      // Save previous tag
      if (currentTag) {
        result.tags.push(currentTag);
      }

      const [, tag, content] = tagMatch;
      currentTag = { tag, description: content || '' };

      // Parse @param
      if (tag === 'param' && content) {
        const paramMatch = content.match(/^\{([^}]+)\}\s+(\w+)\s*-\s*(.+)$/);
        if (paramMatch) {
          currentTag.type = paramMatch[1];
          currentTag.name = paramMatch[2];
          currentTag.description = paramMatch[3];
        } else {
          // Try simpler format: @param name - description
          const simpleMatch = content.match(/^(\w+)\s*-\s*(.+)$/);
          if (simpleMatch) {
            currentTag.name = simpleMatch[1];
            currentTag.description = simpleMatch[2];
          }
        }
      } else if (tag === 'returns' && content) {
        // Parse @returns
        const returnsMatch = content.match(/^\{([^}]+)\}\s*(.+)$/);
        if (returnsMatch) {
          currentTag.type = returnsMatch[1];
          currentTag.description = returnsMatch[2];
        } else {
          currentTag.description = content;
        }
      } else if (tag === 'example') {
        // Example tag
        const exampleContent = content || '';
        if (exampleContent) {
          result.examples.push(exampleContent);
        }
        currentTag = null; // Don't add example as a tag
      }
    } else if (trimmed.startsWith('@example')) {
      // Example tag on its own line
      const exampleContent = trimmed.replace(/^@example\s*/, '');
      if (exampleContent) {
        result.examples.push(exampleContent);
      }
      currentTag = null;
    } else if (currentTag && trimmed) {
      // Continuation of current tag
      currentTag.description += (currentTag.description ? ' ' : '') + trimmed;
    } else if (!trimmed.match(/^@/) && trimmed) {
      // Description line
      descriptionLines.push(trimmed);
    }
  }

  // Save last tag
  if (currentTag) {
    result.tags.push(currentTag);
  }

  result.description = descriptionLines.join('\n').trim();

  return result;
}

// ============================================================================
// Code Analyzer (Regex-based)
// ============================================================================

function analyzeFile(filePath: string, sourceCode: string): ComponentInfo[] {
  const results: ComponentInfo[] = [];
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Determine file type
  let fileType: ComponentInfo['type'] = 'util';
  if (filePath.includes('/components/')) {
    fileType = 'component';
  } else if (filePath.includes('/services/')) {
    fileType = 'service';
  } else if (filePath.includes('/hooks/')) {
    fileType = 'hook';
  } else if (filePath.includes('/types/')) {
    fileType = 'type';
  } else if (filePath.includes('/lib/') || filePath.includes('/utils/')) {
    fileType = 'util';
  }

  // Extract imports (dependencies)
  const dependencies = extractImports(sourceCode);

  // Extract interfaces and types
  const interfaces = extractInterfaces(sourceCode);

  // Extract exported functions
  const exportedFunctions = extractExportedFunctions(sourceCode, filePath);
  exportedFunctions.forEach(func => {
    const jsdoc = extractJSDocBeforeCode(func.match, sourceCode);
    results.push({
      name: func.name,
      filePath,
      relativePath,
      type: fileType,
      jsdoc,
      props: extractFunctionParams(func.match, sourceCode),
      exports: [{
        name: func.name,
        type: func.returnType || 'void',
        signature: func.signature,
      }],
      dependencies,
      examples: jsdoc?.examples || [],
      interfaces: [],
    });
  });

  // Extract exported variables/components
  const exportedVars = extractExportedVariables(sourceCode, filePath);
  exportedVars.forEach(variable => {
    const jsdoc = extractJSDocBeforeCode(variable.match, sourceCode);
    const relatedInterface = interfaces.find(i => 
      variable.name.includes(i.name.replace('Props', '').replace('Config', '')) ||
      i.name.includes(variable.name)
    );

    results.push({
      name: variable.name,
      filePath,
      relativePath,
      type: fileType,
      jsdoc,
      props: relatedInterface?.props,
      exports: [{
        name: variable.name,
        type: variable.type,
      }],
      dependencies,
      examples: jsdoc?.examples || [],
      interfaces: relatedInterface ? [relatedInterface] : [],
    });
  });

  // Extract interfaces/types as separate entries if they're exported
  interfaces.forEach(intf => {
    if (intf.exported) {
      const jsdoc = extractJSDocBeforeCode(intf.match, sourceCode);
      results.push({
        name: intf.name,
        filePath,
        relativePath,
        type: 'type',
        jsdoc,
        props: intf.props,
        exports: [{
          name: intf.name,
          type: 'interface',
        }],
        dependencies,
        examples: jsdoc?.examples || [],
        interfaces: [],
      });
    }
  });

  return results;
}

function extractJSDocBeforeCode(codeMatch: string, sourceCode: string): JSDocComment | undefined {
  const matchIndex = sourceCode.indexOf(codeMatch);
  if (matchIndex === -1) return undefined;

  // Look backwards for JSDoc comment
  const beforeMatch = sourceCode.substring(Math.max(0, matchIndex - 2000), matchIndex);
  const jsdocMatch = beforeMatch.match(/(\/\*\*[\s\S]*?\*\/)\s*(?=\w)/);
  
  if (jsdocMatch) {
    return parseJSDocComment(jsdocMatch[1]);
  }

  return undefined;
}

function extractImports(sourceCode: string): string[] {
  const imports: string[] = [];
  const importRegex = /import\s+(?:.*\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(sourceCode)) !== null) {
    imports.push(match[1]);
  }

  return [...new Set(imports)]; // Remove duplicates
}

function extractInterfaces(sourceCode: string): Array<{ name: string; props: ComponentInfo['props']; exported: boolean; match: string }> {
  const interfaces: Array<{ name: string; props: ComponentInfo['props']; exported: boolean; match: string }> = [];
  
  // Match interface declarations
  const interfaceRegex = /(?:export\s+)?interface\s+(\w+)\s*\{([^}]*)\}/g;
  let match;
  
  while ((match = interfaceRegex.exec(sourceCode)) !== null) {
    const [, name, body] = match;
    const exported = match[0].includes('export');
    const props = extractPropsFromInterface(body);
    
    interfaces.push({
      name,
      props,
      exported,
      match: match[0],
    });
  }

  // Match type aliases with object types
  const typeRegex = /(?:export\s+)?type\s+(\w+)\s*=\s*\{([^}]*)\}/g;
  while ((match = typeRegex.exec(sourceCode)) !== null) {
    const [, name, body] = match;
    const exported = match[0].includes('export');
    const props = extractPropsFromInterface(body);
    
    interfaces.push({
      name,
      props,
      exported,
      match: match[0],
    });
  }

  return interfaces;
}

function extractPropsFromInterface(body: string): ComponentInfo['props'] {
  const props: ComponentInfo['props'] = [];
  const propRegex = /(\w+)(\?)?\s*:\s*([^;,\n]+)/g;
  let match;
  
  while ((match = propRegex.exec(body)) !== null) {
    const [, name, optional, type] = match;
    props.push({
      name,
      type: type.trim(),
      optional: !!optional,
    });
  }

  return props.length > 0 ? props : undefined;
}

function extractExportedFunctions(sourceCode: string, filePath: string): Array<{ name: string; match: string; returnType: string; signature: string }> {
  const functions: Array<{ name: string; match: string; returnType: string; signature: string }> = [];
  
  // Match exported function declarations
  const functionRegex = /export\s+(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?/g;
  let match;
  
  while ((match = functionRegex.exec(sourceCode)) !== null) {
    const [, name, params, returnType] = match;
    const signature = `(${params.trim()}) => ${returnType?.trim() || 'void'}`;
    functions.push({
      name,
      match: match[0],
      returnType: returnType?.trim() || 'void',
      signature,
    });
  }

  // Match exported arrow functions
  const arrowFunctionRegex = /export\s+(?:const|let)\s+(\w+)\s*[:=]\s*(?:async\s+)?\(([^)]*)\)\s*(?::\s*([^=]+))?\s*=>/g;
  while ((match = arrowFunctionRegex.exec(sourceCode)) !== null) {
    const [, name, params, returnType] = match;
    const signature = `(${params.trim()}) => ${returnType?.trim() || 'void'}`;
    functions.push({
      name,
      match: match[0],
      returnType: returnType?.trim() || 'void',
      signature,
    });
  }

  return functions;
}

function extractExportedVariables(sourceCode: string, filePath: string): Array<{ name: string; match: string; type: string }> {
  const variables: Array<{ name: string; match: string; type: string }> = [];
  
  // Match exported const/let/var declarations
  const varRegex = /export\s+(?:const|let|var)\s+(\w+)(?:\s*:\s*([^=]+))?\s*=/g;
  let match;
  
  while ((match = varRegex.exec(sourceCode)) !== null) {
    const [, name, type] = match;
    variables.push({
      name,
      match: match[0],
      type: type?.trim() || 'any',
    });
  }

  // Match React components (export const Component = ...)
  const componentRegex = /export\s+(?:const|function)\s+(\w+)\s*(?:[:=]\s*React\.(?:FC|forwardRef|memo)|\s*=\s*\([^)]*\)\s*=>)/g;
  while ((match = componentRegex.exec(sourceCode)) !== null) {
    const name = match[1];
    // Check if already added
    if (!variables.find(v => v.name === name)) {
      variables.push({
        name,
        match: match[0],
        type: 'React.Component',
      });
    }
  }

  return variables;
}

function extractFunctionParams(funcMatch: string, sourceCode: string): ComponentInfo['props'] {
  const params: ComponentInfo['props'] = [];
  
  // Extract parameters from function signature
  const paramMatch = funcMatch.match(/\(([^)]*)\)/);
  if (!paramMatch) return undefined;

  const paramString = paramMatch[1];
  const paramRegex = /(\w+)(\?)?\s*:\s*([^,]+)/g;
  let match;
  
  while ((match = paramRegex.exec(paramString)) !== null) {
    const [, name, optional, type] = match;
    params.push({
      name,
      type: type.trim(),
      optional: !!optional,
    });
  }

  return params.length > 0 ? params : undefined;
}

// ============================================================================
// Markdown Generator
// ============================================================================

function generateMarkdown(components: ComponentInfo[], config: DocConfig): string {
  const sections: string[] = [];

  // Header
  sections.push(`# ${config.title}\n`);
  sections.push(`${config.description}\n`);
  sections.push(`> Generated on ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}\n`);

  // Table of Contents
  sections.push('## Table of Contents\n');
  if (config.sections.components) {
    sections.push('- [Components](#components)');
  }
  if (config.sections.services) {
    sections.push('- [Services](#services)');
  }
  if (config.sections.hooks) {
    sections.push('- [Hooks](#hooks)');
  }
  if (config.sections.types) {
    sections.push('- [Types](#types)');
  }
  if (config.sections.utils) {
    sections.push('- [Utilities](#utilities)');
  }
  sections.push('');

  // Group by type
  const grouped = {
    component: components.filter(c => c.type === 'component'),
    service: components.filter(c => c.type === 'service'),
    hook: components.filter(c => c.type === 'hook'),
    type: components.filter(c => c.type === 'type'),
    util: components.filter(c => c.type === 'util'),
  };

  // Components Section
  if (config.sections.components && grouped.component.length > 0) {
    sections.push('## Components\n');
    grouped.component.forEach(comp => {
      sections.push(generateComponentDoc(comp));
      sections.push('');
    });
  }

  // Services Section
  if (config.sections.services && grouped.service.length > 0) {
    sections.push('## Services\n');
    grouped.service.forEach(comp => {
      sections.push(generateComponentDoc(comp));
      sections.push('');
    });
  }

  // Hooks Section
  if (config.sections.hooks && grouped.hook.length > 0) {
    sections.push('## Hooks\n');
    grouped.hook.forEach(comp => {
      sections.push(generateComponentDoc(comp));
      sections.push('');
    });
  }

  // Types Section
  if (config.sections.types && grouped.type.length > 0) {
    sections.push('## Types\n');
    grouped.type.forEach(comp => {
      sections.push(generateComponentDoc(comp));
      sections.push('');
    });
  }

  // Utilities Section
  if (config.sections.utils && grouped.util.length > 0) {
    sections.push('## Utilities\n');
    grouped.util.forEach(comp => {
      sections.push(generateComponentDoc(comp));
      sections.push('');
    });
  }

  return sections.join('\n');
}

function generateComponentDoc(comp: ComponentInfo): string {
  const sections: string[] = [];

  // Title
  sections.push(`### \`${comp.name}\``);
  sections.push('');

  // Description
  if (comp.jsdoc?.description) {
    sections.push(comp.jsdoc.description);
    sections.push('');
  }

  // File Path
  sections.push(`**Source:** \`${comp.relativePath}\``);
  sections.push('');

  // Props/Parameters
  if (comp.props && comp.props.length > 0) {
    sections.push('#### Props');
    sections.push('');
    sections.push('| Name | Type | Optional | Description |');
    sections.push('|------|------|----------|-------------|');
    comp.props.forEach(prop => {
      const optional = prop.optional ? 'Yes' : 'No';
      const defaultValue = prop.defaultValue ? ` (default: \`${prop.defaultValue}\`)` : '';
      const description = prop.description || comp.jsdoc?.tags.find(t => t.name === prop.name)?.description || '-';
      sections.push(`| \`${prop.name}\` | \`${prop.type}\` | ${optional} | ${description}${defaultValue} |`);
    });
    sections.push('');
  }

  // Exports
  if (comp.exports && comp.exports.length > 0) {
    sections.push('#### Exports');
    sections.push('');
    comp.exports.forEach(exp => {
      if (exp.signature) {
        sections.push(`- **\`${exp.name}\`**: \`${exp.signature}\``);
      } else {
        sections.push(`- **\`${exp.name}\`**: \`${exp.type}\``);
      }
    });
    sections.push('');
  }

  // Examples
  if (comp.examples && comp.examples.length > 0) {
    sections.push('#### Examples');
    sections.push('');
    comp.examples.forEach((example, idx) => {
      sections.push('```typescript');
      sections.push(example);
      sections.push('```');
      if (idx < comp.examples.length - 1) {
        sections.push('');
      }
    });
    sections.push('');
  }

  // Dependencies
  if (comp.dependencies && comp.dependencies.length > 0) {
    sections.push('#### Dependencies');
    sections.push('');
    comp.dependencies.slice(0, 10).forEach(dep => { // Limit to 10
      sections.push(`- \`${dep}\``);
    });
    if (comp.dependencies.length > 10) {
      sections.push(`- *... and ${comp.dependencies.length - 10} more*`);
    }
    sections.push('');
  }

  // JSDoc Tags (Returns, etc.)
  if (comp.jsdoc?.tags && comp.jsdoc.tags.length > 0) {
    const returnTags = comp.jsdoc.tags.filter(t => t.tag === 'returns');
    
    if (returnTags.length > 0) {
      sections.push('#### Returns');
      sections.push('');
      returnTags.forEach(tag => {
        if (tag.type) {
          sections.push(`- **Type**: \`${tag.type}\``);
        }
        if (tag.description) {
          sections.push(`- **Description**: ${tag.description}`);
        }
      });
      sections.push('');
    }
  }

  return sections.join('\n');
}

// ============================================================================
// File Finder (using Node.js built-ins)
// ============================================================================

function findFiles(
  dir: string,
  includePatterns: string[],
  excludePatterns: string[]
): string[] {
  const files: string[] = [];
  const absoluteDir = path.resolve(dir);

  function shouldInclude(filePath: string): boolean {
    // Check exclude patterns
    for (const pattern of excludePatterns) {
      const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
      if (regex.test(filePath)) {
        return false;
      }
    }

    // Check include patterns
    for (const pattern of includePatterns) {
      const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
      if (regex.test(filePath)) {
        return true;
      }
    }

    return false;
  }

  function walkDir(currentDir: string) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const relativePath = path.relative(absoluteDir, fullPath);

        if (entry.isDirectory()) {
          // Skip node_modules and other common exclusions
          if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
            walkDir(fullPath);
          }
        } else if (entry.isFile()) {
          if (shouldInclude(relativePath)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
      console.warn(`Warning: Could not read directory ${currentDir}:`, error);
    }
  }

  walkDir(absoluteDir);
  return files;
}

// ============================================================================
// Main
// ============================================================================

function main() {
  const config = DEFAULT_CONFIG;

  console.log('📚 Starting documentation generation...');
  console.log(`📁 Source directory: ${config.sourceDir}`);
  console.log(`📄 Output directory: ${config.outputDir}`);

  // Find all TypeScript files
  const files = findFiles(config.sourceDir, config.includePatterns, config.excludePatterns);

  console.log(`\n📝 Found ${files.length} files to process`);

  // Analyze each file
  const allComponents: ComponentInfo[] = [];

  for (const file of files) {
    try {
      const sourceCode = fs.readFileSync(file, 'utf-8');
      const components = analyzeFile(file, sourceCode);
      allComponents.push(...components);
      if (components.length > 0) {
        console.log(`  ✓ Processed: ${path.relative(process.cwd(), file)} (${components.length} exports)`);
      }
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error);
    }
  }

  console.log(`\n📊 Total components found: ${allComponents.length}`);

  // Generate Markdown
  const markdown = generateMarkdown(allComponents, config);

  // Ensure output directory exists
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  // Write documentation
  const outputPath = path.join(config.outputDir, 'API.md');
  fs.writeFileSync(outputPath, markdown, 'utf-8');

  console.log(`\n✅ Documentation generated: ${outputPath}`);
  console.log(`📄 Total size: ${(markdown.length / 1024).toFixed(2)} KB`);
}

// Run
try {
  main();
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}

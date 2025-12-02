import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom for browser environment
    environment: 'jsdom',
    
    // Setup files to run before tests
    setupFiles: ['./src/test/setup.ts'],
    
    // Global test utilities
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        'coverage/',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
        '**/test/**',
        '**/__tests__/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'src/types/**',
        'netlify/**',
        'scripts/**',
      ],
      // Target 70% coverage (currently aspirational - need more tests)
      // Set to 0 for now to not block CI/CD while building test suite
      thresholds: {
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
    
    // Test file patterns
    include: [
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    
    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      '.git',
    ],
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['**/*.integration.test.ts', '**/*.integration.test.tsx'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    testTimeout: 60000, // Integration tests may take longer
    hookTimeout: 60000, // Hooks also need more time for DB operations
    setupFiles: ['./vitest.setup.integration.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

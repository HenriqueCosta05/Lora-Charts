import { join } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['src/test-setup.ts'],
        include: ['src/**/*.spec.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            exclude: [
                'node_modules/',
                'src/test-setup.ts',
                '**/*.spec.ts',
                '**/main.ts',
                '**/*.stories.ts',
            ],
        },
    },
    resolve: {
        alias: {
            '@': join(__dirname, 'src'),
        },
    },
});

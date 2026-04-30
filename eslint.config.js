import { defineConfig } from 'eslint/config'
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig(
    {
        ignores: ['build/*', 'node_modules/*', '*.js']
    },

    js.configs.recommended,
    tseslint.configs.recommended,

    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json'
            }
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn'
        }
    }
);
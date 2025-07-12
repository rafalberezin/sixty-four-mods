import prettier from 'eslint-config-prettier'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
	{ files: ['src/**/*.ts'], plugins: { js }, extends: ['js/recommended'] },
	{ files: ['src/**/*.ts'], languageOptions: { globals: globals.browser } },
	tseslint.configs.recommended,
	prettier,
	{
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			]
		}
	}
])

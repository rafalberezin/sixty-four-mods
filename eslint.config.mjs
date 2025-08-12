import prettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import { defineConfig } from 'eslint/config'

const FILES = ['packages/**/*.ts']

export default defineConfig([
	{ files: FILES, extends: [tseslint.configs.recommended] },
	prettier,

	{
		files: FILES,
		languageOptions: {
			parserOptions: {
				sourceType: 'module'
			},
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		plugins: {
			import: importPlugin
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'import/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						['internal', 'sibling', 'parent', 'index'],
						'object',
						'type'
					],
					alphabetize: {
						order: 'asc',
						caseInsensitive: true
					},
					'newlines-between': 'always'
				}
			]
		}
	}
])

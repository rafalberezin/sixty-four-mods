import prettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

function scoped(scope, configs) {
	return configs.map(config => ({ ...config, files: scope }))
}

export default defineConfig(
	scoped(
		['src/**/*.ts'],
		[
			...tseslint.configs.recommended,
			prettier,

			{
				languageOptions: {
					parserOptions: {
						sourceType: 'module'
					},
					globals: {
						...globals.browser,
						...globals.node
					}
				},
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
		]
	)
)

export type ErrorMessage = string

export type Schema =
	| { type: 'string' }
	| { type: 'number' }
	| { type: 'boolean' }
	| { type: 'function' }
	| { type: 'any' }
	| { type: 'exact'; matches: unknown[]; matchesInError?: boolean }
	| { type: 'array'; items?: Schema }
	| {
			type: 'object'
			properties?: Record<string, Schema>
			required?: string[]
			extra?: {
				all?: Schema
				self?: (value: Record<string, unknown>, path: string) => ErrorMessage[]
			}
	  }

const DIRECT = ['string', 'number', 'boolean', 'function']

export function validate(
	schema: Schema,
	value: unknown,
	path: string = '<root>'
): ErrorMessage[] {
	if (DIRECT.includes(schema.type))
		return typeof value !== schema.type
			? [`${path}: Expected ${schema.type}`]
			: []

	const errors: ErrorMessage[] = []

	switch (schema.type) {
		case 'exact':
			if (!schema.matches.includes(value))
				errors.push(
					`${path}: Expected exact value${schema.matchesInError ? ` (${schema.matches.join(' | ')})` : ''}`
				)
			break

		case 'array':
			if (!Array.isArray(value)) {
				errors.push(`${path}: Expected array`)
				break
			}

			if (schema.items) {
				for (let i = 0; i < value.length; i++) {
					errors.push(...validate(schema.items, value[i], `${path}[${i}]`))
				}
			}
			break

		case 'object':
			if (typeof value !== 'object' || value === null || Array.isArray(value)) {
				errors.push(`${path}: Expected object`)
				break
			}

			for (const key of schema.required || []) {
				if (!(key in value)) {
					errors.push(`${path}.${key}: Required property missing`)
				}
			}

			for (const [key, propSchema] of Object.entries(schema.properties ?? {})) {
				if (key in value) {
					errors.push(
						...validate(
							propSchema,
							value[key as keyof typeof value],
							`${path}.${key}`
						)
					)
				}
			}

			if (schema.extra?.self)
				errors.push(
					...schema.extra.self(value as Record<string, unknown>, path)
				)

			if (schema.extra?.all) {
				for (const key in value) {
					errors.push(
						...validate(
							schema.extra.all,
							value[key as keyof typeof value],
							`${path}.${key}`
						)
					)
				}
			}
			break

		case 'any':
			break
	}

	return errors
}

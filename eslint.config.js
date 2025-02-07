import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import pluginJs from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	pluginJs.configs.recommended,
	eslintConfigPrettier,
	{
		languageOptions: {
			globals: { ...globals.browser, Toastify: 'readable' },
		},
		plugins: {
			'@stylistic/js': stylisticJs,
		},
		rules: {
			'prefer-const': 1,
			'sort-imports': [
				1,
				{
					memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none'],
					ignoreCase: true,
				},
			],
			'no-duplicate-imports': 1,
			yoda: 1,
			camelcase: 1,
			curly: 1,
			'no-console': [2, { allow: ['error'] }],
			semi: 1,
			'no-undef': 0,
		},
	},
];

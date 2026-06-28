// Dedicated ESLint config that runs ONLY eslint-plugin-compat, so the old-browser
// compatibility gate is independent of the project's other (pre-existing) lint rules.
// Browser targets come from the "browserslist" field in package.json.
//
// Scope note: this flags OUR source code using APIs not supported by the target
// browsers. It does not analyze APIs used internally by dependencies.
import compat from 'eslint-plugin-compat';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { compat },
    rules: {
      'compat/compat': 'error',
    },
  },
];

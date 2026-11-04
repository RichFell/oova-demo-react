// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require('eslint-config-expo/flat');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  expoConfig,
  {
    // Colors live only in src/theme/tokens.ts. Hex and rgb()/rgba() values
    // anywhere else fail lint so design drift is caught automatically.
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['src/theme/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/#[0-9a-fA-F]{3,8}\\b|rgba?\\(/]',
          message: 'Use a color from src/theme/tokens.ts instead of a hex or rgb() value.',
        },
        {
          selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b|rgba?\\(/]',
          message: 'Use a color from src/theme/tokens.ts instead of a hex or rgb() value.',
        },
      ],
    },
  },
  {
    ignores: ['dist/*'],
  },
]);

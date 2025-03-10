import js from "@eslint/js"
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier/recommended'

export default [
  js.configs.recommended,
  prettierConfig,
  prettierPlugin,
  {
    languageOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      "arrow-spacing": ["warn", { before: true, after: true }],
      "brace-style": ["error", "stroustrup", { allowSingleLine: true }],
      "comma-dangle": ["error", "always-multiline"],
      "comma-spacing": "error",
      "comma-style": "error",
      curly: ["error", "multi-line", "consistent"],
      "dot-location": ["error", "property"],
      "handle-callback-err": "off",
      indent: ["error", "tab"],
      "keyword-spacing": "error",
      "max-nested-callbacks": ["error", { max: 4 }],
      "max-statements-per-line": ["error", { max: 2 }],
      "no-console": "off",
      "no-empty-function": "error",
      "no-floating-decimal": "error",
      "no-inline-comments": "error",
      "no-lonely-if": "error",
      "no-multi-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1, maxBOF: 0 }],
      "no-shadow": ["error", { allow: ["err", "resolve", "reject"] }],
      "no-trailing-spaces": ["error"],
      "no-var": "error",
      "no-undef": "off",
      "object-curly-spacing": ["error", "always"],
      "prefer-const": "error",
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "space-before-blocks": "error",
      "space-before-function-paren": [
        "error",
        {
          anonymous: "never",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "space-in-parens": "error",
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      "spaced-comment": "error",
      yoda: "error",
    },
  },
  {
    plugins: { import: importPlugin },
    rules: {
      'import/order': [
        'warn',
        {
          groups: [
            'type',
            'builtin',
            'object',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            {
              pattern: '~/**',
              group: 'external',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
        },
      ],
    },
  },
];

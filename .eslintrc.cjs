module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: [
      '@typescript-eslint', 
      'react', 
      'react-hooks', 
      'react-refresh', 
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-multiple-empty-lines': ['warn', { 'max': 1, 'maxEOF': 0, 'maxBOF': 0 }],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': 'off',
  
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
  
      'react/prop-types': 'off',
      'react-refresh/only-export-components': [ 
          'warn',
          { allowConstantExport: true },
      ],
  
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

    },
    ignorePatterns: ['dist', 'node_modules', '*.cjs', '*.js'],
  };
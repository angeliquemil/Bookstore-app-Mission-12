React + TypeScript + Vite

A minimal template for running React with TypeScript in Vite, including Hot Module Replacement (HMR) and basic ESLint setup.

Official Plugins

Choose one of the two official plugins for React:

@vitejs/plugin-react – Uses Babel for Fast Refresh
@vitejs/plugin-react-swc – Uses SWC for Fast Refresh
ESLint Configuration

For production apps, enable type-aware linting to catch more TypeScript issues:

// eslint.config.js or .ts
export default tseslint.config({
  extends: [
    // Recommended type-checked rules
    ...tseslint.configs.recommendedTypeChecked,
    // Or stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optional stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
React-Specific Linting

Add these plugins for React best practices:

eslint-plugin-react-x
eslint-plugin-react-dom

Example setup:

import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})

This setup provides:

Fast Refresh with either Babel or SWC
Type-aware ESLint rules for safer TypeScript
React-specific linting for best practices

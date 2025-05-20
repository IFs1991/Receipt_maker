module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended', // Prettierとの連携は別途 .prettierrc.js で行うためコメントアウトも検討
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json', // tsconfig.jsonのパスを指定
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // ここにプロジェクト固有のルールを追加できます
    // 例:
    // '@typescript-eslint/no-unused-vars': 'warn',
    // '@typescript-eslint/no-explicit-any': 'warn',
  },
  settings: {
    // import/resolverの設定など、必要に応じて追加
  },
};
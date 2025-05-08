module.exports = {
  root: true
, parser: '@typescript-eslint/parser'
, parserOptions: {
    project: ['./tsconfig.json']
  , tsconfigRootDir: __dirname
  }
, plugins: [
    '@typescript-eslint'
  ]
, extends: [
    'eslint:recommended'
  , 'plugin:@typescript-eslint/recommended'
  , 'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ]
, rules: {
    'no-constant-condition': 'off'
  , 'no-useless-escape': 'off'
  , '@typescript-eslint/ban-ts-comment': 'off'
  , '@typescript-eslint/no-extra-semi': 'off'
  , '@typescript-eslint/ban-types': 'off'
  , '@typescript-eslint/require-await': 'off'

    // 以下规则是因为ESLint的检查方式有问题才添加的,
    // 升级到更高版本时有望在移除这些规则的情况下工作.
  , '@typescript-eslint/no-unsafe-call': 'off'
  , '@typescript-eslint/no-unsafe-assignment': 'off'
  , '@typescript-eslint/no-unsafe-argument': 'off'
  , '@typescript-eslint/no-unsafe-member-access': 'off'
  }
}

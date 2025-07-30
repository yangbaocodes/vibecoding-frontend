module.exports = {
  ignoreFiles: [
    'node_modules/**',
    'dist/**',
    'build/**'
  ],
  rules: {
    // 基本必要规则
    'no-duplicate-selectors': true,
    'color-hex-case': 'lower',
    'indentation': 2,
    'string-quotes': 'single',
    
    // 允许所有SCSS at-rules
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'use', 'forward', 'function', 'if', 'else', 'each', 'include', 'mixin',
          'for', 'while', 'return', 'extend', 'at-root', 'warn', 'error', 'debug'
        ]
      }
    ],
    
    // 允许Vue特殊伪类
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global']
      }
    ],
    
    // 禁用可能产生问题的规则
    'selector-class-pattern': null
  },
  overrides: [
    {
      files: ['*.vue', '**/*.vue'],
      customSyntax: 'postcss-html'
    },
    {
      files: ['*.scss', '**/*.scss'],
      customSyntax: 'postcss-scss'
    }
  ]
}
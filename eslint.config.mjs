import antfu from '@antfu/eslint-config'

export default antfu({}, {
  rules: {
    'curly': 'off', // 禁止省略花括号的代码块
    'arrow-parens': 'off', // 要求箭头函数的参数使用圆括号
    'symbol-description': 'off', // 要求 symbol 描述
    'new-parens': 'off', // 要求调用无参构造函数时有圆括号
    'brace-style': 'off', // 强制在代码块中使用一致的大括号风格
    'object-property-newline': 'off', // 强制将对象的属性放在不同的行上
    '@typescript-eslint/indent': 'off', // 强制使用一致的缩进
    '@typescript-eslint/no-use-before-define': 'off', // 禁止定义前使用
    '@typescript-eslint/brace-style': 'off', // 强制在代码块中使用一致的大括号风格
    '@typescript-eslint/lines-between-class-members': 'off', // 要求或禁止类成员之间出现空行
    '@typescript-eslint/consistent-type-definitions': 'off', // 要求定义的类型与导入的类型一致
    '@typescript-eslint/no-unused-vars': [ // 禁止未使用过的变量
      'error',
      {
        vars: 'local',
        args: 'none',
        ignoreRestSiblings: true,
        caughtErrors: 'none',
      },
    ],
    '@typescript-eslint/comma-dangle': 'off', // 要求或禁止末尾逗号
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }], // 强制在代码块中使用一致的大括号风格
    'antfu/if-newline': 'off', // 要求 if 语句的每个块都需要包括一个换行符
  },
})

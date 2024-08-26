export default {
  // jsx也使用单引号
  jsxSingleQuote: true,
  // 'crlf' for all Windows developer
  endOfLine: 'crlf',
  // 单行长度
  printWidth: 100,
  // 句末使用分号
  semi: false,
  // 使用单引号
  singleQuote: true,
  // 对象或数组末尾不加逗号
  trailingComma: 'none',
  // 缩进字节（2 空格代替 tab, 主流）
  tabWidth: 2,
  // 使用空格代替tab缩进
  useTabs: false,
  plugins: ['prettier-plugin-packagejson'],
  overrides: [
    {
      files: '.*rc',
      options: {
        parser: 'json',
      },
    },
  ],
};

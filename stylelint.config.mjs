/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-recess-order',
    'stylelint-no-unsupported-browser-features',
  ],
  plugins: [
    // 'stylelint-order',
    'stylelint-declaration-block-no-ignored-properties',
  ],
  rules: {
    'plugin/declaration-block-no-ignored-properties': true,
    // 禁止低优先级的选择器出现在高优先级的选择器之后
    'no-descending-specificity': null,
    // https://github.com/stylelint/stylelint/issues/4114
    // 允许在 calc 函数中使用无效的表达式
    'function-calc-no-invalid': null,
    // 要求或禁止 url 使用引号
    'function-url-quotes': 'always',
    // 禁止字体家族名称列表中缺少通用家族
    'font-family-no-missing-generic-family-keyword': null,
    // 禁止未知单位
    'unit-no-unknown': [true, { ignoreUnits: [] }],
  },
}

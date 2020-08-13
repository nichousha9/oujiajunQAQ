const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.stylelint,
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-order'],
  rules: {
    'color-hex-case': null,
    'rule-empty-line-before': null,
    'order/order': ['declarations', 'custom-properties', 'dollar-variables', 'rules', 'at-rules'],
    'selector-pseudo-class-no-unknown': null,
    'no-descending-specificity': null,
  },
};

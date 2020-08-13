/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
/* eslint-disable react/sort-comp */
import React from 'react';

// 控件组件

export default class Rule extends React.Component {
  static get defaultProps() {
    return {
      id: null,
      parentId: null,
      field: null,
      operator: null,
      value: null,
      schema: null,
    };
  }

  render() {
    const {
      id,
      colName1,
      colName2,
      operatorId,
      optRule,
      ruleValue,
      translations,
      customOptions,
      schema: {
        fields,
        optRules,
        groupFieldList = {},
        operators,
        controls,
        getOperators,
        getLevel,
        classNames,
      },
    } = this.props;
    const level = getLevel(this.props.id);
    return (
      <div className={`rule ${classNames.rule}`}>
        {/* 下拉框选择器控件 */}
        {React.createElement(controls.valueEditor, {
          showShape: 'combobox',
          title: translations.operators.title,
          value: colName1,
          options: groupFieldList.data,
          className: `rule-operators ${classNames.operators}`,
          handleOnChange: this.onOperatorChanged,
          level: level,
          ...customOptions,
        })}
        {/* 下拉框选择器控件 */}
        {React.createElement(controls.valueEditor, {
          showShape: 'combobox',
          title: translations.operators.title,
          options: optRules,
          value: String(optRule),
          className: `rule-operators ${classNames.operators}`,
          handleOnChange: this.onOperatorChanged,
          level: level,
          ...customOptions,
        })}
        {/* 下拉框选择器控件 */}
        {React.createElement(controls.valueEditor, {
          showShape: 'combobox',
          title: translations.operators.title,
          value: colName2,
          options: groupFieldList.data,
          className: `rule-operators ${classNames.operators}`,
          handleOnChange: this.onOperatorChanged,
          level: level,
          ...customOptions,
        })}
        {/* 下拉框选择器控件 */}
        {React.createElement(controls.valueEditor, {
          showShape: 'combobox',
          title: translations.operators.title,
          value: String(operatorId),
          options: operators,
          className: `rule-operators ${classNames.operators}`,
          handleOnChange: this.onOperatorChanged,
          level: level,
          ...customOptions,
        })}
        {/* input 框 */}
        {React.createElement(controls.valueEditor, {
          id,
          title: translations.value.title,
          value: ruleValue,
          className: `rule-value ${classNames.value}`,
          handleOnChange: this.onValueChanged,
          level: level,
          ...customOptions,
        })}
        {/* 删除按钮 */}
        {React.createElement(controls.removeRuleAction, {
          label: translations.removeRule.label,
          title: translations.removeRule.title,
          className: `rule-remove ${classNames.removeRule}`,
          handleOnClick: this.removeRule,
          level: level,
          type: 'danger',
          ...customOptions,
        })}
      </div>
    );
  }

  onFieldChanged = (value, row) => {
    this.onElementChanged('field', value);
    this.onElementChanged('fieldRow', row);
  };

  onOperatorChanged = value => {
    this.onElementChanged('operator', value);
  };

  onValueChanged = value => {
    this.onElementChanged('ruleValue', value);
  };

  onElementChanged = (property, value) => {
    const {
      id,
      schema: { onPropChange },
    } = this.props;

    onPropChange(property, value, id);
  };

  removeRule = event => {
    event.preventDefault();
    event.stopPropagation();

    this.props.schema.onRuleRemove(this.props.id, this.props.parentId);
  };
}

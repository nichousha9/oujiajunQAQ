/* eslint-disable object-shorthand */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
// 连接点（并且、或、具有）

import React from 'react';
import Rule from './Rule';

export default class RuleGroup extends React.Component {
  static get defaultProps() {
    return {
      id: null,
      parentId: null,
      rules: [],
      con: 'AND',
      schema: {},
    };
  }

  render() {
    const {
      con,
      level,
      rules,
      translations,
      customOptions,
      schema: { combinators, controls, onRuleRemove, isRuleGroup, classNames },
    } = this.props;
    return (
      <div className={`ruleGroup ${classNames.ruleGroup}`}>
        <div className={`ruleGroup-operation ${classNames.ruleGroupOperation}`}>
          {React.createElement(controls.combinatorSelector, {
            options: combinators,
            value: con,
            title: translations.combinators.title,
            className: `ruleGroup-combinators ${classNames.combinators}`,
            handleOnChange: this.onCombinatorChange,
            rules: rules,
            level: level,
          })}
          {/* 新增条件、新增组合条件按钮 */}
          {React.createElement(controls.addRuleAction, {
            label: translations.addRule.label,
            title: translations.addRule.title,
            className: `ruleGroup-addRule ${classNames.addRule}`,
            handleOnClick: this.addRule,
            rules: rules,
            level: level,
            type: '',
            ...customOptions,
          })}
          {React.createElement(controls.addGroupAction, {
            label: translations.addGroup.label,
            title: translations.addGroup.title,
            className: `ruleGroup-addGroup ${classNames.addGroup}`,
            handleOnClick: this.addGroup,
            rules: rules,
            level: level,
            type: 'primary',
            ...customOptions,
          })}
          {this.hasParentGroup() // 有父节点，就可以删除
            ? React.createElement(controls.removeGroupAction, {
                label: translations.removeGroup.label,
                title: translations.removeGroup.title,
                className: `ruleGroup-remove ${classNames.removeGroup}`,
                handleOnClick: this.removeGroup,
                rules: rules,
                level: level,
                type: 'danger',
                ...customOptions,
              })
            : null}
        </div>
        {rules.map(r => {
          return isRuleGroup(r) ? (
            <RuleGroup
              key={r.id}
              id={r.id}
              schema={this.props.schema}
              parentId={this.props.id}
              con={r.con}
              translations={this.props.translations}
              rules={r.rules}
              customOptions={customOptions} // { form, ActionType }
            />
          ) : (
            <Rule
              key={r.id}
              id={r.id}
              colName1={r.colName1}
              colName2={r.colName2}
              operatorId={r.operatorId}
              optRule={r.optRule}
              ruleValue={r.ruleValue}
              schema={this.props.schema}
              parentId={this.props.id}
              translations={this.props.translations}
              onRuleRemove={onRuleRemove}
              customOptions={customOptions}
            />
          );
        })}
      </div>
    );
  }

  hasParentGroup() {
    return this.props.parentId;
  }

  onCombinatorChange = value => {
    const { onPropChange } = this.props.schema;

    onPropChange('con', value, this.props.id);
  };

  addRule = (event, level) => {
    event.preventDefault();
    event.stopPropagation();

    const { createRule, onRuleAdd } = this.props.schema;

    const newRule = createRule(level);
    onRuleAdd(newRule, this.props.id);
  };

  addGroup = (event, level) => {
    event.preventDefault();
    event.stopPropagation();

    const { createRuleGroup, onGroupAdd } = this.props.schema;
    const newGroup = createRuleGroup(level);
    onGroupAdd(newGroup, this.props.id);
  };

  removeGroup = event => {
    event.preventDefault();
    event.stopPropagation();

    this.props.schema.onGroupRemove(this.props.id, this.props.parentId);
  };
}

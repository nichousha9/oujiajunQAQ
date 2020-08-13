/* eslint-disable object-shorthand */
// Card 头操作按钮

import React from 'react';

class RootTitle extends React.Component {
  addRule = e => {
    const { rootRef } = this.props;
    rootRef.addRule(e); // rootRef 指向 <RuleGroup> 组件
  };

  addGroup = e => {
    const { rootRef } = this.props;
    rootRef.addGroup(e);
  };

  render() {
    const {
      rules,
      translations,
      schema: { controls, classNames },
      actionType,
    } = this.props;

    return (
      <div className={`rootTtile ${classNames.rootTitle}`}>
        <div>{translations.rootTitle.title}</div>
        <div style={{ display: actionType === 'V' ? 'none' : '' }}>
          {React.createElement(controls.addRuleAction, {
            label: translations.addRule.label,
            title: translations.addRule.title,
            className: `ruleGroup-addRule ${classNames.addRule}`,
            handleOnClick: this.addRule,
            rules: rules,
            level: 0,
            type: '',
          })}
          {React.createElement(controls.addGroupAction, {
            label: translations.addGroup.label,
            title: translations.addGroup.title,
            className: `ruleGroup-addGroup ${classNames.addGroup}`,
            handleOnClick: this.addGroup,
            rules: rules,
            level: 0,
            type: 'primary',
          })}
        </div>
      </div>
    );
  }
}

export default RootTitle;

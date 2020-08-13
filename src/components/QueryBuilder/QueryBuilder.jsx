/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable prefer-const */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/sort-comp */
/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-plusplus */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-underscore-dangle */
import uniqueId from 'uuid/v4';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import PropTypes from 'prop-types';
import RootTitle from './RootTitle';
import RuleGroup from './RuleGroup';
import {
  ActionElement,
  ValueEditor,
  ValueSelector,
  ValueCombinator,
  FieldSelector,
} from './controls/index';
import { Card } from 'antd';

import styles from './styles.less';

export default class QueryBuilder extends React.Component {
  static get defaultProps() {
    return {
      query: null,
      fields: [],
      operators: QueryBuilder.defaultOperators,
      combinators: QueryBuilder.defaultCombinators,
      translations: QueryBuilder.defaultTranslations,
      controlElements: null,
      getOperators: null,
      onQueryChange: null,
      controlClassnames: null,
    };
  }

  static get propTypes() {
    return {
      query: PropTypes.object,
      fields: PropTypes.array.isRequired,
      operators: PropTypes.array,
      combinators: PropTypes.array,
      controlElements: PropTypes.shape({
        addGroupAction: PropTypes.func,
        removeGroupAction: PropTypes.func,
        addRuleAction: PropTypes.func,
        removeRuleAction: PropTypes.func,
        combinatorSelector: PropTypes.func,
        fieldSelector: PropTypes.func,
        operatorSelector: PropTypes.func,
        valueEditor: PropTypes.func,
      }),
      getOperators: PropTypes.func,
      onQueryChange: PropTypes.func,
      controlClassnames: PropTypes.object,
      translations: PropTypes.object,
    };
  }

  constructor(...args) {
    super(...args);
    this.state = {
      root: {},
      schema: {},
    };
  }

  static get defaultTranslations() {
    return {
      fields: {
        title: '条件',
      },
      operators: {
        title: '操作符',
      },
      value: {
        title: '值',
      },
      removeRule: {
        label: '删除',
        title: 'Remove rule',
      },
      removeGroup: {
        label: '删除组',
        title: 'Remove group',
      },
      addRule: {
        label: '新增条件',
        title: 'Add rule',
      },
      addGroup: {
        label: '新增组合条件',
        title: 'Add group',
      },
      combinators: {
        title: '关系符',
      },
      rootTitle: {
        title: '过滤条件',
      },
    };
  }

  // 默认的操作
  static get defaultOperators() {
    return [
      { name: 'null', label: 'Is Null' },
      { name: 'notNull', label: 'Is Not Null' },
      { name: 'in', label: 'In' },
      { name: 'notIn', label: 'Not In' },
      { name: '=', label: '=' },
      { name: '!=', label: '!=' },
      { name: '<', label: '<' },
      { name: '>', label: '>' },
      { name: '<=', label: '<=' },
      { name: '>=', label: '>=' },
    ];
  }

  static get defaultCombinators() {
    return [
      { name: 'AND', label: 'AND' },
      { name: 'OR', label: 'OR' },
      { name: 'HAVING', label: 'HAVING' },
    ];
  }

  static get defaultControlClassnames() {
    return {
      queryBuilder: '',
      rootTitle: '',

      ruleGroup: '',

      ruleGroupOperation: '',
      combinators: '',

      addRule: '',
      addGroup: '',
      removeGroup: '',

      rule: '',
      fields: '',
      operators: '',
      value: '',
      removeRule: '',
    };
  }

  // 控件以及操作按钮
  static get defaultControlElements() {
    return {
      addGroupAction: ActionElement,
      removeGroupAction: ActionElement,
      addRuleAction: ActionElement,
      removeRuleAction: ActionElement,
      combinatorSelector: ValueCombinator,
      fieldSelector: FieldSelector,
      operatorSelector: ValueSelector,
      valueEditor: ValueEditor,
    };
  }

  componentWillReceiveProps(nextProps) {
    let schema = { ...this.state.schema };

    if (this.props.query !== nextProps.query) {
      this.setState({ root: this.generateValidQuery(nextProps.query) });
    }

    if (schema.fields !== nextProps.fields) {
      schema.fields = nextProps.fields;
      this.setState({ schema });
    }
  }

  // componentWillUpdate(nextP, nextS){
  //   console.log(nextS.root)
  // }

  componentWillMount() {
    const {
      fields,
      optRules,
      operators,
      groupFieldList,
      combinators,
      controlElements,
      controlClassnames,
    } = this.props;
    const classNames = Object.assign({}, QueryBuilder.defaultControlClassnames, controlClassnames);
    const controls = Object.assign({}, QueryBuilder.defaultControlElements, controlElements);
    this.setState({
      root: this.getInitialQuery(),
      schema: {
        fields, // 表单项
        operators, // 操作
        combinators, // 连接（并且、或、具有）
        optRules,
        groupFieldList,
        classNames,
        createRule: this.createRule.bind(this),
        createRuleGroup: this.createRuleGroup.bind(this),
        onRuleAdd: this._notifyQueryChange.bind(this, this.onRuleAdd),
        onGroupAdd: this._notifyQueryChange.bind(this, this.onGroupAdd),
        onRuleRemove: this._notifyQueryChange.bind(this, this.onRuleRemove),
        onGroupRemove: this._notifyQueryChange.bind(this, this.onGroupRemove),
        onPropChange: this._notifyQueryChange.bind(this, this.onPropChange),
        getLevel: this.getLevel.bind(this),
        isRuleGroup: this.isRuleGroup.bind(this),
        controls,
        getOperators: (...args) => this.getOperators(...args),
      },
    });
  }

  generateValidQuery(query) {
    if (this.isRuleGroup(query)) {
      return {
        id: query.id || `g-${uniqueId()}`,
        rules: query.rules.map(rule => this.generateValidQuery(rule)),
        con: query.con,
        level: query.level,
        orderby: query.orderby,
        parId: query.parId,
      };
    }
    return {
      id: query.id || `r-${uniqueId()}`,
      ...query,
    };
  }

  getInitialQuery() {
    const { query } = this.props;
    return (query && this.generateValidQuery(query)) || this.createRuleGroup();

    // TODO: If we replace the above line with the below line, a test should fail.
    // Must properly test that IDs exist, since we use them to generate component keys.
    // return query || this.createRuleGroup();
  }

  componentDidMount() {
    this._notifyQueryChange(null);
  }

  render() {
    const {
      root: { id, rules, con, orderby, parId, level },
      schema,
    } = this.state;
    const { translations, customOptions } = this.props;
    return (
      <Card className={`queryBuilder ${schema.classNames.queryBuilder} ${styles.queryBuilder}`}>
        <RuleGroup
          ref={r => {
            this.rootRef = r;
          }}
          translations={translations}
          rules={rules}
          con={con}
          level={level}
          schema={schema}
          id={id}
          parentId={null}
          customOptions={customOptions}
        />
      </Card>
    );
  }

  // 是否是连接点（AND 、OR） 并且 是否有子节点
  isRuleGroup(rule) {
    return !!(rule.con && rule.rules);
  }

  // 创建表单项
  createRule(level) {
    const { fields = [] } = this.state.schema;
    // const field = fields.length ? fields[0].name : '';
    return {
      id: `r-${uniqueId()}`,
      // field,
      colName1: '',
      colName2: '',
      level: level ? Number(level) + 1 : 1,
      operatorId: '',
      optRule: '',
      orderby: 0,
      ruleValue: '',
      // operator: this.getOperators(field)[0].name,
    };
  }

  // 创建条件组
  createRuleGroup(level) {
    return {
      id: `g-${uniqueId()}`,
      rules: [],
      colName1: '',
      colName2: '',
      level: level ? Number(level) + 1 : 1,
      operatorId: '',
      optRule: '',
      orderby: 0,
      ruleValue: '',
      con: this.props.combinators[0].name,
    };
  }

  getOperators(field) {
    if (this.props.getOperators) {
      const ops = this.props.getOperators(field);
      if (ops) return ops;
    }

    return this.props.operators;
  }

  // 新增条件
  onRuleAdd(rule, parentId) {
    const parent = this._findRule(parentId, this.state.root);
    parent.rules.push(rule);

    this.setState({ root: this.state.root });
  }

  // 新增组合条件
  onGroupAdd(group, parentId) {
    const parent = this._findRule(parentId, this.state.root);
    parent.rules.push(group);

    this.setState({ root: this.state.root });
  }

  onPropChange(prop, value, ruleId) {
    const rule = this._findRule(ruleId, this.state.root);
    Object.assign(rule, { [prop]: value });

    // Reset operator and value for field change
    if (prop === 'field') {
      Object.assign(rule, {
        // operator: this.getOperators(rule.field)[0].name,
        value: '',
      });
    }

    this.setState({ root: this.state.root });
  }

  // 删除条件
  onRuleRemove(ruleId, parentId) {
    const parent = this._findRule(parentId, this.state.root);
    const index = parent.rules.findIndex(x => x.id === ruleId);

    parent.rules.splice(index, 1);
    this.setState({ root: this.state.root });
  }

  // 删除条件组
  onGroupRemove(groupId, parentId) {
    const parent = this._findRule(parentId, this.state.root);
    const index = parent.rules.findIndex(x => x.id === groupId);

    parent.rules.splice(index, 1);
    this.setState({ root: this.state.root });
  }

  // 获取节点在树的第几层
  getLevel(id) {
    return this._getLevel(id, 0, this.state.root);
  }

  _getLevel(id, index, root) {
    const { isRuleGroup } = this.state.schema;

    var foundAtIndex = -1;
    if (root.id === id) {
      foundAtIndex = index;
    } else if (isRuleGroup(root)) {
      root.rules.forEach(rule => {
        if (foundAtIndex === -1) {
          var indexForRule = index;
          if (isRuleGroup(rule)) indexForRule++;
          foundAtIndex = this._getLevel(id, indexForRule, rule);
        }
      });
    }
    return foundAtIndex;
  }

  _findRule(id, parent) {
    const { isRuleGroup } = this.state.schema;

    if (parent.id === id) {
      return parent;
    }

    for (const rule of parent.rules) {
      if (rule.id === id) {
        return rule;
      } else if (isRuleGroup(rule)) {
        const subRule = this._findRule(id, rule);
        if (subRule) {
          return subRule;
        }
      }
    }
  }

  _notifyQueryChange(fn, ...args) {
    if (fn) {
      fn.call(this, ...args);
    }

    const { onQueryChange } = this.props;
    if (onQueryChange) {
      const query = cloneDeep(this.state.root);
      onQueryChange(query);
    }
  }
}

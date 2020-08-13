/* eslint-disable no-param-reassign */
import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import QueryBuilder from '@/components/QueryBuilder/';

const getFields = (fields, rules) => {
  Object.keys(rules).map(index => {
    const rule = rules[index];

    const { id, value, fieldRow = {}, rules: childRules = [] } = rule;

    fields[`${id}_value`] = Form.createFormField({
      value,
    });

    fields[`${id}_field`] = Form.createFormField({
      value: fieldRow.fieldName,
    });

    if (childRules.length) {
      getFields(fields, childRules);
    }

    return id;
  });
};

@connect(({ common }) => ({
  attrSpecCodeList: common.attrSpecCodeList,
}))
@Form.create({
  // 修改和查看的时候数据回填
  mapPropsToFields(props) {
    const { rules: root } = props;
    const { conditions = {} } = root;
    const { rules = [] } = conditions;

    const fields = {};
    getFields(fields, rules);

    return fields;
  },
})
class QueryBuilderRule extends React.Component {
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }

  handleSubmit = callback => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        callback(values);
      }
    });
  };

  // 数据变化回调
  onQueryChange = data => {
    const { dispatch, rules } = this.props;
    dispatch({
      type: 'configDetail/setRules',
      payload: {
        rules: {
          ...rules,
          conditions: data,
        },
      },
    });
  };

  render() {
    const { rules = {}, form, actionType, attrSpecCodeList = {}, groupFieldList = {} } = this.props;
    const { conditions } = rules;

    // 条件
    const fields = [];

    // 操作符，这里传递给 <QueryBuilder> 组件会取代 <QueryBuilder> 组件里的默认 operators
    const optRules = attrSpecCodeList.OPT_RULE;
    const operators = attrSpecCodeList.OPERATOR_ID;

    const customOptions = {
      form,
      actionType,
    };

    return (
      <Form layout="inline">
        <QueryBuilder
          query={conditions}
          fields={fields}
          operators={operators}
          optRules={optRules}
          groupFieldList={groupFieldList}
          onQueryChange={this.onQueryChange}
          customOptions={customOptions}
        />
      </Form>
    );
  }
}

export default QueryBuilderRule;

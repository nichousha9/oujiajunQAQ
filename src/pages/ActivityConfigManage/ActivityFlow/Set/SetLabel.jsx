/**
 * set标签 组件
 * props: {
 *  item: {} // label信息
 *  form // 父组件form
 *  disabled // 是否可编辑
 *  handleTagDragStart // 处理标签移动函数
 *  handleTagDragEnd // 处理标签移动函数
 *  removeItem // 删除标签函数
 * }
 */

 /**
 * set标签 组件
 * item: {
 *  value // setCond的cellName, setOperation的attrSpecCode set
 * }
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Select, Tag, Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '../Select/index.less';

const formItemLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

// '&cap;', '&cup;', '&minus;'
// 集合类型列表
const SET_LIST = [
  { value: 'intersect', title: '∩' }, 
  { value: 'union', title: '∪' }, 
  { value: 'minus', title: '−' }, 
];

@connect()
class SetLabel extends React.Component {

  // 获取并渲染当前label的可选类型
  renderSetOptions = () => {
    const { disabled, form } = this.props;
    const { setType } = form.getFieldsValue(['setType']);
    const currentSetList = [];
    const setOperation = SET_LIST.find(set => {
      return set.value === setType;
    });
    currentSetList.push(setOperation);
    return currentSetList.map(set => {
      return (
        <Select.Option disabled={disabled} key={set.value} value={set.value}>
          {set.title}
        </Select.Option>
      );
    });
  };


  render() {
    const { item, form, handleTagDragEnd, handleTagDragStart, removeItem, disabled } = this.props;
    const { setType } = form.getFieldsValue(['setType']);
    return (
      <div
        id={`tagItem_${item.id}`}
        draggable
        onDragStart={() => handleTagDragStart(item)}
        onDragEnd={e => handleTagDragEnd(item, e)}
      >
        <div className={styles.tagBox}>
          {/* 括号符号 */}
          {item.type !== 3 || !item.type ? <Tag className={styles.tagItem}>{item.title}</Tag> : null}
          {/* 集合操作列表 值根据数据来源固定 */}
          {item.type === 3 ? (
            <div className={styles.tagItem}>
              <Form.Item {...formItemLayout}>
                {form.getFieldDecorator(`setOperation_${item.id}`, {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'common.form.required',
                      }),
                    },
                  ],
                  initialValue: setType,
                })(<Select size="small">{this.renderSetOptions()}</Select>)}
              </Form.Item>
            </div>
          ) : null}
          {!disabled ? (
            <Icon type="close-circle" theme="filled" onClick={() => removeItem(item)} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default SetLabel;

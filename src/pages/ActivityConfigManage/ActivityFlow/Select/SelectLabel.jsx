/**
 * select标签 组件
 * props: {
 *  item: {} // label信息
 *  form // 父组件form
 *  disabled // 是否可编辑
 *  handleTagDragStart // 处理标签移动函数
 *  handleTagDragEnd // 处理标签移动函数
 *  removeItem // 删除标签函数
 * }
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Select, Tag, Input, Icon, DatePicker, InputNumber, Switch } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const OPTIONS_LIST = ['=', '<>', '>', '<', '>=', '<=', 'IN', 'BETWEEN', 'LIKE', 'NOT IN'];

const AND_OR_LIST = ['and', 'or'];

@connect()
class SelectLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 标签选项列表
      labelValueList: [],
    };
  }

  componentDidMount() {
    const { item } = this.props;
    const labelDataType = this.getLabelValueType();
    // 枚举类型，获取标签选项值列表
    if (labelDataType === 'attr' || (labelDataType === undefined && item.labelId)) {
      this.getLabelValueList();
    }
  }

  // 根据labelId获取标签选项值列表
  getLabelValueList = () => {
    const { dispatch, item } = this.props;
    dispatch({
      type: 'activitySelect/getLabelValueList',
      payload: {
        labelId: item.labelId,
      },
      callback: res => {
        this.setState({
          labelValueList: res.data || [],
        });
      },
    });
  };

  // 获取标签类型
  getLabelValueType = () => {
    let {
      item: { labelDataType },
    } = this.props;
    const {
      item: { labelValueType },
    } = this.props;
    // 标签值类型：枚举类型，枚举值只能选择等于
    if (labelValueType == '2000') {
      labelDataType = 'attr';
    }
    return labelDataType;
  };

  // 获取并渲染当前label的可选类型
  renderOptions = () => {
    const { item, disabled } = this.props;
    const { labelValueList } = this.state;
    const labelDataType = this.getLabelValueType();
    let indexs = [];
    // 枚举型 / 有枚举值的情况
    if (labelDataType === 'attr' || labelValueList.length) {
      indexs = [0, 6, 8, 9];
    } else {
      switch (labelDataType) {
        // 日期型
        case '1000': {
          indexs = [0, 1, 2, 3, 4, 5];
          break;
        }
        // 日期时间型
        case '1100': {
          indexs = [0, 1, 2, 3, 4, 5];
          break;
        }
        // 字符型
        case '1200': {
          indexs = [0, 1, 2, 3, 4, 5, 6, 8, 9];
          break;
        }
        // 浮点型
        case '1300': {
          indexs = [0, 1, 2, 3, 4, 5, 6, 9];
          break;
        }
        // 整数型
        case '1400': {
          indexs = [0, 1, 2, 3, 4, 5, 6, 9];
          break;
        }
        // 布尔型
        case '1500': {
          indexs = [0];
          break;
        }
        // 计算型
        case '1600': {
          indexs = [0];
          break;
        }
        default: {
          indexs = [0, 1, 2, 3, 4, 5, 6, 8, 9];
        }
      }
    }

    let optionsList = OPTIONS_LIST;

    if (item.type === 3) {
      // and / or
      indexs = [0, 1];
      optionsList = AND_OR_LIST;
    }

    return indexs.map(ele => {
      const value = optionsList[ele];
      return (
        <Select.Option disabled={disabled} key={value} value={value}>
          {value}
        </Select.Option>
      );
    });
  };

  // 根据label类型渲染标签
  renderLabel = () => {
    const { labelValueList } = this.state;
    const { disabled } = this.props;
    const labelDataType = this.getLabelValueType();
    let ele;
    // 枚举型 / 有枚举值的情况
    if (labelDataType === 'attr' || labelValueList.length) {
      ele = (
        <Select
          disabled={disabled}
          placeholder={formatMessage({ id: 'common.form.select' })}
          size="small"
        >
          {labelValueList
            ? labelValueList.map(lists => {
                const value = lists.valueName;
                return (
                  <Select.Option title={value} key={value} value={value}>
                    {value}
                  </Select.Option>
                );
              })
            : null}
        </Select>
      );
    } else {
      switch (labelDataType) {
        // 日期型
        case '1000': {
          ele = (
            <DatePicker
              disabled={disabled}
              size="small"
              placeholder={formatMessage({ id: 'common.form.select' })}
            />
          );
          break;
        }
        // 日期时间型
        case '1100': {
          ele = (
            <DatePicker
              disabled={disabled}
              size="small"
              placeholder={formatMessage({ id: 'common.form.select' })}
            />
          );
          break;
        }
        // 字符型
        case '1200': {
          ele = (
            <Input
              maxLength={21}
              disabled={disabled}
              size="small"
              placeholder={formatMessage({ id: 'common.form.input' })}
            />
          );
          break;
        }
        // 浮点型
        case '1300': {
          ele = <InputNumber disabled={disabled} size="small" />;
          break;
        }
        // 整数型
        case '1400': {
          ele = <InputNumber disabled={disabled} size="small" />;
          break;
        }
        // 布尔型
        case '1500': {
          ele = <Switch disabled={disabled} size="small" />;
          break;
        }
        // 计算型
        case '1600': {
          ele = <InputNumber disabled={disabled} size="small" />;
          break;
        }
        default: {
          ele = (
            <Input
              maxLength={21}
              disabled={disabled}
              size="small"
              placeholder={formatMessage({ id: 'common.form.input' })}
            />
          );
        }
      }
    }
    return ele;
  };

  render() {
    const { item, form, handleTagDragEnd, handleTagDragStart, removeItem, disabled } = this.props;
    return (
      <div
        id={`tagItem_${item.id}`}
        draggable
        onDragStart={() => handleTagDragStart(item)}
        onDragEnd={e => handleTagDragEnd(item, e)}
      >
        <div className={styles.tagBox}>
          {item.type !== 3 ? <Tag className={styles.tagItem}>{item.title}</Tag> : null}
          {item.type === 3 || !item.type ? (
            <div className={styles.tagItem}>
              <Form.Item {...formItemLayout}>
                {form.getFieldDecorator(`select_${item.id}`, {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'common.form.required',
                      }),
                    },
                  ],
                  initialValue:
                    item.selectValue || (item.type === 3 ? AND_OR_LIST[0] : OPTIONS_LIST[0]),
                })(<Select size="small">{this.renderOptions()}</Select>)}
              </Form.Item>
            </div>
          ) : null}
          {!item.type ? (
            <div className={styles.tagItem}>
              <Form.Item {...formItemLayout}>
                {form.getFieldDecorator(`value_${item.id}`, {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'common.form.required',
                      }),
                    },
                  ],
                  initialValue: item.value,
                })(this.renderLabel())}
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

export default SelectLabel;

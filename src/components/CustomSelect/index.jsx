/* eslint-disable react/jsx-no-bind */
import React from 'react';
import classnames from 'classnames';
import Iconfont from '@/components/Iconfont/index';
import styles from './index.less';

// mode: default单选，multiple:多选，tags可删除标签
// defaultValued
// value
// dataSource: 数据[label,value,disabled]
// onChange
// onClose: mode为tags时触发删除
// required 单选情况下必选，不可取消选择
// size 提供small样式
//  readOnly 整个组件不可编辑只查看

class CustomSelect extends React.Component {
  constructor(props) {
    super(props);
    const { mode, dataSource } = props;
    let checkedValue;
    let control = false;
    if (props.value) {
      checkedValue = props.value;
      control = true;
    } else if (props.defaultValue) {
      checkedValue = props.defaultValue;
    }
    if (mode === 'tags') {
      checkedValue = dataSource && dataSource.map((item) => item.value);
      control = true;
    }
    this.state = {
      checkedValue,
      control,
    };
  }

  componentWillUpdate(nextProps) {
    const { value, mode, dataSource, onChange } = this.props;
    if (JSON.stringify(nextProps.value) !== JSON.stringify(value)) {
      this.setValue(nextProps.value);
    }
    if(mode === 'tags' && JSON.stringify(nextProps.dataSource) !== JSON.stringify(dataSource)) {
      this.setValue(nextProps.dataSource && nextProps.dataSource.map((item) => item.value));
      if (onChange && typeof onChange === 'function') {
        onChange(nextProps.dataSource && nextProps.dataSource.map((item) => item.value));
      }
    }

  }

  setValue = value => {
    this.setState({ checkedValue: value });
  };

  // 选择
  choose = item => {
    const { mode = 'default', onChange, required } = this.props;
    const { control, checkedValue } = this.state;
    let newValue;
    if (item.disabled) {
      return;
    }
    if (mode === 'default') {
      if (item.value === checkedValue) {
        newValue = required ? item.value : '';
      } else {
        newValue = item.value;
      }
    } else if (mode === 'multiple') {
      if (Array.isArray(checkedValue)) {
        newValue = checkedValue.slice(0);
        if (
          Array.isArray(checkedValue) &&
          checkedValue.length > 0 &&
          checkedValue.indexOf(item.value) > -1
        ) {
          newValue.splice(checkedValue.indexOf(item.value), 1);
        } else {
          newValue.push(item.value);
        }
      } else {
        newValue = [item.value];
      }
    }
    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
    if (!control) {
      this.setState({ checkedValue: newValue });
    }
  };

  // tag标签关闭
  onClose = item => {
    const { onClose } = this.props;
    if (onClose && typeof onClose === 'function') {
      onClose(item.value, item);
    }
  };

  render() {
    const { dataSource = [], mode = 'default', otherNode, size = 'default', readyOnly } = this.props;
    const { checkedValue } = this.state;

    return (
      <div className={styles.box}>
        {dataSource &&
          dataSource.map(item => {
            let checked = false;
            if (mode === 'default' && item.value === checkedValue) {
              checked = true;
            } else if (
              mode === 'multiple' &&
              Array.isArray(checkedValue) &&
              checkedValue.length > 0 &&
              checkedValue.indexOf(item.value) > -1
            ) {
              checked = true;
            } else if (mode === 'tags') {
              checked = true;
            }
            return (
              <span
                key={item.value}
                className={classnames(
                  styles.item,
                  checked ? styles.checked : null,
                  item.disabled ? styles.disabled : null,
                  mode === 'tags' && !readyOnly ? styles.tag : null,
                  size === 'small' ? styles.small : null,
                )}
                value={item.value}
                {...(mode === 'tags' || readyOnly ? {} : { onClick: this.choose.bind(this, item) })}
              >
                {checked ? <Iconfont type="iconselect-btn" className={styles.icon} /> : null}
                {mode === 'tags' && !item.disabled ? (
                  <Iconfont
                    type="iconselect-btn-remove"
                    className={classnames(styles.icon, styles.deleteIcon)}
                    onClick={this.onClose.bind(this, item)}
                  />
                ) : null}
                {item.label}
              </span>
            );
          })}
        {otherNode}
      </div>
    );
  }
}

export default CustomSelect;

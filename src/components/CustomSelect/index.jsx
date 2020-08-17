/* eslint-disable react/jsx-no-bind */
import React from 'react';
import classnames from 'classnames';
import Iconfont from '@/components/Iconfont/index';
import styles from './index.less';

// mode: default单选，multiple:多选，tags可删除标签
// defaultValue
// value
// dataSource: 数据[label,value,disabled]
// onChange
// onClose: mode为tags时触发删除
// required 单选情况下必选，不可取消选择

class CustomSelect extends React.Component {
  constructor(props) {
    super(props);
    let checkedValue;
    let control = false;
    if (props.value) {
      checkedValue = props.value;
      control = true;
    } else if (props.defaultValue) {
      checkedValue = props.defaultValue;
    }
    this.state = {
      checkedValue,
      control,
    };
  }

  componentWillUpdate(nextProps) {
    const { value } = this.props;
    if (nextProps.value !== value) {
      this.setValue(nextProps.value);
    }
  }

  setValue = value => {
    this.setState({ checkedValue: value });
  };

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

  onClose = item => {
    const { onClose } = this.props;
    if (onClose && typeof onClose === 'function') {
      onClose(item.value, item);
    }
  };

  render() {
    const { dataSource = [], mode = 'default', otherNode } = this.props;
    const { checkedValue } = this.state;

    return (
      <div>
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
                  mode === 'tags' ? styles.tag : null,
                )}
                value={item.value}
                {...(mode === 'tags' ? {} : { onClick: this.choose.bind(this, item) })}
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

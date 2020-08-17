import React, { Component } from 'react';
import classNames from 'classnames';
import { Tag, Icon } from 'antd';
import { formatMessage } from 'umi/locale';

import styles from './index.less';

const { CheckableTag } = Tag;

const TagSelectOption = ({ children, checked, onChange, value }) => (
  <CheckableTag checked={checked} key={value} onChange={state => onChange(value, state)}>
    {children}
  </CheckableTag>
);

TagSelectOption.isTagSelectOption = true;

class TagSelect extends Component {
  static defaultProps = {
    hideCheckAll: false,
    multiple: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      checkedAllState: true,
      value: props.value || props.defaultValue || [],
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps && nextProps.value) {
      return { value: nextProps.value };
    }
    return null;
  }

  onChange = value => {
    const { onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    if (onChange) {
      onChange(value);
    }
  };

  onSelectAll = checked => {
    const { multiple } = this.props;
    let checkedTags = [];
    if (multiple) {
      if (checked) {
        checkedTags = this.getAllTags();
      }
    } else {
      // 单选情况下，全部选中
      this.setState({
        checkedAllState: true,
      });
    }
    this.onChange(checkedTags);
  };

  getAllTags() {
    let { children } = this.props;
    children = React.Children.toArray(children);
    const checkedTags = children
      .filter(child => this.isTagSelectOption(child))
      .map(child => child.props.value);
    return checkedTags || [];
  }

  handleTagChange = (value, checked) => {
    const { multiple } = this.props;
    let checkedTags = null;
    if (multiple) {
      const { value: StateValue } = this.state;
      checkedTags = [...StateValue];

      const index = checkedTags.indexOf(value);
      if (checked && index === -1) {
        checkedTags.push(value);
      } else if (!checked && index > -1) {
        checkedTags.splice(index, 1);
      }
    } else {
      checkedTags = [value];

      // 单选情况下，全部不选中
      this.setState({
        checkedAllState: false,
      });
    }

    this.onChange(checkedTags);
  };

  handleExpand = () => {
    const { expand } = this.state;
    this.setState({
      expand: !expand,
    });
  };

  isTagSelectOption = node =>
    node &&
    node.type &&
    (node.type.isTagSelectOption || node.type.displayName === 'TagSelectOption');

  render() {
    const { value, expand, checkedAllState } = this.state;
    const { children, hideCheckAll, className, style, expandable, multiple } = this.props;

    const checkedAll = multiple ? this.getAllTags().length === value.length : checkedAllState;

    const cls = classNames(styles.tagSelect, className, {
      [styles.hasExpandTag]: expandable,
      [styles.expanded]: expand,
    });
    return (
      <div className={cls} style={style}>
        {hideCheckAll ? null : (
          <CheckableTag checked={checkedAll} key="tag-select-__all__" onChange={this.onSelectAll}>
            {formatMessage({ id: 'app.all', defaultMessage: '全部' })}
          </CheckableTag>
        )}
        {value &&
          React.Children.map(children, child => {
            if (this.isTagSelectOption(child)) {
              return React.cloneElement(child, {
                key: `tag-select-${child.props.value}`,
                value: child.props.value,
                checked: value.indexOf(child.props.value) > -1,
                onChange: this.handleTagChange,
              });
            }
            return child;
          })}
        {expandable && (
          <a className={styles.trigger} onClick={this.handleExpand}>
            {expand
              ? formatMessage({ id: 'app.drawBack', defaultMessage: '收起' })
              : formatMessage({ id: 'app.expand', defaultMessage: '展开' })}{' '}
            <Icon type={expand ? 'up' : 'down'} />
          </a>
        )}
      </div>
    );
  }
}

TagSelect.Option = TagSelectOption;

export default TagSelect;

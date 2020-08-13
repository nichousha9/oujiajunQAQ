/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const { Group } = Button;

class ValueCombinator extends React.Component {
  constructor(props) {
    super(props);
    const { options = [], handleOnChange, value } = props;
    if (options.length) {
      const name = value || options[0].name;
      this.state = {
        activeName: name,
      };
      handleOnChange(name);
    }
  }

  handleSelect = name => {
    const { handleOnChange } = this.props;
    this.setState({
      activeName: name,
    });
    handleOnChange(name);
  };

  render() {
    const { activeName } = this.state;
    const { options, value, className, title } = this.props;

    return (
      <Group className={className} value={value} title={title}>
        {options.map(option => {
          const { id, name, label } = option;
          const key = id ? `key-${id}` : `key-${name}`;
          return (
            <Button
              size="small"
              key={key}
              type={activeName === name ? 'primary' : ''}
              value={name}
              onClick={() => this.handleSelect(name)}
            >
              {label}
            </Button>
          );
        })}
      </Group>
    );
  }
}

ValueCombinator.displayName = 'ValueCombinator';

ValueCombinator.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
  handleOnChange: PropTypes.func,
  title: PropTypes.string,
};

export default ValueCombinator;

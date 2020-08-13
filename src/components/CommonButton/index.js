import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

export default class CommonButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loading === false && this.state.isActive) {
      this.setState({ isActive: false });
    }
  }
  render() {
    const { children, loading, onClick, handleClick, ...others } = this.props;
    const { isActive } = this.state;
    return (
      <Button
        loading={!!loading && isActive}
        onClick={() => {
          this.setState({ isActive: !isActive });
          if (onClick) {
            onClick();
          } else if (handleClick) {
            handleClick();
          }
        }}
        {...others}>
        {children}
      </Button>
    );
  }
}

CommonButton.propTypes = {
  loading: PropTypes.bool, // 是否在加载中
};

import React from 'react';

import { Progress } from 'antd';

const CommonProgress = props => {
  const { strokeColor, unit = '', percent: value } = props;
  return (
    <Progress
      format={percent => <span style={{ color: strokeColor }}>{`${percent}${unit}`}</span>}
      {...props}
      percent={value || ''}
    />
  );
};

export default CommonProgress;

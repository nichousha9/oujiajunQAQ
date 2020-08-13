import React from 'react';
import { Result } from 'antd';

export default function Error403() {
  return <Result status="403" title="403" subTitle="抱歉，您无权访问此页面。" />;
}

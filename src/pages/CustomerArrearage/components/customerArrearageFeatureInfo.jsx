import React from 'react';
import { Descriptions } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

function CustomerArrearageFeatureInfo(props) {
  const { featureInfo } = props;
  return (
    <Descriptions
      title={formatMessage({ id: 'customerArrearage.featureInfo' }, '客户欠费特征信息')}
    >
      <Descriptions.Item
        label={formatMessage({ id: 'customerArrearage.arrearsCount' }, '近半年欠费次数')}
      >
        { featureInfo.halfYearOweTime}
      </Descriptions.Item>
      <Descriptions.Item
        label={formatMessage({ id: 'customerArrearage.arrearsReason' }, '欠费原因')}
      >
        { featureInfo.oweReasonDesc }
      </Descriptions.Item>
    </Descriptions>
  );
}

export default CustomerArrearageFeatureInfo;

import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import DetailForm from '../../components/DetailForm';
import InputSrc from './InputSrc';
import ActivePolicy from './ActivePolicy';
import OutputFormat from './OutputFormat';

const { TabPane } = Tabs;

const mapStateToProps = ({ eventManageComm }) => ({
  isShowDetailForm: eventManageComm.isShowDetailForm,
});

function CardTabs(props) {
  const { isShowDetailForm } = props;

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="规则详情" key="1">
        {isShowDetailForm === 'readonly' && <DetailForm />}
      </TabPane>
      <TabPane tab="输入源" key="2">
        <InputSrc />
      </TabPane>
      <TabPane tab="活动策略" key="3">
        <ActivePolicy />
      </TabPane>
      <TabPane tab="输出格式" key="4">
        <OutputFormat />
      </TabPane>
    </Tabs>
  );
}

export default connect(mapStateToProps)(CardTabs);

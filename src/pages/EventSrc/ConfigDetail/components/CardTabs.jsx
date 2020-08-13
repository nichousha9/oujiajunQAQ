import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import DetailForm from '../../components/DetailForm';
import InputAttr from './InputAttr';
import DetailLog from './DetailLog';
import CenterObject from './CenterObject';

const { TabPane } = Tabs;

const mapStateToProps = ({ eventSrcComm }) => ({
  isShowDetailForm: eventSrcComm.isShowDetailForm,
  eventItem: eventSrcComm.itemDetail,
});

function CardTabs(props) {
  const { isShowDetailForm, eventItem } = props;

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="详情" key="1">
        {isShowDetailForm === 'readonly' && <DetailForm />}
      </TabPane>
      <TabPane tab="输入属性" key="2">
        <InputAttr />
      </TabPane>
      <TabPane tab="日志" key="3">
        <DetailLog />
      </TabPane>
      {eventItem.inputType != '6000' && ( // 事件源类似不是中间对象才显示
        <TabPane tab="中心对象" key="4">
          <CenterObject />
        </TabPane>
      )}
    </Tabs>
  );
}

export default connect(mapStateToProps)(CardTabs);

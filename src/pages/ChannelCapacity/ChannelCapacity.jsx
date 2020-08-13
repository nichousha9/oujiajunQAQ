import React from 'react';
import { Card, Col, Row,Switch  } from 'antd';
function ChannelCapacity() {

  // 导航右侧菜单
  const topRightDiv = (
    <div>
      <span>天</span>
      <Switch defaultChecked/>
    </div>
  );

  return (
    <div>
      <Card title="渠道运营管理">
        <span>全球</span>
        <div style={{ background: '#ECECEC', padding: '30px' }}>
          <span>个人用户联系人容量限制</span>
          <Row gutter={16}>
            <Col span={8}>
              <Card bordered={false} extra={topRightDiv}>
                Card content
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                Card content
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                Card content
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
}
export default ChannelCapacity;

import React, { Component } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';
import LabelTreeCard from './components/LabelTreeCard';
import LabelListCard from './components/LabelListCard';

class LabelManage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.labelManageCard}>
        <Row type="flex" gutter={16} className='common-list-wrapper'>
          <Col span={5}>
            <LabelTreeCard />
          </Col>
          <Col span={19}>
            <LabelListCard />
          </Col>
        </Row>
      </div>
    );
  }
}

export default LabelManage;

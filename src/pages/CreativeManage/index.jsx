import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import LeftTree from './tree';
import RightTable from './table';
import styles from './index.less';

@connect(({ loading }) => ({
  loadingCopy: loading.effects['creativeIdeaManage/copyAdviceType'],
  loadingMove: loading.effects['creativeIdeaManage/changeAdviceType'],
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {}

  message = treeNode => {
    this.child.getNode(treeNode);
  };

  getTreeNode = ref => {
    this.child = ref;
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <Row gutter={16} type="flex" style={{ height: '100%' }}>
          <Col span={5}>
            <LeftTree messageTable={this.message} />
          </Col>
          <Col span={19}>
            <RightTable getTreeNode={this.getTreeNode} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Index;

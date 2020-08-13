import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import Catalogue from './catalogue';
import MyList from './myList';
import styles from './index.less';

@connect(({ commodityList }) => ({
  commodityList,
  clickFolder: commodityList.clickFolder,
  submitData: commodityList.submitData,
}))
class CommodityManage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // componentWillMount() {
  //   this.qryRootNode();
  // }

  // componentDidMount() {}

  // // 查询根目录
  // qryRootNode = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'commodityList/qryRootNode',
  //     payload: { objType: '4' },
  //   });
  // };

  render() {
    return (
      <div className={styles.wrapper}>
        <Row type="flex" gutter={16}>
          <Col span={5}>
            <Catalogue />
          </Col>
          <Col span={19}>
            <MyList />
          </Col>
        </Row>
      </div>
    );
  }
}

export default CommodityManage;

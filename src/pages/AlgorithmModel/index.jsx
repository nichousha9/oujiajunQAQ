import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import Catalog from './Catalog';
import AlgorithmList from './AlgorithmList'

@connect(()=>({}))
class AlgorithmModel extends React.Component {

  render() {
    return (
      <>
        <Row type="flex" gutter={16} className='common-list-wrapper'>
          <Col span={5}>
            <Catalog />
          </Col>
          <Col span={19}>
            <AlgorithmList />
          </Col>
        </Row>
      </>
    );
  }
}

export default AlgorithmModel;

import React from 'react';
import { Col, Row } from 'antd';
// import { connect } from 'dva';
import Catalogue from './Catalogue';
import SpecialGroupList from './SpecialGroupList';
class SpecialGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      pathcode: '',
    };
  }

  getNodeInfo = (key, pathcode) => {
    this.setState({
      key,
      pathcode,
    });
  };

  render() {
    const { key, pathcode } = this.state;
    return (
      <div>
        <Row type="flex" gutter={16}>
          <Col span={5}>
            <Catalogue getNodeInfo={this.getNodeInfo} />
          </Col>
          <Col span={19}>
            <SpecialGroupList nodeKey={key} nodePath={pathcode} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default SpecialGroup;

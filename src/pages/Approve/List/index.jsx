import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import Catalogue from './catalogue';
import List from './list';

@connect(() => ({}))
class ApproveList extends React.Component {
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
        <Row type="flex" gutter={16} className='common-list-wrapper'>
          <Col span={5}>
            <Catalogue getNodeInfo={this.getNodeInfo} />
          </Col>
          <Col span={19}>
            <List nodeKey={key} nodePath={pathcode} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ApproveList;

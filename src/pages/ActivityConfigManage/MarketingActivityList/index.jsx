import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './index.less';
import Catalogue from './catalogue';
import List from './list';

@connect(() => ({}))
class Active extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 'MARKETING',
      pathcode: '',
      folderName: '',
      parentCode: '-1',
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentDidUpdate() {}

  getNodeInfo = (key, pathcode, folderName, parentCode) => {
    this.setState({
      key,
      pathcode,
      folderName,
      parentCode,
    });
  };

  render() {
    const { key, pathcode, folderName, parentCode } = this.state;
    return (
      <div className={styles.wrapper}>
        <Row type="flex" gutter={16} className="common-list-wrapper">
          <Col span={5}>
            <Catalogue getNodeInfo={this.getNodeInfo} />
          </Col>
          <Col span={19}>
            <List
              nodeKey={key}
              nodePath={pathcode}
              folderName={folderName}
              parentCode={parentCode}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Active;

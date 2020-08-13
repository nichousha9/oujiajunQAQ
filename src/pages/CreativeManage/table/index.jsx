import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Icon,
  ConfigProvider,
  Button,
  Form,
  Dropdown,
  Menu,
  Modal,
} from 'antd';
import { connect } from 'dva';
import HeightSearch from './heightSearch';
import CreativeTable from './creativeTable';
import ImgCreative from './addUpdate/imgCreative';
import TxtCreative from './addUpdate/txtCreative';
import HtmlCreative from './addUpdate/htmlCreative';
import styles from '../index.less';

const { Search } = Input;

@connect(({ loading }) => ({
  loadingCopy: loading.effects['creativeIdeaManage/copyAdviceType'],
  loadingMove: loading.effects['creativeIdeaManage/changeAdviceType'],
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFilterShow: false,
      typeDocument: '',
      visible: false,
    };
    this.node = {};
    this.advanced = {};
    this.searchText = '';
    props.getTreeNode(this);
  }

  componentDidMount() {}

  // 获取树节点
  getNode = node => {
    this.node = node;
    this.setParam();
  };

  // 搜索名称查询
  searchHandler = searchText => {
    this.searchText = searchText;
    this.setParam();
  };

  // 传输参数
  setParam = () => {
    const param = {
      adviceTypeSortId: this.node.key,
      creativeInfoName: this.searchText,
      ...this.advanced,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
    };
    this.child.getData(param);
  };

  // 高级筛选参数
  heightParam = advanced => {
    this.advanced = advanced;
  };

  setCreateType = type => {
    let document = '';
    if (type === '1') {
      document = <ImgCreative handleCancel={this.handleCancel} node={this.node} isEdit={false} />;
    } else if (type === '2') {
      document = <TxtCreative handleCancel={this.handleCancel} node={this.node} isEdit={false} />;
    } else if (type === '3') {
      document = <HtmlCreative handleCancel={this.handleCancel} node={this.node} isEdit={false} />;
    }
    this.setState({
      typeDocument: document,
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.setParam();
  };

  showAdvancedFilter = () => {
    const { advancedFilterShow } = this.state;
    this.setState({
      advancedFilterShow: !advancedFilterShow,
    });
  };

  getParam = ref => {
    this.child = ref;
  };

  render() {
    const { advancedFilterShow, typeDocument, visible } = this.state;
    const menu = (
      <Menu>
        {/* <Menu.Item>
          <a onClick={() => this.setCreateType('1')}>新增图片话术</a>
        </Menu.Item> */}
        <Menu.Item>
          <a onClick={() => this.setCreateType('2')}>新增文本话术</a>
        </Menu.Item>
        {/* <Menu.Item>
          <a onClick={() => this.setCreateType('3')}>新增HTML话术</a>
        </Menu.Item> */}
      </Menu>
    );
    const topRightDiv = (
      <Row style={{ width: '450px', display: 'flex', justifyContent: 'flex-end' }} gutter={16}>
        <Col>
          <ConfigProvider autoInsertSpaceInButton={false}>
            <Dropdown overlay={menu}>
              <Button type="primary" size="small">
                新增
                <Icon type="down" />
              </Button>
            </Dropdown>
          </ConfigProvider>
        </Col>
        <Col>
          <Search placeholder="搜索话术名称" onSearch={this.searchHandler} size="small" />
        </Col>
        {/* <Col>
          <a onClick={this.showAdvancedFilter}>
            高级筛选
            {advancedFilterShow ? <Icon type="up" /> : <Icon type="down" />}
          </a>
        </Col> */}
      </Row>
    );

    return (
      <Card title="话术管理" extra={topRightDiv} size="small" className="common-card">
        <div
          style={{ display: advancedFilterShow ? 'block' : 'none' }}
          className="show-advanced-div"
        >
          <HeightSearch heightParam={this.heightParam} />
        </div>
        <div className={styles.table}>
          <CreativeTable getParam={this.getParam} />
          <Modal
            title="新增话术"
            width="80%"
            visible={visible}
            footer={false}
            onCancel={this.handleCancel}
            destroyOnClose
          >
            {typeDocument}
          </Modal>
        </div>
      </Card>
    );
  }
}

export default Index;

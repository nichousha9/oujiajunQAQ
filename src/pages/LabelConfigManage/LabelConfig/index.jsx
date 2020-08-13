import React, { Component, Fragment } from 'react';
// import { formatMessage } from 'umi-plugin-react/locale';
import { Card, Button, List, Input, Row, Col, Divider } from 'antd';
import { connect } from 'dva';
import Iconfont from '@/components/Iconfont';
import styles from './index.less';
import RelsModal from './components/RelsModal';

const { Search } = Input;

@connect(({ labelConfig }) => ({
  labelRelsListData: labelConfig.labelRelsListData,
}))
class LabelConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalTitle: '',
      modalVisible: false,
      modalType: '', // create / edit
      curItem: null,
      // labelRelsList: [
      //   {
      //     goodsLabelName: '感冒药123',
      //     subsLabelName: '老年人',
      //     subsLabelValueName: '是',
      //     relsNum: 0.95,
      //     goodsLabelValueName: '否',
      //     staffName: '张三',
      //     updateDate: '2077-07-07 07:07',
      //   },
      //   {
      //     goodsLabelName: '商品标签名称',
      //     subsLabelName: '老年人',
      //     subsLabelValueName: '是',
      //     relsNum: 0.95,
      //     goodsLabelValueName: '否',
      //     staffName: '张三',
      //     updateDate: '2077-07-07 07:07',
      //   },
      // ], // 列表的数据
    };
  }

  componentWillMount() {
    this.getMccLabelRelsList({
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
    });
  }

  // 获取标签关联度列表数据
  getMccLabelRelsList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelConfig/getMccLabelRelsList',
      payload: params,
    });
  };

  // 编辑标签关联度
  handleCreate = () => {
    this.setState({
      modalTitle: '新增',
      modalVisible: true,
      modalType: 'create',
      curItem: null,
    });
  };

  // 编辑标签关联度
  handleEdit = item => {
    this.setState({
      modalTitle: '编辑',
      modalVisible: true,
      modalType: 'edit',
      curItem: item,
    });
  };

  hideModal = () => {
    this.setState({
      modalVisible: false,
      modalType: '',
      curItem: null,
    });
  };

  // 根据当前分页情况获取列表
  getRelsList = () => {
    this.getMccLabelRelsList({
      pageInfo: {
        pageNum: 0,
        pageSize: 5,
      },
    });
  };

  render() {
    const { modalTitle, modalVisible, curItem, modalType } = this.state;
    const { labelRelsListData } = this.props;
    return (
      <Fragment>
        <Card
          title="标签关联度列表"
          size="small"
          extra={
            <div className={styles.titleExtra}>
              <Button
                size="small"
                type="primary"
                className={styles.titleButton}
                onClick={this.handleCreate}
              >
                新增
              </Button>
              <Search
                size="small"
                className={styles.titleButton}
                placeholder="请输入商品标签名称"
              />
            </div>
          }
        >
          <List
            dataSource={labelRelsListData && labelRelsListData.data ? labelRelsListData.data : []}
            itemLayout="horizontal"
            pagination={{ showSizeChanger: true, showQuickJumper: true }}
            className={styles.relsList}
            renderItem={item => (
              <List.Item>
                <Col span={24}>
                  <Row gutter={20}>
                    <Col span={6}>
                      <List.Item.Meta
                        avatar={
                          <div className="left-lmg">
                            <Iconfont type="iconhuodong" />
                          </div>
                        }
                        title={<span className="light-color">商品标签名称</span>}
                        description={
                          <span className={('deep-color', styles.boldFont)}>
                            {item.subsLabelName}
                            {item.goodsLabelName}
                          </span>
                        }
                      />
                    </Col>
                    <Col span={2}>
                      <List.Item.Meta
                        title={<span className="light-color">属性值</span>}
                        description={
                          <span className={('deep-color', styles.boldFont)}>
                            {item.goodsLabelValueName}
                          </span>
                        }
                      />
                    </Col>
                    <Col span={4}>
                      <List.Item.Meta
                        title={<span className="light-color">用户标签名称</span>}
                        description={
                          <span className={('deep-color', styles.boldFont)}>
                            {item.subsLabelName}
                            {item.goodsLabelName}
                          </span>
                        }
                      />
                    </Col>
                    <Col span={2}>
                      <List.Item.Meta
                        title={<span className="light-color">属性值</span>}
                        description={
                          <span className={('deep-color', styles.boldFont)}>
                            {item.subsLabelValueName}
                          </span>
                        }
                      />
                    </Col>
                    <Col span={2}>
                      <List.Item.Meta
                        title={<span className="light-color">关联系数</span>}
                        description={<span className="deep-color">{item.relsNum}</span>}
                      />
                    </Col>
                    <Col span={2}>
                      <List.Item.Meta
                        title={<span className="light-color">更新人</span>}
                        description={<span className="light-color">{item.staffName}</span>}
                      />
                    </Col>
                    <Col span={4}>
                      <List.Item.Meta
                        title={<span className="light-color">更新时间</span>}
                        description={<span className="light-color">{item.updateDate}</span>}
                      />
                    </Col>
                    <Col span={2}>
                      <List.Item.Meta
                        description={
                          <Fragment>
                            <a
                              onClick={() => {
                                this.handleEdit(item);
                              }}
                            >
                              编辑
                            </a>
                            <Divider type="vertical" />
                            <a>删除</a>
                          </Fragment>
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              </List.Item>
            )}
          />
        </Card>
        <RelsModal
          modalTitle={modalTitle}
          modalVisible={modalVisible}
          hideModal={this.hideModal}
          curItem={curItem}
          modalType={modalType}
          getRelsList={this.getRelsList}
        />
      </Fragment>
    );
  }
}

export default LabelConfig;

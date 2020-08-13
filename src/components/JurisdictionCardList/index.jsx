/* eslint-disable react/sort-comp */
/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
import { Card, List, Typography, Row, Col, Icon, Popconfirm, message, Input, Button } from 'antd';
import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { connect } from 'dva';
import cardListstyle from '../../common/less/cardListstyle.less';

import AddModal from '../AddKnowledgeModal/AddModal';

const { Paragraph } = Typography;

@connect(({ knowledgeGallery, loading }) => ({
  knowledgeGallery,
  loading: loading.models.knowledgeGallery,
}))
class Components extends Component {
  state = {
    id: '',
    editData: {},
    addModalVisible: false,
    kdbName: '',
    queslike: '',
  };

  componentDidMount() {
    this.getKdbList();
  }

  getKdbList = () => {
    const { kdbName, queslike } = this.state;
    const { dispatch } = this.props;
    dispatch({ type: 'knowledgeGallery/clearList' });
    dispatch({
      type: 'knowledgeGallery/fetchKdbList',
      payload: {
        // count: 8,
        kdbName,
        queslike,
        // isPublic: tabKey,
      },
    });
  };

  handleDeleteAPI = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeGallery/deleteKdb',
      payload: {
        // count: 8,
        kdbId: item.id,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('删除成功');
        this.getKdbList();
      }
    });
  };

  edit = (item) => {
    this.setState({ id: item.id, editData: item, addModalVisible: true });
  };

  closeModal = () => {
    this.setState({
      addModalVisible: false,
      editData: {},
    });
  };

  addOnOk = (obj, okCallBack) => {
    const { dispatch } = this.props;
    const { editData } = this.state;
    if (obj.id) {
      dispatch({
        type: 'knowledgeGallery/editKdb',
        payload: {
          id: obj.id,
          name: obj.name,
          describe: obj.describe,
          createtime: editData.createtime,
          creater: editData.creater,
          updatetime: editData.updatetime,
          updater: editData.updater,
          isdel: editData.isdel,
          isenable: editData.isenable,
          isPublic: editData.isPublic,
        },
      }).then((res) => {
        if (res.msg !== 'success') {
          message.error('修改失败');
        } else if (okCallBack) {
          this.getKdbList();
          okCallBack();
        }
        this.setState({ addModalVisible: false, editData: {} });
      });
    } else {
      dispatch({
        type: 'knowledgeGallery/addKdb',
        payload: {
          name: obj.name,
          describe: obj.describe,
        },
      }).then((res) => {
        if (res.msg !== 'success') {
          message.error('新增失败');
        } else if (okCallBack) {
          this.getKdbList();
          okCallBack();
        }
        this.setState({ addModalVisible: false, editData: {} });
      });
    }
  };

  onSearchKdb = () => {
    this.getKdbList();
  };

  onSearch = () => {
    this.getKdbList();
  };

  onChangeKdb = (e) => {
    this.setState({ kdbName: e.target.value });
  };

  onChange = (e) => {
    this.setState({ queslike: e.target.value });
  };

  share = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: `knowledgeGallery/${item.isPublic === '0' ? 'shareKdb' : 'cancelShareKdb'}`,
      payload: {
        id: item.id,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success(item.isPublic === '0' ? '共享成功' : '取消成功');
        this.getKdbList();
      } else {
        message.error(item.isPublic === '0' ? '共享失败' : '取消失败');
      }
    });
  };

  InputSearchComponents = () => {
    const {
      knowledgeGallery: { kdbList },
    } = this.props;
    const { kdbName, queslike } = this.state;
    return (
      <div className={cardListstyle.searchdiv}>
        <div className={cardListstyle.text}>{`当前数据，${kdbList.length - 1}条`}</div>
        <div>
          <span>知识库查询：</span>
          <Input.Search
            maxLength={200}
            style={{ width: '288px' }}
            placeholder="请输入关键词迅速查知识库"
            onSearch={this.onSearchKdb}
            value={kdbName}
            onChange={(e) => this.onChangeKdb(e)}
          />
          <span style={{ marginLeft: 20 }}>知识点查询：</span>
          <Input.Search
            maxLength={200}
            style={{ width: '288px' }}
            placeholder="请输入知识点迅速查知识库"
            onSearch={this.onSearch}
            value={queslike}
            onChange={(e) => this.onChange(e)}
          />
          <Button
            style={{ marginLeft: 20 }}
            onClick={() => {
              this.setState({ kdbName: '', queslike: '' }, () => this.getKdbList());
            }}
          >
            重置
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const {
      knowledgeGallery: { kdbList },
      loading,
      dispatch,
    } = this.props;
    const { id, editData, addModalVisible } = this.state;
    const addProps = {
      id,
      closeModal: this.closeModal,
      onOk: this.addOnOk,
      editData,
      visible: addModalVisible,
      loading,
    };
    return (
      <div className={cardListstyle.cardList}>
        {this.InputSearchComponents()}
        <List
          rowKey="id"
          grid={{
            gutter: 24,
            lg: 3,
            md: 2,
            sm: 1,
            xs: 1,
          }}
          loading={loading}
          dataSource={kdbList}
          renderItem={(item, index) => {
            return index === 0 ? (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  className={cardListstyle.cardadd}
                  onClick={() => {
                    this.setState({ addModalVisible: true });
                  }}
                >
                  <div style={{ color: 'rgba(0,0,0,0.45)' }}>
                    <Icon type="plus" key="plus" /> 新增知识库
                  </div>
                </Card>
              </List.Item>
            ) : (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  className={cardListstyle.card}
                  onClick={() => {
                    // dispatch(
                    // routerRedux.push('/knowledgebase/customerService'))
                  }}
                  actions={[
                    <div onClick={() => this.edit(item)}>
                      <Icon type="edit" key="edit" />
                      <span className={cardListstyle.btnDescribe}>编辑</span>
                    </div>,
                    <Popconfirm title="确认删除？" onConfirm={() => this.handleDeleteAPI(item)}>
                      <div>
                        <Icon type="delete" key="setting" />
                        <span className={cardListstyle.btnDescribe}>删除</span>
                      </div>
                    </Popconfirm>,
                    <Popconfirm
                      title={`确定要${item.isPublic === '1' ? '取消共享' : '共享'}知识库吗?`}
                      onConfirm={() => this.share(item)}
                    >
                      <div>
                        <Icon type="share-alt" />
                        <span className={cardListstyle.btnDescribe}>
                          {item.isPublic === '1' ? '取消共享' : '共享'}
                        </span>
                      </div>
                    </Popconfirm>,
                  ]}
                >
                  <Card.Meta
                    title={item.name}
                    onClick={() => {
                      dispatch(
                        routerRedux.push({
                          pathname: '/knowledgebase/customerService',
                          query: item,
                          share: false,
                        })
                      );
                    }}
                    description={
                      <div>
                        <Paragraph
                          className={cardListstyle.item}
                          ellipsis={{
                            rows: 3,
                          }}
                        >
                          {item.describe ? `说明:${item.describe}` : '说明：无'}
                        </Paragraph>
                        <Row>
                          <Col span={12}>
                            <div>{`知识条数：${item.quesNum}条`}</div>
                            <div>
                              {item.createtime
                                ? `创建时间：${moment(item.createtime).format('YYYY-MM-DD')}`
                                : '创建时间：暂无'}
                            </div>
                          </Col>
                          <Col span={12}>
                            <div>{`核心词：${item.keywordNum}个`}</div>
                            <div>
                              {item.updatetime
                                ? `最近更新：${moment(item.updatetime).format('YYYY-MM-DD')}`
                                : '最近更新：暂无'}
                            </div>
                          </Col>
                        </Row>
                        <div>{`知识库ID：${item.id}`}</div>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            );
          }}
        />

        {addModalVisible && <AddModal {...addProps} />}
      </div>
    );
  }
}

export default Components;

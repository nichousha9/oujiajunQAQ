import React, { Component } from 'react';
import { Card, List, Icon, Pagination, Avatar, Modal, message, Row } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from './style.less';
import AddModal from './AddModal';
import logo from '../../assets/logo.svg';

const { confirm } = Modal;

@connect(({ robotManagement, loading }) => ({
  ...robotManagement,
  loading: loading.effects['robotManagement/qryRobotList'],
}))
export default class RobotManagement extends Component {
  state = {
    //   id: '',
    editData: {},
    addModalVisible: false,
    pageNumState: 1,
  };

  componentDidMount() {
    this.qryRobotList();
  }

  onChange = pageNumber => {
    this.setState({ pageNumState: pageNumber });
    this.qryRobotList(pageNumber);
  };

  closeModal = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  addOnOk = (obj, okCallBack) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'robotManagement/addRobot',
      payload: obj,
      callback: res => {
        if (res.status === 'OK') {
          if (okCallBack) okCallBack();
          this.setState({ addModalVisible: false });
          this.qryRobotList();
        } else {
          message.error('添加失败');
          this.setState({ addModalVisible: false });
        }
      },
    });
  };

  showConfirm = (e, item) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    confirm({
      title: <p style={{ fontWeight: 'bold' }}>确定要删除{item.robotName}吗?</p>,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'robotManagement/delRobot',
          payload: {
            id: item.id,
          },
        }).then(() => {
          message.success('删除成功');
          dispatch({
            type: 'robotManagement/qryRobotList',
            payload: {
              pageInfo: {
                pageNum: 1,
                pageSize: 11,
              },
            },
          });
        });
      },
      onCancel() {},
    });
  };

  qryRobotList = (pageNum = 1) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'robotManagement/qryRobotList',
      payload: {
        pageInfo: {
          pageNum,
          pageSize: 11,
        },
      },
    });
  };

  render() {
    const { addModalVisible, editData, pageNumState } = this.state;
    const { dispatch, list = [], pageNum, total } = this.props;
    const addProps = {
      closeModal: this.closeModal,
      onOk: this.addOnOk,
      editData,
      visible: addModalVisible,
    };
    return (
      <div className={styles.cardList}>
        <Row>
          <List
            rowKey="id"
            grid={{
              gutter: 24,
              lg: 4,
              md: 2,
              sm: 1,
              xs: 1,
            }}
          >
            {pageNumState === 1 ? (
              <List.Item key="ce0" style={{ padding: '10px 10px 0px 10px' }}>
                <Card
                  hoverable
                  className={styles.cardadd}
                  onClick={() => {
                    this.setState({ addModalVisible: true });
                  }}
                >
                  <Icon type="plus" key="plus" style={{ fontSize: 50 }} />
                  <p>新增机器人</p>
                </Card>
              </List.Item>
            ) : null}

            {list.map(item => (
              <List.Item key={item.id} style={{ padding: 10 }}>
                <Card
                  hoverable
                  className={styles.card}
                  onClick={() => {
                    dispatch(
                      routerRedux.push({
                        pathname: '/robotManagement/robotConfiguration',
                        query: item,
                      })
                    );
                  }}
                >
                  <Card.Meta
                    avatar={<Avatar src={logo} />}
                    title={item.robotName}
                    description={
                      <div className={styles.cardtext}>
                        <Icon
                          type="delete"
                          key="setting"
                          className={styles.carddelete}
                          onClick={e => this.showConfirm(e, item)}
                        />
                        <p
                          style={{
                            width: '85%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {`说明：${item.robotApply}`}
                        </p>
                        <p>{item.id ? `编码：${item.id}` : '编码：暂无'}</p>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            ))}
          </List>
          {addModalVisible && <AddModal {...addProps} />}
        </Row>

        <Row
          style={{
            position: 'absolute',
            right: 50,
            top: '90%',
          }}
        >
          <Pagination
            style={{ float: 'right' }}
            showQuickJumper
            current={pageNum}
            defaultPageSize={11}
            total={total}
            onChange={this.onChange}
          />
        </Row>
      </div>
    );
  }
}

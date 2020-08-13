/* eslint-disable react/sort-comp */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/alt-text */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { message, Modal } from 'antd';
import styles from './CreateTenant.less';

import defaultPic from '../../assets/error.jpg';
import TenantModal from './TenantModal';

const confirm = Modal.confirm;

@connect((props) => {
  const {
    createtenant,
    loading,
    global: { owner = {} },
  } = props;
  return {
    createtenant,
    owner,
    submitting: loading.effects['createtenant/getUserOwer'],
    deleting: loading.effects['createtenant/deleteUserOwer'],
    switching: loading.effects['createtenant/switchUserOwer'],
  };
})
export default class CreateTenant extends PureComponent {
  state = {
    modalVisible: false,
  };

  curTenant = {};

  componentDidMount() {
    this.loadTenant();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.deleting && !nextProps.deleting) {
      if (nextProps.createtenant.status === 'OK') {
        message.success('删除成功！');
        this.loadTenant();
      } else {
        message.error('删除失败，请重试！');
      }
    }
    if (this.props.switching && !nextProps.switching) {
      const currentTenant = this.props.createtenant.currentTenant || {};
      const _this = this.props;
      if (nextProps.createtenant.switchSuc === 'OK') {
        // 存入
        this.setCurrentOwner(currentTenant);
        // setCurrentOwer(currentTenant);
        this.props.dispatch(routerRedux.push('/'));
      } else if (nextProps.createtenant.switchSuc === 'TENANT_STATUS_READY') {
        const that = this;
        const nextOwner = that.nextOwner;
        const text = `当前租户在（${currentTenant.tenantname}）坐席就绪或对话未结束，不能切换租户，点击确定进入租户（${nextOwner.tenantname}）修改为未就绪或结束对话`;
        confirm({
          title: text,
          okText: '确定',
          cancelText: '取消',
          onOk() {
            that.setCurrentOwner(nextOwner);
            _this.dispatch(routerRedux.push('/'));
          },
        });
      } else {
        message.error('进入租户失败，请尝试重新登录！');
      }
    }
  }

  loadTenant = () => {
    // 获取租户列表
    this.props.dispatch({
      type: 'createtenant/getUserOwer',
    });
  };
  // 点击删除
  handleDelete = (id) => {
    const _this = this.props;
    confirm({
      title: '确定删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        _this.dispatch({
          type: 'createtenant/deleteUserOwer',
          payload: {
            id,
          },
        });
      },
    });
  };
  // 点击提交
  handleOk = (status) => {
    if (status === 'OK') {
      message.success('操作成功！');
      this.loadTenant();
    }
  };
  // 点击修改
  handleModify = (tenant) => {
    this.operType = 'modify';
    this.curTenant = tenant;
    this.showModal();
  };
  // 点击新增
  handlAdd = () => {
    this.operType = 'new';
    this.curTenant = {};
    this.showModal();
  };
  // 点击进入租户页面
  handleSwitch = (tenant) => {
    this.props.dispatch({
      type: 'createtenant/switchUserOwer',
      payload: {
        id: tenant.id,
      },
    });
    this.nextOwner = tenant;
  };
  // 弹窗控制
  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };
  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };
  setCurrentOwner = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/saveOwnerInfo',
      payload: data,
    });
  };

  renderTenantList = () => {
    const { tenantList } = this.props.createtenant;
    const tList = [];
    for (const tenant of tenantList) {
      tList.push(
        <div className={styles.divideCard} key={tenant.id}>
          <div className={styles.card}>
            <img
              src={tenant.logourl ? tenant.logourl : defaultPic}
              onClick={() => this.handleSwitch(tenant)}
            />

            <div className={styles.toolDiv}>
              <span>{tenant.tenantname}</span>
              <div>
                <i className="iconfont" onClick={() => this.handleModify(tenant)}>
                  &#xe61b;
                </i>
                <i className="iconfont" onClick={() => this.handleDelete(tenant.id)}>
                  &#xe618;
                </i>
              </div>
            </div>
            <div className={styles.toolDivBG} />
          </div>
        </div>
      );
    }
    tList.push(
      <div className={styles.divideCard} key={0}>
        <div className={styles.addCard} onClick={() => this.handlAdd()}>
          <div>
            <i className="iconfont">&#xe616;</i>
            <span>租户创建</span>
          </div>
        </div>
      </div>
    );
    return tList;
  };
  nextOwner = {};
  render() {
    const { modalVisible } = this.state;
    const modalProps = {
      visible: modalVisible,
      closeModal: this.closeModal,
      onOk: this.handleOk,
      curTenant: this.curTenant,
      operType: this.operType,
    };
    return (
      <Fragment>
        <div>{this.renderTenantList()}</div>
        {modalVisible && <TenantModal {...modalProps} />}
      </Fragment>
    );
  }
}

import React from 'react';
import {connect}from 'dva';
import {Row, Col, List, Button, Divider, Pagination, message, Modal} from 'antd';
import {addEvent, removeEvent, getLayoutHeight}  from '../../../utils/eventUtils';
import {deleteEntity} from "../../../services/sceneApiList";
import {formatDatetime}  from '../../../utils/utils'
import { getResMsg } from '../../../utils/codeTransfer';
import AddSceneEntityModal  from '../AddSceneEntityModal';
import styles from './index.less';

@connect((props) => {
  const {loading, sceneEntity} = props;
  return {
    sceneEntity,
    loading: loading.models.sceneEntity,
  }
})

export default class sceneEntity extends React.Component {
  state = {
    sceneEntityList: {},// 表的数据
    addVisible: false,
    alterEntity: {},
    sysEntityList:[],
  };

  componentDidMount() {
    addEvent(window, 'resize', this.render.bind(this));
    this.loadTabList();
  };

  componentWillReceiveProps(nextProps) {
    const {sceneEntity: {sceneEntityList,sysEntityList}} = nextProps;
    if (JSON.stringify(sceneEntityList) !== JSON.stringify(this.state.sceneEntityList)) {
      this.setState({sceneEntityList})
    }
    if (JSON.stringify(sysEntityList) !== JSON.stringify(this.state.sysEntityList)) {
      this.setState({sysEntityList})
    }
  };

  componentWillUnmount() {
    removeEvent(window, 'resize', this.render);
  };

  // 删除
  onDelete = (id) => {
    if (!id) return;
    const that = this;
    const {sceneId} = this.props;
    Modal.confirm({
      title: '确认删除？',
      okText: "确认",
      cancelText: "取消",
      onOk() {
        deleteEntity({sceneid: sceneId, entityid: id}).then((res) => {
          if (res.status === 'OK') {
            message.success('删除成功');
            that.loadTabList();
          } else {
            message.error('删除失败！');
          }
        });
      },
    });
  };


  static getTypeTxt(key) {
    switch (key) {
      case '001':
        return '系统内键';
      case '002':
        return '用户自定义';
      case '003':
        return '知识图谱';
      case '004':
        return '外部知识';
      default:
        return '';
    }
  }

  loadTabList(page, pageSize) {
    const {dispatch, sceneId: sceneid} = this.props;
    dispatch({
      type: 'sceneEntity/fetchSceneEntityList',
      payload: {
        sceneid,
        p: page || 1,
        ps: pageSize || 10,
      },
    });
    dispatch({
      type: 'sceneEntity/fetchSceneSysEntityList',
    })
  };

  handleGetPagination = (pagination) => {
    if (!pagination) return false;
    if (!(Object.keys(pagination) || []).length) return false;
    return {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: () => {
        // const totalHtml = (
        //   <div className='totalPage' style={{float: 'left'}}>
        //     {`共${total}条记录 第${pagination.current}/${pagination.totalPages}页`}
        //   </div>
        // )
        return (
          <div />
        );
      },
      ...pagination,
    }
  };

  showAddModal = (item = {}) => {
    this.setState({
      alterEntity: item,
      addVisible: true,
    })
  };

  // 添加成功回调
  addOnOk = (obj, okCallBack) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sceneEntity/fetchSaveSceneEntity',
      payload: obj,
    }).then((res) => {
      if(!res) return;
      if(res && res.status==='OK'){
        if (okCallBack) okCallBack();
        this.loadTabList();
        this.closeModal();
        return;
      }
      message.error(getResMsg(res.msg));
    })
  };

  closeModal = () => {
    this.setState({
      addVisible: false,
    })
  };

  render() {
    const {loading, sceneId} = this.props;
    const {sceneEntityList,sysEntityList, alterEntity, addVisible} = this.state;
    const pagination = {
      onChange: (page, pageSize) => {
        this.loadTabList(page, pageSize);
      },
      ...this.handleGetPagination(sceneEntityList.pagination),
    };

    const addEntityPros = {
      loading,
      sceneId,
      alterEntity,
      sysEntityList,
      visible: addVisible,
      onOk: this.addOnOk,
      closeModal: this.closeModal,
    };
    const split = true;
    return (
      <div style={{marginTop: 20, marginBottom: 20}}>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={24} sm={24}>
            <p className={styles.p} onClick={() => this.showAddModal()}> + 添加</p>
          </Col>
        </Row>
        <div style={{height: getLayoutHeight(400), overflowY: 'scroll', overflowX: 'hidden'}}>
          <List
            className={styles.list}
            itemLayout="vertical"
            size="default"
            loading={loading}
            split={split}
            dataSource={sceneEntityList.list}
            renderItem={item => (
              <List.Item>
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                  <Col md={2}>
                    <div>{item.code}</div>
                  </Col>
                  <Col md={10}>
                    <p className={styles.name}>{item.code}</p>
                    <p>{item.info}</p>
                  </Col>
                  <Col md={3}>
                    <p>类型</p>
                    <p>{sceneEntity.getTypeTxt(item.type)}</p>
                  </Col>
                  <Col md={4}>
                    <p>创建时间</p>
                    <p> {formatDatetime(item.createTime)}</p>
                  </Col>
                  <Col md={5}>
                    <Button
                      loading={loading}
                      className={styles.button}
                      onClick={
                        () => {
                          this.showAddModal(item);
                        }}
                    >
                      编辑
                    </Button>
                    <Divider className={styles.divi} type="vertical" />
                    <Button
                      loading={loading}
                      className={styles.button}
                      onClick={
                        () => {
                          this.onDelete(item.id);
                        }}
                    >
                      删除
                    </Button>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </div>
        <Pagination className={styles.pagination} {...pagination} />
        {addVisible && <AddSceneEntityModal {...addEntityPros} /> }
      </div>
    );
  }
}

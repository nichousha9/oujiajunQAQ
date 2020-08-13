/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import {connect} from 'dva';
import {Row, Col, Divider, Switch, message, Modal} from 'antd';
import classnames from 'classnames';
import {addEvent, removeEvent} from '../../../utils/eventUtils';
import AddSceneDialogModal from '../AddSceneDialogModal';
import  CommonList from '../../../components/CommonList';
import  CommonButton from '../../../components/CommonButton';
import  CommonAddNew from '../../../components/CommonAddNew';
import {formatDatetime } from '../../../utils/utils';
import styles from './index.less'

const senceIcon = require('../../../assets/senceIcon.png');

@connect((props) => {
  const {loading, sceneDialog} = props;
  return {
    sceneDialog,
    loading: loading.models.sceneDialog,
  }
})

export default class SceneDialog extends React.Component {
  state = {
    sceneDialogList: {},// 表的数据
    dialogId: '',
    editData:{}, // 场景对的对象
    addVisible: false,
  };

  componentDidMount() {
    addEvent(window, 'resize', this.render.bind(this));
    this.loadTabList();
  };

  componentWillReceiveProps(nextProps) {
    const {sceneDialog: {sceneDialogList}} = nextProps;
    if (JSON.stringify(sceneDialogList) !== JSON.stringify(this.state.sceneDialogList)) {
      this.setState({sceneDialogList})
    }
  };

  componentWillUnmount() {
    removeEvent(window, 'resize', this.render);
  };

  // 删除
  onDelete = (id) => {
    if (!id) return;
    const that = this;
    Modal.confirm({
      title: '确认删除？',
      okText: "确认",
      cancelText: "取消",
      onOk() {
        const { dispatch } = that.props;
        dispatch({
          type:'sceneDialog/fetchDeleteSceneDialog',
          payload:{id},
        }).then((res)=>{
          if(res && res.status==='OK'){
            message.success('删除成功');
            that.loadTabList();
            return;
          }
          message.error('删除失败');
        })
      },
    });
  };

  setAble(isChecked, record) {
    const { dispatch } = this.props;
    dispatch({
      type:'sceneDialog/fetchSetAbleSceneDialog',
      payload:{
        ablevalue: isChecked,
        id:record.id,
      },
    }).then((res)=>{
        if(res && res.status === 'OK') {
          message.success(isChecked ? '开启成功' : '禁用成功');
          this.loadTabList();
          return;
        }
      message.error(isChecked ? '开启失败' : '禁用失败');
    })
  };

  loadTabList=(page)=> {
    const {dispatch, sceneId} = this.props;
    const {pagination = {}} = this.tableRef || {};
    dispatch({
      type: 'sceneDialog/fetchSceneDialogList',
      payload: {
        sceneid:sceneId,
        p: page || 0,
        ps: pagination.pageSize || 10,
      },
    })
  };
  showAddModal = (editData={}) => {
    this.setState({
      editData,
      addVisible: true,
    })
  };

  // 添加成功回调
  addOnOk = (obj, okCallBack) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sceneDialog/fetchSaveScene',
      payload: obj,
    }).then(() => {
      if (okCallBack) okCallBack();
      this.loadTabList();
      this.closeModal();
    })
  };

  closeModal = () => {
    this.setState({
      addVisible: false,
    })
  };


  listRenderItem = (item = {},index,loading) => {
    const { showSetting } = this.props;
    return (
      <Row gutter={{md: 8, lg: 24, xl: 48}}>
        <Col md={2}>
          {/* 原型上是图片 */}
          <div style={{height:48,width:48}} className={classnames(index%2===0 ? 'bgOdd':'bgEvent','contentCenter','borderRadius4')}>
            <img style={{height:26,width:26}} src={senceIcon} />
          </div>
        </Col>
        <Col md={10}>
          <p className={styles.name}>{item.name}</p>
          <p>{item.descript || '我是默认的场景描述'}</p>
        </Col>
        <Col md={3}>
          <p>状态</p>
          <Switch
            size="small"
            onChange={(ischecked) => {
              this.setAble(ischecked, item);
            }}
            checked={item.isEnable === '1'}
          />
        </Col>
        <Col md={4}>
          <p>创建时间</p>
          <p>{formatDatetime(item.updateTime)}</p>
        </Col>
        <Col md={5}>
          <CommonButton onClick={() => {showSetting(item)}} loading={loading} className={styles.button}>
            配置
          </CommonButton>
          <Divider className={styles.divi} type="vertical" />
          <CommonButton
            loading={loading}
            className={styles.button}
            onClick={() => {
              this.showAddModal(item);
            }}
          >
            编辑
          </CommonButton>
          <Divider className={styles.divi} type="vertical" />
          <CommonButton
            loading={loading}
            className={styles.button}
            onClick={() => {
              this.onDelete(item.id);
            }}
          >
            删除
          </CommonButton>
        </Col>
      </Row>
    )
  }
  tableRef;

  render() {
    const {loading, sceneId} = this.props;
    const {sceneDialogList, dialogId, addVisible,editData} = this.state;
    const addDialogPros = {
      loading,
      sceneId,
      id: dialogId,
      visible: addVisible,
      onOk: this.addOnOk,
      closeModal: this.closeModal,
      editData,
    };

    return (
      <div style={{marginTop: 20, marginBottom: 20}}>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={24} sm={24}>
            <CommonAddNew className="margin-bottom-10" onClick={this.showAddModal} />
          </Col>
        </Row>
        <CommonList
          ref={(ele)=>{this.tableRef = ele}}
          listChange={this.loadTabList}
          pagination={sceneDialogList.pagination}
          className={styles.list}
          itemLayout="vertical"
          size="default"
          loading={loading}
          dataSource={sceneDialogList.list}
          renderItem={this.listRenderItem}
        />
        {addVisible && <AddSceneDialogModal {...addDialogPros} /> }
      </div>
    );
  }
}

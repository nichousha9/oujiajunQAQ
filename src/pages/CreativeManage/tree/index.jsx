/* eslint-disable no-console */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, message, Modal, Button, Spin } from 'antd';
import SearchTree from '@/components/SearchTree/index';
import Add from './add';
import Update from './update';
import styles from '../index.less';

@connect(({ loading }) => ({
  loadingCopy: loading.effects['creativeIdeaManage/copyAdviceType'],
  loadingMove: loading.effects['creativeIdeaManage/changeAdviceType'],
}))
class LeftTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      treeObj: {},
      addVisible: false,
      updateVisible: false,
      deleteVisible: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'creativeIdeaManage/qryMessageFolder',
      payload: {},
    }).then(res => {
      this.setState({
        loading: false,
      });
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.handleTreeData(res.svcCont.data);
      } else {
        message.error('请求接口错误');
      }
    });
  };

  // 处理返回的目录数组
  handleTreeData = data => {
    const { messageTable } = this.props;
    const len = data.length;
    const treeArr = data.map(item => ({
      title: item.adviceTypeSortName, // 目录的名称
      key: item.adviceTypeSortId, // 目录的ID
      comments: item.adviceTypeSortName, // 目录的描述
      pathCode: item.pathCode,
      pathCodeLen: item.pathCode.split('.').length,
      parentKey: item.parentAdviceTypeSortId, // 父目录的ID
      children: [],
      used: false,
      statusCd: item.statusCd, // 目录的状态
      curItem: {}, // 当前选择的目录
      labelType: item.labelType,
      adviceCatg: item.adviceCatg,
      spId: item.spId,
    }));
    const newArr = [];
    const getChild = (node, index) => {
      // 拿到当前节点的子节点
      if (index === len - 1) {
        return;
      }
      for (let i = 0; i < len; i += 1) {
        // 如果当前节点的路径长度大于 node 且 parentKey = node.key 那么它就是 node 的子元素
        if (
          treeArr[i].pathCodeLen > node.pathCodeLen &&
          treeArr[i].parentKey === node.key &&
          !treeArr[i].used
        ) {
          node.children.push(treeArr[i]);
          treeArr[i].used = true;
          getChild(treeArr[i], i);
        }
      }
    };
    for (let i = 0; i < len; i += 1) {
      if (treeArr[i].pathCodeLen === 1) {
        newArr.push(treeArr[i]);
        treeArr[i].used = true;
        getChild(treeArr[i], i);
      }
    }

    this.setState({
      treeData: newArr,
    });
    messageTable(newArr[0]); // 通知表格更新
  };

  // 添加
  addCallBack = () => {
    this.setState({
      addVisible: true,
    });
  };

  // 编辑
  editCallBack = () => {
    this.setState({
      updateVisible: true,
    });
  };

  // 删除
  deleteCallBack = () => {
    console.log(123);
    this.setState({
      deleteVisible: true,
    });
  };

  // 选中目录节点
  onSelectCallBack = key => {
    const { treeData } = this.state;
    const { messageTable } = this.props;
    const findData = list => {
      let data = {};
      for (let i = 0; i < list.length; i += 1) {
        if (Number(list[i].key) === Number(key)) {
          data = list[i];
          break;
        }
        if (list[i].children && list[i].children.length > 0) {
          data = findData(list[i].children);
          if (Object.keys(data).length !== 0) {
            break;
          }
        }
      }
      return data;
    };
    const tree = findData(treeData);
    this.setState({
      treeObj: tree,
    });
    messageTable(tree); // 通知表格更新
  };

  // 确定删除
  okDelete = () => {
    console.log(12345);
    const { treeObj } = this.state;
    const { dispatch } = this.props;
    const params = {
      adviceTypeSortId: treeObj.key,
    };
    dispatch({
      type: 'creativeIdeaManage/delAdviceTypeSort',
      payload: params,
    }).then(res => {
      this.setState({
        deleteVisible: false,
      });
      console.log(res);
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success('话术目录删除成功');
        console.log(123);
        this.getData();
      } else {
        message.error(res.topCont.remark);
      }
    });
  };

  // 关闭弹窗
  closeModalCancel = () => {
    this.setState({
      addVisible: false,
      updateVisible: false,
      deleteVisible: false,
    });
  };

  render() {
    const { treeData, treeObj, addVisible, updateVisible, deleteVisible, loading } = this.state;
    const treeProps = {
      treeData,
      defaultSelectedKeys: [String(treeData[0] && treeData[0].key)],
      add: true,
      edit: true,
      del: true,
      addCallBack: this.addCallBack,
      editCallBack: this.editCallBack,
      deleteCallBack: this.deleteCallBack,
      onSelectCallBack: this.onSelectCallBack,
    };
    return (
      <div className={styles.treeMain}>
        <Card size="small" title="话术目录">
          <Spin spinning={loading} tip="Loading...">
            <SearchTree {...treeProps} />
          </Spin>
        </Card>
        <Modal title="新增节点" visible={addVisible} onCancel={this.closeModalCancel} footer={null}>
          <Add treeObj={treeObj} getData={this.getData} closeModalCancel={this.closeModalCancel} />
        </Modal>
        <Modal
          title="修改节点"
          visible={updateVisible}
          onCancel={this.closeModalCancel}
          closeModalCancel={this.closeModalCancel}
          footer={null}
        >
          <Update
            treeObj={treeObj}
            getData={this.getData}
            closeModalCancel={this.closeModalCancel}
          />
        </Modal>
        <Modal
          title="删除节点"
          visible={deleteVisible}
          width="348px"
          centered
          onCancel={this.closeModalCancel}
          footer={
            <div>
              <Button type="primary" onClick={this.okDelete}>
                确认
              </Button>
              <Button onClick={this.closeModalCancel}>取消</Button>
            </div>
          }
        >
          确认是否删除当前标签目录？
        </Modal>
      </div>
    );
  }
}

export default LeftTree;

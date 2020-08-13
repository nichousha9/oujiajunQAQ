/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'dva';
// import { formatMessage } from 'umi-plugin-react/locale';
import { message, Modal, Button } from 'antd';
import styles from './index.less';
import SearchTree from '@/components/SearchTree/index';

@connect(({ loading }) => ({
  loadingCopy: loading.effects['creativeIdeaManage/copyAdviceType'],
  loadingMove: loading.effects['creativeIdeaManage/changeAdviceType'],
}))
class TreeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      returnedTreeData: [],
      curNode: {},
    };
  }

  componentWillMount() {
    this.getTreeData();
  }

  componentWillReceiveProps(old) {
    if (old.visible) {
      this.getTreeData();
    }
  }

  // 获取树状目录的数据
  getTreeData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'creativeIdeaManage/qryMessageFolder',
      payload: {},
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // const rootElement = res.svcCont.data.find(tree => tree.pathCode.indexOf('.') === -1);
        this.handleTreeData(res.svcCont.data);
        this.setState({
          returnedTreeData: res.svcCont.data,
          //   defaultSelectedKeys: rootElement ? [String(rootElement.adviceTypeSortId)] : [],
        });
      }
    });
  };

  // 处理返回的目录数组
  handleTreeData = data => {
    const len = data.length;
    const treeArr = data.map(item => ({
      title: item.folderName, // 目录的名称
      key: item.folderId, // 目录的ID
      comments: item.folderName, // 目录的描述
      pathCode: item.pathCode,
      pathCodeLen: item.pathCode.split('.').length,
      parentKey: item.parentFolderId, // 父目录的ID
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
  };

  // 点击确定按钮
  handleOk = () => {
    const { dispatch, changeVisible, type, record } = this.props;
    const { curNode } = this.state;
    console.log(record);
    const { adviceId, folderId } = record;
    let name;
    if (type === 'copy') {
      if (record.templateInfoType == null || record.templateInfoType === '1') {
        name = 'addCopyCreativeInfo';
      } else {
        name = 'copyAdviceType';
      }
    } else if (type === 'move') {
      if (record.templateInfoType == null || record.templateInfoType === '1') {
        name = 'operatorAdviceTypeEdit';
      } else {
        name = 'changeAdviceType';
      }
    }
    dispatch({
      type: `creativeIdeaManage/${name}`,
      payload: {
        ...record,
        ...curNode,
        templateInfoType: record.templateInfoType == 1 ? null : record.templateInfoType,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        if (changeVisible) changeVisible(false);
        message.success(`${type === 'copy' ? '复制' : '移动'}成功！`);
      }
    });
  };

  // 隐藏添加、编辑标签对话框
  handleCancel = () => {
    const { changeVisible } = this.props;
    if (changeVisible) changeVisible(false);
  };

  // 获取pathCode
  getNode = key => {
    const { returnedTreeData } = this.state;
    const thisTree = returnedTreeData.find(tree => Number(tree.folderId) === Number(key));
    return thisTree;
  };

  // 在目录树内选择某一个目录的回调函数
  onSelectCallBack = key => {
    const node = this.getNode(key);
    this.setState({
      curNode: node,
    });
    console.log(node);
  };

  render() {
    const { treeData } = this.state;
    const { visible } = this.props;
    const treeProps = {
      treeData,
      onSelectCallBack: this.onSelectCallBack,
    };

    return (
      <Modal
        title="目录"
        visible={visible}
        onCancel={this.handleCancel}
        footer={
          <div className={styles.modalFooter}>
            <Button type="primary" onClick={this.handleOk}>
              确认
            </Button>
            <Button onClick={this.handleCancel}>取消</Button>
          </div>
        }
      >
        <SearchTree {...treeProps} showButtons={false} />
      </Modal>
    );
  }
}

export default TreeModal;

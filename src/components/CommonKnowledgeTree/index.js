import React from 'react';
import { Tree, Icon, Input, message, Popover, Modal } from 'antd';
import classnames from 'classnames';
import { saveCate, deleteCate } from '../../services/api';
import { getResMsg } from '../../utils/codeTransfer';
import './index.less';

const TreeNode = Tree.TreeNode;

export default class CommonKnowledgeTree extends React.Component {
  state = {
    addNewEmpty: false, // 添加一级节点
    hasInput: false,
    selectedKeys: [],
    expandedKeys: [], // 展开的节点
    treeData: this.props.treeData, // 树节点数据
  };
  componentWillReceiveProps(nextProps) {
    const { treeData } = nextProps;
    // 当前的树只根据自己的状态刷新
    if (JSON.stringify(treeData) !== JSON.stringify(this.state.treeData)) {
      const treeInfor = JSON.parse(localStorage.getItem('treeInfor')) || {};
      this.selectedNode = this.props.defaultSelectCate; // 当前选中的Node
      this.setState({
        treeData,
        selectedKeys: treeInfor.selectedKeys || [treeData && treeData[0].id] || [],
        expandedKeys: treeInfor.expandedKeys || [treeData[0].id] || [],
      });
    }
  }
  onSelect = (keys, info) => {
    const { onSelectCallBack } = this.props;
    // 当属没有选中的时候不给操作
    if (keys.length) {
      this.selectedNode = info.node.props;
      this.selectedCate = info.node.props.code;
      this.selectedCateId = info.node.props.id;
      this.setState({ selectedKeys: keys }, () => {
        if (onSelectCallBack) onSelectCallBack();
      });
    }
  };
  onExpand = keys => {
    this.setState({ expandedKeys: keys });
  };
  // 修改树节点
  editTreeNode = (e, node) => {
    const { addEditTreeNode } = this.props;
    if (addEditTreeNode) {
      addEditTreeNode(node);
      return;
    }
    const { hasInput } = this.state;
    if (hasInput) {
      message.error('存在未保存的节点');
      return;
    }
    const { id } = node;
    if (!id) return;
    this.setState({ hasInput: true, treeData: this.handleEditNode(id, null, 'edit') }, () => {
      const { updateTree } = this.props;
      if (updateTree) updateTree(this.state.treeData);
    });
  };
  clearInputNode = (treeData, node) => {
    if (node.id) {
      return treeData.map(item => {
        if (item.type === 'input') {
          delete item.type;
          return item;
        }
        if (item.children && item.children.length > 0) {
          item.children = this.clearInputNode(item.children, node);
        }
        return item;
      });
    } else {
      return treeData.filter(item => {
        if (item.type === 'input') {
          return false;
        }
        if (item.children && item.children.length > 0) {
          item.children = this.clearInputNode(item.children, node);
        }
        return true;
      });
    }
  };
  saveTreeNode = (e, node) => {
    const { kdbid } = this.props;
    // 没有节点名称不给保存 ；
    if (!e.target.value) {
      message.error('请填写节点名称');
      const { updateTree } = this.props;
      // 去掉input框
      this.setState(
        { treeData: this.clearInputNode(this.state.treeData, node), hasInput: false },
        () => {
          if (updateTree) updateTree(this.state.treeData);
        }
      );
      return;
    }
    let obj = {};
    if (node.id) {
      obj = {
        cate: e.target.value,
        kdbid,
        id: node.id,
      };
      // 具体保存添加节点
    }
    if (!node.id) {
      // 新增树节点;
      obj = {
        cate: e.target.value,
        kdbid,
        pcateid: node.pcateid,
      };
    }
    saveCate(obj).then(res => {
      if (!node.id) {
        // 将原来的null id 的节点替换成新的节点
        this.setState({ hasInput: false, treeData: this.replaceNewNode(node, res.data) }, () => {
          const { updateTree } = this.props;
          if (updateTree) updateTree(this.state.treeData);
          message.success('操作成功');
        });
      }
      if (node.id) {
        // 将原来的节点的cate修改了
        this.setState(
          { hasInput: false, treeData: this.editOldNode(obj, null, null, obj.cate, 'edit') },
          () => {
            message.success('操作成功');
            const { updateTree } = this.props;
            if (updateTree) updateTree(this.state.treeData);
          }
        );
      }
    });
  };
  // 替换掉原有的树节点
  replaceNewNode = (node, newChild, data) => {
    const { addEditTreeNode } = this.props;
    const treeData = data || this.state.treeData;
    if ((node.pcateid == '0' || !node.pcateid) && !node.id) {
      return [...treeData, newChild];
    }
    return treeData.map(item => {
      if (item.id === node.pcateid) {
        if (addEditTreeNode) {
          if (item.children) {
            item.children = [...item.children, newChild];
          } else {
            item.children = [];
            item.children.push(newChild);
          }
          return item;
        }
        item.children = (item.children || []).map(child => {
          if (!child.id) {
            return newChild;
          }
          return child;
        });
        return item;
      }
      if (item.children) {
        item.children = this.replaceNewNode(node, newChild, item.children);
        return item;
      }
      return item;
    });
  };
  editOldNode = (node, data) => {
    const treeData = data || this.state.treeData;
    return treeData.map(item => {
      if (item.id === node.id) {
        item = { ...node };
        item.type = '';
        return item;
      }
      if (item.children) {
        item.children = this.editOldNode(node, item.children);
        return item;
      }
      return item;
    });
  };
  // 删除 node
  deleteNodeData = (node, data) => {
    const treeData = data || this.state.treeData;
    return treeData.filter(item => {
      if (item.id === node.id) {
        return false;
      }
      if (item.children) {
        item.children = this.deleteNodeData(node, item.children);
        return true;
      }
      return true;
    });
  };
  // 遍历树节点
  handleEditNode = (key, data, type, changeNode) => {
    // type
    if (!key || !type) return;
    const treeData = data || this.state.treeData;
    // edit是修改数据
    return treeData.map(item => {
      if (item.id === key) {
        type === 'edit' ? (item.type = 'input') : (item = changeNode);
        return item;
      }
      if (item.children) {
        item.children = this.handleEditNode(key, item.children, type, changeNode);
        return item;
      }
      return item;
    });
  };
  // 新增树节点
  addTreeNode = item => {
    const { addEditTreeNode } = this.props;
    if (addEditTreeNode) {
      addEditTreeNode(item, true);
      return;
    }
    const { hasInput } = this.state;
    if (hasInput) {
      message.error('存在未保存的节点');
      return;
    }
    const obj = {
      cate: '',
      id: '',
      type: 'input',
      isdel: 'undel',
      isenable: 'enable',
      kdbid: item.kdbid,
      pcateid: item.id,
    };
    if (item.children && item.children.length > 0) {
      item.children.push(obj);
    } else {
      item.children = [obj];
    }
    // 设置新的节点
    const { expandedKeys } = this.state;
    expandedKeys.push(item.id);
    this.setState(
      {
        expandedKeys,
        hasInput: true,
        treeData: this.handleEditNode(item.id, null, 'add', item),
      },
      () => {
        const { updateTree } = this.props;
        if (updateTree) updateTree(this.state.treeData);
      }
    );
  };
  // 删除树节点
  deleteTreeNode = item => {
    if (!item.id) return;
    const that = this;
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        deleteCate({ id: item.id }).then(res => {
          if (res.status === 'OK') {
            const newTreeData = that.deleteNodeData(item);
            that.selectedNode = {
              ...newTreeData[0],
              dataRef: newTreeData[0],
            };
            that.selectedCate = newTreeData[0].code;
            that.selectedCateId = newTreeData[0].id;
            that.setState(
              {
                treeData: newTreeData || [],
                selectedKeys: [(newTreeData[0] || {}).id || ''],
              },
              () => {
                const { updateTree, onSelectCallBack } = that.props;
                if (updateTree) updateTree(that.state.treeData);
                if (onSelectCallBack) onSelectCallBack();
                message.success('操作成功');
              }
            );
          } else {
            message.error(getResMsg(res.msg));
          }
        });
      },
    });
  };
  addNewEmptyNode = () => {
    const { addEditTreeNode } = this.props;
    if (addEditTreeNode) {
      addEditTreeNode({}, true);
      return;
    }
    this.setState({ addNewEmpty: true });
  };
  
  addNodeLevelOne = e => {
    const { kdbid } = this.props;
    if (!e.target.value) {
      message.error('请填写节点名称');
      this.setState({ addNewEmpty: false });
      return;
    }
    // 新增树节点;
    const obj = {
      cate: e.target.value,
      kdbid,
    };
    saveCate(obj).then(res => {
      if (res && res.status === 'OK') {
        const { treeData } = this.state;
        this.setState({ addNewEmpty: false, treeData: [...treeData, res.data] });
        message.success('添加成功');
      }
    });
  };
  // 渲染树节点
  renderTreeNodes = data => {
    const { treeData, editFlag } = this.props;
    let { selectedKeys } = this.state;
    selectedKeys =
      selectedKeys.length > 0 ? selectedKeys : treeData && treeData[0] && [treeData[0].id];

    return data.map((item = {}) => {
      // 是启用而且没有配删除的
      if (item.isenable !== '0' && item.isdel !== '1') {
        let title; // 树节点的显示
        if (item.type === 'input') {
          title = (
            <div>
              <span>
                <Input
                  defaultValue={item.cate}
                  autoFocus
                  placeholder="请输入节点名称"
                  onBlur={e => {
                    this.saveTreeNode(e, item);
                  }}
                />
              </span>
            </div>
          );
        } else {
          title = (
            <div>
              <a className="margin-right-10">
                <Icon
                  type="edit"
                  onClick={e => {
                    this.editTreeNode(e, item);
                  }}
                />
              </a>
              <a className="margin-right-10">
                <Icon
                  type="plus-circle-o"
                  onClick={() => {
                    this.addTreeNode(item);
                  }}
                />
              </a>
              {(!item.children || (item.children && item.children.length === 0)) && (
                <a className="margin-right-10">
                  <Icon
                    type="delete"
                    onClick={() => {
                      this.deleteTreeNode(item);
                    }}
                  />
                </a>
              )}
            </div>
          );
        }
        if (item.type !== 'input') {
          if (selectedKeys[0] === item.id) {
            this.selectedCate = item.code;
            this.selectedCateId = item.id;
          }
          title = editFlag ? (
            <Popover
              placement="rightTop"
              overlayClassName={classnames(
                'commonKnowTreePopover',
                selectedKeys[0] === item.id ? 'selectedPopover' : 'hoverPopover'
              )}
              content={title}
            >
              <div style={{ width: 'calc(100% - 100px)' }}>{item.cate || '空的'}</div>
            </Popover>
          ) : (
            <div style={{ width: 'calc(100% - 100px)' }}>{item.cate || '空的'}</div>
          );
        }
        if (item.children && item.children.length) {
          return (
            <TreeNode title={title} key={item.id} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...item} title={title} key={item.id} dataRef={item} />;
      }
      return '';
    });
  };
  selectedCate = '';
  selectedCateId = '';
  render() {
    const { selectedKeys, expandedKeys, treeData, addNewEmpty } = this.state;
    const { scrollY, editFlag = false } = this.props;
    return (
      <div className="scrollY" style={{ height: scrollY }}>
        {editFlag && (
          <div className="margin-bottom-15 margin-top-15" style={{ paddingLeft: 24 }}>
            <a onClick={this.addNewEmptyNode}>
              <Icon type="plus-circle-o" className="margin-right-10" />添加知识库
            </a>
          </div>
        )}
        {addNewEmpty &&
          editFlag && (
            <Input
              autoFocus
              style={{ width: 220, height: 22, padding: '2px 4px' }}
              onBlur={e => {
                this.addNodeLevelOne(e);
              }}
            />
          )}
        <div className="commonKnowledgeTree flex-auto">
          <div style={{ maxWidth: 800 }}>
            {treeData.length > 0 && (
              <Tree
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                selectedKeys={
                  selectedKeys.length > 0
                    ? selectedKeys
                    : (treeData && treeData[0] && [treeData[0].id]) || []
                }
                expandedKeys={expandedKeys}
                style={{ float: 'right', width: '80%' }}
              >
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>
            )}
          </div>
        </div>
      </div>
    );
  }
}

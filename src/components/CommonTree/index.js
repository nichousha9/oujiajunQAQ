import React from 'react';
import { Tree, Input, Icon, message, Popover, Modal } from 'antd';
import {
  oneChildChecked,
  getAllNodeOnlyOneChild,
  getParentIdArr,
  getChildIdArr,
  removSubArr,
  arrayDeweight,
} from '../../utils/utils';
import classnames from 'classnames';
import './index.less';

const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;

export default class CommonTree extends React.Component {
  state = {
    checkKeysList: [], // 选中的节点
    selectedKeys: [], // 选中的节点；
    expandedKeys: [], // 展开的节点；
    treeData: this.props.treeData, // 展开的节点；
  };
  componentWillReceiveProps(nextProps) {
    const { checkedKeys = [], selectedKeys = [], treeData } = nextProps;
    if (
      JSON.stringify(checkedKeys) !== JSON.stringify(this.state.checkKeysList) ||
      JSON.stringify(treeData) !== JSON.stringify(this.state.treeData) ||
      JSON.stringify(selectedKeys) !== JSON.stringify(this.state.selectedKeys)
    ) {
      // 根据默认的selected 和 check的节点拿到默认展开的节点;
      this.setState({
        treeData,
        checkKeysList: checkedKeys,
        selectedKeys,
        expandedKeys: this.getExpandKeys(checkedKeys, selectedKeys),
      });
    }
  }
  onExpand = (keys) => {
    this.setState({ expandedKeys: keys });
  };
  onSelect = (keys, info) => {
    const { onSelectCallBack, noSelect = false } = this.props;
    if (noSelect) return;
    // 当属没有选中的时候不给操作
    if (keys.length) {
      this.selectedNode = info.node.props;
      this.setState({ selectedKeys: keys }, () => {
        if (onSelectCallBack) onSelectCallBack(this.selectedNode.dataRef);
      });
    }
  };

  onLoadData = (treeNode) =>
    new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      const { loadCallBack, labelObj = {} } = this.props;
      const { id = 'id' } = labelObj;
      loadCallBack(treeNode.props).then((res) => {
        Object.assign(treeNode.props.dataRef, { children: res });
        const { treeData } = this.state;
        treeData.forEach((v) => {
          if (v[id] === treeNode.props.dataRef[id]) {
            Object.assign(v, { children: res });
          }
        });
        this.setState({ treeData: [...treeData] });
        resolve();
      });
    });

  getExpandKeys = (checkedKeys, selectedKeys) => {
    const { treeData } = this.props;
    const { expandedKeys } = this.state;
    // 节点的所有父节点要展开；
    const newKeys = arrayDeweight([...checkedKeys, ...selectedKeys]);
    let newArr = [];
    newKeys.forEach((item) => {
      newArr = newArr.concat(getParentIdArr(item, treeData));
    });
    return arrayDeweight(newArr.concat(selectedKeys).concat(expandedKeys));
  };

  getExpandedKeys = () => {
    const { expandedKeys = [], treeData = [] } = this.state;
    const { labelObj = {} } = this.props;
    const { id = 'id' } = labelObj;
    if (expandedKeys.length) return expandedKeys;
    if (!expandedKeys.length && !!treeData.length) return [(treeData[0] || {})[id]];
  };

  checkTree = (checkKeysList, checkInfo) => {
    const { treeData, org } = this.props;
    if (org) {
      this.setState({ checkKeysList });
    } else {
      const { checked } = checkKeysList;
      const isChecked = checkInfo.checked;
      const checkId = checkInfo.node.props.dataRef.id;
      // 如果是选中要获取当前节点的所有父节点和所有子节点，和现在选中的节点去重
      if (isChecked) {
        const curCheck = [
          ...getParentIdArr(checkId, treeData),
          ...getChildIdArr(checkId, treeData),
          ...checked,
        ];
        this.setState({ checkKeysList: arrayDeweight(curCheck) });
      }
      // 如果是没有选中，就取消当前节点的所有子节点的选择；
      // 如果当前取消的节点是父节点的最后一个孩子，就要取消掉所有的只有checkId一个孩子节点的所有节点;
      if (!isChecked) {
        let curCheck = removSubArr(checked, getChildIdArr(checkId, treeData)) || [];
        if (oneChildChecked(checkId, treeData, checked)) {
          curCheck =
            removSubArr(curCheck, getAllNodeOnlyOneChild(checkId, treeData, checked)) || [];
        }
        this.setState({ checkKeysList: arrayDeweight(curCheck) });
      }
    }
  };
  // 新增树节点
  addTreeNode = (e, item) => {
    const { editCallBack } = this.props;
    if (editCallBack) {
      if (e) {
        e.stopPropagation();
      }
      editCallBack(item, true);
      return;
    }
    const obj = {
      name: '',
      id: '',
      type: 'input',
    };
    if (item.children && item.children.length > 0) {
      item.children.push(obj);
    } else {
      item.children = [obj];
    }
    // 设置新的节点
    const { expandedKeys } = this.state;
    expandedKeys.push(item.id);
    this.setState({
      expandedKeys,
      treeData: this.handleEditNode(item.id, null, 'add', item),
    });
  };
  saveTreeNode = (e, node) => {
    // 没有节点名称不给保存 ；
    const { nodeSave } = this.props;
    if (!e.target.value) {
      message.error('请填写节点名称');
      return;
    }
    let obj = {};
    if (node.id) {
      obj = {
        name: e.target.value,
        id: node.id,
      };
    }
    if (!node.id) {
      // 新增树节点;
      obj = {
        name: e.target.value,
      };
    }
    if (nodeSave) nodeSave(obj);
  };
  // 删除树节点
  deleteTreeNode = (item) => {
    const { parentid = 'parentid', handleDeleteNode, isMenu, deleteTopAble } = this.props;
    if ((!item[parentid] || item[parentid] === '0') && !isMenu && !deleteTopAble) {
      message.error('当前节点为顶层节点，不能删除！');
      return;
    }
    confirm({
      title: '确定删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (handleDeleteNode) handleDeleteNode(item);
      },
    });
  };
  // 修改树节点
  editTreeNode = (e, node) => {
    const { editCallBack } = this.props;
    const { id } = node;
    if (!id) return;
    if (editCallBack) {
      editCallBack(node);
      return;
    }
    this.setState({ treeData: this.handleEditNode(id, null, 'edit') });
  };
  // 遍历树节点
  handleEditNode = (key, data, type, changeNode) => {
    // type
    if (!key || !type) return;
    const treeData = data || this.state.treeData;
    // edit是修改数据
    return treeData.map((item) => {
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

  // 渲染树节点
  renderTreeNodes = (data = []) => {
    const { selectedKeys } = this.state;
    const { act, labelObj = {}, isMenu } = this.props;
    const { id = 'id', name = 'name' } = labelObj;

    return data.map((item) => {
      // console.log('item', item);

      let title = item[name];
      if (act) {
        if (item.type === 'input') {
          title = (
            <div>
              <Input
                defaultValue={item[name]}
                placeholder="请输入节点名称"
                onBlur={(e) => {
                  this.saveTreeNode(e, item);
                }}
              />
            </div>
          );
        } else {
          title = (
            <div>
              {!isMenu && (
                <a className="margin-right-10">
                  <Icon
                    key="edit"
                    type="edit"
                    onClick={(e) => {
                      this.editTreeNode(e, item);
                    }}
                  />
                </a>
              )}
              <a className="margin-right-10">
                <Icon
                  key="add"
                  type="plus-circle-o"
                  onClick={(e) => {
                    this.addTreeNode(e, item);
                  }}
                />
              </a>
              <a className="margin-right-10">
                <Icon
                  key="delete"
                  type="delete"
                  onClick={() => {
                    this.deleteTreeNode(item);
                  }}
                />
              </a>
            </div>
          );
        }
        if (item.type !== 'input') {
          title = (
            <Popover
              placement="rightTop"
              content={title}
              overlayClassName={classnames(
                'commonKnowTreePopover',
                selectedKeys[0] === item[id] ? 'selectedPopover' : 'hoverPopover'
              )}
            >
              <div style={{ width: 'calc(100% - 100px)' }}>{item[name]}</div>
            </Popover>
          );
        }
      }
      const { renderChildNode, uniqueOrg } = this.props;
      if (item.children) {
        if (renderChildNode) {
          return (
            <TreeNode
              title={title}
              disabled={item.disabled}
              selectable={false}
              key={item[id]}
              dataRef={item}
            >
              {item.children.map((child) => {
                const childTitle = renderChildNode(child);
                return (
                  <TreeNode
                    disabled={item.disabled}
                    selectable={false}
                    key={child.key}
                    title={childTitle}
                    dataRef={child}
                  />
                );
              })}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            disabled={item.disabled}
            title={title}
            key={uniqueOrg ? `${item[id]}%%${item[name]}` : item[id]}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }

      return (
        <TreeNode
          disabled={item.disabled}
          {...item}
          selectable={!renderChildNode}
          title={title}
          key={uniqueOrg ? `${item[id]}%%${item[name]}` : item[id]}
          dataRef={item}
        />
      );
    });
  };

  render() {
    const { checkable, loadCallBack, checkStrictlyAble } = this.props;
    const { treeData, checkKeysList, selectedKeys } = this.state;
    const expandedKeys = this.getExpandedKeys();
    return (
      <div className="commonTree">
        <Tree
          expandedKeys={expandedKeys}
          onExpand={this.onExpand}
          onCheck={this.checkTree}
          checkedKeys={checkKeysList}
          selectedKeys={selectedKeys}
          onSelect={this.onSelect}
          checkStrictly={!!checkStrictlyAble}
          checkable={checkable}
          loadData={loadCallBack ? this.onLoadData : null}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
      </div>
    );
  }
}

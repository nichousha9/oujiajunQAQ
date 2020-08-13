/* 目录树
参数props:
treeData 目录树数据
add 添加,
edit 编辑,
del 删除,
addCallBack: 添加回调,
editCallBack: 编辑回调,
deleteCallBack: 删除回调,
onSelectCallBack: 选中回调,
showButtons = true 是否显示按钮，默认是,
defaultSelectedKeys 默认展开节点, 
tooltip 有提示语，提示语字段 */
/**
 * 添加 props：
 * loadData 用于异步加载目录
 * draggable 可拖拽
 * onDragStart
 * onDragEnd
 * handleAsyncSearch 用于异步加载的搜索，异步的情况下，输入enter查询
 * ignoreCaseFlag 搜索是否忽略大小写
 */
import { Tree, Input, Dropdown, Menu, Icon, Modal, Tooltip } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import Iconfont from '@/components/Iconfont/index';
import styles from './index.less';

const { TreeNode, DirectoryTree } = Tree;
const { Search } = Input;
const { confirm } = Modal;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.childTypes) {
      if (node.childTypes.some(item => item.busiCode === key)) {
        parentKey = node.busiCode;
      } else if (getParentKey(key, node.childTypes)) {
        parentKey = getParentKey(key, node.childTypes);
      }
    }
  }
  return parentKey;
};

class SearchTree extends React.Component {
  currentData = ''; // 选择的目录值

  dataList = [];

  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: props.defaultExpandedKeys || [],
      searchValue: '',
      autoExpandParent: true,
    };
  }

  componentWillMount() {
    const { treeData, Refs } = this.props;
    if (Refs) Refs(this);

    this.generateList(treeData);
  }

  componentWillReceiveProps(nextprops) {
    const { treeData, defaultExpandedKeys } = nextprops;
    this.generateList(treeData);
    // eslint-disable-next-line react/destructuring-assignment
    if (defaultExpandedKeys != this.props.defaultExpandedKeys) {
      this.setState({
        expandedKeys: defaultExpandedKeys,
      });
    }
  }

  generateList = data => {
    for (let i = 0; i < data.length; i += 1) {
      const node = data[i];
      const { busiCode, busiName } = node;
      this.dataList.push({
        key: String(busiCode),
        busiName,
      });
      if (node.childTypes) {
        this.generateList(node.childTypes);
      }
    }
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  // 异步加载搜索
  handleAsyncSearch = async value => {
    const { handleAsyncSearch } = this.props;
    if (handleAsyncSearch) {
      await handleAsyncSearch(value);
    }
    this.onChange(undefined, { value });
  };

  /**
   * @param {obj} searchValue 搜索关键词，异步搜索的情况需要传
   */
  onChange = (e, searchValue) => {
    const { treeData, ignoreCaseFlag } = this.props;
    const { value } = searchValue || e.target;
    const expandedKeys = this.dataList
      .map(item => {
        if (
          item.busiName.indexOf(value) > -1 ||
          (ignoreCaseFlag && item.busiName.toUpperCase().indexOf(value.toUpperCase()) > -1)
        ) {
          return getParentKey(item.busiCode, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  onSelect = (key, { node }) => {
    const curkey = key[0];
    this.currentData = node.props;
    const { onSelectCallBack } = this.props;
    if (onSelectCallBack) {
      onSelectCallBack(curkey, node.props.dataRef.parentCode); // 添加返回选择目录的名字
    }
  };

  addNode = item => {
    const { addCallBack } = this.props;
    addCallBack(item);
    // 无论添加与否，设置为展开
    const { expandedKeys } = this.state;
    expandedKeys.push(String(item.busiCode));
    this.setState({ expandedKeys: Array.from(new Set(expandedKeys)) });
  };

  editNode = item => {
    const { treeData } = this.props;
    const { editCallBack } = this.props;
    const parentId = getParentKey(String(item.busiCode), treeData);
    editCallBack({ ...item, parentId: parentId || -1 });
  };

  delNode = item => {
    const { treeData } = this.props;
    const { deleteCallBack } = this.props;
    const parentId = getParentKey(String(item.busiCode), treeData);
    confirm({
      icon: false,
      title: '',
      content: formatMessage({
        id: 'component.searchTree.deleteTip',
      }),
      cancelText: formatMessage({
        id: 'component.searchTree.cancel',
      }),
      okText: formatMessage({
        id: 'component.searchTree.sure',
      }),
      onOk() {
        deleteCallBack({ ...item, parentId: parentId || -1 });
      },
    });
  };

  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;

    const {
      treeData,
      add,
      edit,
      del,
      showButtons = true,
      defaultSelectedKeys,
      // selectedKeys, // 添加此属性会使选中效果消失
      loadData,
      hideSearch,
      draggable,
      onDragEnd,
      onDragStart,
      handleAsyncSearch,
      ignoreCaseFlag,
      tooltip,
    } = this.props;

    const loop = data => {
      return data.map(item => {
        const index = ignoreCaseFlag
          ? item.busiName.toUpperCase().indexOf(searchValue.toUpperCase())
          : item.busiName.indexOf(searchValue);
        const beforeStr = item.busiName.substr(0, index);
        const searchStr = item.busiName.substr(index, searchValue.length);
        const afterStr = item.busiName.substr(index + searchValue.length);
        // *****************
        const content = (
          <Menu>
            {add ? (
              <Menu.Item>
                <div onClick={() => this.addNode(item)}>
                  <Icon type="plus-circle" />
                  &nbsp;&nbsp;
                  {formatMessage({
                    id: 'component.searchTree.plus',
                  })}
                </div>
              </Menu.Item>
            ) : null}
            {edit ? (
              <Menu.Item>
                <div onClick={() => this.editNode(item)}>
                  <Iconfont type="iconeditx" />
                  &nbsp;&nbsp;
                  {formatMessage({
                    id: 'component.searchTree.edit',
                  })}
                </div>
              </Menu.Item>
            ) : null}
            {del && item.childTypes && item.childTypes.length === 0 ? (
              <Menu.Item>
                <div
                  onClick={() => {
                    this.delNode(item);
                  }}
                >
                  <Iconfont type="iconshanchux" />
                  &nbsp;&nbsp;
                  {formatMessage({
                    id: 'component.searchTree.delete',
                  })}
                </div>
              </Menu.Item>
            ) : null}
          </Menu>
        );
        const showtitle = (
          <div className={styles.treeTitle}>
            <span>{item.busiName}</span>
            {showButtons && (
              <Dropdown overlay={content} placement="bottomCenter">
                <span className={styles.more}>
                  <Iconfont type="iconmore" />
                </span>
              </Dropdown>
            )}
          </div>
        );
        const searchtitle = (
          <div className={styles.treeTitle}>
            {beforeStr}
            <span style={{ color: '#f50' }}>{ignoreCaseFlag ? searchStr : searchValue}</span>
            {afterStr}
            {showButtons && (
              <Dropdown overlay={content} placement="bottomCenter">
                <span className={styles.more}>
                  <Iconfont type="iconmore" />
                </span>
              </Dropdown>
            )}
          </div>
        );
        const title = index > -1 ? searchtitle : showtitle;
        const titleDom =
          tooltip && item[tooltip] ? (
            <Tooltip placement="bottom" title={item[tooltip]}>
              <span>{title}</span>
            </Tooltip>
          ) : (
            title
          );
        if (item.childTypes) {
          return (
            <TreeNode
              key={String(item.busiCode)}
              title={titleDom}
              name={item.busiName}
              isLeaf={item.isLeaf}
              dataRef={item}
            >
              {loop(item.childTypes)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={String(item.busiCode)}
            title={titleDom}
            name={item.busiName}
            isLeaf={item.isLeaf}
            dataRef={item}
          />
        );
      });
    };

    return (
      <div className={styles.commonTreeStyle}>
        {!hideSearch ? (
          <Search
            size="small"
            style={{ marginBottom: 8 }}
            placeholder={handleAsyncSearch ? '输入enter查询' : '查询'}
            onChange={handleAsyncSearch ? null : this.onChange}
            onSearch={handleAsyncSearch ? this.handleAsyncSearch : null}
          />
        ) : null}
        {treeData.length !== 0 && (
          <DirectoryTree
            showIcon={false}
            autoExpandParent={autoExpandParent}
            expandedKeys={expandedKeys}
            onSelect={this.onSelect}
            onExpand={this.onExpand}
            defaultSelectedKeys={defaultSelectedKeys}
            defaultExpandedKeys={defaultSelectedKeys}
            // selectedKeys={selectedKeys}
            loadData={loadData || null}
            draggable={draggable || false}
            onDragStart={onDragStart || null}
            onDragEnd={onDragEnd || null}
          >
            {loop(treeData)}
          </DirectoryTree>
        )}
      </div>
    );
  }
}

export default SearchTree;

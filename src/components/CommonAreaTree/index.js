import React from 'react';
import { Tree, Modal, Popover, Spin, message } from 'antd';
import { connect } from 'dva';
import CommonButton from '../../components/CommonButton';
import { getChildRegions } from '../../services/systemSum';

const { TreeNode } = Tree;

@connect(({ organization, loading }) => {
  return { organization, loading: loading.models.organization };
})
export default class CommonAreaTree extends React.Component {
  state = {
    visible: false,
    checkedKeys: [],
    disabledArea: false,
    areaData: [],
    expandedKeys: [],
  };

  componentWillMount() {
    getChildRegions({ parentId: 0 }).then((res) => {
      if (res.data) {
        this.setState({ areaData: res.data });
      }
    });
  }

  onLoadData = (treeNode) =>
    new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      this.onMyLoadData(treeNode.props).then((res) => {
        Object.assign(treeNode.props.dataRef, { children: res });
        const { areaData } = this.state;
        areaData.forEach((v) => {
          if (v.regionId === treeNode.props.dataRef.regionId) {
            Object.assign(v, { children: res });
          }
        });
        this.setState({ areaData: [...areaData] });
        resolve();
      });
    });

  onMyLoadData = (treeNodeProps) =>
    new Promise((resolve) => {
      getChildRegions({
        parentId: treeNodeProps.regionId ? treeNodeProps.regionId : treeNodeProps[0].regionId,
      }).then((res) => {
        resolve(res.data);
      });
    });

  handleOk = () => {
    const { checkedKeys } = this.state;
    if (!checkedKeys.length) {
      message.error('请选择节点');
      return;
    }
    const {
      dispatch,
      org: { id },
    } = this.props;
    dispatch({
      type: 'organization/fetchUpdateOrgScope',
      payload: { newRegionIds: checkedKeys.join(','), id },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('添加成功');
        this.handleCloseModal();
      }
    });
  };

  handleCheck = (checkInfo) => {
    const { checked = [] } = checkInfo;
    this.setState({ checkedKeys: checked });
  };
  handleCloseModal = () => {
    this.setState({ visible: false });
  };
  handleExpand = (expanIno) => {
    this.setState({ expandedKeys: expanIno });
  };
  handleSearch = () => {
    const {
      dispatch,
      org: { id, area },
    } = this.props;
    this.setState({ visible: true });
    dispatch({
      type: 'organization/fetchGetOrgScopeList',
      payload: { id },
    }).then((res) => {
      if (res && res.data) {
        const checkedKeys = (res.data || []).map((item) => {
          return item.regionId;
        });
        this.setState({
          checkedKeys,
          expandedKeys: checkedKeys,
          disabledArea: checkedKeys.indexOf(area) > -1,
        });
      }
    });
  };
  renderTree = (data) => {
    const { disabledArea } = this.state;
    const { name = 'regionName', value = 'regionId' } = {};
    const organ = this.props.org.area || '';
    return data.map((tree, index) => {
      const fun = () => {
        if (tree.children && tree.children.length) {
          return (
            <TreeNode
              disabled={tree[value] === organ && disabledArea}
              value={tree[value]}
              title={tree[name]}
              key={tree[value] || index}
              dataRef={tree}
            >
              {this.renderTree(tree.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            {...tree}
            disabled={tree[value] === organ && disabledArea}
            value={tree[value]}
            title={tree[name]}
            key={tree[value]}
            dataRef={tree}
          />
        );
      };
      return fun();
    });
  };
  render() {
    const { loading } = this.props;
    const { visible, areaData, checkedKeys, expandedKeys } = this.state;
    const clientHeight =
      window.innerHeight || window.document.documentElement.clientHeight || window.document.body;
    return (
      <div style={{ display: 'inline-block' }}>
        <CommonButton loading={loading} className="margin-right-10" onClick={this.handleSearch}>
          添加服务区域
        </CommonButton>
        <Modal
          bodyStyle={{ height: clientHeight - 240, overflow: 'auto' }}
          title="添加服务区域"
          onOk={this.handleOk}
          visible={visible}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <Spin spinning={loading}>
            <Tree
              expandedKeys={expandedKeys}
              checkedKeys={checkedKeys}
              onCheck={this.handleCheck}
              onExpand={this.handleExpand}
              checkable
              checkStrictly
              loadData={this.onLoadData}
            >
              {this.renderTree(areaData)}
            </Tree>
          </Spin>
        </Modal>
      </div>
    );
  }
}

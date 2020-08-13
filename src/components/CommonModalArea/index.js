import React from 'react';
import { Tree, Modal, Button, Tooltip, Spin, message, Input } from 'antd';
import { connect } from 'dva';
import { getClientHeight } from '../../utils/utils';
import { getCurUserArea } from '../../services/systemSum';
import CommonTree from '../../components/CommonTree'

const TreeNode = Tree.TreeNode;

@connect(({ dataDic, loading }) => {
  return { dataDic: dataDic.dataDic, loading: loading.models.dataDic };
})
class CommonModalArea extends React.Component {
  constructor(props) {
    super(props);
    const { area = '', areaList = [] } = this.props;
    const newArr = areaList.map(item => ({ label: item.regionname, id: item.regionid }));
    this.state = {
      visible: false,
      checkedKeys: area ? area.split(',') : [],
      checkedNodeInfo: newArr || [],
      expandedKeys: [],
    };
  }

  componentDidMount() {
    const { dataDic = {}, type = 'pickup' } = this.props;
    const curType = type === 'pickup' ? 'common_region_type_kdbPickup' : 'common_region_type_kdb';
    const curUserAreaList = dataDic[`curUserAreaList${curType}`] || [];
    if (!curUserAreaList.length) {
      const { dispatch } = this.props;
      // 获取树
      dispatch({
        type: 'dataDic/fetchGetCurUserAreaList',
        payload: {
          type: curType,
          parentId: 0,
        },
      });
    }
  }
  handleOk = () => {
    const { checkedKeys } = this.state;
    if (!checkedKeys.length) {
      message.error('请选择节点');
      return;
    }
    const { dispatch, org: { id } } = this.props;
    dispatch({
      type: 'organization/fetchUpdateOrgScope',
      payload: { regionIds: checkedKeys.join(','), id },
    }).then(res => {
      if (res && res.status === 'OK') {
        message.success('添加成功');
        this.handleCloseModal();
      }
    });
  };
  handleCheck = (checkInfo, info) => {
    const { checkedNodes = [] } = info;
    const { onChange } = this.props;
    const checkedNodeInfo = checkedNodes.map(node => {
      const { props = {} } = node;
      return {
        id: props.value,
        label: props.title,
      };
    });
    const { checked = [] } = checkInfo;
    if (onChange) onChange(checked.join(','), checked, checkedNodeInfo);
    this.setState({ checkedKeys: checked, checkedNodeInfo });
  };
  handleSelect = (checked, info) => {
    const { onChange, checkable = true } = this.props;
    if (checkable) return;
    const { selectedNodes = [] } = info;
    const checkedNodeInfo = selectedNodes.map(item => {
      const { props = {} } = item;
      return {
        id: props.value,
        label: props.title,
      };
    });
    if (onChange) onChange(checked.join(','), checked, checkedNodeInfo);
    this.setState({ checkedKeys: checked, checkedNodeInfo });
  };
  orgSelectOk = () => {
    const {showArea} = this.props
    const { checkKeysList } = this.treeRef.state;
    const checkedNodeInfo = checkKeysList.map(item =>{
      const obj = item.split('%%')
      return{
        id:obj[0],
        name:obj[1],
      }
    })
    const checkedKeys = checkKeysList.map(item =>{
      return item.split('%%')[0]
    })
    this.setState({visible: false,checkedNodeInfo,checkedKeys})
    showArea(checkedKeys)
  }
  handleCloseModal = () => {
    this.setState({ visible: false });
  };
  onLoadData = treeNodeProps =>
    new Promise(resolve => {
      getCurUserArea({ parentId: treeNodeProps.regionId }).then(res => {
        resolve(res.data);
      });
    });
  handleExpand = expanIno => {
    this.setState({ expandedKeys: expanIno });
  };
  renderTree = data => {
    const { name = 'regionName', value = 'regionId' } = this.props.type || {};
    return data.map((tree, index) => {
      tree.children = [];
      const fun = () => {
        return (
          <TreeNode
            {...tree}
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
    const {
      dataDic = {},
      type = 'pickup',
      loading = false,
      noWidth = false,
      isForce = false,
      checkedKeysProps = [],
      checkedNodeInfoProps = [],
      checkable = true,
    } = this.props;
    const { visible, checkedKeys, expandedKeys, checkedNodeInfo = [] } = this.state;
    const clientHeight = getClientHeight();
    const curType = type === 'pickup' ? 'common_region_type_kdbPickup' : 'common_region_type_kdb';
    const curUserAreaList = dataDic[`curUserAreaList${curType}`] || [];
    const str = (isForce ? checkedNodeInfoProps : checkedNodeInfo)
      .map(item => {
        return item.name;
      })
      .join('，');
    const treeProps = {
      labelObj:{name:'regionName',id:'regionId'}, 
      treeData: curUserAreaList,
      org: true,
      uniqueOrg: true,
      checkable,
      loadCallBack: this.onLoadData,
    };
    return (
      <div className="inlineBlock height32" style={{ width: noWidth ? '100%' : 'auto' }}>
        <div>
          <Tooltip title={str}>
            <Input
              placeholder="请选择"
              value={str}
              style={{ width: noWidth ? 'calc(100% - 46px)' : 180, borderRadius: '4px 0 0 4px' }}
              className="padding-left-10 padding-right-10 vertical-middle one-line-text border radius-4 height32 line-height32 inline-block"
            />
          </Tooltip>
          <Button
            style={{ padding: '0 5px', marginLeft: '-2.5px', borderRadius: '0 4px 4px 0' }}
            className="vertical-middle"
            type="primary"
            onClick={() => {
              this.setState({ visible: true });
            }}
          >
            查看
          </Button>
        </div>
        <Modal
          bodyStyle={{ height: clientHeight - 240, overflow: 'auto' }}
          title="选择分部地区"
          onOk={this.orgSelectOk}
          // onOk={() => {
          //   this.setState({ visible: false });
          // }}
          visible={visible}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <Spin spinning={loading}>
            {/* <Tree
              expandedKeys={expandedKeys}
              checkedKeys={isForce?checkedKeysProps:checkedKeys}
              onSelect={this.handleSelect}
              onCheck={this.handleCheck}
              onExpand={this.handleExpand}
              checkable={checkable}
              checkStrictly
              loadData={this.onLoadData}
            >
              {this.renderTree(curUserAreaList)}
            </Tree> */}
            <CommonTree {...treeProps} ref={(ele) => { this.treeRef = ele}} />
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default CommonModalArea;

import React from 'react';
import { Tree, Modal, Button, Tooltip, Input } from 'antd';
import { getClientHeight } from '../../utils/utils';
import { getOrganByUser } from '../../services/api';
import CommonTree from '../../components/CommonTree'

const TreeNode = Tree.TreeNode;

export default class CommonModalOrgan extends React.Component {
  constructor(props) {
    super(props);
    const { organ = '', organList = [] } = this.props;
    const newArr = organList.map(item => ({ name: item.name, id: item.id }));
    this.state = {
      visible: false,
      checkedKeys: organ.split(',') || [],
      checkedNodeInfo: newArr || [],
      expandedKeys: [],
    };
  }

  onLoadData = treeNodeProps =>{
    return new Promise(resolve => {
      getOrganByUser({ parent: treeNodeProps.id }).then(res => {
        resolve(res.data);
      });
    });
  }
  
  handleCheck = (checkInfo, info) => {
    const { checkedNodes = [] } = info;
    const { onChange } = this.props;
    const checkedNodeInfo = checkedNodes.map(node => {
      const { props = {} } = node;
      return {
        id: props.value,
        name: props.title,
      };
    });
    const { checked = [] } = checkInfo;
    const checkedArr = checkedNodeInfo.map(item => {
      return item.id;
    });
    if (onChange) onChange(checkedArr.join(','), checked, checkedNodeInfo);
    this.setState({ checkedKeys: checked, checkedNodeInfo });
  };
  
  orgSelectOk = () => {
    const {showOrgan} = this.props
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
    console.log(checkedKeys)
    this.setState({visible: false,checkedNodeInfo,checkedKeys})
    showOrgan(checkedKeys)
  }
  
  handleSelect = (checked, info) => {
    const { onChange, checkable = true } = this.props;
    if (checkable) return;
    const { selectedNodes = [] } = info;
    const checkedNodeInfo = selectedNodes.map(item => {
      const { props = {} } = item;
      return {
        id: props.value,
        name: props.title,
      };
    });
    const checkedArr = checkedNodeInfo.map(item => {
      return item.id;
    });
    if (onChange) onChange(checkedArr.join(','), checked, checkedNodeInfo);
    this.setState({ checkedKeys: checked, checkedNodeInfo });
  };
  handleCloseModal = () => {
    this.setState({ visible: false });
  };
  handleExpand = expanIno => {
    this.setState({ expandedKeys: expanIno });
  };
  
    
  renderTree = data => {
    const { name = 'name', value = 'id', parent = 'parent' } = this.props.type || {};
    return data.map((tree, index) => {
      const item = tree[index] === undefined?tree[index]:tree
      const fun = () => {
        if (tree.children && tree.children.length > 0) {
          return (
            <TreeNode
              {...item}
              value={item[value]}
              title={item[name]}
              key={item[value]}
              dataRef={item}
            >
              {this.renderTree(item.children)}
            </TreeNode>
          );
        }
        console.log(item)
        return (
          <TreeNode
            {...item}
            value={item}
            title={item[name]}
            key={item[value]}
            dataRef={item}
          />
        );
      };
      return fun();
    });
  };

  render() {
    const {
      noWidth = false,
      isForce = false,
      curUserOrganList = [],
      organList = [],
      checkable = true,
    } = this.props;
    const { visible, checkedKeys, expandedKeys, checkedNodeInfo = [] } = this.state;
    const clientHeight = getClientHeight();
    const str = checkedNodeInfo
      .map(item => {
        return item.name;
      })
      .join('，');
      const treeProps = {
        treeData:curUserOrganList,
        org: true,
        uniqueOrg: true,
        checkable: true,
        loadCallBack: this.onLoadData,
      }
    return (
      <div className="inlineBlock height32" style={{ width: noWidth ? '100%' : 'auto' }}>
        <div>
          <Tooltip title={str}>
            <Input
              placeholder="请选择部门"
              value={str}
              style={{ width: noWidth ? 'calc(100% - 45px)' : 180, borderRadius: '4px 0 0 4px' }}
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
            选择
          </Button>
        </div>
        <Modal
          bodyStyle={{ height: clientHeight - 240, overflow: 'auto' }}
          title="选择部门"
          onOk={() => {
            this.orgSelectOk()
          }}
          visible={visible}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <CommonTree {...treeProps} ref={(ele) => { this.treeRef = ele}} />
        </Modal>
      </div>
    );
  }
}

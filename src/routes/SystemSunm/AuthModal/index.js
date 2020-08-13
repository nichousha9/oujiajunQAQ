/* eslint-disable no-console */
import React from 'react';
import { connect } from 'dva';
import { Modal, Spin, message } from 'antd';
import lodash from 'lodash';
import CommonTree from '../../../components/CommonTree/index';
import { allAuthList } from '../../../services/systemSum';
import './modal.less';
// import { setTreeDisabled } from '../../../utils/utils'

@connect((props) => {
  const { roleAuth } = props;
  return {
    roleAuth,
  };
})
export default class RoleAuthModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curData: props.curData || {}, // 當前的角色
      resourceList: [], // 当前
      curAuthList: [], // 当前选保存的权限
      // curDisableList:[],// 当前disable的权限
    };
  }
  componentDidMount() {
    const { dispatch, type = 'Role' } = this.props;
    const { curData } = this.state;
    if (curData) {
      dispatch({
        // 默认是角色，
        type: type === 'Role' ? 'roleAuth/fetchGetAuthListRole' : 'roleAuth/fetchGetAuthListOrg',
        payload: { id: curData },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      resourceList,
      roleAuth: { curAuthList },
    } = nextProps;
    // console.log(curAuthList, resourceList);
    if (
      JSON.stringify(resourceList) !== JSON.stringify(this.state.resourceList) ||
      JSON.stringify(curAuthList) !== JSON.stringify(this.state.curAuthList)
    ) {
      this.setState({ resourceList, curAuthList });
    }
  }

  // 加载下级菜单
  loadCallBack = (treeNodeProps) =>
    new Promise((resolve) => {
      allAuthList({ authId: treeNodeProps.id }).then((res) => {
        resolve(res.data.list);
      });
    });

  handleOk = () => {
    const { dispatch, onOK, type } = this.props;
    const { checkKeysList } = this.treeRef.state;
    const { curData } = this.state;
    dispatch({
      type: type === 'Role' ? 'roleAuth/fetchAuthToRole' : 'roleAuth/fetchAuthToOrg',
      payload:
        type === 'Role'
          ? {
              roleId: curData,
              authIds: lodash.cloneDeep(checkKeysList).join(','),
            }
          : {
              id: curData,
              menus: lodash.cloneDeep(checkKeysList).join(','),
            },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('分配权限成功');
        onOK();
      }
    });
  };
  render() {
    const { listLoading = false, onCancel, visible, resourceList } = this.props;
    const { curAuthList = [] } = this.state;
    // console.log(curAuthList);
    return (
      <div className="roleAuthModal">
        <Modal visible={visible} title="角色授权" onCancel={onCancel} onOk={this.handleOk}>
          <Spin spinning={listLoading}>
            <CommonTree
              ref={(ele) => {
                this.treeRef = ele;
              }}
              checkable="true"
              checkedKeys={curAuthList}
              isMenu
              org
              labelObj={{ id: 'id' }}
              treeData={resourceList}
              loadCallBack={this.loadCallBack}
            />
          </Spin>
        </Modal>
      </div>
    );
  }
}

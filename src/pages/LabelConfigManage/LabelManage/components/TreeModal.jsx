import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '../index.less';
import SearchTree from '@/components/SearchTree/index';

@connect(({ labelManage }) => ({
  labelCatalogData: labelManage.labelCatalogData,
  currentCatalogId: labelManage.currentCatalogId,
  currentCatalogName: labelManage.currentCatalogName,
}))
class TreeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curCatalogKey: '', // 在目录树对话框内选择的目录的ID
      curCatalogName: '', // 在目录树对话框内选择的目录的名字
    };
  }

  componentWillMount() {
    const { currentCatalogId, currentCatalogName } = this.props;
    this.setState({
      curCatalogKey: currentCatalogId,
      curCatalogName: currentCatalogName,
    })
    this.getTreeData();
  }

  componentDidMount() {}

  // 获取树状目录的数据
  getTreeData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelManage/getMccLabelCatalogList',
      payload: {},
    });
  };

  // 目录树选择回调的时候将选择的信息先保存下来
  onSelectCallBack = (key, catalogName) => {``
    this.setState({
      curCatalogKey: key,
      curCatalogName: catalogName,
    });
  };

  render() {
    const { curCatalogKey, curCatalogName } = this.state;
    const {
      modalVisible,
      labelCatalogData, // 目录树的数据
      hideModal,
      handleModalOK,
    } = this.props;

    // 传入目录树的参数
    const treeProps = {
      treeData: labelCatalogData.data || [], // 当labelCatalogData为空的时候传一个空数组进去
      showButtons: false,
      onSelectCallBack: this.onSelectCallBack,
      defaultSelectedKeys: curCatalogKey ? [curCatalogKey] : [],
    };

    return (
      <Modal
        title={formatMessage(
          {
            id: 'labelConfigManage.labelManage.labelCatalog',
          },
          '标签目录',
        )}
        visible={modalVisible}
        onCancel={hideModal}
        width="300px"
        destroyOnClose
        footer={
          <div className={styles.modalFooter}>
            <Button
              key="confirm"
              type="primary"
              size="small"
              onClick={() => {
                handleModalOK(curCatalogKey, curCatalogName);
              }}
            >
              {formatMessage(
                {
                  id: 'common.btn.confirm',
                },
                '确定',
              )}
            </Button>
            <Button key="back" size="small" onClick={hideModal}>
              {formatMessage(
                {
                  id: 'common.btn.cancel',
                },
                '取消',
              )}
            </Button>
          </div>
        }
      >
        <SearchTree {...treeProps} />
      </Modal>
    );
  }
}

export default TreeModal;

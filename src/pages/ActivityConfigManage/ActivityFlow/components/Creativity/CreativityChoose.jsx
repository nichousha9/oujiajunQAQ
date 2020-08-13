/* eslint-disable no-unused-vars */
// 创意选择弹窗
import React from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Table, Input, Card } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import commonStyles from '../../common.less';
import SearchTree from '@/components/SearchTree';
import Iconfont from '@/components/Iconfont';
import { formatTree } from '@/utils/formatData';

const { Search } = Input;

@connect(({ activityFlowContact }) => ({
  activityFlowContact,
}))
class ActivitySelect extends React.Component {
  columns = [
    {
      title: formatMessage({ id: 'activityConfigManage.contact.adviceChannelName' }),
      dataIndex: 'adviceName',
      key: 'adviceName',
    },

    {
      title: formatMessage({ id: 'activityConfigManage.contact.channel' }),
      dataIndex: 'channelName',
      key: 'channelName',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.time' }),
      dataIndex: 'createDate',
      key: 'createDate',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      // 左边树
      treeSelectedKey: '',
      messageFolderList: [],
      // 右边模块
      pageNum: 1,
      pageSize: 5,
      pageInfo: {}, // 后端的返回
      creativeInfoName: '',
      creativeInfoList: [],
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentDidMount() {
    this.qryMessageFolder();
  }

  /**
   *获取目录树数据
   *
   * @memberof ActivitySelect
   */
  qryMessageFolder = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlowContact/qryMessageFolder',
      success: svcCont => {
        const { data = [] } = svcCont;
        // const newArr = formatTree(
        //   data,
        //   'parentAdviceTypeSortId',
        //   'adviceTypeSortId',
        //   'adviceTypeSortName', folderId
        // );
        const newArr = this.handleTreeData(data);
        // const newArr = data.map(item => ({
        //   ...item,
        //   key: item.folderId,
        //   title: item.folderName,
        //   adviceTypeSortId: item.folderId,
        // }));
        if (newArr && newArr.length) {
          const treeSelectedKey = newArr[0].key;
          this.setState({ messageFolderList: newArr, treeSelectedKey }, this.qryCreativeInfoList);
        } else {
          this.setState({ messageFolderList: newArr || [] });
        }
      },
    });
  };

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
    return newArr;
  };

  /**
   *获取创意列表
   *
   * @memberof ActivitySelect
   */
  qryCreativeInfoList = () => {
    const { dispatch, options } = this.props;
    const {
      adviceCode,
      channelId,
      channelIds,
      isEngine,
      templateInfoType,
      templateInfoTypes,
    } = options;
    const { treeSelectedKey, pageNum, pageSize, creativeInfoName } = this.state;
    dispatch({
      type: 'activityFlowContact/qryCreativeInfoList',
      payload: {
        adviceName: creativeInfoName,
        folderId: treeSelectedKey, // 通知类型id
        pageInfo: { pageNum, pageSize },
        adviceCode, // 通知编码
        channelId, // 渠道id
        channelIds, // 多个渠道
        isEngine, // 是否引擎
        templateInfoType, // 模板信息类型
        // 1 图文模板2 文字模板3 HTML模板
        templateInfoTypes, // 多模板信息类型
      },
      success: svcCont => {
        const { data = [], pageInfo = {} } = svcCont;
        this.setState({
          creativeInfoList: data,
          pageInfo,
        });
      },
    });
  };

  // 创意列表搜索文字改变
  creativeInfoNameChange = e => {
    const { value } = e.target;
    this.setState({ creativeInfoName: value });
  };

  // 树选中值改变
  onSelectCallBack = key => {
    this.setState({ treeSelectedKey: key }, this.qryCreativeInfoList);
  };

  // 删除选中的创意
  cancelChoose = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    });
  };

  // 提交
  handleSubmit = () => {
    const { onOk } = this.props;
    const { selectedRows } = this.state;
    onOk(selectedRows);
  };

  // 列表条件切换
  onChange = pagination => {
    const { current: pageNum, pageSize } = pagination;
    this.setState(
      {
        pageNum,
        pageSize,
      },
      this.qryCreativeInfoList,
    );
  };

  render() {
    const { visible, onCancel, chooseMultiple } = this.props;
    const {
      messageFolderList,
      creativeInfoList,
      pageInfo,
      treeSelectedKey,
      selectedRowKeys,
      selectedRows,
    } = this.state;

    const treeProps = {
      hideSearch: true,
      showButtons: false,
      defaultSelectedKeys: [String(treeSelectedKey)],
      treeData: messageFolderList,
      onSelectCallBack: this.onSelectCallBack,
    };

    const pagination = {
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    const rowSelection = {
      hideDefaultSelections: !chooseMultiple,
      type: chooseMultiple ? 'checkbox' : 'radio',
      selectedRowKeys,
      onChange: (selectedKeys, selecteds) => {
        this.setState({
          selectedRowKeys: selectedKeys,
          selectedRows: selecteds,
        });
      },
    };

    const chooseTableOpe = {
      title: formatMessage({ id: 'activityConfigManage.contact.operate' }),
      dataIndex: 'operate',
      key: 'operate',
      render: () => (
        <a onClick={this.cancelChoose}>
          <Iconfont type="iconshanchux" />
        </a>
      ),
    };

    return (
      <Modal
        title="选择话术"
        visible={visible}
        width={960}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        wrapClassName={commonStyles.flowModal}
      >
        <div className={commonStyles.chooseWrapper}>
          <Row type="flex" gutter={8}>
            {/* 创意选择左边目录树 */}
            <Col span={6}>
              <Card
                size="small"
                title={formatMessage({ id: 'activityConfigManage.flow.productCatalog' })}
                className={commonStyles.treeBox}
              >
                <div>
                  {messageFolderList && messageFolderList.length > 0 && (
                    <SearchTree {...treeProps} />
                  )}
                </div>
              </Card>
            </Col>
            {/* 创意选择列表及选中列表 */}
            <Col span={18}>
              <Card
                size="small"
                bordered={false}
                className={commonStyles.chooseWrapperCard}
                extra={
                  <Search
                    size="small"
                    placeholder={formatMessage({ id: 'common.form.input' })}
                    onChange={this.creativeInfoNameChange}
                    onPressEnter={this.qryCreativeInfoList}
                    onSearch={this.qryCreativeInfoList}
                    className={commonStyles.chooseSearch}
                  />
                }
              >
                <Table
                  dataSource={creativeInfoList}
                  columns={this.columns}
                  pagination={pagination}
                  rowSelection={rowSelection}
                  onChange={this.onChange}
                />
                <p className={commonStyles.title}>
                  {formatMessage({ id: 'activityConfigManage.contact.selectedCreative' })}
                </p>
                <Table
                  dataSource={selectedRows}
                  columns={[...this.columns, chooseTableOpe]}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default ActivitySelect;

/* eslint-disable react/no-did-update-set-state */
import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import {
  Card,
  Button,
  Input,
  Table,
  Divider,
  Form,
  Row,
  Col,
  Select,
  Popconfirm,
  message,
  Empty,
} from 'antd';
import moment from 'moment';
import { getPathCode } from '../utils';
import styles from '../index.less';
import LabelModal from './LabelModal';
import TreeModal from './TreeModal';

const { Search } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@connect(({ labelManage }) => ({
  labelListData: labelManage.labelListData,
  currentCatalogId: labelManage.currentCatalogId,
  rawLabelCatalogData: labelManage.rawLabelCatalogData,
}))
@Form.create()
class LabelListCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFilterVisible: 'none', // 是否显示高级筛选选项
      selectedRowKeys: [],
      selectedRows: [],
      labelModalVisible: false,
      labelModalTitle: '', // 查看标签 / 编辑标签 / 新建标签
      labelModalType: '', // 'read' / 'edit' / 'create'
      // labelName: '', // 想要搜索的标签的名称
      batchDelVisible: false, // 批量删除二次确认框
      batchModifyVisible: false, // 批量下架标签的二次确认框
      modifyVisible: false,
      batchMoveModalVisible: false, // 批量移动的二次确认弹出对话框
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  }

  componentDidUpdate(nextProps) {
    const {
      currentCatalogId: prevCurrentCatalogId,
      currentCatalogName: prevCurrentCatalogName,
      labelListData,
    } = this.props;
    const { selectedRows } = this.state;
    if (
      prevCurrentCatalogId != nextProps.currentCatalogId ||
      prevCurrentCatalogName != nextProps.currentCatalogName
    ) {
      this.qryLabelInfo();
    }
    if (JSON.stringify(nextProps.labelListData.data) !== JSON.stringify(labelListData.data)) {
      if (nextProps.labelListData.data && selectedRows.length && selectedRows[0] !== undefined) {
        const resultArr = [];
        selectedRows.forEach(item => {
          resultArr.push(labelListData.data.filter(_item => _item.labelId === item.labelId)[0]);
        });
        this.setState({ selectedRows: resultArr });
      }
    }
  }

  getColums = () => {
    return [
      {
        title: formatMessage(
          {
            id: 'labelConfigManage.labelManage.labelName',
          },
          '标签名称',
        ),
        dataIndex: 'labelName',
        sorter: (a, b) => {
          if (a.labelName < b.labelName) {
            return -1;
          }
          if (a.labelName > b.labelName) {
            return 1;
          }
          return 0;
        },
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                this.showLabelDetailModal(record);
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: formatMessage(
          {
            id: 'labelConfigManage.labelManage.labelCatalog',
          },
          '标签目录',
        ),
        dataIndex: 'grpName',
        sorter: (a, b) => {
          if (a.grpName < b.grpName) {
            return -1;
          }
          if (a.grpName > b.grpName) {
            return 1;
          }
          return 0;
        },
      },
      {
        title: formatMessage(
          {
            id: 'common.table.status',
          },
          '状态',
        ),
        dataIndex: 'statusCd',
        sorter: (a, b) => {
          if (a.statusCd < b.statusCd) {
            return -1;
          }
          if (a.statusCd > b.statusCd) {
            return 1;
          }
          return 0;
        },
        // 根据状态码显示不同的文字
        render: text => {
          switch (text) {
            case '00': {
              return formatMessage(
                {
                  id: 'common.table.status.invaild',
                },
                '无效',
              );
            }
            case '01': {
              return formatMessage(
                {
                  id: 'common.table.status.new',
                },
                '新增',
              );
            }
            case '02': {
              return formatMessage(
                {
                  id: 'common.table.status.onSale',
                },
                '上架中',
              );
            }
            case '03': {
              return formatMessage(
                {
                  id: 'common.table.status.offSale',
                },
                '下架中',
              );
            }
            default: {
              return '';
            }
          }
        },
      },
      {
        title: formatMessage(
          {
            id: 'common.table.createTime',
          },
          '创建时间',
        ),
        dataIndex: 'createDate',
        sorter: (a, b) => {
          if (moment(a.createDate).isBefore(b.createDate)) {
            return -1;
          }
          if (moment(a.createDate).isAfter(b.createDate)) {
            return 1;
          }
          return 0;
        },
      },
      {
        title: '修改时间',
        dataIndex: 'updateDate',
      },
      {
        title: formatMessage(
          {
            id: 'common.table.action',
          },
          '操作',
        ),
        key: 'labelAction',
        align: 'center',
        render: record => {
          // 如果当前为上架中的状态，只返回下架按钮
          // if (record.statusCd === '02') {
          //   return <a>下架</a>;
          // }
          // // 否则返回完整的按钮
          return (
            <span>
              <a
                disabled={record.statusCd === '02' || record.statusCd === '00'}
                onClick={() => {
                  this.showEditLabelModal(record);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title={`是否确认${record.statusCd === '02' ? '下架' : '上架'}?`}
                onConfirm={() => {
                  this.handleModifyState(record);
                }}
              >
                <a disabled={record.statusCd === '00'}>
                  {record.statusCd === '02' ? '下架' : '上架'}
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="是否确认删除?"
                onConfirm={() => {
                  this.handleDelete(record);
                }}
              >
                <a disabled={record.statusCd === '02'}>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
  };

  // 获取所选的标签的详细信息
  queryLabelInfoById = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelManage/queryLabelInfoById',
      payload: params,
    });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  // 显示新建标签的Modal
  showCreateLabelModal = () => {
    this.setState({
      labelModalVisible: true,
      labelModalTitle: formatMessage(
        {
          id: 'labelConfigManage.labelManage.createLabel',
        },
        '新建标签',
      ),
      labelModalType: 'create',
    });
  };

  // 显示编辑标签的Modal
  showEditLabelModal = record => {
    const { labelId } = record;
    // 获取标签详细信息
    this.queryLabelInfoById({ labelId });
    this.setState({
      labelModalVisible: true,
      labelModalTitle: formatMessage(
        {
          id: 'labelConfigManage.labelManage.editLabel',
        },
        '编辑标签',
      ),
      labelModalType: 'edit',
    });
  };

  // 显示标签详细信息
  showLabelDetailModal = record => {
    const { labelId } = record;
    // 获取标签详细信息
    this.queryLabelInfoById({ labelId });
    this.setState({
      labelModalVisible: true,
      labelModalTitle: formatMessage(
        {
          id: 'labelConfigManage.labelManage.readLabel',
        },
        '查看标签',
      ),
      labelModalType: 'read',
    });
  };

  hideLabelModal = () => {
    // 在隐藏的时候清除之前获取的标签详细信息
    const { dispatch } = this.props;
    // 清除之前保存的标签详细信息
    dispatch({
      type: 'labelManage/resetLabelInfoData',
    });
    // 清除之前保存的“标签对应字段”
    dispatch({
      type: 'labelManage/resetlabelCodeData',
    });
    this.setState({
      labelModalVisible: false,
    });
  };

  // // 切换高级筛选的显示状态
  // showAdvancedFilter = () => {
  //   const { form } = this.props;
  //   const { advancedFilterVisible } = this.state;
  //   if (advancedFilterVisible === 'none') {
  //     this.setState({
  //       advancedFilterVisible: 'block',
  //     });
  //   } else {
  //     this.setState({
  //       advancedFilterVisible: 'none',
  //     });
  //     form.resetFields(['statusCd']);
  //   }
  // };

  /**
   * @param {integer} targetPageNum 控制页数
   * 查询标签列表
   */
  qryLabelInfo = targetPageNum => {
    const { pageNum, pageSize } = this.state;
    const { form, currentCatalogId, rawLabelCatalogData, dispatch } = this.props;
    const values = form.getFieldsValue();
    dispatch({
      type: 'labelManage/getLabelInfoList',
      payload: {
        ...values,
        pathCode: getPathCode(currentCatalogId, rawLabelCatalogData),
        pageInfo: {
          pageNum: targetPageNum || pageNum,
          pageSize,
        },
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { pageInfo } = res.svcCont;
        const { pageNum: servePageNum, pageSize: servePageSize, total } = pageInfo;
        this.setState({
          pageNum: servePageNum,
          pageSize: servePageSize,
          total,
        });
      } else {
        message.error(res && res.topCont && res.topCont.remark);
      }
    });
  };

  // 情况搜索输入框
  handleEmpty = () => {
    const { form } = this.props;
    form.resetFields(['statusCd']);
  };

  // 删除标签
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelManage/delLabel',
      payload: {
        labelId: record.labelId,
        labelGrpId: record.grpId,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success('删除标签成功');

        this.qryLabelInfo(1);
      } else {
        message.error('删除标签失败');
      }
    });
  };

  // 上架或下架标签
  handleModifyState = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelManage/modifyLabelStatusCd',
      payload: {
        labelId: record.labelId,
        statusCd: record.statusCd === '02' ? '03' : '02',
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success('修改标签状态成功');

        this.qryLabelInfo(1);
      } else {
        message.error('修改标签状态失败');
      }
    });
  };

  // 批量删除标签
  handleBatchDelete = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) {
      /* 如果没有选择 */
      message.warning('请至少选中一行!');
    } else {
      let canDelete = true;
      for (let i = 0; i < selectedRows.length; i += 1) {
        if (selectedRows[i].statusCd === '02') {
          // 判断是否选中了上架中状态的标签
          message.error('无法删除上架中的标签');
          canDelete = false;
          break;
        }
      }
      if (canDelete) {
        this.setState({
          batchDelVisible: true,
        });
      }
    }
  };

  // 二次确认批量删除
  handleBatchDeleteConfirm = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    let idStr = String(selectedRows[0].labelId);
    for (let i = 1; i < selectedRows.length; i += 1) {
      idStr = idStr.concat(',', selectedRows[i].labelId);
    }
    dispatch({
      type: 'labelManage/batchDelLabel',
      payload: {
        labelIdStr: idStr,
        statusCd: '00', // 这里先写死为00，上架中的情况已经额外处理
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success(
          `${formatMessage(
            {
              id: 'labelConfigManage.labelManage.batchDeleteLabel',
            },
            '批量删除标签',
          )}${formatMessage(
            {
              id: 'common.message.successfully',
            },
            '成功',
          )}!`,
        );
        this.handleBatchDeleteCancel();
        // 成功删除后清除选中状态
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        });

        this.qryLabelInfo(1);
      } else {
        message.error(
          `${formatMessage(
            {
              id: 'labelConfigManage.labelManage.batchDeleteLabel',
            },
            '批量删除标签',
          )}${formatMessage(
            {
              id: 'common.message.failedTo',
            },
            '失败',
          )}!`,
        );
        this.handleBatchDeleteCancel();
      }
    });
  };

  // 取消批量删除
  handleBatchDeleteCancel = () => {
    this.setState({
      batchDelVisible: false,
    });
  };

  // 进行批量下架标签
  handleBatchModify = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) {
      /* 如果没有选择 */
      message.warning(
        `${formatMessage(
          {
            id: 'common.message.selectOne',
          },
          '请至少选中一行',
        )}!`,
      );
    } else {
      let canModify = true;
      for (let i = 0; i < selectedRows.length; i += 1) {
        if (selectedRows[i].statusCd !== '02') {
          canModify = false;
          message.error(
            `${formatMessage(
              {
                id: 'labelConfigManage.labelManage.onlySelectLabelOnsale',
              },
              '请只选中处于上架状态的标签',
            )}!`,
          );
          break;
        }
      }
      if (canModify) {
        this.setState({
          batchModifyVisible: true,
        });
      }
    }
  };

  batchModify = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      /* 如果没有选择 */
      message.warning(
        `${formatMessage(
          {
            id: 'common.message.selectOne',
          },
          '请至少选中一行',
        )}!`,
      );
    } else {
      let canModify = true;

      for (let i = 0; i < selectedRows.length; i += 1) {
        if (selectedRows[i].statusCd === '02') {
          canModify = false;
          message.error('请只选中处于下架状态的标签');
          break;
        }
      }
      if (canModify) {
        this.setState({
          modifyVisible: true,
        });
      }
    }
  };

  // 二次确认批量下架
  handleBatchModifyConfirm = () => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    let idStr = String(selectedRows[0].labelId);
    for (let i = 1; i < selectedRows.length; i += 1) {
      idStr = idStr.concat(',', selectedRows[i].labelId);
    }
    dispatch({
      type: 'labelManage/batchModifyLabelStatusCd',
      payload: {
        labelIdStr: idStr,
        statusCd: '03', // 修改为下架中状态
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success(
          `${formatMessage(
            {
              id: 'labelConfigManage.labelManage.batchModifyLabel',
            },
            '批量下架标签',
          )}${formatMessage(
            {
              id: 'common.message.successfully',
            },
            '成功',
          )}!`,
        );
        this.handleBatchModifyCancel();
        // 成功下架后清除选中状态
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        });

        this.qryLabelInfo(1);
      } else {
        message.error(
          `${formatMessage(
            {
              id: 'labelConfigManage.labelManage.batchModifyLabel',
            },
            '批量下架标签',
          )}${formatMessage(
            {
              id: 'common.message.failedTo',
            },
            '失败',
          )}!`,
        );
        this.handleBatchModifyCancel();
      }
    });
  };

  // 二次确认批量上
  BatchModifyConfirm = () => {
    const { selectedRows } = this.state;

    const { dispatch } = this.props;
    let idStr = String(selectedRows[0].labelId);
    for (let i = 1; i < selectedRows.length; i += 1) {
      idStr = idStr.concat(',', selectedRows[i].labelId);
    }
    dispatch({
      type: 'labelManage/batchModifyLabelStatusCd',
      payload: {
        labelIdStr: idStr,
        statusCd: '02', // 修改为下架中状态
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success('批量上架标签成功');
        this.handleBatchModifyCancel();
        // 成功下架后清除选中状态
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        });

        this.qryLabelInfo(1);
        this.setState({
          modifyVisible: false,
        });
      } else {
        message.error('批量上架标签失败');
        this.handleBatchModifyCancel();
      }
    });
  };

  // 取消批量下架
  handleBatchModifyCancel = () => {
    this.setState({
      batchModifyVisible: false,
    });
  };

  batchModifyCancel = () => {
    this.setState({
      modifyVisible: false,
    });
  };

  // 批量移动标签，显示标签目录树对话框
  handleBatchMove = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      /* 如果没有选择 */
      message.warning(
        `${formatMessage(
          {
            id: 'common.message.selectOne',
          },
          '请至少选中一行',
        )}!`,
      );
    } else {
      let canMove = true;
      for (let i = 0; i < selectedRows.length; i += 1) {
        if (selectedRows[i].statusCd === '02') {
          canMove = false;
          message.error(
            `${formatMessage(
              {
                id: 'labelConfigManage.labelManage.cannotMoveLabelOnSale',
              },
              '上架中的标签不允许在目录中移动',
            )}!`,
          );
          break;
        }
      }
      if (canMove) {
        this.setState({
          batchMoveModalVisible: true,
        });
      }
    }
  };

  handleBatchMoveConfirm = curCatalogKey => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    let idStr = String(selectedRows[0].labelId);
    for (let i = 1; i < selectedRows.length; i += 1) {
      idStr = idStr.concat(',', selectedRows[i].labelId);
    }
    dispatch({
      type: 'labelManage/batchMoveLabel',
      payload: {
        labelIdStr: idStr,
        grpId: curCatalogKey,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success(
          `${formatMessage(
            {
              id: 'labelConfigManage.labelManage.batchMoveLabel',
            },
            '批量移动标签',
          )}${formatMessage(
            {
              id: 'common.message.successfully',
            },
            '成功',
          )}!`,
        );
        this.handleBatchMoveCancel();
        // 成功下架后清除选中状态
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
        });

        this.qryLabelInfo(1);
      } else {
        message.error(
          `${formatMessage(
            {
              id: 'labelConfigManage.labelManage.batchMoveLabel',
            },
            '批量移动标签',
          )}${formatMessage(
            {
              id: 'common.message.failedTo',
            },
            '失败',
          )}!`,
        );
        this.handleBatchMoveCancel();
      }
    });
  };

  handleBatchMoveCancel = () => {
    this.setState({
      batchMoveModalVisible: false,
    });
  };

  handleTableChange = (pageNum, pageSize) => {
    this.setState(
      {
        pageNum,
        pageSize,
      },
      () => {
        this.qryLabelInfo();
      },
    );
  };

  render() {
    const {
      selectedRowKeys,
      advancedFilterVisible,
      labelModalVisible,
      labelModalTitle,
      labelModalType,
      // labelName,
      batchDelVisible,
      batchModifyVisible,
      modifyVisible,
      batchMoveModalVisible,
      pageNum,
      pageSize,
      total,
    } = this.state;
    const { form, labelListData } = this.props;
    const { getFieldDecorator } = form;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNum,
      total,
      pageSize,
      pageSizeOptions: ['5', '10', '20', '30', '40'],
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size),
    };

    return (
      <Fragment>
        <Form>
          <Card
            size="small"
            title={formatMessage(
              {
                id: 'labelConfigManage.labelManage.labelListTitle',
              },
              '标签管理',
            )}
            className={styles.labelListCard}
            /* eslint-disable  react/jsx-wrap-multilines  */
            extra={
              <div className={styles.titleExtra}>
                <Button
                  size="small"
                  type="primary"
                  className={styles.titleButton}
                  onClick={this.showCreateLabelModal}
                >
                  {formatMessage(
                    {
                      id: 'labelConfigManage.labelManage.createLabel',
                    },
                    '新建标签',
                  )}
                </Button>
                {/* <Button
                  size="small"
                  type="primary"
                  className={styles.titleButton}
                  onClick={this.handleBatchMove}
                >
                  {formatMessage(
                    {
                      id: 'labelConfigManage.labelManage.batchMove',
                    },
                    '批量移动',
                  )}
                </Button> */}
                <Popconfirm
                  title={`${formatMessage(
                    {
                      id: 'common.title.isConfirm',
                    },
                    '是否确认',
                  )}${formatMessage(
                    {
                      id: 'labelConfigManage.labelManage.batchDeleteLabel',
                    },
                    '批量删除标签',
                  )}?`}
                  visible={batchDelVisible}
                  onConfirm={this.handleBatchDeleteConfirm}
                  onCancel={this.handleBatchDeleteCancel}
                >
                  <Button
                    size="small"
                    type="primary"
                    className={styles.titleButton}
                    onClick={this.handleBatchDelete}
                  >
                    {formatMessage(
                      {
                        id: 'labelConfigManage.labelManage.batchDelete',
                      },
                      '批量删除',
                    )}
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title={`${formatMessage(
                    {
                      id: 'common.title.isConfirm',
                    },
                    '是否确认',
                  )}${formatMessage(
                    {
                      id: 'labelConfigManage.labelManage.batchModifyLabel',
                    },
                    '批量下架标签',
                  )}?`}
                  visible={batchModifyVisible}
                  onConfirm={this.handleBatchModifyConfirm}
                  onCancel={this.handleBatchModifyCancel}
                >
                  <Button
                    size="small"
                    type="primary"
                    className={styles.titleButton}
                    onClick={this.handleBatchModify}
                  >
                    {formatMessage(
                      {
                        id: 'labelConfigManage.labelManage.batchModify',
                      },
                      '批量下架',
                    )}
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="是否确认批量上架标签"
                  visible={modifyVisible}
                  onConfirm={this.BatchModifyConfirm}
                  onCancel={this.batchModifyCancel}
                >
                  <Button
                    size="small"
                    type="primary"
                    className={styles.titleButton}
                    onClick={this.batchModify}
                  >
                    批量上架
                  </Button>
                </Popconfirm>
                {/* {advancedFilterVisible === 'none' ? ( */}
                <Form.Item>
                  {getFieldDecorator('labelName')(
                    <Search
                      size="small"
                      placeholder={`${formatMessage(
                        {
                          id: 'common.form.input',
                        },
                        '请输入',
                      )}${formatMessage(
                        {
                          id: 'labelConfigManage.labelManage.labelName',
                        },
                        '标签名称',
                      )}`}
                      className={styles.titleButton}
                      onSearch={() => {
                        this.qryLabelInfo(1);
                      }}
                      // onChange={this.handleLabelNameChanged}
                      // value={labelName}
                    />,
                  )}
                </Form.Item>

                {/* <Button
                  size="small"
                  type="link"
                  className={styles.titleButton}
                  onClick={this.showAdvancedFilter}
                >
                  {formatMessage(
                    {
                      id: 'common.btn.AdvancedFilter',
                    },
                    '高级筛选',
                  )}
                  {advancedFilterVisible === 'block' ? <Icon type="up" /> : <Icon type="down" />}
                </Button> */}
              </div>
            }
          >
            {advancedFilterVisible === 'block' ? (
              <Row type="flex" justify="space-between">
                <Col span={10}>
                  <Form.Item label="状态" {...formItemLayout}>
                    {getFieldDecorator('statusCd', {
                      // rules: [{ required: true, message: '请选择标签状态！' }],
                    })(
                      /* 这里需要修改成获取静态数据 */
                      <Select size="small" placeholder="--请选择--" allowClear>
                        {/* <Option value="00">无效</Option> */}
                        <Option value="01">新增</Option>
                        <Option value="02">上架中</Option>
                        <Option value="03">下架中</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    size="small"
                    style={{ margin: '8px 5px' }}
                    onClick={() => {
                      this.qryLabelInfo(1);
                    }}
                  >
                    {formatMessage(
                      {
                        id: 'common.btn.search',
                      },
                      '查询',
                    )}
                  </Button>
                  <Button size="small" style={{ margin: '8px 5px' }} onClick={this.handleEmpty}>
                    {formatMessage(
                      {
                        id: 'common.btn.reset',
                      },
                      '重置',
                    )}
                  </Button>
                </Col>
              </Row>
            ) : null}
            <Table
              rowSelection={rowSelection}
              columns={this.getColums()}
              dataSource={labelListData && labelListData.data ? labelListData.data : []}
              pagination={paginationProps}
              rowKey="labelId"
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={formatMessage(
                      {
                        id: 'component.noticeIcon.empty',
                      },
                      '暂无数据',
                    )}
                  />
                ),
              }}
            />
          </Card>
        </Form>
        {/* 新建或编辑或查看标签的对话框 */}
        {labelModalVisible ? (
          <LabelModal
            modalVisible={labelModalVisible}
            hideModal={this.hideLabelModal}
            modalTitle={labelModalTitle}
            modalType={labelModalType}
            qryLabelInfo={this.qryLabelInfo}
          />
        ) : null}

        <TreeModal
          modalVisible={batchMoveModalVisible}
          hideModal={this.handleBatchMoveCancel}
          handleModalOK={this.handleBatchMoveConfirm}
        />
      </Fragment>
    );
  }
}

export default LabelListCard;

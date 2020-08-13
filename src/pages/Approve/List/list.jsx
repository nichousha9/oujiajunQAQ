import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Input,
  Row,
  Col,
  Icon,
  Form,
  DatePicker,
  Select,
  List,
  Pagination,
  Badge,
  Popconfirm,
  Tooltip,
  message,
} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import Iconfont from '@/components/Iconfont';
import CommonFilter from '@/components/CommonFilter';
import CopyApprove from './Components/CopyApprove';

const { Search } = Input;
const { RangePicker } = DatePicker;

const status = {
  1000: 'processing', // 1000编辑
  2000: 'success', // 2000发布
};

@connect(({ user, approveList, loading, common }) => ({
  userInfo: user.userInfo && user.userInfo.userInfo,
  approveList,
  loading: loading.effects['marketingActivityLis/qryApprovalFlowchart'],
  flowchartStates: common.attrSpecCodeList.FLOWCHART_STATE,
}))
@Form.create()
class ListItem extends React.Component {
  constructor(props) {
    super(props);
    const { approveList } = props;
    const { formValue, pageType, list } = approveList;
    this.state = {
      advancedFilterShow: false,
      list: pageType === 'back' ? list : [], // 列表
      total: 0,
      formValue: pageType === 'back' ? formValue : {},
      modalVisible: false, // 复制模板弹窗
    };
  }

  componentWillMount() {
    const { dispatch, approveList } = this.props;
    const { pageType } = approveList;
    if (pageType === 'back') {
      dispatch({
        type: 'approveList/save',
        payload: {
          pageType: '',
        },
      });
    } else {
      this.qryAttrValueByCode();
    }
  }

  componentDidUpdate(nextProps) {
    const { nodeKey, nodePath } = this.props;
    if (nodeKey != nextProps.nodeKey || nodePath != nextProps.nodePath) {
      this.fetchList();
    }
  }

  componentWillUnmount() {
    // 离开页面还原分页信息
    const { dispatch } = this.props;
    dispatch({
      type: 'approveList/save',
      payload: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
  }

  // 获取列表数据
  fetchList = () => {
    const { dispatch, nodeKey } = this.props;
    const otherPamams = this.getForm();
    dispatch({
      type: 'approveList/qryApprovalFlowchart',
      payload: {
        fold: nodeKey,
        ...otherPamams,
      },
      success: svcCont => {
        const {
          data,
          pageInfo: { total },
        } = svcCont;
        this.setState({
          list: data,
          total,
        });
      },
    });
  };

  // 获取请求表单数据
  getForm = () => {
    const { form } = this.props;
    const { validateFields } = form;
    let result = {};
    validateFields((err, values) => {
      const startDate =
        values.date && values.date[0] && values.date[0].format('YYYY-MM-DD HH:mm:ss');
      const endDate = values.date && values.date[1] && values.date[1].format('YYYY-MM-DD HH:mm:ss');
      if (!err) {
        result = { ...values, startDate, endDate };
      }
    });
    return result;
  };

  // 获取流程状态静态数据
  qryAttrValueByCode = () => {
    const { dispatch, flowchartStates } = this.props;
    if (!flowchartStates || flowchartStates.length === 0) {
      dispatch({
        type: 'common/qryAttrValueByCode',
        payload: {
          attrSpecCode: 'FLOWCHART_STATE',
        },
      });
    }
  };

  // 高级筛选展开收起
  showAdvancedFilter = () => {
    const { advancedFilterShow } = this.state;
    this.setState({
      advancedFilterShow: !advancedFilterShow,
    });
  };

  /**
   *
   *删除活动
   * @memberof ListItem
   */
  delApprovalFlowchart = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approveList/delApprovalFlowchart',
      payload: {
        id: record.id,
      },
      success: this.fetchList,
    });
  };

  /**
   *
   *复制活动
   * @memberof ListItem
   */
  copyApprovalFlowchart = (id, name) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approveList/copyApprovalFlowchart',
      payload: {
        id,
        name,
      },
      success: () => {
        this.setState(
          {
            modalVisible: false,
          },
          this.fetchList,
        );
      },
    });
  };

  // 设置复制的审批模板的信息
  setCopyApproveInfo = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approveList/save',
      payload: {
        copyApproveInfo: record,
      },
    });
    this.setState({
      modalVisible: true,
    });
  };

  // 重置
  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
    this.fetchList();
  };

  // 改变分页信息
  changePageInfo = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approveList/save',
      payload: {
        pageInfo: {
          pageNum,
          pageSize,
        },
      },
    });
    this.fetchList();
  };

  // 根据状态id找出转态名
  getStatusName = value => {
    const { flowchartStates = [] } = this.props;
    const current = flowchartStates.find(item => item.attrValueCode == value);
    return current && current.attrValueName;
  };

  // 跳到详情页
  goDetailPage = query => {
    const { dispatch, form } = this.props;
    const formValue = form.getFieldsValue();

    dispatch({
      type: 'approveList/save',
      payload: {
        formValue,
      },
    });

    router.push({
      pathname: '/approve/detail',
      query,
    });
  };

  // 取消发布状态
  cancelPublish = ({ id }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approveList/updApprovalFlowchartState',
      payload: {
        id,
        status: '1000',
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success('操作成功');
        this.fetchList();
      } else {
        message.error(res.topCont.remark || '操作失败');
      }
    });
  };

  // 整理列表操作栏
  getListActions = item => {
    const { nodeKey } = this.props;
    return [
      <a
        onClick={() => {
          this.setCopyApproveInfo(item);
        }}
      >
        {formatMessage({ id: 'common.table.action.copy' })}
      </a>,
      ...(item.status.toString() === '1000'
        ? [
            <a
              onClick={() => {
                this.goDetailPage({ id: item.id, fold: nodeKey });
              }}
            >
              {formatMessage({
                id: 'common.table.action.edit',
              })}
            </a>,
            <Popconfirm
              title={formatMessage({
                id: 'common.title.isConfirmDelete',
              })}
              onConfirm={() => {
                this.delApprovalFlowchart(item);
              }}
              okText={formatMessage({
                id: 'common.text.yes',
              })}
              cancelText={formatMessage({
                id: 'common.text.no',
              })}
            >
              <a>
                {formatMessage({
                  id: 'common.table.action.delete',
                })}
              </a>
            </Popconfirm>,
            <span className="operate-disable">取消发布</span>,
          ]
        : [
            <span className="operate-disable">
              {formatMessage({
                id: 'common.table.action.edit',
              })}
            </span>,
            <span className="operate-disable">
              {formatMessage({
                id: 'common.table.action.delete',
              })}
            </span>,
            <Popconfirm
              title="是否取消发布"
              onConfirm={() => {
                this.cancelPublish(item);
              }}
              okText={formatMessage({
                id: 'common.text.yes',
              })}
              cancelText={formatMessage({
                id: 'common.text.no',
              })}
            >
              <a>取消发布</a>
            </Popconfirm>,
          ]),
    ];
  };

  // 显示（关闭）复制模板弹窗
  setVisible = visible => {
    this.setState({
      modalVisible: visible,
    });
  };

  render() {
    const { loading, form, flowchartStates, nodeKey, approveList } = this.props;
    const { getFieldDecorator } = form;
    const { advancedFilterShow, list, formValue, total, modalVisible } = this.state;
    const { pageInfo } = approveList;
    const disabled = false;

    const topRightDiv = (
      <div>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            this.goDetailPage({ fold: nodeKey });
          }}
        >
          {formatMessage({ id: 'common.btn.new' })}
        </Button>
        {/* 根据流程名称搜索 */}
        {getFieldDecorator('name', {
          initialValue: formValue.name,
        })(
          <Search
            size="small"
            placeholder={formatMessage({ id: 'approve.list.nameTip' })}
            onSearch={this.fetchList}
            className="filter-input"
          />,
        )}
        <a className="dropdown-style" onClick={this.showAdvancedFilter}>
          {formatMessage({
            id: 'common.btn.AdvancedFilter',
          })}
          {!advancedFilterShow ? <Icon type="down" /> : <Icon type="up" />}
        </a>
      </div>
    );

    return (
      <Fragment>
        <Card
          title={formatMessage({ id: 'approve.list.title' })}
          extra={topRightDiv}
          size="small"
          className="common-card"
        >
          {advancedFilterShow && (
            <div className="show-advanced-div">
              <CommonFilter span={8} handleSubmit={this.fetchList} handleReset={this.resetForm}>
                <Form.Item label={formatMessage({ id: 'common.table.creator' })}>
                  {getFieldDecorator('createName', {
                    initialValue: formValue.createName,
                  })(
                    <Input size="small" placeholder={formatMessage({ id: 'common.form.input' })} />,
                  )}
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'common.table.createTime' })}>
                  {getFieldDecorator('date', {
                    initialValue: formValue.date,
                  })(<RangePicker size="small" />)}
                </Form.Item>
                {/* 流程状态 */}
                <Form.Item label={formatMessage({ id: 'approve.list.flowStatus' })}>
                  {getFieldDecorator('status', {
                    initialValue: formValue.status,
                  })(
                    <Select
                      size="small"
                      placeholder={formatMessage({ id: 'common.form.select' })}
                      allowClear
                    >
                      {flowchartStates.map(item => (
                        <Select.Option
                          key={item.attrValueCode}
                          value={item.attrValueCode}
                          disabled={disabled}
                        >
                          {item.attrValueName}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </CommonFilter>
            </div>
          )}
          <List
            itemLayout="horizontal"
            dataSource={list}
            loading={loading}
            className="common-list"
            renderItem={item => (
              <List.Item actions={this.getListActions(item)}>
                <List.Item.Meta
                  avatar={
                    <div className="left-lmg">
                      <Iconfont type="iconhuodong" />
                    </div>
                  }
                />
                <Row type="flex" className="list-row-style">
                  <Col span={7}>
                    <div className="deep-color">
                      <a
                        onClick={() => {
                          this.goDetailPage({ id: item.id, type: 'view' });
                        }}
                      >
                        {item.name}
                      </a>
                    </div>
                    <div className="light-color text-ellipsis">
                      <Tooltip
                        placement="bottom"
                        title={`${formatMessage({
                          id: 'common.list.description',
                        })}：${item.comments || ''}`}
                      >
                        {formatMessage({
                          id: 'common.list.description',
                        })}
                        ：{item.comments || ''}
                      </Tooltip>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="light-color">
                      {formatMessage({
                        id: 'approve.list.extCode',
                      })}
                    </div>
                    <div className="deep-color text-ellipsis">{item.code}</div>
                  </Col>
                  {/* 状态 */}
                  <Col span={3}>
                    <div className="light-color">
                      {formatMessage({
                        id: 'common.list.status',
                      })}
                    </div>
                    <div className="deep-color">
                      <Badge status={status[item.status]} text={this.getStatusName(item.status)} />
                    </div>
                  </Col>
                  <Col span={4}>
                    <div className="light-color">
                      {formatMessage({
                        id: 'common.list.startTime',
                      })}
                    </div>
                    <Tooltip placement="bottom" title={item.startDate}>
                      <div className="light-color text-ellipsis">{item.startDate}</div>
                    </Tooltip>
                  </Col>
                  <Col span={4}>
                    <div className="light-color">
                      {formatMessage({
                        id: 'common.list.endTime',
                      })}
                    </div>
                    <Tooltip placement="bottom" title={item.endDate}>
                      <div className="light-color text-ellipsis">{item.endDate}</div>
                    </Tooltip>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
          {total > 0 && (
            <div className="pagination-style">
              <Pagination
                showQuickJumper
                showSizeChanger
                onShowSizeChange={this.changePageInfo}
                defaultCurrent={1}
                current={pageInfo.pageNum}
                total={total}
                pageSize={pageInfo.pageSize}
                onChange={this.changePageInfo}
              />
            </div>
          )}
        </Card>
        {modalVisible ? (
          <CopyApprove setVisible={this.setVisible} okCallback={this.copyApprovalFlowchart} />
        ) : null}
      </Fragment>
    );
  }
}

export default ListItem;

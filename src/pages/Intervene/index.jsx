import React from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Input, Button, Icon, Select, Divider, Tabs, Row, Col, Popconfirm } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import classnames from 'classnames';
import Ellipsis from '@/components/Ellipsis';
import InterveneModal from './components/InterveneModal';
import RuleModal from './components/RuleModal';

import styles from './index.less';

const { TabPane } = Tabs;
const { Option } = Select;

@connect(({ loading })=>({
  interveneLoading: loading.effects['intervene/qryInterveneListEffect'],
  ruleLoading: loading.effects['intervene/qryInterveneRuleEffect'],
}))
@Form.create()
class Intervene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statusList: [],
      isAdvanceVisible: false,
      isInterveneVisible: false,
      isRuleVisible: false,
      // intervene 干预规则组
      interveneList: [],
      intervenePageNum: 1,
      intervenePageSize: 5,
      interveneTotal: 0,
      currentConfId: '', // 当前干预组Id
      action: '',
      selectedIntervene: {},
      // rule 规则
      ruleList: [],
      rulePageNum: 1,
      rulePageSize: 5,
      ruleTotal: 0,
      selectedRule: {},
    }
  }

  componentDidMount(){
    this.qryStatusList();
    this.qryInterveneList();
  }

  qryStatusList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'intervene/qryStatusListEffect',
      payload: { attrSpecCode: 'INTERVENE_STATUS' },
      callback: svcCont => {
        this.setState({
          statusList: svcCont.data,
        });
      }
    });
  }

  // 查询干预规则组
  qryInterveneList = pageNum => {
    const { intervenePageNum, intervenePageSize } = this.state;
    const { form, dispatch } = this.props;
    const values = form.getFieldsValue();
    dispatch({
      type: 'intervene/qryInterveneListEffect',
      payload: {
        ...values,
        pageInfo: {
          pageNum: pageNum || intervenePageNum,
          pageSize: intervenePageSize,
        },
      },
      callback: svcCont => {
        const { data, pageInfo } = svcCont;
        // 获取规则 默认选中第一行
        this.setState({
          interveneList: data,
          interveneTotal: pageInfo.total,
          intervenePageNum: pageInfo.pageNum,
          intervenePageSize: pageInfo.pageSize,
          rulePageNum: 1, // 重置
          selectedIntervene: data[0],
          ruleList: [], // 清空
        }, () => {
          this.qryRuleList();
        });
      }
    });
  }

  effectiveIntervene = confId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'intervene/effectiveInterveneEffect',
      payload: {
        confId,
      },
      callback: () => {
        this.qryInterveneList();
      }
    });
  }

  invalidIntervene = confId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'intervene/delInterveneEffect',
      payload: {
        confId,
      },
      callback: () => {
        this.qryInterveneList();
      }
    });
  }

  // 查询规则
  qryRuleList = pageNum => {
    const { selectedIntervene, rulePageNum, rulePageSize } = this.state;
    const { dispatch } = this.props;
    if(selectedIntervene) {
      dispatch({
        type: 'intervene/qryInterveneRuleEffect',
        payload: {
          confId: selectedIntervene.confId,
          pageInfo: {
            pageNum: pageNum || rulePageNum,
            pageSize: rulePageSize,
          },
        },
        callback: svcCont => {
          const { data, pageInfo } = svcCont;
    
          this.setState({
            ruleList: data,
            ruleTotal: pageInfo.total,
            rulePageNum: pageInfo.pageNum,
            rulePageSize: pageInfo.pageSize,
          });
        }
      });
    } 
  }

  /**
   * @params {String} visibleType ['Advance', 'Intervene', 'Rule']
   */
  toggleVisible = visibleType => {
    const visibleName = `is${visibleType}Visible`;
    this.setState(preState => ({ [visibleName]: !preState[visibleName] }));
  }

  // 重置
  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
  }
  
  /**
   * 
   * @param {String} action 操作类型 [add, view, edit]
   */
  showInterveneModel = action => {
    this.toggleVisible('Intervene');
    this.setState({
      action,
    });
  }

    /**
   * @param {String} record 
   * @param {String} action 操作类型 [add, view, edit]
   */
  showRuleModel = (action, record) => {
    this.toggleVisible('Rule');
    this.setState({
      action,
      selectedRule: record || {},
    });
  }

  deleteRule = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'intervene/delInterveneRuleEffect',
      payload: {
        ruleId: record.ruleId,
        confId: record.confId,
      },
      callback: () => {
        this.qryRuleList();
      }
    });
  }

  handleInterveneTableChange = (pageNum, pageSize) => {
    this.setState({
      intervenePageNum: pageNum,
      intervenePageSize: pageSize,
    }, () => {
      this.qryInterveneList();
    });
  }

  handleRuleTableChange = (pageNum, pageSize) => {
    this.setState({
      rulePageNum: pageNum,
      rulePageSize: pageSize,
    }, () => {
      this.qryRuleList();
    });
  }

  handleInterveneSearch = () => {
    this.setState({
      intervenePageNum: 1,
    }, () => {
      this.qryInterveneList();
    });
  }

  onRow = record => {
    return {
      onClick: () => {
        this.onRowClick(record);
      },
    };
  };

  onRowClick = record => {
   this.setState({
     selectedIntervene: record,
   }, () => {
     this.qryRuleList();
   });
  };

  setRowClickClassName =  record => {
    const { selectedIntervene } = this.state;
    // 判断索引相等时添加行的高亮样式
    return record.id === selectedIntervene.id ? 'tableRowSelect' : '';
  };

  render() {
    const {
      isAdvanceVisible,
      isInterveneVisible,
      interveneList,
      intervenePageNum,
      intervenePageSize,
      interveneTotal,
      selectedIntervene,
      interveneLoading,
      // Rule
      isRuleVisible,
      ruleList,
      rulePageNum,
      rulePageSize,
      ruleTotal,
      selectedRule,
      ruleLoading,
      action,
      statusList,
    } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    // 干预组
    const interveneColumns = [
      {
        title: formatMessage({ id: 'intervene.interveneName' }),
        dataIndex: 'offerId',
        render: text => (
          <Button
            type="link"
            onClick={() => {
              this.showInterveneModel('view');
            }}
          >
            <Ellipsis tooltip lines={1}>
              {text}
            </Ellipsis>
          </Button>
        ),
      },
      {
        title: formatMessage({ id: 'common.table.createTime' }),
        dataIndex: 'createTime',
      },
      {
        title: formatMessage({ id: 'common.table.updateTime' }),
        dataIndex: 'updateTime',
      },
      {
        title: formatMessage({ id: 'common.table.status' }),
        dataIndex: 'status',
        render: text =>
          text === '1'
            ? formatMessage({ id: 'common.table.status.effect' })
            : formatMessage({ id: 'common.table.status.invalid' }),
      },
      {
        title: formatMessage({ id: 'common.table.action' }),
        dataIndex: 'action',
        render: (_, record) => (
          <>
            {record.status === '1' ? (
              <>
                <a
                  onClick={() => {
                    this.showInterveneModel('edit');
                  }}
                >
                  {formatMessage({ id: 'common.table.action.edit' })}
                </a>
                <Divider type="vertical" />
                <Popconfirm
                  title={formatMessage({ id: 'common.title.isConfirm' })}
                  okText={formatMessage({ id: 'common.btn.confirm' })}
                  cancelText={formatMessage({ id: 'common.btn.cancel' })}
                  onConfirm={() => {
                    this.invalidIntervene(record.confId);
                  }}
                >
                  <a>{formatMessage({ id: 'common.table.status.invalid' })}</a>
                </Popconfirm>
              </>
            ) : (
              <a
                onClick={() => {
                  this.effectiveIntervene(record.confId);
                }}
              >
                {formatMessage({ id: 'common.table.status.effect' })}
              </a>
            )}
          </>
        ),
      },
    ];

    const intervenePaginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: intervenePageNum,
      total: interveneTotal,
      pageSize: intervenePageSize,
      pageSizeOptions: ['5', '10', '20', '30', '40'],
      onChange: (page, size) => this.handleInterveneTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleInterveneTableChange(current, size),
    }

    // 规则
    const ruleColumns = [
      {
        title: formatMessage({ id: 'intervene.ruleName' }),
        dataIndex: 'ruleName',
        render: text => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: formatMessage({ id: 'intervene.trigger' }),
        dataIndex: 'condition',
        render: text => {
          if (text) {
            let res = text.replace(new RegExp('&amp;', 'gm'), '&');
            res = res.replace(new RegExp('&lt;', 'gm'), '<');
            res = res.replace(new RegExp('&gt;', 'gm'), '>');
            return (
              <Ellipsis tooltip lines={1}>
                {res}
              </Ellipsis>
            );
          }
          return '';
        },
      },
      {
        title: formatMessage({ id: 'intervene.callback' }),
        dataIndex: 'action',
        render: text => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: formatMessage({ id: 'intervene.sort' }),
        dataIndex: 'ruleOrder',
      },
      {
        title: formatMessage({ id: 'common.table.action' }),
        dataIndex: '',
        render: (_, record) => (
          <>
            <a
              onClick={() => {
                this.showRuleModel('edit', record);
              }}
            >
              {formatMessage({ id: 'common.table.action.edit' })}
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title={formatMessage({ id: 'common.title.isConfirm' })}
              okText={formatMessage({ id: 'common.btn.confirm' })}
              cancelText={formatMessage({
                id: 'common.btn.cancel',
              })}
              onConfirm={() => {
                this.deleteRule(record);
              }}
            >
              <a href="#">{formatMessage({ id: 'common.table.action.delete' })}</a>
            </Popconfirm>
          </>
        ),
      },
    ];

    const rulePaginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: rulePageNum,
      total: ruleTotal,
      pageSize: rulePageSize,
      pageSizeOptions: ['5', '10', '20', '30', '40'],
      onChange: (page, size) => this.handleRuleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleRuleTableChange(current, size),
    }

    const extraBlock = (
      <div className={styles.extraBlock}>
        <Form.Item>
          {getFieldDecorator('offerId')(
            <Input.Search
              size="small"
              allowClear
              placeholder={formatMessage({ id: 'intervene.interveneNamePlaceHolder' })}
              onSearch={() => { this.handleInterveneSearch(); }}
            />
          )}
        </Form.Item>
        <Button size="small" onClick={this.resetForm} className={styles.marginHalfFont}>
          {formatMessage({ id: 'common.btn.reset' })}
        </Button>
        <a className={classnames(["dropdown-style", styles.marginHalfFont])} onClick={() => { this.toggleVisible('Advance') }}>
          {formatMessage({
            id: 'common.btn.AdvancedFilter',
          })}
          {isAdvanceVisible === 'none' ? <Icon type="down" /> : <Icon type="up" />}
        </a>
        <Button size="small" type="primary" onClick={()=>{ this.showInterveneModel('add')}}>
          {formatMessage({ id: 'intervene.addIntervene' })}
        </Button>
      </div>
    );

    const tabBarExtra = (
      <Button size="small" type="primary" onClick={() => {this.showRuleModel('add');}}>
        {formatMessage({ id: 'intervene.addRule' })}
      </Button>
    );

    return (
      <>
        <Form>
          <Card
            size="small"
            title={formatMessage({ id: 'intervene.interveneRule' })}
            className="common-card"
            extra={extraBlock}
          >
            {isAdvanceVisible ? (
              <Row className={styles.advanceForm}>
                <Col sm={{ span: 24 }} md={{ span: 12 }}>
                  <Form.Item
                    label={formatMessage({ id: 'common.table.status' })}
                    {...formItemLayout}
                  >
                    {getFieldDecorator('status')(
                      <Select
                        size="small"
                        placeholder={formatMessage({ id: 'common.form.select' })}
                        allowClear
                      >
                        {statusList.map(status => (
                          <Option key={status.attrValueCode}>{status.attrValueName}</Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col sm={{ span: 24 }} md={{ span: 6 }}>
                  <Button
                    size="small"
                    type="primary"
                    className={styles.searchBtn} 
                    onClick={() => {
                      this.handleInterveneSearch();
                    }}
                  >
                    {formatMessage({ id: 'common.btn.search' })}
                  </Button>
                </Col>
              </Row>
            ) : null}

            <Table
              rowKey={record => record.confId}
              dataSource={interveneList}
              columns={interveneColumns}
              pagination={intervenePaginationProps}
              rowClassName={this.setRowClickClassName}
              onRow={this.onRow}
              loading={interveneLoading}
            />
            <Tabs type="card" className={styles.ruleTab} tabBarExtraContent={tabBarExtra}>
              <TabPane tab={formatMessage({ id: 'intervene.interveneRule' })} key="rule">
                <Table
                  rowKey={record => record.ruleId}
                  dataSource={ruleList}
                  columns={ruleColumns}
                  pagination={rulePaginationProps}
                  loading={ruleLoading}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Form>
        {isInterveneVisible ? (
          <InterveneModal
            selectedIntervene={selectedIntervene}
            action={action}
            toggleVisible={this.toggleVisible}
            isInterveneVisible={isInterveneVisible}
            qryInterveneList={this.qryInterveneList}
          />
        ) : null}
        {isRuleVisible ? (
          <RuleModal
            selectedRule={selectedRule}
            selectedIntervene={selectedIntervene}
            action={action}
            toggleVisible={this.toggleVisible}
            isRuleVisible={isRuleVisible}
            qryRuleList={this.qryRuleList}
          />
        ) : null}
      </>
    );
  }
}

export default Intervene;

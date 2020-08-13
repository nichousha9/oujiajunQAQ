import React, { Component } from 'react';
import { Card, Form, DatePicker, Button, Table, Select } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import moment from 'moment';
import LabelFormItem from './components/LabelFormItem';
import styles from './index.less';
const { MonthPicker } = DatePicker;
const { Column } = Table;
const { Option } = Select;

@connect(() => ({}))
@Form.create()
class ArrearageDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 分页
      pageInfo: {
        pageNum: 1, // 当前页码
        pageSize: 10, // 每页条数
        total: '', // 总页数
      },
      largeOweUser: '', // 是否为大额欠费用户
      qryType: '', // 查询详情分析的类型
      monthId: '', // 账期
      lanId: '', // 地市id
      lanMenu: [], // 下拉地市
      lanName: localStorage.getItem('lanName'), // 初始的地市选择
      composeValue: '', // 分析类型
      composeMenu: [], // 分析下拉菜单
      tableData: [], // 表格数据
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const { query } = location;
    this.setState(
      {
        largeOweUser: query.type ? '' : 1,
        qryType: query.type,
        monthId: query.monthId,
        lanId: query.lanId,
      },
      () => {
        this.fetchData();
        this.fetchLan();
        this.fetchProdType();
      },
    );
  }

  // 获取列表数据
  fetchData = () => {
    const { dispatch } = this.props;
    const { pageInfo, largeOweUser, monthId, lanId, composeValue, qryType } = this.state;
    const { pageNum, pageSize } = pageInfo;
    const payload = {
      pageInfo: {
        pageNum,
        pageSize,
      },
      // 是否查询大额欠费
      largeOweUser,
      monthId,
      lanId,
    };
    if (qryType) payload[this.getParams('req')] = composeValue;
    dispatch({
      type: 'arrearageDetails/qryDetailsList',
      payload,
      success: svcCont => {
        const { data = [], pageInfo: pageInfoData } = svcCont;
        this.setState({
          pageInfo: {
            ...pageInfo,
            total: pageInfoData.total,
          },
          tableData: data,
        });
      },
    });
  };

  // 获取地市下拉
  fetchLan = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'arrearageDetails/qryOrganizationLevel2',
      payload: {
        parRegionId: 10008,
      },
      success: svcCont => {
        const { data = [] } = svcCont;
        const lanMenu = data.map(item => {
          return {
            lanId: item.lanId,
            lanName: item.regionName,
          };
        });
        this.setState({
          lanMenu,
        });
      },
    });
  };

  // 获取分析菜单下拉
  fetchProdType = () => {
    const { dispatch } = this.props;
    const { monthId, qryType } = this.state;
    // 不同分析对应的请求接口
    const type = {
      prod: 'ProdType',
      channel: 'ProdChannel',
      reason: 'OweReason',
    };
    dispatch({
      type: `arrearageDetails/qry${type[qryType]}Compose`,
      payload: {
        monthId,
      },
      success: svcCont => {
        const { data = [] } = svcCont;
        const composeMenu = data.map(item => {
          return {
            composeType: item[this.getParams('res')[0]],
            composeName: item[this.getParams('res')[1]],
          };
        });
        this.setState({
          composeMenu,
        });
      },
    });
  };

  // 生成业务类型 下拉菜单
  createComposeMenu = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { qryType, composeMenu } = this.state;
    if (!qryType) return null;
    return (
      <LabelFormItem title={formatMessage({ id: `arrearage.details.${qryType}Name` })}>
        {getFieldDecorator('compose', { initialValue: '全部' })(
          <Select
            size="small"
            onChange={this.handleChangeProdType}
            placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
          >
            <Option value="all" key="all">
              全部
            </Option>
            {composeMenu.map(item => (
              <Option value={item.composeType} key={item.composeType}>
                {item.composeName}
              </Option>
            ))}
          </Select>,
        )}
      </LabelFormItem>
    );
  };

  // 生成业务类型列
  createComposeColumn = () => {
    const { qryType } = this.state;
    if (!qryType) return null;
    return (
      <Column
        title={formatMessage({ id: `arrearage.details.${qryType}Name` })}
        dataIndex={this.getParams('res')[1]}
        key={this.getParams('res')[1]}
      />
    );
  };

  // 欠费金额排序
  handleSort = (a, b) => {
    return parseFloat(a.allOweAmount) - parseFloat(b.allOweAmount);
  };

  // 改变页码
  handleChangePage = page => {
    const { pageInfo } = this.state;
    this.setState(
      {
        pageInfo: {
          ...pageInfo,
          pageNum: page,
        },
      },
      this.fetchData,
    );
  };

  // 改变每页显示条数
  handleChangeSize = (current, size) => {
    const { pageInfo } = this.state;
    this.setState(
      {
        pageInfo: {
          ...pageInfo,
          pageSize: size,
        },
      },
      this.fetchData,
    );
  };

  // 改变账期
  handleChangeMonthId = (date, dateString) => {
    this.setState({
      monthId: dateString,
    });
  };

  // 改变地市
  handleChangeLanId = value => {
    this.setState({
      lanId: value,
    });
  };

  // 改变分析类型
  handleChangeProdType = value => {
    this.setState({
      composeValue: value,
    });
  };

  // 处理点击查询
  handleClickQuery = () => {
    this.fetchData();
  };

  // 导出数据
  handleExportData = () => {
    const { largeOweUser, monthId, lanId, qryType, composeValue } = this.state;
    const url = `/mccm-service/geekUnion/ZqythWidCustProdInfoMController/exportDetailsList?largeOweUser=${largeOweUser}&monthId=${monthId}&lanId=${lanId}&type=${qryType}&${this.getParams(
      'req',
    )}=${composeValue}`;
    const a = document.createElement('a');
    a.download = url;
    a.href = url;
    a.target = '_bank';
    a.click();
    a.remove();
  };

  // 根据不同的分析类型返回相对应的res或req参数
  getParams = type => {
    const { qryType } = this.state;
    // 不同分析对应的请求接口
    const req = {
      prod: 'prodType',
      channel: 'operChannel',
      reason: 'oweReasonId',
    };
    // 不同分析对应的返回id
    const res = {
      prod: ['prodType', 'prodTypeName'],
      channel: ['operChannel', 'operChannel'],
      reason: ['oweReasonId', 'oweReasonDesc'],
    };
    if (type === 'res') {
      return res[qryType];
    }
    return req[qryType];
  };

  render() {
    const { form, history } = this.props;
    const { tableData, pageInfo, monthId, lanMenu, lanName } = this.state;
    const { pageSize, total } = pageInfo;
    const { getFieldDecorator } = form;

    return (
      <Card bordered={false} headStyle={{ border: 'none' }}>
        <Form className={styles.arrearageFormStyle}>
          <LabelFormItem title={formatMessage({ id: 'arrearage.details.monthId' }, '账期')}>
            {getFieldDecorator('monthNum', { initialValue: moment(monthId, 'YYYYMM') })(
              <MonthPicker
                style={{ minWidth: 100 }}
                size="small"
                showTime
                format="YYYYMM"
                onChange={this.handleChangeMonthId}
                placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
              />,
            )}
          </LabelFormItem>
          <LabelFormItem title={formatMessage({ id: 'arrearage.details.regionName' }, '地市名称')}>
            {getFieldDecorator('lanId', { initialValue: lanName })(
              <Select
                size="small"
                onChange={this.handleChangeLanId}
                placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
              >
                <Option value="" key="all">
                  全部
                </Option>
                {lanMenu.map(item => (
                  <Option value={item.lanId} key={item.lanId}>
                    {item.lanName}
                  </Option>
                ))}
              </Select>,
            )}
          </LabelFormItem>
          {this.createComposeMenu()}
          <div className="item">
            <Button
              size="small"
              type="primary"
              style={{ marginRight: 10 }}
              onClick={this.handleClickQuery}
            >
              {formatMessage({ id: 'common.btn.search' }, '查询')}
            </Button>
            <Button
              style={{ marginRight: 10 }}
              size="small"
              icon="upload"
              onClick={this.handleExportData}
            >
              {formatMessage({ id: 'arrearage.details.exportData' }, '导出')}
            </Button>
            <Button
              size="small"
              onClick={() => {
                history.goBack();
              }}
            >
              返回
            </Button>
          </div>
        </Form>
        <Table
          dataSource={tableData}
          rowKey="custCode"
          pagination={{
            allowClear: false,
            showQuickJumper: true,
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize: pageSize,
            pageSize,
            total,
            onChange: this.handleChangePage,
            onShowSizeChange: this.handleChangeSize,
          }}
        >
          <Column
            title={formatMessage({ id: 'arrearage.details.monthId', defaultMessage: '账期' })}
            dataIndex="monthId"
            key="monthId"
          />
          <Column
            title={formatMessage({
              id: 'arrearage.details.regionName',
              defaultMessage: '地市名称',
            })}
            dataIndex="lanName"
            key="lanName"
          />
          <Column
            title={formatMessage({ id: 'arrearage.details.countyName', defaultMessage: '区县' })}
            dataIndex="countyName"
            key="countyName"
          />
          {this.createComposeColumn()}
          <Column
            title={formatMessage({ id: 'arrearage.details.custName', defaultMessage: '企业名称' })}
            dataIndex="custName"
            key="custName"
          />
          <Column
            title={formatMessage({ id: 'arrearage.details.custCode', defaultMessage: '客户编码' })}
            dataIndex="custCode"
            key="custCode"
          />
          <Column
            title={formatMessage({
              id: 'arrearage.details.allOweAmount',
              defaultMessage: '欠费金额',
            })}
            dataIndex="allOweAmount"
            key="allOweAmount"
            sorter={this.handleSort}
            render={allOweAmount => (
              <span>
                <span style={{ marginRight: 5 }}>&yen;</span>
                {allOweAmount}
              </span>
            )}
          />
          {/* 客户状态预留 */}
          {/* <Column title={formatMessage({id: 'arrearage.details.custStatus', defaultMessage: '客户状态'})} dataIndex="custStatus" key="custStatus" /> */}
          <Column
            title={formatMessage({
              id: 'arrearage.details.managerNamePhone',
              defaultMessage: '所属客户经理',
            })}
            dataIndex="managerNamePhone"
            key="managerNamePhone"
          />
        </Table>
        ,
      </Card>
    );
  }
}

export default ArrearageDetails;

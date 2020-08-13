import React from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, DatePicker, Table, Button, TreeSelect, Tooltip } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
// import _ from 'lodash';
import styles from './index.less';
import { formatCurrency } from '@/utils/formatData';

const { MonthPicker } = DatePicker;

@connect(({ arrearageInfo, loading }) => ({
  arrearageList: arrearageInfo.arrearageList,
  pageInfo: arrearageInfo.pageInfo,
  arrearageListEffectLoading: loading.effects['arrearageInfo/fetchArrearageListEffect'],
}))
@Form.create()
class ArrearageInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      selectedAreaId: null,
    };
  }

  componentDidMount() {
    this.qryArrearageList();
  }

  // formatCurrency = originAmountText => {
  //   const originAmountNum = Number(originAmountText);
  //   if(!_.isNumber(originAmountNum)) {
  //     return '--';
  //   }

  //   const fixedAmountNum = originAmountNum.toFixed(2);
  //   const [integer, decimal] = String(fixedAmountNum).split('.');
  //   let formatInteger = integer.split('').reverse().join('');
  //   formatInteger = formatInteger.match(/\d{1,3}/g).join(',');
  //   return `${formatInteger.split('').reverse().join('')}.${decimal}`;
  // }

  handleTableChange = (pageNum, pageSize) => {
    const { dispatch, pageInfo } = this.props;
    dispatch({
      type: 'arrearageInfo/getPageInfo',
      payload: { ...pageInfo, pageNum, pageSize },
    });

    this.qryArrearageList();
  };

  handleSearch = () => {
    const { dispatch, pageInfo } = this.props;
    dispatch({
      type: 'arrearageInfo/getPageInfo',
      payload: { ...pageInfo, pageNum: 1 },
    });

    this.qryArrearageList();
  };

  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  qryArrearageList = async () => {
    const { form, dispatch } = this.props;
    const { selectedAreaId: area } = this.state;
    const values = form.getFieldsValue();
    const { date } = values;
    const payload = {
      area,
      date: date ? date.format('YYYY-MM') : undefined,
    };
    await dispatch({
      type: 'arrearageInfo/fetchArrearageListEffect',
      payload,
    });
  };

  qryAreaTreeData = async value => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'arrearageInfo/fetchAreaTreeData',
      payload: { value },
      callback: svcCont => {
        const treeData = this.formatTreeData(svcCont.data);
        this.setState({
          treeData,
        });
      },
    });
  };

  onLoadData = treeNode => {
    return new Promise(resolve => {
      const { id } = treeNode.props;
      resolve(id);
    });
  };

  formatTreeData = data => {
    // const treeArr = data.map(item => ({
    //   value: item.title,
    //   title: item.title,
    //   id: item.id,
    //   children: [],
    // }));

    return data;
  };

  onTreeSelect = (_, node) => {
    this.setState({
      selectedAreaId: node.props.id,
    });
  };

  onDownLoad = () => {
    const { form } = this.props;
    const values = form.getFieldsValue();
    const { date } = values;
    const { selectedAreaId: area } = this.state;
    const formatDate = date ? date.format('YYYY-MM') : undefined;
    let url = '#';
    if (formatDate && area) {
      url = `${url}?date=${formatDate}&area=${area}`;
    } else if (formatDate && !area) {
      url = `${url}?date=${formatDate}`;
    } else if (!formatDate && area) {
      url = `${url}?area=${area}`;
    }
    window.open(url);
  };

  render() {
    const { treeData } = this.state;
    const { form, arrearageList, pageInfo, arrearageListEffectLoading } = this.props;
    const { getFieldDecorator } = form;
    const { total, pageNum, pageSize } = pageInfo;

    // Todo: 对应字段
    const columns = [
      {
        title: formatMessage({ id: 'arrearageInfo.customerCode' }, '客户编码'),
        dataIndex: 'customerCode',
        fixed: 'left',
        width: 100,
        // sorter: (a, b) => a.customerCode - b.customerCode,
        // sortDirections: ['descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'arrearageInfo.customerName' }, '客户姓名'),
        dataIndex: 'customerName',
        fixed: 'left',
        width: 120,
        render: text =>
          text ? (
            <div className="tableCol">
              <Tooltip placement="topLeft" title={text}>
                {text.length > 12 ? `${text.slice(0, 12)}...` : text}
              </Tooltip>
            </div>
          ) : (
            '--'
          ),
      },
      {
        title: formatMessage({ id: 'arrearageInfo.ownedSubsidiary' }, '所属分公司'),
        dataIndex: 'companyName',
        fixed: 'left',
        width: 120,
        render: text =>
          text ? (
            <div className="tableCol">
              <Tooltip placement="topLeft" title={text}>
                {text.length > 12 ? `${text.slice(0, 12)}...` : text}
              </Tooltip>
            </div>
          ) : (
            '--'
          ),
      },
      {
        title: formatMessage({ id: 'arrearageInfo.area' }, '区县'),
        dataIndex: 'area',
      },
      {
        title: formatMessage({ id: 'arrearageInfo.ownedNet' }, '所属网格'),
        dataIndex: 'net',
      },
      {
        title: formatMessage({ id: 'arrearageInfo.arrearsAccountPeriod' }, '欠费账期'),
        dataIndex: 'date',
      },
      {
        title: formatMessage({ id: 'arrearageInfo.totalArrearsAmount(yuan)' }, '总欠费金额（元）'),
        dataIndex: 'totalArrearsAmount',
        render: text => (text ? formatCurrency(text) : '--'),
      },
      {
        title: formatMessage({ id: 'arrearageInfo.goodName' }, '产品名称'),
        dataIndex: 'goodName',
      },
      {
        title: formatMessage({ id: 'arrearageInfo.goodCode' }, '产品号码'),
        dataIndex: 'goodCode',
      },
      {
        title: formatMessage(
          { id: 'arrearageInfo.productArrearsAmount(yuan)' },
          '产品欠费金额（元）',
        ),
        dataIndex: 'goodArrearage',
        render: text => (text ? formatCurrency(text) : '--'),
      },
      {
        title: formatMessage(
          { id: 'arrearageInfo.whetherAllUsersAreInArrears' },
          '是否所有用户欠费',
        ),
        dataIndex: 'isArrearageAll',
      },
      {
        title: formatMessage({ id: 'arrearageInfo.ownedAccountManager' }, '所属客户经理'),
        dataIndex: 'accountManager',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNum,
      total,
      pageSize,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size),
    };

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

    return (
      <Card
        size="small"
        title={formatMessage(
          {
            id: 'menu.arrearageInfo',
          },
          '欠费信息',
        )}
      >
        <Form {...formItemLayout} className={styles.arrearageFormStyle}>
          <Row gutter={16} className="row-bottom-line">
            <Col sm={{ span: 24 }} md={{ span: 7 }}>
              {/* 对应字段 */}
              <Form.Item label={formatMessage({ id: 'arrearageInfo.chooseDate' }, '选择时间')}>
                {getFieldDecorator('date')(
                  <MonthPicker
                    size="small"
                    showTime
                    format="YYYY-MM"
                    placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} md={{ span: 8 }}>
              {/* 对应字段 */}
              <Form.Item label={formatMessage({ id: 'arrearageInfo.chooseArea' }, '选择地点')}>
                {getFieldDecorator('area')(
                  <TreeSelect
                    showSearch
                    allowClear
                    size="small"
                    treeIcon
                    treeData={treeData}
                    placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
                    searchPlaceholder={formatMessage({ id: 'arrearageInfo.searchTreePlaceholder' })}
                    onSearch={this.qryAreaTreeData}
                    onSelect={this.onTreeSelect}
                    loadData={this.onLoadData}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col className={styles.btnGroup}>
              <Button
                size="small"
                type="primary"
                onClick={this.handleSearch}
                className={styles.btn}
              >
                {formatMessage(
                  {
                    id: 'common.btn.search',
                  },
                  '搜索',
                )}
              </Button>
              <Button size="small" onClick={this.resetForm}>
                {formatMessage(
                  {
                    id: 'common.btn.reset',
                  },
                  '重置',
                )}
              </Button>
            </Col>
          </Row>
        </Form>

        <Table
          rowKey={record => record.customerCode}
          dataSource={arrearageList}
          columns={columns}
          pagination={paginationProps}
          loading={arrearageListEffectLoading}
          scroll={{ x: 1500 }}
        />

        <Row className={styles.exportBtnRow}>
          <Button
            icon="upload"
            onClick={() => {
              this.onDownLoad();
            }}
          >
            {formatMessage({ id: 'arrearageInfo.exportData' }, '导出数据')}
          </Button>
        </Row>
      </Card>
    );
  }
}

export default ArrearageInfo;

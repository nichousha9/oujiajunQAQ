import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Input, Button, Row, Col, DatePicker } from 'antd';
import moment from 'moment';
import style from '../index.less';

@connect(({ campaignMonitor }) => ({
  advancedSearchData: campaignMonitor.advancedSearchData,
  pageInfo: campaignMonitor.pageInfo,
  operationsModal: campaignMonitor.operationsModal,
  rulesModal: campaignMonitor.rulesModal,
  activityModal: campaignMonitor.activityModal,
}))
@Form.create({
  name: 'advanced_search',
})
class AdvancedSearch extends Component {

  componentDidMount() {
    // 初始化高级筛选表单值
    this.initAdvancedSearchData();
  }

  componentWillReceiveProps(nextProps) {
    // 更新暂存高级筛选表单值
    this.changeFormData(nextProps);
  }

  // 初始化高级筛选表单值
  initAdvancedSearchData = () => {
    const {
      form: { setFieldsValue },
      advancedSearchData = {},
      activityModal = {},
      rulesModal = {},
      operationsModal = {},
    } = this.props;
    const { startDate, endDate, contactNumber } = advancedSearchData;

    // 格式化日期
    const startTime = startDate ? moment(startDate, 'YYYY-MM-DD HH:mm:ss') : undefined;
    const endTime = endDate ? moment(endDate, 'YYYY-MM-DD HH:mm:ss') : undefined;

    let { choosedData: activityName = [] } = activityModal;
    let { choosedData: ruleName = [] } = rulesModal;
    let { choosedData: operationName = [] } = operationsModal;

    // 获取名称
    activityName = activityName.map(item => item.extName).join(', ');
    ruleName = ruleName.map(item => item.groupName).join(', ');
    operationName = operationName.map(item => item.adviceChannelName).join(', ');

    setFieldsValue({
      activityName,
      ruleName,
      operationName,
      contactNumber,
      startTime,
      endTime,
    });
  };

  // 更新暂存高级筛选表单值
  changeFormData = nextProps => {
    const {
      form: { setFieldsValue },
      activityModal = {},
      rulesModal = {},
      operationsModal = {},
    } = this.props;
    let { choosedData: activityName = [] } = activityModal;
    let { choosedData: ruleName = [] } = rulesModal;
    let { choosedData: operationName = [] } = operationsModal;

    // 获取名称
    activityName = activityName.map(item => item.extName).join(', ');
    ruleName = ruleName.map(item => item.groupName).join(', ');
    operationName = operationName.map(item => item.adviceChannelName).join(', ');

    const {
      activityModal: nActivityModal = {},
      rulesModal: nRulesModal = {},
      operationsModal: nOperationsModal = {},
    } = nextProps;
    let { choosedData: nActivityName = [] } = nActivityModal;
    let { choosedData: nRuleName = [] } = nRulesModal;
    let { choosedData: nOperationName = [] } = nOperationsModal;

    // 获取名称
    nActivityName = nActivityName.map(item => item.extName).join(', ');
    nRuleName = nRuleName.map(item => item.groupName).join(', ');
    nOperationName = nOperationName.map(item => item.adviceChannelName).join(', ');

    if (
      activityName !== nActivityName ||
      ruleName !== nRuleName ||
      operationName !== nOperationName
    ) {
      setFieldsValue({
        activityName: nActivityName,
        ruleName: nRuleName,
        operationName: nOperationName,
      });
    }
  };

  // 日期表单控件逻辑 start
  disabledStartDate = startValue => {
    const { form } = this.props
    const { getFieldValue } = form
    const endTime = getFieldValue('endTime')
    if (!startValue || !endTime) {
      return false;
    }
    return startValue.valueOf() > endTime.valueOf();
  };

  disabledEndDate = endValue => {
    const { form } = this.props
    const { getFieldValue } = form
    const startTime = getFieldValue('startTime')
    if (!endValue || !startTime) {
      return false;
    }
    return endValue.valueOf() <= startTime.valueOf();
  };

  onChange = (field, value) => {
    const { form } = this.props
    const { setFieldsValue } = form
    setFieldsValue({
      [field]: value,
    })
  };

  onStartChange = value => {
    this.onChange('startTime', value);
  };

  onEndChange = value => {
    this.onChange('endTime', value);
  };
  // 日期表单控件逻辑 end

  // 搜索
  handleSearch = () => {
    const { getMonitorList, pageInfo: { pageSize } } = this.props;
    // 保存搜索值，以便后续使用
    const formData = this.saveAdvancedSearchData();

    // 获取列表数据
    getMonitorList({ 
      ...formData,
      pageInfo: {
        pageNum: 1,
        pageSize
      }
    });
  };

  // 保存高级筛选搜索数据
  saveAdvancedSearchData = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      activityModal = {},
      rulesModal = {},
      operationsModal = {},
    } = this.props;

    const { choosedData: activityName = [] } = activityModal;
    const { choosedData: ruleName = [] } = rulesModal;
    const { choosedData: operationName = [] } = operationsModal;
    // 获取 ID
    const activityIds = activityName.map(item => item.id);
    const ruleIds = ruleName.map(item => item.groupId);
    const operationIds = operationName.map(item => item.adviceChannel);
    let formData = getFieldsValue();

    // 格式化日期
    let { startTime, endTime } = formData;
    const { contactNumber } = formData
    startTime = startTime ? startTime.format('YYYY-MM-DD HH:mm:ss') : '';
    endTime = endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : '';

    // 格式化 formData
    formData = {
      campaignIds: activityIds,
      rulesIds: ruleIds,
      adviceChannels: operationIds,
      startDate: startTime,
      endDate: endTime,
      contactNumber
    };

    dispatch({
      type: 'campaignMonitor/saveAdvancedSearchData',
      payload: formData,
    });

    return formData;
  };

  // 重置表单
  resetForm = () => {
    const {
      form: { resetFields },
    } = this.props;

    // 清空搜索 Modal 选中项
    this.clearModalChoosedData('Activity');
    this.clearModalChoosedData('Rules');
    this.clearModalChoosedData('Operation');

    resetFields();
  };

  // 清空搜索 Modal 选中项
  clearModalChoosedData = type => {
    const { dispatch } = this.props;

    dispatch({
      type: `campaignMonitor/save${type}ChoosedData`,
      payload: [],
    });
  };

  // 清空输入框的值的回调
  clearInputCallback = (e, type) => {
    if (!e.value) {
      this.clearModalChoosedData(type);
    }
  };

  // 搜索活动
  handleSearchActivity = () => {
    // 显示Modal
    this.handleShowSearchModal('activity');
  };

  // 搜索运营位
  handleSearchOperation = () => {
    // 显示Modal
    this.handleShowSearchModal('operations');

    // 改变运营位搜索值
    // this.changeOperationSearchVal(val);

    // 获取运营位列表数据
    this.getOperationList();
  };

  // 搜索规则组
  handleSearchRules = () => {
    // 显示Modal
    this.handleShowSearchModal('rules');

    // 改变规则组搜索值
    // this.changeRulesSearchVal(val);

    // 获取规则组列表数据
    this.getRulesList();
  };

  // 改变运营位搜索值
  changeOperationSearchVal = val => {
    const { dispatch } = this.props;

    dispatch({
      type: 'campaignMonitor/changeOperationSearchVal',
      payload: val,
    });
  };

  // 改变规则组搜索值
  changeRulesSearchVal = val => {
    const { dispatch } = this.props;

    dispatch({
      type: 'campaignMonitor/changeRulesSearchVal',
      payload: val,
    });
  };

  // 根据运营位名称获取运营位列表
  getOperationList = operationName => {
    const { dispatch, operationsModal = {} } = this.props;
    const { allDataPageInfo = {} } = operationsModal;
    const { pageNum, pageSize } = allDataPageInfo;

    return dispatch({
      type: 'campaignMonitor/getOperationListEffect',
      payload: {
        channelId: '',
        adviceChannelName: operationName || '',
        adviceChannelCode: '',
        state: '1',
        pageInfo: {
          pageNum,
          pageSize,
        },
      },
    });
  };

  // 根据规则组名称获取规则组列表
  getRulesList = rulesName => {
    const { dispatch, rulesModal = {} } = this.props;
    const { allDataPageInfo = {} } = rulesModal;
    const { pageNum, pageSize } = allDataPageInfo;

    return dispatch({
      type: 'campaignMonitor/getRulesListEffect',
      payload: {
        groupName: rulesName || '',
        state: '',
        pageInfo: {
          pageNum,
          pageSize,
        },
      },
    });
  };

  // 处理显示哪个搜索 Modal
  handleShowSearchModal = which => {
    const { dispatch } = this.props;

    dispatch({
      type: 'campaignMonitor/handleShowSearchModal',
      payload: which,
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form layout="inline" className={style.AdvancedSearchForm} labelAlign="right">
        <Row className={style.rowBorderBottom}>
          <Col span={3} className={style.rowBorderBottom}>
            <span className={style.title}>
              {formatMessage({
                id: 'campaignMonitor.otherChoose'
              }, "其他选项").concat(' : ')}
            </span>
          </Col>
          <Col span={21}>
            <Row className={style.rowBorderBottom}>
              <Col span={6}>
                <Form.Item 
                  label={formatMessage({
                    id: 'campaignMonitor.activityName'
                  }, "活动名称")}
                >
                  {getFieldDecorator('activityName')(
                    <Input.Search
                      readOnly
                      size="small"
                      allowClear
                      placeholder={formatMessage({
                        id: 'campaignMonitor.activityName'
                      }, "活动名称")}
                      onSearch={this.handleSearchActivity}
                      onChange={e => this.clearInputCallback(e, 'Activity')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item 
                  label={formatMessage({
                    id: 'campaignMonitor.rulesName'
                  }, "规则组名称")}
                >
                  {getFieldDecorator('ruleName')(
                    <Input.Search
                      readOnly
                      size="small"
                      allowClear
                      placeholder={formatMessage({
                        id: 'campaignMonitor.rulesName'
                      }, "规则组名称")}
                      onSearch={this.handleSearchRules}
                      onChange={e => this.clearInputCallback(e, 'Rules')}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item 
                  label={formatMessage({
                    id: 'campaignMonitor.operationName'
                  }, "运营位名称")}
                >
                  {getFieldDecorator('operationName')(
                    <Input.Search
                      readOnly
                      size="small"
                      allowClear
                      placeholder={formatMessage({
                        id: 'campaignMonitor.operationName'
                      }, "运营位名称")}
                      onSearch={this.handleSearchOperation}
                      onChange={e => this.clearInputCallback(e, 'Operation')}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item 
                  label={formatMessage({
                    id: 'campaignMonitor.contactNumber'
                  }, "会员号码")}
                >
                  {getFieldDecorator('contactNumber')(
                    <Input
                      size="small"
                      placeholder={formatMessage({
                        id: 'campaignMonitor.contactNumber'
                      }, "会员号码")}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item 
                  label={formatMessage({
                    id: 'campaignMonitor.startTime'
                  }, "开始时间")}
                >
                  {getFieldDecorator('startTime')(
                    <DatePicker
                      size="small"
                      disabledDate={this.disabledStartDate}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder={formatMessage({
                        id: 'campaignMonitor.startTime'
                      }, "开始时间")}
                      onChange={this.onStartChange}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item 
                  label={formatMessage({
                    id: 'campaignMonitor.endTime'
                  }, "结束时间")}
                >
                  {getFieldDecorator('endTime')(
                    <DatePicker
                      size="small"
                      disabledDate={this.disabledEndDate}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder={formatMessage({
                        id: 'campaignMonitor.endTime'
                      }, "结束时间")}
                      onChange={this.onEndChange}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={6} className={style.btnCol}>
                <Button size="small" type="primary" onClick={this.handleSearch}>
                  {formatMessage({
                    id: 'campaignMonitor.search'
                  }, "搜索")}
                </Button>
                <Button size="small" onClick={this.resetForm}>
                  {formatMessage({
                    id: 'campaignMonitor.reset'
                  }, "重置")}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default AdvancedSearch;

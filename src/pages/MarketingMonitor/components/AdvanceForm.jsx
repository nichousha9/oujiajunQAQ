import React from 'react';
import { Form, Input, Select, Row, Col, DatePicker, Button, message } from 'antd';
import { formatMessage, getLocale } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import moment from 'moment';
import CampaignModal from '@/pages/CampaignModal/index';
import { fieldToStr } from '@/pages/ResponseMonitor/common';

import styles from '../index.less';

const { Option } = Select;

@connect(({ marketingMonitor }) => ({
  campaignNames: marketingMonitor.campaignNames,
  campaignVisible: marketingMonitor.campaignVisible,
  campaignIds: marketingMonitor.campaignIds,
}))
@Form.create({ name: 'marketing-form' })
class AdvanceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCampaignList: [],
      processList: [],
      statusList: [],
      runList: [
        {
          isTestName: formatMessage({ id: 'marketingMonitor.campaignMonitorIsTest' }, '测试运行'),
          isTestValue: 'Y',
        },
        {
          isTestName: formatMessage(
            { id: 'marketingMonitor.campaignMonitorCommonRun' },
            '普通运行',
          ),
          isTestValue: 'N',
        },
      ],
    };
  }

  componentDidMount() {
    // 获取select列表
    this.getProcessList();
    this.getStatusList();
  }

  // 获取processType
  getProcessList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingMonitor/getProcessListEffect',
    }).then(result => {
      if (result && result.topCont) {
        if (result.topCont.resultCode === 0) {
          this.setState({
            processList: [...result.svcCont.data],
          });
        }
        if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    });
  };

  // 获取status
  getStatusList = () => {
    const { dispatch } = this.props;
    const language = getLocale();
    const attrSpecCode = 'BATCH_STATE';
    const payload = {
      language,
      attrSpecCode,
    };

    dispatch({
      type: 'marketingMonitor/getStatusListEffect',
      payload,
    }).then(result => {
      if (result && result.topCont) {
        if (result.topCont.resultCode === 0) {
          this.setState({
            statusList: [...result.svcCont.data],
          });
        }
        if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    });
  };

  disableStartDate = startDate => {
    const { form } = this.props;
    const endDate = form.getFieldValue('END_DATE');
    if (!startDate || !endDate) {
      return false;
    }

    return moment(startDate).isAfter(endDate);
  };

  disableEndDate = endDate => {
    const { form } = this.props;
    const startDate = form.getFieldValue('START_DATE');
    if (!startDate || !endDate) {
      return false;
    }

    return moment(startDate).isAfter(endDate) || moment(startDate).isSame(endDate);
  };

  resetForm = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'marketingMonitor/getCampaignNames',
      payload: '',
    });
    dispatch({
      type: 'marketingMonitor/getCampaignIds',
      payload: [],
    });
    dispatch({
      type: 'marketingMonitor/getCampaignCodes',
      payload: '',
    });
    this.setState({
      selectedCampaignList: [],
    });
  };

  handleSearch = async () => {
    // TODO: 搜索
    const { BATCH_NAME, getBatchList, campaignIds } = this.props;
    const CAMPAIGN_IDS = [...campaignIds];
    const fieldsValue = this.getFieldValues();
    const payload = { ...fieldsValue, BATCH_NAME, CAMPAIGN_IDS };
    const { dispatch } = this.props;
    await dispatch({
      type: 'marketingMonitor/getPageInfo',
      payload: { pageNum: 1, pageSize: 10, total: 0 },
    });
    getBatchList(payload);
  };

  setFieldValue = (field, fieldValue) => {
    const { form } = this.props;
    form.setFieldsValue({ [field]: fieldValue });
  };

  // campaign modal
  handleCampaignVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingMonitor/handleCampaignVisible',
      payload: true,
    });
  };

  onInputChange = e => {
    const { dispatch } = this.props;
    if (e.target.value === '') {
      dispatch({
        type: 'marketingMonitor/getCampaignNames',
        payload: '',
      });

      dispatch({
        type: 'marketingMonitor/getCampaignIds',
        payload: [],
      });

      dispatch({
        type: 'marketingMonitor/getCampaignCodes',
        payload: '',
      });

      this.setState({
        selectedCampaignList: [],
      });
    }
  };

  getFieldValues = () => {
    const { form } = this.props;
    const advancedFilter = form.getFieldsValue();
    const { START_DATE, END_DATE } = advancedFilter;
    // 格式化日期
    const startDate = START_DATE ? START_DATE.format('YYYY-MM-DD HH:mm:ss') : undefined;
    const endDate = END_DATE ? END_DATE.format('YYYY-MM-DD HH:mm:ss') : undefined;

    const fieldValues = {
      ...advancedFilter,
      START_DATE: startDate,
      END_DATE: endDate,
    };

    return fieldValues;
  };

  handleOk = async selectedCampaignList => {
    const campaignNames = fieldToStr(selectedCampaignList, 'extName', ',');
    const campaignCodes = fieldToStr(selectedCampaignList, 'extCode', ',');
    const campaignIds = [];
    selectedCampaignList.map(campaign => {
      campaignIds.push(campaign.id);
      return campaign;
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingMonitor/getCampaignNames',
      payload: campaignNames,
    });

    await dispatch({
      type: 'marketingMonitor/getCampaignCodes',
      payload: campaignCodes,
    });

    // 回写到输入框
    this.setFieldValue('CAMPAIGN_NAME', campaignNames);

    dispatch({
      type: 'marketingMonitor/getCampaignIds',
      payload: campaignIds,
    });

    this.setState({
      selectedCampaignList,
    });

    this.closeModal();
  };

  handleCancel = () => {
    this.closeModal();
  };

  closeModal = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'marketingMonitor/handleCampaignVisible',
      payload: false,
    });
  };

  render() {
    const { selectedCampaignList, runList, statusList, processList } = this.state;
    const { form, campaignVisible } = this.props;
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

    const commonColLayout = {
      md: {
        span: 6,
      },
      sm: {
        span: 24,
      },
    };

    return (
      <>
        <Form {...formItemLayout}>
          <Row className="row-bottom-line">
            <Col {...commonColLayout}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'marketingMonitor.campaign',
                  },
                  '营销活动',
                )}
              >
                {getFieldDecorator('CAMPAIGN_NAME')(
                  <Input.Search
                    size="small"
                    readOnly
                    allowClear
                    onChange={this.onInputChange}
                    onSearch={this.handleCampaignVisible}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col {...commonColLayout}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'marketingMonitor.batchStatus',
                  },
                  '批次状态',
                )}
              >
                {getFieldDecorator('BATCH_STATE')(
                  <Select
                    size="small"
                    allowClear
                    placeholder={formatMessage(
                      {
                        id: 'common.form.select',
                      },
                      '请选择',
                    )}
                  >
                    {statusList.map(status => (
                      <Option key={status.attrValueId} value={status.attrValueCode}>
                        {status.attrValueName}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col {...commonColLayout}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'marketingMonitor.runType',
                  },
                  '运行类型',
                )}
              >
                {getFieldDecorator('IS_TEST')(
                  <Select
                    size="small"
                    allowClear
                    placeholder={formatMessage(
                      {
                        id: 'common.form.select',
                      },
                      '请选择',
                    )}
                  >
                    {runList.map(run => (
                      <Option key={run.isTestValue}>{run.isTestName}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col {...commonColLayout}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'marketingMonitor.processType',
                  },
                  '处理类型',
                )}
              >
                {getFieldDecorator('PROCESS_TYPE')(
                  <Select
                    size="small"
                    allowClear
                    placeholder={formatMessage(
                      {
                        id: 'common.form.select',
                      },
                      '请选择',
                    )}
                  >
                    {processList.map(process => (
                      <Option key={process.name}>{process.name}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className="row-bottom-line">
            <Col {...commonColLayout}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'commodityManage.date.startDate',
                  },
                  '开始时间',
                )}
              >
                {getFieldDecorator('START_DATE')(
                  <DatePicker
                    size="small"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={formatMessage(
                      {
                        id: 'commodityManage.date.startDate',
                      },
                      '开始时间',
                    )}
                    disabledDate={this.disableStartDate}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col {...commonColLayout}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'commodityManage.date.endDate',
                  },
                  '结束时间',
                )}
              >
                {getFieldDecorator('END_DATE')(
                  <DatePicker
                    size="small"
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={formatMessage(
                      {
                        id: 'commodityManage.date.endDate',
                      },
                      '结束时间',
                    )}
                    disabledDate={this.disableEndDate}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col className={styles.btnGroup}>
              <Button
                className={styles.queryBtn}
                size="small"
                type="primary"
                onClick={this.handleSearch}
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
        {campaignVisible ? (
          <CampaignModal
            campaignVisible
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
            initSelectedCampaignList={selectedCampaignList}
          />
        ) : null}
      </>
    );
  }
}

export default AdvanceForm;

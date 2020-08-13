import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Row, Col, Select, Input, DatePicker, Button} from 'antd';
import moment from 'moment';
import styles from '../index.less';
import UserModal from './UserModal';

const { Option } = Select;


@connect(({ scheduleMonitor }) => ({
  filterCondition: scheduleMonitor.filterCondition,
  timingObjectList: scheduleMonitor.timingObjectList,
  userModalVisible: scheduleMonitor.userModalVisible,
  user: scheduleMonitor.user,
  pageInfo: scheduleMonitor.pageInfo,
}))
@Form.create({
  name: 'advanced-filter',
})
class AdvancedFilterForm extends React.Component {
  componentDidMount() {
    this.getTimingObjectList();
  }

  resetForm = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    const temp = {
      timingObject: '',
      userId: '',
      createUser: '',
      cycleStartDate: '',
      cycleEndDate: '',
    };
    dispatch({
      type: 'scheduleMonitor/getFilterCondition',
      payload: temp,
    });
  };

  handleUserSelectModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scheduleMonitor/handleUserModal',
      payload: true,
    });
  };

  handleSearch = () => {
    const { dispatch, getScheduleList, pageInfo } = this.props;

    const fieldValues = this.getFieldValues();

    // 整合查询条件
    dispatch({
      type: 'scheduleMonitor/getFilterCondition',
      payload: fieldValues,
    });

    dispatch({
      type: 'scheduleMonitor/getPageInfo',
      payload: { ...pageInfo, pageNum: 1 },
    });

    getScheduleList();
  };

  getTimingObjectList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scheduleMonitor/getTimingObjectListEffect',
    });
  };

  afterClose = () => {
    const { user, form, dispatch } = this.props;
    form.setFieldsValue({ createUser: user.staffName });
    if(user && user.sysUserId) {
      dispatch({
        type: 'scheduleMonitor/getFilterCondition',
        payload: { userId: user.sysUserId.toString() },
      });
   }
  };

  getFieldValues = () => {
    const { form } = this.props;
    const advancedFilter = form.getFieldsValue();
    const { cycleStartDate, cycleEndDate } = advancedFilter;
    // 格式化日期
    const startDate = cycleStartDate ? cycleStartDate.format('YYYY-MM-DD HH:mm:ss') : undefined;
    const endDate = cycleEndDate ? cycleEndDate.format('YYYY-MM-DD HH:mm:ss') : undefined;
   
    const fieldValues = {
      ...advancedFilter,
      cycleStartDate: startDate,
      cycleEndDate: endDate,
    };

    return fieldValues;
  };

  disableCycleStartDate = cycleStartDate => {
    const { form } = this.props;
    const cycleEndDate = form.getFieldValue('cycleEndDate');
    if (!cycleStartDate || !cycleEndDate) {
      return false;
    }

    return moment(cycleStartDate).isAfter(cycleEndDate);
  };

  disableCycleEndDate = cycleEndDate => {
    const { form } = this.props;
    const cycleStartDate = form.getFieldValue('cycleStartDate');
    if (!cycleStartDate || !cycleEndDate) {
      return false;
    }

    return moment(cycleStartDate).isAfter(cycleEndDate) || moment(cycleStartDate).isSame(cycleEndDate);
  };

  onInputChange = val => {
    const { dispatch } = this.props;
    if(!val) {
      dispatch({
        type: 'scheduleMonitor/getSelectedUser',
        payload: {},
      });

      dispatch({
        type: 'scheduleMonitor/getFilterCondition',
        payload: { userId: '' },
      });
    }
  }

  render() {
    const { form, timingObjectList } = this.props;
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

    return (
      <div className="advanced-filter-section">
        <Form {...formItemLayout} className={styles.advancedFilterForm}>
          <Row gutter={16} className="row-bottom-line">
            <Col sm={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'scheduleMonitor.timingObject',
                  },
                  'timing对象',
                )}
                className={styles.timingObjInput}
              >
                {getFieldDecorator('timingObject')(
                  <Select
                    // className={styles.select}
                    allowClear
                    size="small"
                    placeholder={formatMessage(
                      {
                        id: 'common.form.select',
                      },
                      '请选择',
                    )}
                  >
                    {timingObjectList.map(timingObj => {
                      return (
                        <Option key={timingObj.attrValueCode}>{timingObj.attrValueName}</Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} md={{ span: 5 }}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'scheduleMonitor.createdBy',
                  },
                  '创建人',
                )}
              >
                {getFieldDecorator('createUser')(
                  <Input.Search 
                    allowClear 
                    size="small" 
                    onSearch={this.handleUserSelectModal} 
                    onChange={this.onInputChange}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'commodityManage.date.startDate',
                  },
                  '开始时间',
                )}
              >
                {getFieldDecorator('cycleStartDate')(
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
                    disabledDate={this.disableCycleStartDate}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col sm={{ span: 24 }} md={{ span: 6 }}>
              <Form.Item
                label={formatMessage(
                  {
                    id: 'commodityManage.date.endDate',
                  },
                  '结束时间',
                )}
              >
                {getFieldDecorator('cycleEndDate')(
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
                    disabledDate={this.disableCycleEndDate}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} className="row-bottom-line">
            <Col className={styles.scheduleBtnGroup}>
              <Button
                className={styles.scheduleQueryBtn}
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
        <UserModal afterClose={this.afterClose} />
      </div>
    );
  }
}

export default AdvancedFilterForm;
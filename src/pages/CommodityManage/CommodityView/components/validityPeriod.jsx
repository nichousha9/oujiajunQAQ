import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Radio, DatePicker, Input, Select, TimePicker } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import styles from '../index.less';

const { Option } = Select;

@connect(() => ({}))
class RelativeTime extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleOpenChange = open => {
    this.setState({ open });
  };

  handleClose = () => this.setState({ open: false });

  handleNow = () => {
    const nowtime = moment();
    this.onChange(nowtime, nowtime.format('hh:mm:ss'));
    this.setState({ open: false });
  };

  onChange = (date, dateString) => {
    const { dispatch, validityDate, dateType } = this.props;
    if (validityDate) {
      const { effDate, expDate } = validityDate;
      const payload =
        dateType === 'eff'
          ? { effDate: { ...effDate, effDateOffsetTime: dateString }, expDate }
          : { expDate: { ...expDate, expDateOffsetTime: dateString }, effDate };
      dispatch({
        type: 'commodityList/changeValDate',
        payload,
      });
    }
  };

  onnumChange = e => {
    const { dispatch, validityDate, dateType } = this.props;
    if (validityDate) {
      const { effDate, expDate } = validityDate;
      const payload =
        dateType === 'eff'
          ? { effDate: { ...effDate, effDateOffset: e.target.value }, expDate }
          : { expDate: { ...expDate, expDateOffset: e.target.value }, effDate };
      dispatch({
        type: 'commodityList/changeValDate',
        payload,
      });
    }
  };

  onselChange = value => {
    const { dispatch, validityDate, dateType } = this.props;
    if (validityDate) {
      const { effDate, expDate } = validityDate;
      const payload =
        dateType === 'eff'
          ? { effDate: { ...effDate, effDateOffsetUnit: value }, expDate }
          : { expDate: { ...expDate, expDateOffsetUnit: value }, effDate };
      dispatch({
        type: 'commodityList/changeValDate',
        payload,
      });
    }
  };

  render() {
    const { open } = this.state;
    const { validityDate, dateType, readOnly } = this.props;
    let time = null;
    let num = null;
    let select = null;
    if (validityDate) {
      time =
        dateType === 'exp'
          ? validityDate.expDate.expDateOffsetTime
          : validityDate.effDate.effDateOffsetTime;
      num =
        dateType === 'exp'
          ? validityDate.expDate.expDateOffset
          : validityDate.effDate.effDateOffset;
      select =
        dateType === 'exp'
          ? validityDate.expDate.expDateOffsetUnit
          : validityDate.effDate.effDateOffsetUnit;
    }
    time = time === '' || time === null || undefined === time ? null : moment(`2019-01-01 ${time}`); // 默认有年月日，否则会报错

    return (
      <div className={styles.validityDate}>
        <Row>
          <Col span={11} key="startDateValue">
            <Input
              size="small"
              className={styles.numberStyle}
              onChange={this.onnumChange}
              value={num}
              placeholder={formatMessage({ id: 'common.form.input' })}
              maxLength={4}
              readOnly={!readOnly}
            />
            <Select
              defaultValue="H"
              size="small"
              onChange={this.onselChange}
              style={{ width: '100px' }}
              value={select}
              placeholder={formatMessage({ id: 'common.form.select' })}
              disabled={!readOnly}
            >
              <Option value="H">{formatMessage({ id: 'commodityManage.date.hour' })}</Option>
              <Option value="D">{formatMessage({ id: 'commodityManage.date.day' })}</Option>
              <Option value="M">{formatMessage({ id: 'commodityManage.date.month' })}</Option>
            </Select>
          </Col>
          <Col span={4} key="startTime">
            {formatMessage({ id: 'commodityManage.tip.dateTip' })}
          </Col>
          <Col key="startTimeValue" span={9}>
            <TimePicker
              placeholder={formatMessage({ id: 'common.form.select' })}
              size="small"
              value={time}
              open={open}
              onOpenChange={this.handleOpenChange}
              onChange={this.onChange}
              disabled={!readOnly}
              addon={() => (
                <Fragment>
                  <a onClick={this.handleNow}>{formatMessage({ id: 'commodityManage.tip.now' })}</a>
                  <a onClick={this.handleClose} style={{ float: 'right' }}>
                    {formatMessage({ id: 'common.btn.confirm' })}
                  </a>
                </Fragment>
              )}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

@connect(() => ({}))
class AbsoluteTime extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 生效时间绝对时间选择
  onabsChange = (date, dateString) => {
    const { dispatch, validityDate, dateType } = this.props;
    if (validityDate) {
      const { effDate, expDate } = validityDate;
      const payload =
        dateType === 'eff'
          ? { effDate: { ...effDate, effDate: dateString }, expDate }
          : { expDate: { ...expDate, expDate: dateString }, effDate };
      dispatch({
        type: 'commodityList/changeValDate',
        payload,
      });
    }
  };

  render() {
    const { validityDate, dateType, readOnly } = this.props;
    let date = null;
    if (validityDate) {
      date = dateType === 'eff' ? validityDate.effDate.effDate : validityDate.expDate.expDate;
      date = date === '' || date === null || undefined === date ? null : moment(date);
    }

    return (
      <div className={styles.validityDate}>
        <span>{formatMessage({ id: 'commodityManage.date.startDate' })}：</span>
        <DatePicker
          showTime
          value={date}
          placeholder={formatMessage({ id: 'common.form.select' })}
          size="small"
          onChange={this.onabsChange}
          disabled={!readOnly}
        />
      </div>
    );
  }
}

function EffDate(props) {
  const { validityDate } = props;
  if (validityDate.effDate.effDateType === '2') {
    return <AbsoluteTime validityDate={validityDate} dateType="eff" />;
  }
  if (validityDate.effDate.effDateType === '1') {
    return <RelativeTime validityDate={validityDate} dateType="eff" />;
  }
  return '';
}

@connect(({ commodityList }) => ({
  validityDate: commodityList.validityDate,
}))
class ValidityPeriod extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 生效时间周期类型选择
  onvalChange = e => {
    const { dispatch, validityDate } = this.props;
    dispatch({
      type: 'commodityList/changeValDate',
      payload: {
        expDate: validityDate.expDate,
        effDate: { effDateType: e.target.value, effDateOffsetUnit: 'H' },
      },
    });
  };

  // 失效时间周期类型选择
  ondisvalChange = e => {
    const { dispatch, validityDate } = this.props;
    dispatch({
      type: 'commodityList/changeValDate',
      payload: {
        effDate: validityDate.effDate,
        expDate: { expDateType: e.target.value, expDateOffsetUnit: 'H' },
      },
    });
  };

  render() {
    const { validityDate, readOnly } = this.props;
    // console.log(validityDate);

    return (
      <div className={styles.validityDiv} id="validityPeriod">
        <Row className={styles.validityRow}>
          <Col span={2} offset={2} key="validityTime">
            {formatMessage({ id: 'commodityManage.date.effDate' })}：
          </Col>
          <Col key="validityTimeValue">
            <Radio.Group
              value={validityDate.effDate.effDateType}
              buttonStyle="solid"
              onChange={this.onvalChange}
              disabled={readOnly}
            >
              <Radio value="0">{formatMessage({ id: 'commodityManage.date.rightnow' })}</Radio>
              <Radio value="2">{formatMessage({ id: 'commodityManage.date.absoluteDate' })}</Radio>
              <Radio value="1">{formatMessage({ id: 'commodityManage.date.relativeDate' })}</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row>
          <Col offset={4}>
            <EffDate validityDate={validityDate} />
          </Col>
        </Row>
        <Row className={styles.validityRow} onChange={this.ondisvalChange}>
          <Col span={2} offset={2} key="disvalidityTime">
            {formatMessage({ id: 'commodityManage.date.expDate' })}：
          </Col>
          <Col key="disvalidityTimeValue">
            <Radio.Group value={validityDate.expDate.expDateType} disabled={readOnly}>
              <Radio value="2">{formatMessage({ id: 'commodityManage.date.absoluteDate' })}</Radio>
              <Radio value="1">{formatMessage({ id: 'commodityManage.date.relativeDate' })}</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row>
          <Col offset={4}>
            {validityDate.expDate.expDateType === '2' ? (
              <AbsoluteTime validityDate={validityDate} dateType="exp" />
            ) : (
              <RelativeTime validityDate={validityDate} dateType="exp" />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default ValidityPeriod;

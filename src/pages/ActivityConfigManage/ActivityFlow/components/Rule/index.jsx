import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Row, Col } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import classnames from 'classnames';
import CustomSelect from '@/components/CustomSelect';
import RuleChoose from './RuleChoose';
import commonStyles from '../../common.less';
import styles from './index.less';
import { objToLowerCase } from '@/utils/common';

/**
 * 优化规则：运行状态
 */
const optState = {
  A: formatMessage({ id: 'activityConfigManage.contact.optStateN'}),// '接触名单未更新',
  N: formatMessage({ id: 'activityConfigManage.contact.optStateN'}),// '接触名单未更新',
  W: formatMessage({ id: 'activityConfigManage.contact.optStateW'}),// '待优化',
  F: formatMessage({ id: 'activityConfigManage.contact.optStateN'}),// '优化完成',
  R: formatMessage({ id: 'activityConfigManage.contact.optStateR'}),// '运行中',
};

/**
 * 优化规则：优化方式，模型
 */
const isSync = {
  Y: formatMessage({ id: 'activityConfigManage.contact.runningWithOtherProcesses'}),// '同步运行',
  N: formatMessage({ id: 'activityConfigManage.contact.runningSeparately'}) // '单个运行',
};

@connect(({ activityFlowContact }) => ({
  activityFlowContact
}))
class Rule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ruleChooseVisible: false
    };
  }
    
  componentDidMount() {
    const { processId } = this.props;
    // 如果有processId则去请求之前保存数据
    if(processId){
      this.qryProcessOptimize();
    }
  }
  
  /**
   *
   *查询环节之前保存接入数据
   * @memberof Rule
   */
  qryProcessOptimize = () => {
    const { dispatch, processId  } = this.props;
    dispatch({
      type: 'activityFlowContact/qryProcessOptimize',
      payload: {
        processId
      }
    });
  };

  /**
   *
   *选择弹窗选择规则
   * @memberof Rule
   */
  addRule = () => {
    this.setState({ ruleChooseVisible: true });
  };

  /**
   *选中规则返回
   *
   * @memberof Rule
   */
  onOk = values => {
    const { dispatch } = this.props;
    const processOptimize = objToLowerCase(values);
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        processOptimize: { ...processOptimize, rulesetName: processOptimize.name, runDate: processOptimize.latestRunTime }
      }
    })
    this.setState({ ruleChooseVisible: false });
  };

  /**
   *
   *删除已有规则
   * @memberof Rule
   */
  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        processOptimize: {}
      }
    })
  };

  render() {
    const { form, activityFlowContact, campaignId } = this.props;
    const { getFieldDecorator } = form;
    const { processOptimize } = activityFlowContact;
    const { ruleChooseVisible } = this.state;

    const customSelectProps = {
      mode: 'tags',
      dataSource:
        processOptimize && processOptimize.rulesetId
          ? [
              {
                label: processOptimize.rulesetName,
                value: processOptimize.rulesetId,
              },
            ]
          : [],
      onClose: this.onClose,
      otherNode: <a onClick={this.addRule}>添加</a>,
    };

    const ruleChooseProps = {
      campaignId,
      visible: ruleChooseVisible,
      onCancel: () => {
        this.setState({ ruleChooseVisible: false });
      },
      onOk: this.onOk,
    };
    return (
      <Fragment>
        {ruleChooseVisible && <RuleChoose {...ruleChooseProps} />}
        <div className={commonStyles.block}>
          <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.contact.ruleInformation' })}</p>
          <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.content' })}>
            {getFieldDecorator('name', {
              initialValue: [],
            })(<CustomSelect {...customSelectProps} />)}
          </Form.Item>
          {/* 规则管理运行  先屏蔽 */}
          {/* 定时运行优化 */}
          {/* <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.optimizeOnScheudle' })} labelCol={{ span: 4 }}>
            {getFieldDecorator('autoAddRmCtrlCell')(
              <Radio.Group>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>,
            )}
          </Form.Item> */}
          {/* 是否加入控制组 */}
          {/* <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.autoAddRmCtrlCell' })} labelCol={{ span: 4 }}>
            {getFieldDecorator('ignoreAsSchedule')(
              <Radio.Group>
                <Radio value="Y">是</Radio>
                <Radio value="N">否</Radio>
              </Radio.Group>,
            )}
          </Form.Item> */}
          {processOptimize && processOptimize.rulesetId && (
            <div className={classnames(styles.greyBlock, styles.ruleText)}>
              <Row>
                {/* 优化状态 */}
                <Col span={12}>
                  <span className={styles.textLabel}>{formatMessage({ id: 'activityConfigManage.contact.optimizeState' })}：</span>
                  <span>{optState[processOptimize.state]}</span>
                </Col>
                {/* 上次优化时间 */}
                <Col span={12}>
                  <span className={styles.textLabel}>{formatMessage({ id: 'activityConfigManage.contact.lastOptimizeTime' })}：</span>
                  <span>{processOptimize.latestRunTime}</span>
                </Col>
                {/* 优化方式 */}
                <Col span={24}>
                  <div className={styles.ruleTypeText}>
                    <span className={styles.textLabel}>{formatMessage({ id: 'activityConfigManage.contact.optimizeMode' })}：</span>
                    <span className={styles.text}>{isSync[processOptimize.isSync]}</span>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

export default Rule;

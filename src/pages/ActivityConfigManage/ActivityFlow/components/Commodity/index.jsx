/* eslint-disable react/no-unused-state */
// 商品信息选择
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Switch, Table } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import CustomSelect from '@/components/CustomSelect';
import CommondityChoose from './CommodityChoose';
import commonStyles from '../../common.less';
import styles from './index.less';
import { uniqueArray } from '@/utils/formatData';
import ModalRule from './ModalRule';

@connect(({ activityFlowContact, loading }) => ({
  activityFlowContact,
  loading: loading.effects['activityFlowContact/qryCommondity'],
}))
class Commondity extends React.Component {
  columns = [
    {
      title: formatMessage({ id: 'activityConfigManage.contact.recommendGroupName' }),
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.recommendRuleName' }),
      dataIndex: 'rulesName',
      key: 'rulesName',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.recommendRuleNum' }),
      dataIndex: 'rcmdNum',
      key: 'rcmdNum',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.recommendIsDefault' }), // 是否默认
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: text => {
        return text === '01'
          ? formatMessage({ id: 'common.text.yes' })
          : formatMessage({ id: 'common.text.no' });
      },
    },
    // {
    //   title: formatMessage({ id: 'activityConfigManage.contact.recommendDefaultNum' }),
    //   dataIndex: 'defaultNum',
    //   key: 'defaultNum',
    // },
  ];

  constructor(props) {
    super(props);
    // const { nodeData = {} } = props;
    this.state = {
      processInfo: {},
      choosedList: [], // 已经选中内容的列表
      modalVisible: false, // 选择内容弹窗
      // 决策分组列表
      decisionList: [],
      // 当前节点的决策分组
      selectDecisionId: undefined,
      // 推荐规则列表
      ruleInfo: [],
      // 添加规则弹框信息
      modalRuleInfo: {
        visible: false,
      },
      // 判断是否是APP或MYSF,可以选择多个
      // chooseMultiple: nodeData.channelcode === 'APP' || nodeData.channelcode === 'MYSF',
      // 暂时让所有选项都可以多选
      chooseMultiple: true,
    };
  }

  async componentDidMount() {
    const {
      //  processInfo: { adviceId, adviceName },
      dispatch,
      processId,
    } = this.props;
    dispatch({
      type: 'activityFlowContact/qryProcess',
      payload: {
        processId,
      },
      success: svcCont => {
        const { data } = svcCont;

        if (data === undefined) {
          this.setState({ choosedList: [] });
        } else {
          dispatch({
            type: 'activityFlowContact/save',
            payload: {
              offerRels: data.prods || [],
            },
          });
          this.setState({ processInfo: data || {}, choosedList: data.prods || [] });
        }
      },
    });

    // console.log(prods);
    // if (prods) {
    //   this.setState({ choosedList: prods });
    // }

    // 屏蔽判断
    // const flag = await this.qryAttrValue();
    // // 阿里接口开启的情况
    // if (flag) {

    // 请求上一个节点的决策分组列表，有列表的情况下才显示决策分组开关/通过isOfferRecommend判断是否开启
    // this.qryDecisionGroups();
    // 初始化选中的决策分组
    // this.qryIreGroupsRels();

    // 获取当前节点的商品内容，运营位0时才显示
    // this.qryOfferRels();

    // 获取当前节点的推荐规则组，运营位6才显示
    // this.qryRcmdRulesRels();
    // }
  }

  /**
   * 检验阿里接口开关是否开启，是的话返回true
   * @memberof Commondity
   */
  qryAttrValue = () => {
    return new Promise(resolve => {
      const { dispatch } = this.props;
      dispatch({
        type: 'activityFlowContact/qryAttrValue',
        payload: {
          attrSpecCode: 'ALI_INTERFACE_SWITCH',
        },
        success: flag => {
          resolve(flag);
        },
      });
    });
  };

  /**
   * 获取决策分组列表
   */
  qryDecisionGroups = () => {
    const { dispatch, prevAllNodeData } = this.props;
    if (!prevAllNodeData || !prevAllNodeData.length) return;
    dispatch({
      type: 'activityFlowContact/qryDecisionGroups',
      payload: {
        preProcessIds: prevAllNodeData.map(item => {
          return item.PROCESS_ID;
        }),
      },
      success: res => {
        this.setState({
          decisionList: (res && res.data) || [],
        });
      },
    });
  };

  /**
   * 获取当前节点选中的决策分组
   */
  qryIreGroupsRels = () => {
    const { dispatch, nodeData = {} } = this.props;
    const processId = nodeData.PROCESS_ID;
    if (!processId) return;
    dispatch({
      type: 'activityFlowContact/qryIreGroupsRels',
      payload: {
        nextProcessId: processId,
        divProType: '2',
      },
      success: res => {
        const selectDecisionId = (res.data && res.data[0] && res.data[0].groupId) || '';
        this.setState({
          selectDecisionId,
        });
      },
    });
  };

  /**
   * 获取商品内容
   */
  qryOfferRels = () => {
    const { dispatch, nodeData = {} } = this.props;
    const processId = nodeData.PROCESS_ID;
    if (!processId) return;
    dispatch({
      type: 'activityFlowContact/qryOfferRels',
      payload: {
        processId,
      },
      success: res => {
        this.setState(
          {
            choosedList: (res && res.data) || [],
          },
          this.toSaveOfferRels,
        );
      },
    });
  };

  /**
   * 获取推荐规则组
   */
  qryRcmdRulesRels = () => {
    const { dispatch, nodeData = {} } = this.props;
    const processId = nodeData.PROCESS_ID;
    if (!processId) return;
    dispatch({
      type: 'activityFlowContact/qryRcmdRulesRels',
      payload: {
        processId,
      },
      success: res => {
        const arr = (res && res.data) || [];
        dispatch({
          type: 'activityFlowContact/save',
          payload: {
            processRcmdRulesRels: arr,
          },
        });
        this.queryChildRuleSource(arr[0] && arr[0].groupId, arr[0] && arr[0].groupName);
      },
    });
  };

  /**
   * 获取推荐规则
   */
  queryChildRuleSource = (groupId, groupName) => {
    const { dispatch } = this.props;
    if (!groupId) return;
    dispatch({
      type: 'activityFlowContact/queryChildRuleSource',
      payload: {
        groupId,
        pageInfo: {
          pageSize: 50,
          pageNum: 1,
        },
      },
      success: res => {
        this.setState({
          ruleInfo: {
            list: res.data.map(item => {
              return {
                ...item,
                groupName,
              };
            }),
          },
        });
      },
    });
  };

  // 添加推荐规则组
  addRuleGroup = selectItem => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        processRcmdRulesRels: [selectItem],
      },
    });
    this.queryChildRuleSource(selectItem.groupId, selectItem.groupName);
  };

  /**
   *
   * 去选择商品
   * @memberof Commondity
   */
  addCommondity = () => {
    this.setState({ modalVisible: true });
  };

  /**
   *选中商品返回
   *
   * @memberof Commondity
   */
  onOk = values => {
    const { choosedList, chooseMultiple } = this.state;
    let tempArr = [];
    if (chooseMultiple) {
      // 要先去重
      tempArr = uniqueArray([...choosedList, ...values], 'prodId');
    } else {
      tempArr = values;
    }
    this.setState({ choosedList: tempArr || [], modalVisible: false }, this.toSaveOfferRels);
  };

  /**
   *
   *删除已选中商品
   * @memberof Commondity
   */
  onRuleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        processRcmdRulesRels: [],
      },
    });
  };

  // 保存现有的选中商品到models
  toSaveOfferRels = () => {
    const { dispatch } = this.props;
    const { choosedList } = this.state;
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        offerRels: choosedList || [],
      },
    });
  };

  // 打开推荐规则组列表
  switchModalRule = flag => {
    this.setState({
      modalRuleInfo: {
        visible: flag,
      },
    });
  };

  // 商品分组修改保存
  offerIreGroupsChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        offerIreGroups: value,
      },
    });
  };

  /**
   *
   *删除已有商品
   * @memberof Commondity
   */
  onClose = id => {
    const { choosedList } = this.state;
    const newArr = choosedList.filter(item => item.prodId != id);
    this.setState({ choosedList: newArr || [] }, this.toSaveOfferRels);
  };

  render() {
    const { form, activityFlowContact, processInfo } = this.props;
    const {
      mccProcessAdviceChannelRel: adviceChannelRel,
      creativeInfoRels,
      processRcmdRulesRels,
    } = activityFlowContact;
    const { adviceChannelType } = adviceChannelRel;
    const { getFieldDecorator, getFieldValue } = form;
    const {
      modalVisible,
      choosedList,
      decisionList,
      selectDecisionId,
      modalRuleInfo,
      ruleInfo,
      chooseMultiple,
    } = this.state;
    const channelType = `${adviceChannelType}`;

    const creativeInfoIds = [];
    creativeInfoRels.map(item => creativeInfoIds.push(item.creativeInfoId));

    const customSelectProps = {
      // 单选，必选
      required: true,
      dataSource: decisionList.map(item => {
        return {
          label: item.prodName,
          value: item.prodId,
        };
      }),
    };

    const commondityCustomSelectProps = {
      mode: 'tags',
      dataSource: choosedList.map(item => {
        return {
          label: item.prodName,
          value: item.prodId,
        };
      }),
      onClose: this.onClose,
      otherNode: (
        <a onClick={this.addCommondity}>{formatMessage({ id: 'activityConfigManage.flow.add' })}</a>
      ),
    };

    const commodityChooseProps = {
      creativeInfoIds,
      // 判断是否是APP或MYSF,可以选择多个
      chooseMultiple,
      visible: modalVisible,
      onCancel: () => {
        this.setState({ modalVisible: false });
      },
      onOk: this.onOk,
    };

    // 添加规则弹框 props
    const ruleProps = {
      visible: modalRuleInfo.visible,
      onCancel: () => this.switchModalRule(false),
      addRuleGroup: this.addRuleGroup,
    };

    // 推荐规则选项
    const ruleCustomSelectProps = {
      mode: 'tags',
      dataSource: processRcmdRulesRels.map(item => {
        return {
          label: item.groupName,
          value: item.groupId,
        };
      }),
      otherNode: <a onClick={() => this.switchModalRule(true)}>添加</a>,
      onRuleClose: this.onRuleClose,
    };

    return (
      <Fragment>
        {modalVisible && <CommondityChoose {...commodityChooseProps} />}
        {modalRuleInfo.visible && <ModalRule {...ruleProps} />}
        {adviceChannelType &&
        (channelType === '1' ||
          channelType === '2' ||
          channelType === '4' ||
          channelType === '5') ? null : (
          <div className={commonStyles.block}>
            {/* @TODO: 类型为USSI/USSD时，需要根据USSI类型的选择：值为0时，决策分组关闭并隐藏；否则显示决策分组 */}
            <p className={commonStyles.title}>产品信息</p>
            {/* 商品决策分组 */}
            {decisionList && decisionList.length ? (
              <Form.Item
                label={formatMessage({ id: 'activityConfigManage.contact.makingGroup' })}
                className={commonStyles.doubleFormItem}
              >
                <Form.Item className={commonStyles.connectSwitch}>
                  {getFieldDecorator('isOfferRecommend', {
                    valuePropName: 'checked',
                    initialValue: processInfo.isOfferRecommend === '1',
                  })(<Switch />)}
                </Form.Item>
                {getFieldValue('isOfferRecommend') && (
                  <Form.Item className={commonStyles.connectSwitchOther}>
                    {getFieldDecorator('offerIreGroups', {
                      rules: [
                        { required: true, message: formatMessage({ id: 'common.form.required' }) },
                      ],
                      initialValue: selectDecisionId === undefined ? '' : selectDecisionId,
                      onChange: this.offerIreGroupsChange,
                    })(<CustomSelect {...customSelectProps} />)}
                  </Form.Item>
                )}
              </Form.Item>
            ) : null}
            {/* 是否按推荐模型匹配产品 */}
            {channelType === '7' ? (
              <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.isOfferMode' })}>
                {getFieldDecorator('offerRecommendType', {
                  valuePropName: 'checked',
                  initialValue: processInfo.offerRecommendType === '2',
                })(<Switch />)}
              </Form.Item>
            ) : null}
            {/* 商品内容，运营位 '0' 时展示 */}
            {!adviceChannelType ||
            channelType === '0' ||
            (channelType === '7' && !getFieldValue('offerRecommendType')) ? (
              <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.content' })}>
                {getFieldDecorator('selectCommondity', {
                  initialValue: [],
                })(<CustomSelect {...commondityCustomSelectProps} />)}
              </Form.Item>
            ) : null}
            {/* 商品推荐规则，运营位 '6' 时 展示 */}
            {channelType === '6' ? (
              <div className={styles.greyBlock}>
                <Form.Item
                  label={formatMessage({ id: 'activityConfigManage.contact.recommendRule' })}
                  className="mb0"
                >
                  {getFieldDecorator('ruleGroupId', {})(
                    <CustomSelect {...ruleCustomSelectProps} />,
                  )}
                </Form.Item>
                {/* 商品推荐规则列表 */}
                {processRcmdRulesRels && processRcmdRulesRels.length > 0 ? (
                  <Table
                    size="small"
                    dataSource={ruleInfo.list}
                    columns={this.columns}
                    pagination={false}
                    rowKey="rulesId"
                    className={styles.table}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </Fragment>
    );
  }
}

export default Commondity;

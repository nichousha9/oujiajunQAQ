/* eslint-disable no-unused-vars */
/* eslint-disable react/no-danger */
/* 创意
参数：form,
processId,// 环节id
prevAllNodeData,// 所有父节点
adviceChannelFlag: true,
processInfo,// 部分初始数据
needAdviceChannel: true // 需要有运营位才可以选择创意 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon, Switch, message, Card, Modal, Radio, InputNumber } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Iconfont from '@/components/Iconfont';
import CustomSelect from '@/components/CustomSelect';
import CreativityChoose from './CreativityChoose';
import commonStyles from '../../common.less';
import styles from './index.less';

@connect(({ activityFlowContact, loading }) => ({
  activityFlowContact,
  loading: loading.effects['activityFlowContact/qryCreativity'],
}))
class Creativity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgChoosedList: [], // 图文已经选中的创意
      textChoosedList: [], // 文本或html已经选中的创意
      creativityChooseVisible: false, // 选择创意弹窗
      templateInfoTypes: [], // 模板
      type: '', // 当前选创意的类型，img为图文，text为文本或html
      previewVisible: false,
      previewImage: '',
      // 决策分组列表
      decisionList: [],
      // 当前节点的决策分组
      selectDecisionId: undefined,
      creativeSourceType: '00',
      creativeInfoId: '',
    };
  }

  componentWillMount() {
    const {
      processInfo: { adviceId, adviceName },
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
        if (data) {
          dispatch({
            type: 'activityFlowContact/qryAdviceInfo',
            payload: {
              adviceId: data.adviceId,
            },
            success: res => {
              this.setState({ textChoosedList: [res.data] });
              dispatch({
                type: 'activityFlowContact/save',
                payload: {
                  creativeInfoRels: [res.data],
                },
              });
            },
          });

          // this.setState({ choosedList: [] });
        } else {
          this.setState({ textChoosedList: [] });
          // this.setState({ processInfo: data || {}, choosedList: data.prods });
        }
      },
    });

    // dispatch({
    //   type: 'activityFlowContact/qryCreativeInfoList',
    //   payload: {
    //     adviceName,
    //     pageInfo: { pageNum: 1, pageSize: 50 },
    //   },
    //   success: svcCont => {, textChoosedList: data
    //     const { data = [] } = svcCont;
    this.setState({ selectDecisionId: adviceId });
    //   },
    // });

    //
  }

  async componentDidMount() {
    const { processId } = this.props;
    const flag = await this.qryAttrValue();
    // 阿里接口开启的情况
    if (flag) {
      // 请求上一个节点的决策分组列表，有列表的情况下才显示决策分组开关/通过isOfferRecommend判断是否开启
      this.qryDecisionGroups();
      // 初始化选中的决策分组
      // this.qryIreGroupsRels();
    }
    if (processId) {
      // 初始化选中的创意
      this.qryCreativeInfoRels();
    }
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
    const { dispatch, processId } = this.props;
    if (!processId) return;
    dispatch({
      type: 'activityFlowContact/qryIreGroupsRels',
      payload: {
        nextProcessId: processId,
        divProType: '1',
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
   * 获取当前节点选中的创意
   */
  qryCreativeInfoRels = () => {
    const { dispatch, processId } = this.props;
    dispatch({
      type: 'activityFlowContact/qryCreativeInfoRels',
      payload: {
        processId,
      },
      success: ({ data = [] }) => {
        const imgChoosedList = [];
        const textChoosedList = [];

        data.forEach(creativeInfo => {
          if (creativeInfo.templateInfoType == '2' || creativeInfo.templateInfoType == '3') {
            textChoosedList.push(creativeInfo);
          } else {
            imgChoosedList.push(creativeInfo);
          }
        });
        dispatch({
          type: 'activityFlowContact/save',
          payload: {
            creativeInfoRels: data,
          },
        });
        this.setState({
          imgChoosedList,
          textChoosedList,
          creativeSourceType: data[0] && data[0].creativeSourceType,
          creativeInfoId: data[0] && data[0].creativeInfoId,
        });
      },
    });
  };

  /**
   *
   * 去选择创意
   * @memberof Creativity
   */
  addCreativity = type => {
    this.setState({ type, creativityChooseVisible: true });
    // console.log(type);
    // const { activityFlowContact, needAdviceChannel } = this.props;
    // console.log(activityFlowContact, needAdviceChannel);
    // const { mccProcessAdviceChannelRel: adviceChannelRel } = activityFlowContact;
    // const optionalCreativeType =
    //   (adviceChannelRel.optionalCreativeType && adviceChannelRel.optionalCreativeType.toString()) ||
    //   '';
    // if ((needAdviceChannel && adviceChannelRel.id) || !needAdviceChannel) {
    //   let templateInfoTypes;
    //   if (type === 'img') {
    //     templateInfoTypes = ['1'];
    //   } else {
    //     templateInfoTypes = optionalCreativeType.split(',');
    //     const moreIndex = templateInfoTypes.indexOf('1');
    //     if (moreIndex > -1) {
    //       templateInfoTypes.splice(moreIndex, '1');
    //     }
    //   }
    //   this.setState({ templateInfoTypes }, () => {
    //     this.setState({ type, creativityChooseVisible: true });
    //   });
    // } else {
    //   message.info(formatMessage({ id: 'activityConfigManage.contact.pleaseSelCreative' }));
    // }
  };

  /**
   *选中创意返回
   *
   * @memberof Creativity
   */
  onOk = values => {
    const { type, imgChoosedList, textChoosedList } = this.state;

    const { form } = this.props;
    const { getFieldValue } = form;
    if (type === 'img') {
      // 多选
      if (getFieldValue('isCreativeRecommend')) {
        this.setState(
          {
            imgChoosedList: [imgChoosedList, ...values],
            creativityChooseVisible: false,
          },
          this.toSaveCreativeInfoRels,
        );
      }
      // 单选
      else {
        this.setState(
          { imgChoosedList: values, creativityChooseVisible: false },
          this.toSaveCreativeInfoRels,
        );
      }
    } else if (getFieldValue('isCreativeRecommend')) {
      // 多选
      this.setState(
        {
          textChoosedList: [textChoosedList, ...values],
          creativityChooseVisible: false,
        },
        this.toSaveCreativeInfoRels,
      );
    } else {
      // 文本单选
      this.setState(
        { textChoosedList: values, creativityChooseVisible: false },
        this.toSaveCreativeInfoRels,
      );
    }
  };

  /**
   *
   *删除已有创意
   * @memberof Creativity
   */
  cancelChoose = (type, values) => {
    const { imgChoosedList, textChoosedList } = this.state;
    let tempArr;
    if (type === 'img') {
      tempArr = imgChoosedList.filter(item => item.id != values.id);
      this.setState({ imgChoosedList: tempArr }, this.toSaveCreativeInfoRels);
    } else {
      tempArr = textChoosedList.filter(item => item.id != values.id);
      this.setState({ textChoosedList: tempArr }, this.toSaveCreativeInfoRels);
    }
  };

  // 保存现有的选中创意到models
  toSaveCreativeInfoRels = value => {
    const { dispatch, form } = this.props;
    let creativeInfoId;
    if (value) {
      creativeInfoId = value;
    } else {
      creativeInfoId = form.getFieldValue('creativeInfoId');
    }
    const creativeSourceType = form.getFieldValue('creativeSourceType');
    const { imgChoosedList, textChoosedList } = this.state;
    const mixChooseList = [];
    imgChoosedList.forEach(item => {
      mixChooseList.push({ ...item, creativeSourceType });
    });
    textChoosedList.forEach(item => {
      mixChooseList.push({ ...item, creativeSourceType });
    });
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        creativeInfoRels:
          creativeSourceType == '01' ? [{ creativeInfoId, creativeSourceType }] : mixChooseList,
      },
    });
  };

  // 创意分组修改保存
  creativeIreGroupsChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        creativeIreGroups: value,
      },
    });
  };

  // 创意类型修改
  creativeSourceTypeChange = v => {
    this.setState({ creativeSourceType: v.target.value }, this.toSaveCreativeInfoRels);
  };

  render() {
    // creativeInfoRels //adviceId
    const { form, activityFlowContact, adviceChannelFlag, processInfo } = this.props;
    const { mccProcessAdviceChannelRel: adviceChannelRel, creativeInfoRels } = activityFlowContact;
    const { adviceChannelType } = adviceChannelRel;
    const optionalCreativeType =
      (adviceChannelRel.optionalCreativeType && adviceChannelRel.optionalCreativeType.toString()) ||
      '';
    const { getFieldDecorator, getFieldValue } = form;
    const { decisionList, selectDecisionId, creativeSourceType, creativeInfoId } = this.state;

    const channelType = `${adviceChannelType}`;
    const {
      creativityChooseVisible,
      imgChoosedList,
      textChoosedList,
      templateInfoTypes,
      previewVisible,
      previewImage,
    } = this.state;
    const customSelectProps = {
      // 单选，必选
      required: true,
      dataSource: decisionList.map(item => {
        return {
          label: item.adviceName,
          value: item.adviceText,
        };
      }),
    };

    const creativityChooseProps = {
      visible: creativityChooseVisible,
      options: {
        channelId: adviceChannelFlag ? adviceChannelRel.channelId : '', // 渠道id如果不是创意，是dir:用编码而不是id
        adviceCode: adviceChannelFlag ? undefined : 'SMS_CONTACT', // 通知编码如果不是创意，是dir:adviceCode : "SMS_CONTACT",
        channelIds: undefined, // 多个渠道
        isEngine: undefined, // 是否引擎
        templateInfoType: undefined, // 模板信息类型
        // 1 图文模板2 文字模板3 HTML模板
        templateInfoTypes, // 多模板信息类型
      },
      chooseMultiple: getFieldValue('isCreativeRecommend'), // 是否可多选(与决策分组有关)
      onCancel: () => {
        this.setState({ creativityChooseVisible: false });
      },
      onOk: this.onOk,
    };
    return (
      <Fragment>
        {creativityChooseVisible && <CreativityChoose {...creativityChooseProps} />}
        {adviceChannelType &&
        (channelType === '1' ||
          channelType === '2' ||
          channelType === '4' ||
          channelType === '5') ? null : (
          <div className={commonStyles.block}>
            <p className={commonStyles.title}>
              {formatMessage({ id: 'activityConfigManage.contact.creativeInformation' })}
            </p>
            {/* 决策分组：配置了ire节点情况下才出现 */}
            {/* {decisionList && decisionList.length > 0 && ( */}
            {/* <Form.Item
                label={formatMessage({ id: 'activityConfigManage.contact.makingGroup' })}
                className={commonStyles.doubleFormItem}
              >
                <Form.Item className={commonStyles.connectSwitch}>
                  {getFieldDecorator('isCreativeRecommend', {
                    valuePropName: 'checked',
                    initialValue: processInfo.isCreativeRecommend === '1',
                  })(<Switch />)}
                </Form.Item>
                {getFieldValue('isCreativeRecommend') && ( */}
            <Form.Item className={commonStyles.connectSwitchOther}>
              {getFieldDecorator('creativeIreGroups', {
                // rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
                initialValue: selectDecisionId === undefined ? '' : selectDecisionId,
                onChange: this.creativeIreGroupsChange,
              })(<CustomSelect {...customSelectProps} />)}
            </Form.Item>
            {/* )}
              </Form.Item> */}
            {/* )}  */}
            {/* <Form.Item
              label={formatMessage({ id: 'activityConfigManage.contact.creativeSourceType' })}
            >
              {getFieldDecorator('creativeSourceType', {
                rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
                // initialValue: selectDecisionId === undefined ? '' : selectDecisionId,
                initialValue: creativeSourceType === undefined ? '' : creativeSourceType,
                onChange: this.creativeSourceTypeChange,
              })(
                <Radio.Group>
                  <Radio value="00">内部</Radio>
                  <Radio value="01">外部</Radio>
                </Radio.Group>,
              )}
            </Form.Item> */}
            {/* 图片添加 */}
            {optionalCreativeType.indexOf('1') > -1 ? (
              <Form.Item
                label={formatMessage({ id: 'activityConfigManage.contact.creativeChoice' })}
              >
                <div className={styles.creativityImgWrap}>
                  {imgChoosedList &&
                    imgChoosedList.map(item => {
                      return (
                        <div className={styles.creativityImg} key={item.id}>
                          <img
                            src={item.thumbUrl}
                            alt={formatMessage({
                              id: 'activityConfigManage.contact.creativeChoice',
                            })}
                          />
                          <div className={styles.operate}>
                            <a
                              onClick={() => {
                                this.setState({
                                  previewVisible: true,
                                  previewImage: item.thumbUrl,
                                });
                              }}
                            >
                              <Icon type="eye" />
                              {formatMessage({ id: 'common.picture.preview' })}
                            </a>
                            <a
                              onClick={this.cancelChoose.bind(this, 'img', item)}
                              className={styles.operete}
                            >
                              <Iconfont type="iconshanchux" />
                              {formatMessage({ id: 'common.picture.delete' })}
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  <div
                    className={styles.addCreativity}
                    onClick={this.addCreativity.bind(this, 'img')}
                  >
                    <Icon type="plus" />
                    <p>{formatMessage({ id: 'activityConfigManage.contact.creativeChoice' })}</p>
                  </div>
                </div>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={() => {
                    this.setState({ previewVisible: false });
                  }}
                >
                  <img
                    alt={formatMessage({ id: 'activityConfigManage.contact.creativeChoice' })}
                    src={previewImage}
                    className={styles.previewImg}
                  />
                </Modal>
              </Form.Item>
            ) : null}
            {creativeSourceType == '01' ? (
              <Form.Item
                label={formatMessage({ id: 'activityConfigManage.contact.creativeChoice' })}
              >
                {getFieldDecorator('creativeInfoId', {
                  rules: [
                    { required: true, message: formatMessage({ id: 'common.form.required' }) },
                  ],
                  // initialValue: selectDecisionId === undefined ? '' : selectDecisionId,
                  initialValue: creativeInfoId === undefined ? '' : creativeInfoId,
                })(<InputNumber min={1} precision={0} onChange={this.toSaveCreativeInfoRels} />)}
              </Form.Item>
            ) : null}
            {/* 文本或html添加 */}
            {/* {(optionalCreativeType.indexOf('2') > -1 &&
              form.getFieldValue('creativeSourceType') === '00') ||
            (optionalCreativeType.indexOf('3') > -1 &&
              form.getFieldValue('creativeSourceType') === '00') ? ( */}
            <Form.Item label="话术选择">
              {textChoosedList &&
                textChoosedList.map(item => {
                  return (
                    <Card
                      key={item.adviceId}
                      size="small"
                      type="inner"
                      title={`话术名称：${item.adviceName}`}
                      extra={
                        <a
                          onClick={this.cancelChoose.bind(this, 'text', item)}
                          className={styles.operete}
                        >
                          <Iconfont type="iconshanchux" />
                        </a>
                      }
                      className={styles.textChoosedBox}
                    >
                      {item.templateInfoType === '3' ? (
                        <div
                          className={styles.con}
                          dangerouslySetInnerHTML={{ __html: item.creativeText }}
                        />
                      ) : (
                        <div className={styles.con}>{item.adviceText}</div>
                      )}
                    </Card>
                  );
                })}
              <a onClick={this.addCreativity.bind(this, 'text')}>
                {formatMessage({ id: 'activityConfigManage.flow.add' })}
              </a>
            </Form.Item>
            {/* ) : null} */}
          </div>
        )}
      </Fragment>
    );
  }
}

export default Creativity;

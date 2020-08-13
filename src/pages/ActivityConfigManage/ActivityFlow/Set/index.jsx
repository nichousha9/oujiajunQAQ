import React from 'react';
import { connect } from 'dva';
import { Form, Modal, Divider, Input, Row, Col, Tag, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Iconfont from '@/components/Iconfont/index';
import SearchTree from '@/components/SearchTree';
import CustomSelect from '@/components/CustomSelect/index';
import SetLabel from './SetLabel';
import commonStyles from '../common.less';
import selectStyles from '../Select/index.less';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

// 筛选条件
const TAG_LIST = [
  {
    title: '(',
    type: 1,
    ruleType: 'bracket',
  },
  {
    title: ')',
    type: 2,
    ruleType: 'bracket',
  },
  {
    // 交集 并集 补集
    title: '∩/∪/−',
    type: 3,
    ruleType: 'setOperation',
  },
];

@connect(({ user, loading }) => ({
  userInfo: user.userInfo,
  confirmLoading:
    loading.effects['activitySet/addProcess'] || loading.effects['activitySet/modProcess'],
}))
@Form.create()
class Set extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tagList: [],
      fNodes: [],
      setTypeList: [],
    };

    const { nodeData, activityInfo } = this.props;

    // console.log('nodeData', nodeData);

    this.selectedItem = {
      processId: nodeData.PROCESS_ID || '',
      processType: nodeData.processType,
      actionType: nodeData.actionType,
      campaignId: nodeData.campaignId, // 营销活动Id
      flowchartId: activityInfo.id,
      flowchartName: activityInfo.name,
      processName: nodeData.processname,
      // 当前活动状态信息，判断节点是否可编辑
      campaignState: activityInfo.campaignState,
      // 节点在xml中的数据
      id: nodeData.id,
    };

     // 拖拽事件信息
     this.eventInfo = {
      // 标识 是否绑定dragEnter(进入目标对象范围)
      bindFlag: false,
      // 标识 是否在放置区域: true，index，false
      enterFlag: false,
      // 拖拽索引
      dragIndex: 0,
      // 标签内拖拽排序选中id
      tagDragId: '',
    };
  }

  componentDidMount() {
    this.getSetTypeList();
    // 获取目录树数据
    this.qryProcessCellNameList();

    // 非新增，获取节点集合类型
    if(this.selectedItem.actionType !== 'A') {
      this.qryTarGrp();
      this.qryTarGrpLabelInfo();
    }
  }

  // set type
  getSetTypeList = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'activitySet/getSetTypeList',
      payload: {'attrSpecCode' : 'SET_TYPE'},
      callback: svcCont => {
        if(svcCont.data) {
          this.setState({
            setTypeList: svcCont.data,
          });
        }
      }
    });
  }

  onCustomSelectChange = () => {
    // 清空当前tagList
    this.setState({
      tagList: []
    });
  }

  // tree 
  qryProcessCellNameList = () => {
   const { dispatch, prevNodeData } = this.props;
   const { processId } = this.selectedItem;
   const preProcessIds = [];
   prevNodeData.forEach(nodeData => {
     if (nodeData.PROCESS_ID) {
       preProcessIds.push(nodeData.PROCESS_ID);
     }
   });

   const payload = {
     queryParams: {
       ids: preProcessIds,
       processType: prevNodeData,
       processId,
     }
   }

   dispatch({
     type: 'activitySet/qryProcessCellNameList',
     payload,
     callback: svcCont => {
       if(svcCont.data){
         this.setState({
           fNodes: this.formatTreeData(svcCont.data),
         });
       }
     },
   });

    // mock 
    // const { nodeData } = this.props;
    // const { preTableCode } = nodeData;
    // const mockData = [{
    //   CELL_NAME: preTableCode,
    //   ID: prevNodeData[0].id,
    // }];
    // this.setState({
    //   fNodes: this.formatTreeData(mockData),
    // });
  }

  formatTreeData = originFNodes => {
    return originFNodes.map(fNode => {
      const { CELL_NAME, ID } = fNode;
      return {
        title: CELL_NAME,
        id: ID,
        objId: ID,
        isLeaf: true,
        key: ID,
        ruleType: 'setCond',
      }
    });
  }

  // 根据id遍历已有标签树，返回对应treeItem
  findTreeItem = (id, treeArr) => {
    const treeItem = treeArr.find(item => item.id === id);
    return treeItem;
  };

  // drag
  // 开始拖拽，添加dragEnter监听
  handleDragStart = item => {
    // console.log('handleDragStart', item);
    if (this.getDisabledFlag()) return;
    // // 标签树目录拖拽 item，不执行监听事件
    // if (item && item.node && item.node.props && item.node.props.eventKey.indexOf('cat_') === 0) {
    //   return;
    // }
    // 标签内排序拖拽 item
    this.eventInfo.tagDragId = (item && item.id) || '';
    if (!this.eventInfo.bindFlag) {
      this.eventInfo.bindFlag = true;
      document.addEventListener('dragenter', this.handleDragEnter);
    }
  };

  // 拖拽完毕，移除dragEnter监听，并更新数据
  handleDragEnd = item => {
    // console.log('handleDragEnd', item);
    if (this.eventInfo.bindFlag) {
      document.removeEventListener('dragenter', this.handleDragEnter);
      this.eventInfo.bindFlag = false;
    }
    let newItem;
    if (item && item.node && item.node.props) {
      const {
        node: { props },
      } = item;
      const { fNodes } = this.state;
      const selectTreeItem = this.findTreeItem(props.eventKey, fNodes);
      // console.log('selectTreeItem',selectTreeItem );
      newItem = selectTreeItem || {};
    } else {
      // 筛选条件标签
      newItem = item;
    }
    if (this.eventInfo.enterFlag !== false) {
      // 移除移动active效果
      this.switchEmptyActive();
      this.setState(({ tagList }) => {
        const newTagList = [].concat(tagList) || [];
        this.eventInfo.dragIndex += 1;
        const newTagItem = { ...newItem, id: this.eventInfo.dragIndex };
        // 添加到数组末尾
        if (this.eventInfo.enterFlag === true) {
          newTagList.push(newTagItem);
        } else {
          // 添加到索引位置处
          newTagList.splice(this.eventInfo.enterFlag, 0, newTagItem);
        }
        // console.log('newTagList',newTagList);
        return {
          tagList: newTagList,
        };
      });
    }
  };

  /**
   * dragEnter事件，根据拖拽放置区 判断添加数据的情况，赋值到this.eventInfo.enterFlag
   * 1. tagWrapper，添加到末尾
   * 2. tagItem，添加到tagItem前
   * 3. tagWrapper外，不添加
   */
  handleDragEnter = e => {
    // console.log('handleDragEnter', e);
    if (e && e.target) {
      // 1，返回 true(插入末尾的状态)
      if (e.target.id === 'tagWrapper') {
        this.eventInfo.enterFlag = true;
        this.switchEmptyActive(true);
        return;
      }
      // 2 返回 index(记录当前插入列表中的顺序)
      const tagItem = this.findTagItem(e.target);
      if (tagItem) {
        this.eventInfo.enterFlag = Array.prototype.indexOf.call(
          tagItem.parentNode.childNodes,
          tagItem,
        );
        this.switchEmptyActive(true);
        return;
      }
    }
    // 3 返回 false
    this.eventInfo.enterFlag = false;
    this.switchEmptyActive(false);
  };

  // 为拖拽放置区 切换移动active效果
  switchEmptyActive = flag => {
    // 操作dom添加active样式
    const { childNodes } = document.getElementById('tagWrapper');
    const index =
      this.eventInfo.enterFlag === true ? childNodes.length - 1 : this.eventInfo.enterFlag;
    childNodes.forEach((ele, i) => {
      const item = ele;
      if (this.eventInfo.enterFlag === true) {
        item.className = flag && index === i ? 'tagRightActive' : '';
      } else {
        item.className = flag && index === i ? 'tagLeftActive' : '';
      }
      // 标签内拖拽排序，隐藏目标元素
      if (flag && this.eventInfo.tagDragId == item.id.substr(item.id.indexOf('_') + 1)) {
        item.className = item.className ? `${item.className} tagHide` : 'tagHide';
      }
    });
  };

  // 返回target对应的tagWrapper的子节点
  findTagItem = target => {
    let tagNode;
    if (target && target.id && target.id.indexOf('tagItem_') === 0) {
      tagNode = target;
    } else if (target && target.parentNode) {
      tagNode = this.findTagItem(target.parentNode);
    }
    return tagNode;
  };

  // 标签内排序
  handleTagDragEnd = item => {
    if (this.getDisabledFlag()) return;
    if (this.eventInfo.bindFlag) {
      document.removeEventListener('dragenter', this.handleDragEnter);
      this.eventInfo.bindFlag = false;
    }
    // 移除拖拽active效果
    this.switchEmptyActive();
    if (this.eventInfo.enterFlag !== false) {
      this.setState(({ tagList }) => {
        let newTagList = [].concat(tagList) || [];
        if (this.eventInfo.enterFlag === true) {
          newTagList = newTagList.filter(ele => {
            return ele.id !== item.id;
          });
          newTagList.push(item);
        } else {
          this.eventInfo.dragIndex += 1;
          const newItem = { ...item, id: this.eventInfo.dragIndex };
          newTagList.splice(this.eventInfo.enterFlag, 0, newItem);
          newTagList = newTagList.filter(ele => {
            return ele.id !== item.id;
          });
        }
        return {
          tagList: newTagList,
        };
      });
    }
  };

  // 删除标签
  removeTagItem = item => {
    this.setState(({ tagList }) => {
      const newArr = tagList.filter(ele => {
        return item.id !== ele.id;
      });
      return {
        tagList: newArr,
      };
    });
  };

  /**
   * tagList transform MccTarGrpLabelRels
   * values: field value
   */
  generateMccTarGrpLabelRels = values => {
    const { tagList } = this.state;
    // console.log('tagList', tagList);
    return tagList.map((item, index) => {
      const ruleSeq = index + 1;
      const newItem = item.type ? {
        ruleType: item.ruleType,
        ruleSeq,
        ruleValue: item.type === 3 ? values[`setOperation_${item.id}`]: item.title,
      } : {
        objId: item.objId,
        ruleType: item.ruleType || 'setCond',
        ruleSeq,
      }
      return newItem;
    });
  }

    /**
   * MccTarGrpLabelRels  transform tagList
   */
  generateTagList = mccTarGrpLabelRels => {
    return mccTarGrpLabelRels.map(item => {
      this.eventInfo.dragIndex += 1;
      const { ruleType } = item;
      if(ruleType === 'bracket' ) {
        return {
          type: item.ruleValue === '(' ? 1 : 2,
          title: item.ruleValue,
          ruleType,
          id: this.eventInfo.dragIndex,
        }
      } 
      if(ruleType === 'setOperation') {
        return {
          type: 3,
          title: item.ruleValue,
          ruleType,
          id: this.eventInfo.dragIndex,
        }
      }
      return {
        title: item.cellName,
        id: this.eventInfo.dragIndex,
        objId: item.objId,
        ruleType,
      }
    });
  }

  // 获取tagList信息
  qryTarGrpLabelInfo = async () => {
    const { processId } = this.selectedItem;
    const { dispatch } = this.props;
    await dispatch({
      type: 'activitySet/qryTarGrpLabelInfo',
      payload: { processId },
      callback: svcCont => {
        // console.log(result);
        this.setState({
          tagList: this.generateTagList(svcCont.data),
        });
      }
    });

    // mock
    // const data = [
    //    {
    //     createDate: "2019-09-12 13:51:44",
    //     grpId: 5556,
    //     id: 11162,
    //     ruleSeq: 1,
    //     ruleType: "bracket",
    //     ruleValue: "(",
    //     statusCd: "1",
    //     statusDate: "2019-09-12 13:51:44",
    //     whereId: 11162,
    //    },
    //    {
    //     cellName: "MCC_X_SELECT_285270",
    //     createDate: "2019-09-12 13:51:44",
    //     grpId: 5556,
    //     id: 11163,
    //     objId: 160150,
    //     ruleSeq: 2,
    //     ruleType: "setCond",
    //     statusCd: "1",
    //     statusDate: "2019-09-12 13:51:44",
    //     whereId: 11163,
    //    },
    //    {
    //     createDate: "2019-09-12 13:51:44",
    //     grpId: 5556,
    //     id: 11164,
    //     ruleSeq: 3,
    //     ruleType: "setOperation",
    //     ruleValue: "intersect",
    //     statusCd: "1",
    //     statusDate: "2019-09-12 13:51:44",
    //     whereId: 11164,
    //    },
    //    {
    //     createDate: "2019-09-12 13:51:44",
    //     grpId: 5556,
    //     id: 11165,
    //     ruleSeq: 4,
    //     ruleType: "bracket",
    //     ruleValue: ")",
    //     statusCd: "1",
    //     statusDate: "2019-09-12 13:51:44",
    //     whereId: 11165,
    //    }
    // ];
    
    // this.setState({
    //   tagList: this.generateTagList(data),
    // }, () => {
    //   console.log(this.state.tagList);
    // });
  };

  // 非新增时，获取当前节点集合类型
  qryTarGrp = () => {
    const { dispatch, form } = this.props;
    const { processId } = this.selectedItem;
    dispatch({
      type: 'activitySet/qryTarGrp',
      payload: { processId },
      callback: result => {
        if(result && result.mccTarGrp) {
          form.setFieldsValue({
            setType: result.mccTarGrp.setType,
          });
        }
      } 
    });

    // mockData
    // const result =  {
    //   mccTarGrp: {
    //     grpId: 5556,
    //     grpSql: " (  SELECT T1.FIELD,160173 AS PROCESSING_ID FROM MCC_X_SELECT_285270 T1 INNER JOIN  )  WHERE 1=1 ",
    //     id: 5556,
    //     processId: 285316,
    //     processType: "SET",
    //     setType: "intersect",
    //     tableCode: "MCC_X_SET_285316",
    //   }
    // }
    // form.setFieldsValue({
    //   setType: result.mccTarGrp.setType,
    // });
  }

  // 判断节点是否不可编辑
  getDisabledFlag = () => {
    const { campaignState } = this.selectedItem;
    return campaignState !== 'Editing';
    // return false;
  };

  /**
   * values: FieldsValue
   */
  generateParams = values => {
    const { processId, processType, flowchartId, flowchartName, campaignId } = this.selectedItem;
    return {
      mccProcess: {
        id: processId,
        processType,
        name: values.processName,
        flowchartId,
        flowchartName,
        campaignId,
        isAccumulation: '0',
        isCreativeRecommend: '0',
      },
      mccTarGrpLabelRels: this.generateMccTarGrpLabelRels(values) || [],
      setType: values.setType,
      PROCESS_TYPE: processType,
    }
  }

  handleSubmit = () => {
    const { form, dispatch, onOk, onCancel, nodeData } = this.props;
    const { processId } = this.selectedItem;
    const addFlag = !processId;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = this.generateParams(values);

      if(!this.isValid(params)) {
        return;
      }
   
      dispatch({
        type: addFlag ? 'activitySet/addProcess' : 'activitySet/modProcess',
        payload: params,
        callback: svcCont => {
          const { data } = svcCont;
          const newNodeData = {
            ...nodeData,
            ...data,
            PROCESS_ID: svcCont.data.processId, // ?
            PROCESS_NAME: params.mccProcess.name,
            processname: params.mccProcess.name,
            // PROCESS_TYPE: this.selectedItem.processType, nodeData取
            NEED_OPT: 'N'
          }
          if(addFlag) nodeData.NODE_STATE = '2';
          onOk(newNodeData);
          onCancel();
        }
      });
    });
  };

  isValid  = params => {
    const { mccTarGrpLabelRels } = params;

    if (!mccTarGrpLabelRels || (mccTarGrpLabelRels && !mccTarGrpLabelRels.length)) {
      message.error(formatMessage({ id: 'activityConfigManage.set.conditionEmptyError'},  '集合运算不为空'));
      return;
    }

    let leftBracketCount = 0;
    let rightBracketCount  = 0;
    mccTarGrpLabelRels.forEach(item => {
      if(item.ruleType === 'bracket' && item.ruleValue === '(') {
        leftBracketCount += 1;
      }
      if(item.ruleType === 'bracket' && item.ruleValue === ')') {
        rightBracketCount += 1;
      }
    });

    if(leftBracketCount > rightBracketCount) {
      message.error(formatMessage({ id: 'activityConfigManage.set.rightBracketLackError' }, '筛选条件右括号缺失!'));
      return;
    }
    if(leftBracketCount < rightBracketCount) {
      message.error(formatMessage({ id: 'activityConfigManage.set.leftBracketLackError' }, '筛选条件左括号缺失!'));
      return;
    }

    return true;
  }

  render() {
    const { tagList, fNodes, setTypeList } = this.state;
    const { onCancel, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const { processName } = this.selectedItem;
    // console.log('PROCESSNAME', processName);
    const title = (
      <div>
        <span className={commonStyles.modalTitle}>{formatMessage({ id: 'activityConfigManage.set.set' }, '集合')}</span>
        <Divider type="vertical" />
        <Form.Item className={commonStyles.titleNameFormItem}>
          {getFieldDecorator('processName', {
             rules: [
              {
                min: 1,
                max: 30,
                required: true,
                message: 'processName is required[1~30].',
              },
            ],
            initialValue: processName,
          })(
            <Input
              size="small"
              className={commonStyles.titleNameInput}
              placeholder={formatMessage({ id: 'activityConfigManage.flow.customName' })}
              addonAfter={<Iconfont type="iconbianji1" />}
            />,
          )}
        </Form.Item>
      </div>
    );

    // 节点是否可编辑
    const disabled = this.getDisabledFlag();

    const customSelectProps = {
      // 必选
      required: true,
      dataSource:
        (setTypeList &&
          setTypeList.map(item => {
            return {
              label: item.attrValueName,
              value: item.attrValueCode,
              disabled,
            };
          })) ||
        [],
      onChange: this.onCustomSelectChange,
    };

    const treeProps = {
      loadData: () => this.qryProcessCellNameList(),
      draggable: true,
      onDragStart: disabled ? null : this.handleDragStart,
      onDragEnd: disabled ? null : this.handleDragEnd,
      treeData: fNodes,
      showButtons: false,
      ignoreCaseFlag: true,
      hideSearch: true,
    };

    return (
      <Modal
        title={title}
        visible
        width={960}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        okButtonProps={{ size: 'small', style: disabled ? { display: 'none' } : null }}
        cancelButtonProps={{ size: 'small' }}
        confirmLoading={!!confirmLoading}
        wrapClassName={commonStyles.flowModal}
      >
        <Form {...formItemLayout}>
          <div className={commonStyles.block}>
            <Form.Item
              label={formatMessage(
                { id: 'activityConfigManage.set.setType' },
                '集合类型',
              )}
              className="mb0"
            >
              {getFieldDecorator('setType', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'common.form.required' }),
                  },
                ],
                initialValue: setTypeList && setTypeList.length && setTypeList[0].attrValueCode,  // 默认为交集
              })(<CustomSelect {...customSelectProps} />)}
            </Form.Item>
          </div>
          <div>
            <Row className={commonStyles.block}>
              <p className={commonStyles.title}>
                {formatMessage(
                  { id: 'activityConfigManage.select.conditions' },
                  '筛选条件',
                )}
              </p>
            </Row>
            <div>
              <Row>
                <Col span={6}>
                  <p className={selectStyles.title}>
                    {formatMessage({ id: 'activityConfigManage.select.catalog' }, '标签目录')}
                  </p>
                  <div className={selectStyles.catWrapper}>
                    <SearchTree {...treeProps} />
                  </div>
                </Col>
                <Col span={18}>
                  <div>
                  {/* 筛选条件 */}
                    <Row>
                      <div>
                        {TAG_LIST.map(item => (
                          <Tag
                            key={item.type}
                            draggable
                            onDragStart={disabled ? null : () => this.handleDragStart()}
                            onDragEnd={disabled ? null : e => this.handleDragEnd(item, e)}
                          >
                            {item.title}
                          </Tag>
                        ))}
                      </div>
                      {/* 拖拽标签列表 */}
                      <div id="tagWrapper" className={selectStyles.tagWrapper}>
                          {tagList.map(item => (
                            <SetLabel
                              item={item}
                              key={item.id}
                              form={form}
                              handleTagDragStart={
                                disabled ? null : () => this.handleDragStart(item)
                              }
                              handleTagDragEnd={disabled ? null : this.handleTagDragEnd}
                              removeItem={this.removeTagItem}
                              disabled={disabled}
                            />
                          ))}
                      </div>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Set;

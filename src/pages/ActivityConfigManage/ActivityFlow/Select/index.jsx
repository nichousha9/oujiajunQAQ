/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/**
 * select弹框 组件
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Divider, Row, Col, Tag, message, Spin } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import CustomSelect from '@/components/CustomSelect/index';
import Iconfont from '@/components/Iconfont/index';
import commonStyles from '../common.less';
import styles from './index.less';
import SearchTree from '@/components/SearchTree';
import ModalGroup from './ModalGroup';
import SelectLabel from './SelectLabel';

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
    title: 'and/or',
    type: 3,
    ruleType: 'connectOpt',
  },
];

// 新增select的columnList传参
// const SELECT_COLUMN_LIST = [
//   {
//     field_alias_name: 'field',
//     obj_code: 'SUBS_ID',
//     table_code: 'SUBS_BASIC',
//   },
// ];

// 标签选择值
// const SELECT_LABEL = 'select_label';

@connect(({ activitySelect, loading, common }) => ({
  ...activitySelect,
  // selectSegment: activitySelect.selectSegment,
  // initLoading:
  //   // loading.effects['activitySelect/getTarGrpInfos'] ||
  //   loading.effects['activitySelect/getSeqWithProcess'],
  // confirmLoading:
  //   loading.effects['activitySelect/validateSql'] ||
  //   loading.effects['activitySelect/addProcess'] ||
  //   loading.effects['activitySelect/modProcess'],
}))
@Form.create()
class ActivitySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 标签树
      dimList: [],
      // 右侧拖拽标签列表
      tagList: [],
      // 群组弹框信息
      modalGroup: {
        visible: false,
      },
      // 是否可选择客户群类型
      // selectTypeFlag: false, // 不要客户群了
      // 环节信息
      processInfo: {
        processId: '', // 新的流程id
        selectSourceType: '', // 已有流程id的selectType
      },
      selectTypes: [],
      headerTagList: [],
      columnList: [],
      dataSourceType: '',
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
      // 标识 头部是否在放置区域: true，index，false
      headerEnterFlag: false,

      headerDrageIndex: 0,
    };
    // 储存已请求的目录id
    this.getDimListIdArr = [];

    // 与流程编辑对接，赋值到 selectItem
    const { nodeData, activityInfo } = this.props;
    this.selectItem = {
      // 当前活动状态信息，判断节点是否可编辑
      campaignState: activityInfo.campaignState,
      // 节点在xml中的数据
      id: nodeData.id,
      processName: nodeData.processname,
      campaignId: activityInfo.campaignId,
      processType: nodeData.processType,
      flowChartId: activityInfo.flowchartId,
      processId: nodeData.PROCESS_ID,
    };
  }

  componentDidMount() {
    this.getDimList();
    this.getSpecCode(); // 返回标签选择和客户群选择
    // this.checkSmartWebSwitchIsOn();

    // 初始化数据
    const { processId } = this.selectItem;
    // if (!id) return;
    if (processId) {
      this.getTarGrpInfos(processId);
      // processName 可从xml json中获取
      // this.qryProcess(processId);
    } else {
      this.getSeqWithProcess();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { form } = this.props;
    const { selectSegment } = nextProps;
    if (selectSegment && selectSegment.length) {
      form.resetFields('group');
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'activitySelect/save',
      payload: {
        selectSegment: '',
      },
    });
  }

  // 当前节点有processId，获取节点信息 wheres，初始化tagList信息
  getTarGrpInfos = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activitySelect/getTarGrpInfos',
      payload: {
        processId: id,
        id,
      },
      callback: res => {
        console.log(res);
        // const selectSourceType = res.data.mccProcessTarGrp && res.data.mccProcessTarGrp.selectSourceType;
        // // 客户群选择的情况，请求选中的客户群列表
        // if (selectSourceType && selectSourceType !== SELECT_LABEL) {
        //   this.qrySegList(id);
        // }
        this.setState(({ processInfo }) => {
          return {
            tagList: res.data.wheres.map(item => {
              const ruleType = item.ruletype;
              const ruleValue = item.rulevalue;
              this.eventInfo.dragIndex += 1;

              if (ruleType === 'bracket' || ruleType === 'connectOpt') {
                let type = ruleValue === '(' ? 1 : 3;
                if (ruleValue === ')') type = 2;
                return {
                  title: ruleValue,
                  ruleType,
                  type,
                  id: this.eventInfo.dragIndex,
                  // value 初始值
                  selectValue: ruleValue,
                };
              }
              return {
                labelcode: item.labelcode,
                title: item.name,
                id: this.eventInfo.dragIndex,
                tableCode: item.tablecode,
                labelId: item.objid,
                // select 初始值
                selectValue: item.ruleoperator,
                // value 初始值
                value: ruleValue,
              };
            }),
            processInfo: {
              ...processInfo,
              selectSourceType: res.data.mccProcessTarGrp && res.data.mccProcessTarGrp.selectSourceType,
            },
            dataSourceType: res.data.mccProcessTarGrp && res.data.mccProcessTarGrp.selectSourceType,
          };
        });
        const fliedList = [];
        if (res.data.fields) {
          for (let i = 0; i < res.data.fields.length; i += 1) {
            fliedList.push({
              ...res.data.fields[i],
              title: res.data.fields[i].label_code,
              id: res.data.fields[i].obj_id,
              labelId: res.data.fields[i].obj_id,
              tableCode: res.data.fields[i].table_code,
            });
          }
          const column = [];
          for (let i = 0; i < fliedList.length; i += 1) {
            column.push({
              table_code: fliedList[i].tableCode,
              label_code: fliedList[i].title,
              obj_id: fliedList[i].labelId,
            });
          }
          this.setState({ headerTagList: fliedList, columnList: column });
        }
      },
    });
  };

  // 当前节点有processId，获取环节信息
  qryProcess = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activitySelect/qryProcess',
      payload: {
        processId: id,
        id,
      },
      callback: res => {
        this.setState(({ processInfo }) => ({
          processInfo: {
            ...processInfo,
            ...res.data,
          },
        }));
      },
    });
  };

  // 获取群组列表
  qrySegList = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activitySelect/qrySegList',
      payload: {
        processId: Number(id),
      },
      callback: res => {
        dispatch({
          type: 'activitySelect/save',
          payload: {
            selectSegment: res.data || [],
          },
        });
      },
    });
  };

  // 当前节点没有processId，获取流程id序列值
  getSeqWithProcess = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activitySelect/getSeqWithProcess',
      payload: {},
      callback: res => {
        this.setState({
          processInfo: {
            processId: res.data.processId,
          },
        });
      },
    });
  };

  // 检查是否开启指挥中心
  // checkSmartWebSwitchIsOn = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'activitySelect/checkSmartWebSwitchIsOn',
  //     payload: {
  //       attrSpecCode: 'SELECT_TYPE',
  //     },
  //     callback: res => {
  //       // 如果开启了智慧中心，屏蔽客户群选择
  //       if (res.data) {
  //         this.setState({
  //           selectTypeFlag: false,
  //         });
  //       }
  //     },
  //   });
  // };

  // 获取选择类型
  getSpecCode = () => {
    const { dispatch } = this.props;
    // const { processId } = this.selectItem;
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'SELECT_SOURCE_TYPE',
      },
      callback: res => {
        if (res.data) {
          this.setState({ selectTypes: res.data });
          if (res.data.length == 1 && res.data[0].attrValueCode == 'subs_basic') {
            this.setState({ dataSourceType: res.data[0].attrValueCode });
          }
        }
      },
    });
  };

  // 获取左侧树列表
  getDimList = id => {
    // return new Promise(resolve => {
    //   if (this.getDimListIdArr.indexOf(id) > -1) {
    //     // 已请求
    //     resolve();
    //     return;
    //   }
    //   if (id) this.getDimListIdArr.push(id);
    const { dispatch } = this.props;
    dispatch({
      type: 'activitySelect/getDimList',
      payload: {
        id,
      },
      callback: res => {
        this.formatDimList(id, res.data);

        //  resolve();
      },
    });
    // });
  };

  // 搜索标签树
  handleAsyncSearch = value => {
    return new Promise(resolve => {
      if (value === '') {
        resolve();
        return;
      }
      const { dispatch } = this.props;
      dispatch({
        type: 'activitySelect/expandTreeNodes',
        payload: {
          name: value,
        },
        callback: async res => {
          await this.formatExpandTree(res.data || []);
          resolve();
        },
      });
    });
  };

  // 搜索标签树后 异步请求上级节点数据，并格式化标签树
  formatExpandTree = treeArr => {
    return new Promise(resolve => {
      treeArr.forEach(async (ele, index) => {
        const parents = (ele.path_code && ele.path_code.split('.')) || [];
        await this.asyncArrItem(parents, 0);
        if (index === treeArr.length - 1) resolve();
      });
    });
  };

  // arr 需要按数组顺序请求，请求成功setState后再请求下一个
  asyncArrItem = async (arr, index) => {
    if (arr.length === index) return;
    const { dimList } = this.state;
    const id = `cat_${arr[index]}`;
    const treeNode = this.findTreeItem(id, dimList);
    if ((treeNode && treeNode.children.length === 0) || this.getDimListIdArr.indexOf(id) === -1) {
      await this.getDimList(id);
    }
    await this.asyncArrItem(arr, index + 1);
  };

  // 格式化标签树 id为父级目录，data为节点数据
  formatDimList = (id, data) => {
    return new Promise(resolve => {
      const { dimList } = this.state;
      const treeArr = data.map(item => ({
        id: item.id,
        parentGrpId: item.parentgrpid,
        labelId: item.objid,
        title: item.name || '',
        key: item.id,
        isLeaf: !item.isParent,
        children: [],
        labelValueType: item.labelvaluetype,
        labelDataType: item.labeldatetype,
        tableCode: item.tartablecode,
        labelcode: item.labelcode,
      }));

      let newArr = [].concat(dimList);
      if (!id) {
        newArr = treeArr;
      } else {
        treeArr.forEach(item => {
          const parentItem = this.findTreeItem(`cat_${item.parentGrpId}`, newArr);

          if (parentItem) {
            parentItem.children.push(item);
          }
        });
      }

      if (newArr[0].children) {
        const obj = {};
        const objs = {};
        let newArrs = [];
        const newArr3 = [];
        let newArr4 = [];
        newArrs = newArr[0].children.reduce((item, next) => {
          obj[next.id] ? ' ' : (obj[next.id] = true && item.push(next));
          return item;
        }, []);

        newArrs.map(item => {
          if (item.children.length !== 0) {
            newArr4 = item.children.reduce((cur, next) => {
              objs[next.id] ? '' : (objs[next.id] = true && cur.push(next));
              return cur;
            }, []);
            if (item.id === `cat_${newArr4[0].parentGrpId}`) {
              item.children = newArr4.filter(cur => cur.parentGrpId !== item.id);
            }
            return item;
          }
        });

        newArr[0].children = newArrs;
      }

      this.setState(
        {
          dimList: newArr,
        },
        () => {
          resolve();
        },
      );
    });
  };

  // 根据id遍历已有标签树，返回对应treeItem
  findTreeItem = (id, treeArr) => {
    // console.log(treeArr);
    let treeItem;
    treeArr.forEach(item => {
      if (!treeItem) {
        if (item.id === id) {
          treeItem = item;
        } else if (item.children && item.children.length) {
          treeItem = this.findTreeItem(id, item.children);
        }
      }
    });
    return treeItem;
  };

  // 切换客户群弹框
  handleSwitchGroup = flag => {
    this.setState({
      modalGroup: {
        visible: flag,
      },
    });
  };

  // 开始拖拽，添加dragEnter监听
  handleDragStart = item => {
    if (this.getDisabledFlag()) return;
    // 标签树目录拖拽 item，不执行监听事件
    if (item && item.node && item.node.props && item.node.props.eventKey.indexOf('cat_') === 0) {
      return;
    }
    // 标签内排序拖拽 item
    this.eventInfo.tagDragId = (item && item.id) || '';
    if (!this.eventInfo.bindFlag) {
      this.eventInfo.bindFlag = true;
      document.addEventListener('dragenter', this.handleDragEnter);
    }
  };

  // 拖拽完毕，移除dragEnter监听，并更新数据
  handleDragEnd = item => {
    if (this.eventInfo.bindFlag) {
      document.removeEventListener('dragenter', this.handleDragEnter);
      this.eventInfo.bindFlag = false;
    }
    let newItem;
    if (item && item.node && item.node.props) {
      const {
        node: { props },
      } = item;
      const { dimList } = this.state;
      if (props && props.eventKey.indexOf('cat_') === 0) {
        message.warn(formatMessage({ id: 'activityConfigManage.select.move' }), '只可以移动标签');
        return;
      }
      const selectTreeItem = this.findTreeItem(props.eventKey, dimList);
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
        return {
          tagList: newTagList,
        };
      });
    } else if (this.eventInfo.headerEnterFlag !== false) {
      // 移除移动active效果
      this.switchEmptyActive();
      this.setState(({ headerTagList }) => {
        let newTagList = [].concat(headerTagList) || [];
        this.eventInfo.headerDrageIndex += 1;
        const newTagItem = { ...newItem, id: this.eventInfo.headerDrageIndex };
        let doubble = false;
        newTagList.forEach(nitem => {
          if (newTagItem.labelId === nitem.labelId) {
            doubble = true;
          }
        });
        if (doubble) {
          message.info('不可添加重复标签');
          return {};
        }
        // 添加到数组末尾
        if (this.eventInfo.headerEnterFlag === true) {
          newTagList.push(newTagItem);
        } else {
          // 添加到索引位置处
          newTagList.splice(this.eventInfo.headerEnterFlag, 0, newTagItem);
        }
        newTagList = newTagList.filter(ele => {
          return ele.id !== item.id;
        });
        const column = [];
        for (let i = 0; i < newTagList.length; i += 1) {
          column.push({
            table_code: newTagList[i].tableCode,
            label_code: newTagList[i].title,
            obj_id: newTagList[i].labelId,
          });
        }
        return {
          headerTagList: newTagList,
          columnList: column,
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
    if (e && e.target) {
      // 1，返回 true(插入末尾的状态)
      if (e.target.id === 'tagWrapper') {
        this.eventInfo.enterFlag = true;
        this.switchEmptyActive(true);
        return;
      }
      if (e.target.id === 'newTagWrapper') {
        this.eventInfo.headerEnterFlag = true;
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
    this.eventInfo.headerEnterFlag = false;
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

  onClose = item => {
    this.setState(({ headerTagList }) => {
      const newArr = headerTagList.filter(ele => {
        return item.id !== ele.id;
      });
      return {
        headerTagList: newArr,
      };
    });
  };

  // 提交select表单
  handleSubmit = () => {
    const { form, selectSegment, confirmLoading } = this.props;

    if (confirmLoading) return;

    form.validateFieldsAndScroll(async (err, values) => {
      if (err) return;
      const { dispatch } = this.props;
      const { type } = values;
      const { columnList, dataSourceType } = this.state;
      const { processId, campaignId, flowChartId, processName, processType } = this.selectItem;
      // const labelFlag = type === SELECT_LABEL;
      const labelFlag = true;
      const params = {
        campaignId, // 活动id
        flowchartId: flowChartId, // 流程id
        id: this.getProcessId(), // 节点id

        processType, // 环节类型

        PROCESS_TYPE: processType,
        processId: this.getProcessId(), // 环节id
        selectSourceType: type, // 节点类型
        tableCode: this.getTableCode(),
        // 校验sql后正确的传参
        columnList: dataSourceType == 'subs_basic' ? columnList : [{ table_code: type }],
        condList: [],
        joinList: [],
        sqlType: '0',
      };
      if (labelFlag) {
        // 校验sql
        const res = await this.validateSql(values);
        if (!res) return;
        params.condList = res.condList;
        params.joinList = res.joinList;
        params.sqlType = res.sqlType;
      } else {
        params.segList =
          (selectSegment &&
            selectSegment.map(item => {
              return { segmentid: item.segmentid };
            })) ||
          [];
      }
      dispatch({
        type: 'activitySelect/modProcess',
        payload: params,
        callback: () => {
          const { onCancel } = this.props;
          onCancel();
          // 与流程编辑对接：返回更新节点数据
          const { nodeData, onOk } = this.props;
          const newNodeData = {
            ...nodeData,
            PROCESS_ID: params.processId,
            name: params.name,
            processname: params.name,
            tableCode: params.tableCode,
          };
          newNodeData.NODE_STATE = 2;
          onOk(newNodeData);
        },
      });
    });
  };

  // 检验sql
  validateSql = values => {
    return new Promise((resolve, reject) => {
      const { dispatch, form } = this.props;
      const type = form.getFieldValue('type');
      // 格式化condList
      const { columnList, dataSourceType } = this.state;
      const condList = this.formatCondList(values);
      const params = {
        columnList: dataSourceType == 'subs_basic' ? columnList : [{ table_code: type }],
        condList,
        joinList: [], // 连接查询列表
        processing_id: '0',
        sqlType: '0',
      };
      dispatch({
        type: 'activitySelect/validateSql',
        payload: params,
        callback: () => {
          resolve(params);
        },
      }).then(() => {
        reject();
      });
    });
  };

  // 校验选择客户群
  validateGroup = (rule, value, callback) => {
    const { selectSegment } = this.props;
    if (!selectSegment || !selectSegment.length) {
      callback(
        formatMessage({
          id: 'common.form.required',
        }),
      );
    } else {
      callback();
    }
  };

  // 根据tagList将数据格式化成condList
  formatCondList = values => {
    const { tagList } = this.state;
    return tagList.map((item, index) => {
      const resSeq = index + 1;
      const newItem = item.type
        ? {
            ruleType: item.ruleType,
            field_data_type: item.ruleType,
            rule_type: item.ruleType,
            ruleSeq: resSeq,
            rule_seq: resSeq,
            ruleValue: item.type === 3 ? values[`select_${item.id}`] : item.title,
            rule_value: item.type === 3 ? values[`select_${item.id}`] : item.title,
          }
        : {
            labelcode: item.labelcode,
            name: item.title,
            objId: item.labelId,
            obj_id: item.labelId,
            ruleOperator: values[`select_${item.id}`],
            rule_operator: values[`select_${item.id}`],
            ruleType: 'simpleCond',
            rule_type: 'simpleCond',
            ruleValue: values[`value_${item.id}`],
            rule_value: values[`value_${item.id}`],
            ruleSeq: resSeq,
            rule_seq: resSeq,
            tablecode: item.tableCode,
            tar_table_code: item.tableCode,
          };
      return newItem;
    });
  };

  // 获取tableCode
  getTableCode = () => {
    const { processType } = this.selectItem;
    return `MCC_X_${processType}_${this.getProcessId()}`;
  };

  // 获取当前processId
  getProcessId = () => {
    const { processId } = this.selectItem;
    const { processInfo } = this.state;
    return processId || processInfo.processId;
  };

  // 判断节点是否不可编辑
  getDisabledFlag = () => {
    const { campaignState } = this.selectItem;
    return campaignState !== 'Editing';
  };

  // 数据来源类型切换
  onValueChange = value => {
    this.setState({ dataSourceType: value });
  };

  render() {
    const {
      form,
      onCancel,
      // selectSegment,
      confirmLoading,
      initLoading,
    } = this.props;
    const { processName } = this.selectItem;
    const {
      getFieldDecorator,
      // getFieldValue
    } = form;
    const {
      dimList,
      modalGroup,
      // selectTypeFlag,
      tagList,
      processInfo,
      selectTypes,
      headerTagList,
      dataSourceType,
    } = this.state;
    const title = (
      <div>
        <span className={commonStyles.modalTitle}>客户筛选</span>
        {/* <Divider type="vertical" />
        <Form.Item className={commonStyles.titleNameFormItem}>
          {getFieldDecorator('processName', {
            initialValue: processName,
          })(
            <Input
              size="small"
              className={commonStyles.titleNameInput}
              placeholder={formatMessage({ id: 'activityConfigManage.flow.customName' })}
              addonAfter={<Iconfont type="iconbianji1" />}
            />,
          )}
        </Form.Item> */}
      </div>
    );

    // 节点是否可编辑
    const disabled = this.getDisabledFlag();

    const customSelectProps = {
      // 必选
      required: true,
      dataSource:
        (selectTypes &&
          selectTypes.map(item => {
            return {
              label: item.attrValueName,
              value: item.attrValueCode,
              disabled,
            };
          })) ||
        [],
      onChange: e => {
        this.onValueChange(e);
      },
    };
    const treeProps = {
      onSelectCallBack: this.getDimList,
      draggable: true,
      onDragStart: disabled ? null : this.handleDragStart,
      onDragEnd: disabled ? null : this.handleDragEnd,
      treeData: dimList,
      showButtons: false,
      handleAsyncSearch: this.handleAsyncSearch,
      ignoreCaseFlag: true,
    };

    const visible = true;
    console.log(processInfo);
    return (
      <Fragment>
        <Modal
          title={title}
          visible={visible}
          width={960}
          onOk={this.handleSubmit}
          confirmLoading={!!confirmLoading}
          onCancel={onCancel}
          okText={formatMessage({ id: 'common.btn.submit' })}
          cancelText={formatMessage({ id: 'common.btn.back' })}
          okButtonProps={{ size: 'small', style: disabled ? { display: 'none' } : null }}
          cancelButtonProps={{ size: 'small' }}
          wrapClassName={commonStyles.flowModal}
        >
          <Spin spinning={!!initLoading}>
            <Form {...formItemLayout}>
              {/* 数据来源类型 */}
              <div className={commonStyles.block}>
                <Form.Item
                  label={formatMessage(
                    { id: 'activityConfigManage.select.dataType' },
                    '数据来源类型',
                  )}
                  className="mb10"
                >
                  {getFieldDecorator('type', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'common.form.required' }),
                      },
                    ],
                    initialValue:
                      processInfo.selectSourceType ||
                      (selectTypes && selectTypes.length && selectTypes[0].attrValueCode),
                  })(<CustomSelect {...customSelectProps} />)}
                </Form.Item>
              </div>
              {/* {getFieldValue('type') === SELECT_LABEL ? ( */}
              {/* // 标签选择 */}
              <Fragment>
                {/* 输出客户群 */}
                {/* <Form.Item
                  label={formatMessage({ id: 'activityConfigManage.select.custom' }, '输出客户群')}
                  className="mb0"
                >
                  <Tag>{this.getTableCode()}</Tag>
                </Form.Item> */}
                <div className={styles.labelWrapper}>
                  <Row>
                    <Col span={6}>
                      <p className={styles.title}>
                        {formatMessage({ id: 'activityConfigManage.select.catalog' }, '标签目录')}
                      </p>
                      <div className={styles.catWrapper}>
                        <SearchTree {...treeProps} />
                      </div>
                    </Col>
                    <Col span={18}>
                      <div className={styles.rightLabel}>
                        {/* 输出标签 */}
                        {dataSourceType == 'subs_basic' && (
                          <p className={[`${styles.title}`, `${styles.label}`].join(' ')}>
                            {formatMessage(
                              { id: 'activityConfigManage.select.outputLabel' },
                              '输出标签',
                            )}
                          </p>
                        )}
                        <Row className={styles.conditionWrapper}>
                          {dataSourceType == 'subs_basic' && (
                            <div id="newTagWrapper" className={styles.newTagWrapper}>
                              {headerTagList.map(item => (
                                <Tag key={item.id} onClose={() => this.onClose(item)} closable>
                                  {item.title}
                                </Tag>
                              ))}
                            </div>
                          )}
                          <div>
                            <p className={[`${styles.title}`, `${styles.label}`].join(' ')}>
                              {formatMessage(
                                { id: 'activityConfigManage.select.conditions' },
                                '筛选条件',
                              )}
                            </p>
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
                            <div id="tagWrapper" className={styles.tagWrapper}>
                              {tagList.map(item => (
                                <SelectLabel
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
                          </div>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Fragment>
              {/* ) : (
                // 客户群选择
                <div className={styles.groupWrapper}>
                  <Form.Item
                    label={formatMessage({ id: 'activityConfigManage.select.chooseCustom' })}
                    className="mb0"
                  >
                    {getFieldDecorator('group', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'common.form.required' }),
                        },
                        {
                          validator: this.validateGroup,
                        },
                      ],
                      initialValue: selectSegment
                        ? `${formatMessage({ id: 'common.form.selected' })}：${selectSegment.map(
                            item => {
                              return item.name;
                            },
                          )}`
                        : `${formatMessage({ id: 'common.form.select' })}`,
                    })(
                      <Input
                        readOnly
                        size="small"
                        onClick={() => {
                          this.handleSwitchGroup(true);
                        }}
                        suffix={<Icon type="copy" />}
                        title={
                          selectSegment
                            ? `${formatMessage({
                                id: 'common.form.selected',
                              })}：${selectSegment.map(item => {
                                return item.name;
                              })}`
                            : ''
                        }
                      />,
                    )}
                  </Form.Item>
                </div>
              )} */}
            </Form>
          </Spin>
        </Modal>
        <ModalGroup
          {...modalGroup}
          onCancel={() => {
            this.handleSwitchGroup(false);
          }}
        />
      </Fragment>
    );
  }
}

export default ActivitySelect;

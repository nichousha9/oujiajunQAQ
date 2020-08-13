import React from 'react';
import { Modal, Form, Row, Col, Input, Table, Button, message, Tag, Divider } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import _ from 'lodash';
import classnames from 'classnames';
import Iconfont from '@/components/Iconfont/index';
import SearchTree from '@/components/SearchTree';
import SelectLabel from '../Select/SelectLabel';
import { EditableFormRow, EditableCell } from './editable';
// import { getTableCode } from '../common';
import selectStyles from '../Select/index.less';
import styles from './index.less';
import commonStyles from '../common.less';
import './edit.less';

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

@connect(({ user, loading }) => ({
  subsetListLoading: loading.effects['activitySegment/getSegmentGrpEffect'],
  userInfo: user.userInfo,
  confirmLoading:
    loading.effects['activitySegment/addProcess'] || loading.effects['activitySegment/modProcess'],
}))
@Form.create({ name: 'segment-form' })
class Segment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      processID: '',
      segmentNumberDisabled: false,
      // 右侧拖拽标签列表 当前subset
      tagList: [],
      // 标签树
      dimList: [],
      subsetList: [],
      showTree: false,
      showTagsPane: false,
      // lastSubsetCode: '',
      // lastSubsetId: '',
      inputCellList: [],
      currentSubsetCode: '',
      currentSubsetIndex: 0,
    };
    // 储存已请求的目录id
    this.getDimListIdArr = [];

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
      flowChartId: activityInfo.id,
      processId: nodeData.PROCESS_ID,
      actionType: nodeData.actionType,
      flowchartName: activityInfo.name,
    };

    this.columns = [
      {
        title: formatMessage({ id: 'activityConfigManage.segment.segmentName' }, '分组名'),
        dataIndex: 'subsetName',
        editable: true,
        width: 250,
      },
      {
        title: formatMessage({ id: 'activityConfigManage.segment.segmentCode' }, '分组编码'),
        dataIndex: 'subsetCode',
        width: 250,
      },
      {
        title: formatMessage({ id: 'common.table.action' }, '操作'),
        dataIndex: 'operation',
        width: 250,
        render: (text, record) => {
          const { currentSubsetCode } = this.state;
          return (
            <Button
              size="small"
              onClick={() => {
                this.onSaveBtnClick(record);
              }}
              className={styles.saveSubsetBtn}
              disabled={!!(record && currentSubsetCode !== record.subsetCode)}
            >
              {formatMessage({ id: 'activityConfigManage.segment.save' }, '保存')}
            </Button>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const { nodeData, form } = this.props;
    const { preTableCode, tempProcessId, actionType, PROCESS_ID } = nodeData;
    form.setFieldsValue({
      customerGroup: preTableCode,
    });

    // Todo: 报错
    this.qryInputCell();

    this.setState(
      {
        processID: actionType === 'A' ? tempProcessId : PROCESS_ID,
        segmentNumberDisabled: actionType === 'V',
      },
      () => {
        if (actionType === 'V' || actionType === 'M') {
          this.getSubsetList();
        }
      },
    );

    // console.log(this.props);
    this.getDimList();
  }

  handleSubmit = () => {
    const { form, onCancel, onOk, dispatch, nodeData, confirmLoading } = this.props;
    if (confirmLoading) return;
    form.validateFields((err, values) => {
      if (!err) {
        const params = this.getParams(values);
        const res = this.validateParams(params);
        // console.log('res', res);
        if (!res) {
          return;
        }
        const { processId } = this.selectItem;
        const addFlag = !processId;
        // 新增 / 修改
        dispatch({
          type: addFlag ? 'activitySegment/addProcess' : 'activitySegment/modProcess',
          payload: params,
        }).then(result => {
          if (result && result.topCont) {
            if (result.topCont.resultCode === 0) {
              // 与流程编辑对接：返回更新节点数据
              const { data } = result.svcCont;
              const newNodeData = {
                ...nodeData,
                ...data,
                PROCESS_ID: data.processId,
                // name: params.MCC_PROCESS.name,
                processname: values.processName,
                // tableCode: params.tableCode,
              };

              if (addFlag) newNodeData.NODE_STATE = 2;
              onOk(newNodeData);
              onCancel();
            }

            if (result.topCont.resultCode === -1) {
              message.error(result.topCont.remark);
            }
          }
        });
      }
    });
  };

  getParams = values => {
    const { subsetList, inputCellList, processID } = this.state;
    const { processId, campaignId, flowChartId, processType, flowchartName } = this.selectItem;
    return {
      MCC_PROCESS: {
        processType,
        name: values.processName,
        flowchartId: flowChartId,
        flowchartName,
        campaignId,
        id: processID,
      },
      flowChartId,
      processId,
      PROCESS_TYPE: processType,
      PROCESS_ID: processID,
      subsetList,
      inputCellList,
      name: values.processName,
    };
  };

  // 数量触发 Grid 分组变化
  onInputChange = e => {
    const { nodeData } = this.props;
    const { preTableCode } = nodeData;
    if (preTableCode && e.target.value !== '') {
      // 在 grid 生成可编辑分组
      this.createGroupDemo(e.target.value);
    }
  };

  getSubsetData = () => {
    const { form } = this.props;
    // 检验通过可直接取
    const values = form.getFieldsValue();
    const condList = this.formatCondList(values);
    // console.log('condList', condList);
    const params = {
      columnList: [],
      condList,
      joinList: [], // 连接查询列表
      processing_id: '0',
      sqlType: '2',
      condListMap: condList,
    };
    return params;
  };

  // 点击行
  onRow = (record, index) => {
    return {
      onClick: () => {
        this.onRowClick(record, index);
      },
    };
  };

  onRowClick = (record, index) => {
    let tagList = [];
    const { subsetCode } = record;
    const { currentSubsetCode, currentSubsetIndex, subsetList } = this.state;

    if (currentSubsetCode !== subsetCode) {
      const lastSubsetIndex = currentSubsetIndex;
      // 若验证成功，则自动保存上一个活动行数据
      const lastSubset = subsetList[lastSubsetIndex];
      this.saveSubset(lastSubset);

      if (record && record.condList) {
        tagList = this.condListToTagList(record.condList);
      }
      // console.log('tag', tagList);
      this.setState({
        showTree: true,
        showTagsPane: true,
        currentSubsetCode: subsetCode,
        currentSubsetIndex: index,
        tagList,
      });
    }
  };

  onSaveBtnClick = record => {
    this.saveSubset(record);
  };

  saveSubset = async record => {
    const { subsetList, tagList } = this.state;
    if (!record.subsetName) {
      message.error(
        formatMessage({ id: 'activityConfigManage.segment.subsetNameEmptyError' }, '分组名不为空'),
      );
      return;
    }

    if (!tagList.length) {
      message.error(
        formatMessage(
          { id: 'activityConfigManage.segment.conditionFilterEmptyError' },
          '筛选条件不为空',
        ),
      );
      return;
    }

    const res = await this.validateSubset();
    if (!res) {
      return;
    }

    const { subsetCode } = record;
    const data = this.getSubsetData();

    const newSubsetList = subsetList.map(subset => {
      let tempSubset = { ...subset };
      if (subset.subsetCode === subsetCode) {
        tempSubset = { ...tempSubset, ...data };
      }
      return tempSubset;
    });

    this.setState({
      subsetList: newSubsetList,
    });
  };

  createGroupDemo = value => {
    const { form, nodeData } = this.props;
    const { subsetList } = this.state;
    const wantedGroupNum = value;
    let nodeList = [...subsetList];

    if (!_.isNumber(wantedGroupNum) && subsetList) {
      form.setFieldsValue({
        segmentNumber: subsetList.length,
      });
    }

    if (wantedGroupNum > subsetList.length) {
      for (let i = subsetList.length; i < wantedGroupNum; i += 1) {
        const subsetCode = `${nodeData.tableCode}_${i}`;
        nodeList.push({ subsetCode, subsetName: '' });
      }
    } else if (wantedGroupNum < subsetList.length) {
      const subNum = subsetList.length - wantedGroupNum;
      nodeList = nodeList.slice(0, subsetList.length - subNum);
    } else if (!wantedGroupNum) {
      nodeList = [];
    }

    let tagList = [];
    if (nodeList[0] && nodeList[0].condList) {
      tagList = this.condListToTagList(nodeList[0].condList);
    }

    this.setState({
      subsetList: nodeList,
      currentSubsetCode: nodeList[0] && nodeList[0].subsetCode ? nodeList[0].subsetCode : '',
      showTagsPane: nodeList.length !== 0,
      showTree: nodeList.length !== 0,
      tagList,
    });
  };

  validateSubset = async () => {
    const { form } = this.props;
    let res;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        message.error(err);
        return;
      }

      res = await this.validateSql(values);
    });

    if (!res) {
      message.error(
        formatMessage(
          {
            id: 'activityConfigManage.segment.sqlValidateFail',
          },
          'sql语法校验失败，请修改后提交',
        ),
      );
    }

    return res;
  };

  validateSql = values => {
    // return new Promise((resolve, reject) => {
    const { dispatch } = this.props;
    const { inputCellList } = this.state;
    let res;
    // 格式化condList
    const condList = this.formatCondList(values);
    const params = {
      columnList: [],
      condList,
      joinList: [], // 连接查询列表
      processing_id: '0',
      sqlType: '2',
      inputCellList,
    };

    dispatch({
      type: 'activitySegment/validateSql',
      payload: params,
    }).then(result => {
      if (result && result.topCont && result.topCont.resultCode) {
        if (result.topCont.resultCode === 0) {
          res = true;
        } else if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    });
    // });

    return res;
  };

  validateParams = params => {
    const { form } = this.props;
    const { subsetList } = params;
    let pass = true;

    form.validateFieldsAndScroll(err => {
      if (err) {
        return;
      }

      if (!subsetList && !subsetList.length) {
        message.error(
          formatMessage({ id: 'activityConfigManage.segment.infoSegmentEmpty' }, '分组不为空'),
        );
        pass = false;
        return;
      }

      const validateEmptyCondList = subsetList.some(subset => {
        return !subset.condList || (subset.condList && !subset.condList.length);
      });
      if (validateEmptyCondList) {
        message.error(
          formatMessage(
            { id: 'activityConfigManage.segment.infoSegmentPartEmpty' },
            '存在条件为空的分组',
          ),
        );
        pass = false;
        return;
      }

      const validateEmptySubsetName = subsetList.some(subset => {
        return !subset.subsetName;
      });
      if (validateEmptySubsetName) {
        message.error(
          formatMessage(
            { id: 'activityConfigManage.segment.infoSubsetNameEmpty' },
            '分组名不能为空',
          ),
        );
        pass = false;
        return;
      }

      const subsetSet = new Set();
      subsetList.forEach(subset => {
        subsetSet.add(subset.subsetName);
      });
      if (subsetList.length !== subsetSet.size) {
        message.error(
          formatMessage(
            { id: 'activityConfigManage.segment.repeatedGroupName' },
            '存在重复的分组名',
          ),
        );
        pass = false;
        // return;
      }
    });
    return pass;
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
            labelcode: item.title,
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

  handleSave = row => {
    // console.log(row);
    const { subsetList } = this.state;
    const newData = [...subsetList];
    const index = newData.findIndex(item => row.subsetCode === item.subsetCode);
    const item = newData[index];

    newData.splice(index, 1, {
      ...item,
      ...row,
      save: true,
    });
    this.setState({ subsetList: newData });
  };

  getSubsetList = async () => {
    const { processID } = this.state;
    const { dispatch, form } = this.props;
    dispatch({
      type: 'activitySegment/getSegmentGrpEffect',
      payload: {
        processId: processID,
        id: processID,
      },
    }).then(result => {
      if (result && result.topCont) {
        if (result.topCont.resultCode === 0) {
          const { subsetList } = result.svcCont.data;

          if (subsetList && subsetList.length) {
            form.setFieldsValue({
              segmentNumber: subsetList.length,
            });
          }
          // const tempSubsetList = this.formatSubsetList(subsetList);
          this.setState({
            subsetList,
            currentSubsetCode: subsetList[0].subsetCode,
            tagList: this.condListToTagList(subsetList[0].condList),
            showTree: this.selectItem.actionType === 'M',
            showTagsPane: true,
          });
        }

        if (result.topCont.resultCode === -1) {
          message.error(result.topCont.remark);
        }
      }
    });
  };

  // formatSubsetList = subsetList => {
  //   let res = [];
  //   if(subsetList && subsetList.length) {
  //     res = subsetList.map(subset => {
  //       const { condList } = subset;
  //       const tagList = this.condListToTagList(condList);
  //       return { ...subset, tagList };
  //     });
  //   }
  //   return res;
  // }

  // cond -> tag
  condToTag = cond => {
    let { ruleType, ruleValue } = cond;
    if (!ruleType && !ruleValue) {
      ruleType = cond.ruletype;
      ruleValue = cond.rulevalue;
    }
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
      title: cond.labelcode,
      id: this.eventInfo.dragIndex,
      tableCode: cond.tablecode,
      labelId: cond.objid,
      // select 初始值
      selectValue: cond.ruleoperator,
      // value 初始值
      value: ruleValue,
    };
  };

  condListToTagList = condList => {
    let tagList = [];
    if (condList && condList.length) {
      tagList = condList.map(cond => {
        return this.condToTag(cond);
      });
    }
    return tagList;
  };

  qryInputCell = async () => {
    const { prevNodeData, dispatch } = this.props;
    const inputCellList = [];
    if (prevNodeData && prevNodeData.length > 0) {
      const preProcessIds = [];
      prevNodeData.forEach(node => {
        if (node.PROCESS_ID) {
          preProcessIds.push(node.PROCESS_ID);
        }
      });

      if (preProcessIds.length) {
        await dispatch({
          type: 'user/getLoginInfo',
        });

        const { userInfo } = this.props;
        const params = {
          queryParam: {
            ids: preProcessIds,
          },
          staffId: userInfo.staffInfo.staffId,
          staffName: userInfo.staffInfo.staffName,
        };

        dispatch({
          type: 'activitySegment/getProcessCellNameListEffect',
          payload: params,
        }).then(result => {
          if (result && result.topCont) {
            if (result.topCont.resultCode === 0) {
              // 只取一个
              if (result.svcCont.data && result.svcCont.data.length) {
                inputCellList.push(result.svcCont.data[0].ID);
              }

              this.setState({
                inputCellList,
              });
            }

            if (result.topCont.resultCode === -1) {
              message.error(result.topCont.remark);
            }
          }
        });
      }
    }
  };

  // 获取左侧树列表
  getDimList = id => {
    return new Promise(resolve => {
      if (this.getDimListIdArr.indexOf(id) > -1) {
        // 已请求
        resolve();
        return;
      }

      if (id) this.getDimListIdArr.push(id);

      const { dispatch } = this.props;
      dispatch({
        type: 'activitySelect/getDimList',
        payload: {
          id,
        },
        callback: async res => {
          // console.log('res', res);
          await this.formatDimList(id, res.data);
          resolve();
        },
      });
    });
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
        parentGrpId: item.parent_grp_id,
        labelId: item.obj_id,
        title: item.name || '',
        key: item.id,
        isLeaf: !item.isParent,
        children: [],
        labelValueType: item.labelValueType,
        labelDataType: item.label_Date_type,
        tableCode: item.tar_table_code,
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
    let treeItem;
    treeArr.forEach(item => {
      if (item.id === id) {
        treeItem = item;
      } else if (item.children && item.children.length) {
        treeItem = this.findTreeItem(id, item.children);
      }
    });
    return treeItem;
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
    // const { currentSubsetIndex, subsetList } = this.state;
    // const newSubsetList = [...subsetList];
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
        // 更新当前subset的tagList
        // newSubsetList[currentSubsetIndex] = { ...newSubsetList[currentSubsetIndex], tagList: newTagList };
        return {
          tagList: newTagList,
          // subsetList: newSubsetList,
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
    // const { currentSubsetIndex, subsetList } = this.state;
    // const newSubsetList = [...subsetList];
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
        // // 更新当前subset的tagList
        // newSubsetList[currentSubsetIndex] = { ...newSubsetList[currentSubsetIndex], tagList: newTagList };
        return {
          tagList: newTagList,
          // subsetList: newSubsetList,
        };
      });
    }
  };

  // 删除标签
  removeTagItem = item => {
    // const { currentSubsetIndex, subsetList } = this.state;
    // const newSubsetList = [...subsetList];
    this.setState(({ tagList }) => {
      const newArr = tagList.filter(ele => {
        return item.id !== ele.id;
      });
      // const condList = this.condListToTagList(newArr);
      // 更新当前subset的tagList
      // newSubsetList[currentSubsetIndex] = { ...newSubsetList[currentSubsetIndex], condList };
      return {
        tagList: newArr,
        // subsetList: newSubsetList,
      };
    });
  };

  // 判断节点是否不可编辑
  getDisabledFlag = () => {
    const { campaignState } = this.selectItem;
    return campaignState !== 'Editing';
  };

  render() {
    const { onCancel, form, subsetListLoading, confirmLoading } = this.props;
    const {
      segmentNumberDisabled,
      dimList,
      tagList,
      subsetList,
      showTagsPane,
      showTree,
      currentSubsetCode,
    } = this.state;

    const { getFieldDecorator } = form;

    const { processName } = this.selectItem;
    const title = (
      <div>
        <span className={commonStyles.modalTitle}>
          {formatMessage({ id: 'activityConfigManage.segment.segment' }, '分群')}
        </span>
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

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    // 节点是否可编辑
    const disabled = this.getDisabledFlag();

    const treeProps = {
      loadData: treeNode => this.getDimList(treeNode.props.eventKey),
      draggable: true,
      onDragStart: disabled ? null : this.handleDragStart,
      onDragEnd: disabled ? null : this.handleDragEnd,
      treeData: dimList,
      showButtons: false,
      handleAsyncSearch: this.handleAsyncSearch,
      ignoreCaseFlag: true,
    };

    return (
      <>
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
          <div className="segment-form-block">
            <Form {...formItemLayout}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label={formatMessage(
                      { id: 'activityConfigManage.segment.customerGroup' },
                      '客户群',
                    )}
                  >
                    {getFieldDecorator('customerGroup', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage(
                            { id: 'activityConfigManage.segment.validateCustomerGroup' },
                            '客户群不能为空',
                          ),
                        },
                      ],
                    })(<Input size="small" readOnly />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={formatMessage(
                      { id: 'activityConfigManage.segment.segmentNumber' },
                      '分组数',
                    )}
                  >
                    {getFieldDecorator('segmentNumber', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage(
                            { id: 'activityConfigManage.segment.validateSegmentNumber' },
                            '分组数不能为空',
                          ),
                        },
                      ],
                    })(
                      <Input
                        size="small"
                        placeholder={formatMessage({ id: 'common.form.input' }, '请输入')}
                        disabled={segmentNumberDisabled}
                        onChange={this.onInputChange}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={styles.segmentTableBlock}>
            <Table
              rowKey={record => record.subsetCode}
              components={components}
              columns={columns}
              dataSource={subsetList}
              loading={subsetListLoading}
              rowClassName={record =>
                classnames(
                  ['editable-row'],
                  record.subsetCode === currentSubsetCode ? styles.clickRow : '',
                  record.save ? styles.savedSign : '',
                )
              }
              onRow={this.onRow}
            />
          </div>
          <div className={selectStyles.labelWrapper}>
            <Row>
              {showTree ? (
                <Col span={6}>
                  <p className={selectStyles.title}>
                    {formatMessage({ id: 'activityConfigManage.select.catalog' }, '标签目录')}
                  </p>
                  <div className={selectStyles.catWrapper}>
                    <SearchTree {...treeProps} />
                  </div>
                </Col>
              ) : null}
              {showTagsPane ? (
                <Col span={18}>
                  <div className={selectStyles.rightLabel}>
                    {/* 筛选条件 */}
                    <Row className={selectStyles.conditionWrapper}>
                      <div>
                        <p className={[`${selectStyles.title}`, `${selectStyles.label}`].join(' ')}>
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
                        <div id="tagWrapper" className={selectStyles.tagWrapper}>
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
              ) : null}
            </Row>
          </div>
        </Modal>
      </>
    );
  }
}

export default Segment;

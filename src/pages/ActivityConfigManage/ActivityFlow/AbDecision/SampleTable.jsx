import React from 'react';
import { connect } from 'dva';
import { Table, Input, InputNumber, Form, message, Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
import commonStyles from '../common.less';
import { strToUtf8Char } from '@/utils/common';

@connect(({ user, loading, activityAbDecision }) => ({
  userInfo: user.userInfo || {},
  loading: loading.effects['activityAbDecision/getSeqList'],
  activityAbDecision
}))
class EditableTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      // sampleList: [],
      editingKey: '', // 编辑的行数
      editingType: '' // 编辑的格
    };
  }

  componentDidUpdate(prevProps) {
    const { sampleNum, defaultList } = this.props;
    if(prevProps.sampleNum != sampleNum) {
      this.setTableData();
    }
    if(prevProps.defaultList != defaultList) {
      this.initialData(defaultList)
    }
  }

  // 初始化列表数据
  initialData = (sampleList) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityAbDecision/save',
      payload: { sampleList }
    });
  }

  // 处理列表
  setTableData = async () => {
    const { sampleNum, activityAbDecision, dispatch } = this.props;
    const { sampleList } = activityAbDecision;
    const nowSampleNum = sampleList.length;
    let list = [];
    if (sampleNum <= nowSampleNum) {
      for (let i = 0; i < sampleNum; i += 1) {
        const obj = sampleList[i];
        list.push(obj);
      }
    } else {
      const addNum = sampleNum - nowSampleNum;
      const seqList = await this.getSampleSeqList(addNum);
      list = JSON.parse(JSON.stringify(sampleList));
      for (let i = 0; i < seqList.length; i += 1) {
        const obj = {
          id: seqList[i],
          blockName: `Sample${nowSampleNum + i}`,
          percent: 0
        };
        list.push(obj);
      }
    }
    dispatch({
      type: 'activityAbDecision/save',
      payload: { sampleList: list }
    });
  }

  // 获取Sample序列码
  getSampleSeqList = (count) => {
    const { dispatch, userInfo } = this.props;
    return new Promise(resolve => {
      dispatch({
        type: 'activityAbDecision/getSeqList',
        payload: {
          COUNT: count,
          TYPE: 'SAMPLE_BLOCK' ,
          staffId: userInfo.staffInfo.staffId, // 当前用户id
          staffName: userInfo.staffInfo.staffName // 用户姓名
        },
        success: (svcCont) => {
          const { data = {} } = svcCont;
          resolve(data.SEQ_LIST || []);
        }
      });
    })
  }

  // 是否是编辑的行
  isEditing = (record, type) => {
    const { editingKey, editingType } = this.state;
    return record.id === editingKey && type === editingType
  }

  // 获取编辑区域
  getItem = ({name, component, initialValue, rules = [], otherComponent}) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form.Item className={styles.tableFormItem}>
        {getFieldDecorator(name, {
          rules,
          initialValue,
        })(component)}
        {otherComponent || null}
      </Form.Item>
    )
  }

  // 编辑行
  edit = (id, type) => {
    this.setState({ editingKey: id, editingType: type }, () => {
      if(this[`${type}Input`]) {
        this[`${type}Input`].focus( );
      }
    });
  }

  // 保存修改
  save = () => {
    const { form } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      this.saveItemData(row);
    });
  }
    
  // 保存
  saveItemData = (newValues) => {
    const { dispatch, activityAbDecision } = this.props;
    const { sampleList } = activityAbDecision;
    const { editingKey } = this.state;
    const newData = [...sampleList];
    const index = newData.findIndex(item => editingKey === item.id);
    const closeObj = {editingKey:''};
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...newValues
      });
    } else {
      newData.push(newValues);
    }
    this.setState({ ...closeObj });
    dispatch({
      type: 'activityAbDecision/save',
      payload: { sampleList: newData }
    });
  }

  // 删除
  delete = (id) => {
    const { dispatch, changeNum, activityAbDecision } = this.props;
    const { sampleList } = activityAbDecision;
    const newData = [...sampleList];
    const index = newData.findIndex(item => item.id === id);
    newData.splice(index, 1);
    dispatch({
      type: 'activityAbDecision/save',
      payload: { sampleList: newData }
    });
    changeNum(newData.length);
  }

  render() {
    const { handleAdd, activityAbDecision, loading } = this.props;
    const { sampleList } = activityAbDecision;

    const columns = [
      {
        title: formatMessage({ id: 'activityConfigManage.abDecision.blockName' }), // '采集名称',
        dataIndex: 'blockName',
        width: '45%',
        render: (text, record) => {
          const editable = this.isEditing(record, 'blockName');
          const component = <Input size='small' ref={node => {this.blockNameInput = node}} onPressEnter={this.save} onBlur={this.save} />;
          const params = {
            name: 'blockName', 
            component, 
            initialValue: text,
            rules: [
              { 
                required: true, 
                whitespace: true, 
                min:1, max: 64, 
                transform(value) {
                  return strToUtf8Char(value);
                },
                message: formatMessage({ id: 'activityConfigManage.abDecision.blockNameInput' }) 
              }
            ]
          };
          return editable ? this.getItem(params) : <div className={styles.editCell} onClick={()=>{this.edit(record.id, 'blockName')}}>{text}</div>
        }
      },
      {
        title: formatMessage({ id: 'activityConfigManage.abDecision.percent' }), // '百分比',
        dataIndex: 'percent',
        width: '45%',
        render: (text, record) => {
          const editable = this.isEditing(record, 'percent');
          const component = <InputNumber size='small' precision={0} min={0} max={100} ref={node => {this.percentInput = node}} onPressEnter={this.save} onBlur={this.save} />;
          const params = {
            name: 'percent', 
            component, 
            initialValue: text,
            rules: [
              { required: true, message: ' ' }
            ]
          };
          return editable ? this.getItem(params) : <div className={styles.editCell} onClick={()=>{this.edit(record.id, 'percent')}}>{text}</div>
        }
      },
      {
        title: formatMessage({ id: 'common.table.action' }), // '操作',
        dataIndex: 'operate',
        width: 100,
        render: (text, record) => <a onClick={this.delete.bind(this, record.id)}>删除</a>
      }
    ];

    return (
      <Table
        className={styles.editTable}
        size='small'
        dataSource={sampleList}
        rowKey='id'
        columns={columns}
        rowClassName={commonStyles.editableRow}
        pagination={false}
        loading={loading}
        footer={() => <a onClick={handleAdd}><Icon type='plus' className={styles.mr10} />{formatMessage({ id: 'common.table.action.new' })}</a>}
      />
    );
  }
}

export default Form.create()(EditableTable)
import React from 'react';
import { Table, Input, InputNumber, Form, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
import commonStyles from '../common.less';

class EditableTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      data: [],
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
  initialData = (data) => {
    this.setState({ data });
  }

  // 处理列表
  setTableData = () => {
    const { sampleNum, tableCode } = this.props;
    const { data } = this.state;
    const nowSampleNum = data.length;
    const list = [];
    let obj = {};
    if (sampleNum <= nowSampleNum) {
      for (let i = 0; i < sampleNum; i += 1) {
        obj = data[i];
        list.push(obj);
      }
      this.setState({ data: list });
    } else {
      for (let i = nowSampleNum + 1; i <= sampleNum; i += 1) {
        obj = {};
        obj.tableCode = `${tableCode}_${i}`;
        data.push(obj);
      }
      this.setState({ data });
    }
  }

  // 是否是编辑的行
  isEditing = (record, type) => {
    const { editingKey, editingType } = this.state;
    return record.tableCode === editingKey && type === editingType
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
    const { data, editingKey } = this.state;
    const newData = [...data];
    const index = newData.findIndex(item => editingKey === item.tableCode);
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
    this.setState({ data: newData, ...closeObj });
  }

  // 校验并处理最后保存数据
  getTarGrpRels = () => {
    const { data } = this.state;
    const { sebgmentKind } = this.props;
    let isVilid = true;
    if(data.length === 0) {
      message.info(formatMessage({ id: 'activityConfigManage.sample.infoSampleEmpty' }));
      return false
    }
    // 检查 组数据
    for (let i = 0; i < data.length; i +=1) {
      const tarGrpRel = data[i];

      if (!tarGrpRel.tableName) {
        isVilid = false;
        message.info(formatMessage({ id: 'activityConfigManage.sample.infoSamplenameEmpty' }));
        break
      }
      if (sebgmentKind === 'ratio') {
        // 百分比
        if (!tarGrpRel.sebgmentCount) {
          isVilid = false;
          message.info(formatMessage({ id: 'activityConfigManage.sample.infoSampleCountEmpty' }));
          break
        }
      } else if (!tarGrpRel.maxCount) {
          isVilid = false;
          message.info(formatMessage({ id: 'activityConfigManage.sample.infoSampleCountEmpty' }));
          break
      }
    }
    if(isVilid) {
      return { data }
    }
    return false
  }

  render() {
    const { sebgmentKind } = this.props;
    const { data } = this.state;

    const columns = [
      {
        title: formatMessage({ id: 'activityConfigManage.sample.samplename' }), // '抽样名称',
        dataIndex: 'tableName',
        width: 150,
        render: (text, record) => {
          const editable = this.isEditing(record, 'tableName');
          const component = <Input size='small' ref={node => {this.tableNameInput = node}} onPressEnter={this.save} onBlur={this.save} />;
          const params = {
            name: 'tableName', 
            component, 
            initialValue: text,
            rules: [
              { required: true, whitespace: true, min:1, max: 30, message: formatMessage({ id: 'activityConfigManage.sample.tableNameMessage' }) }
            ]
          };
          return editable ? this.getItem(params) : <div className={styles.editCell} onClick={()=>{this.edit(record.tableCode, 'tableName')}}>{text}</div>
        }
      },
      {
        title: formatMessage({ id: 'activityConfigManage.sample.samplecode' }), // '抽样编码',
        dataIndex: 'tableCode',
        width: 150
      },
      ...sebgmentKind === 'ratio' ? [
        {
          title: formatMessage({ id: 'activityConfigManage.sample.count' }), // '数量(%)',
          dataIndex: 'sebgmentCount',
          width: '10%',
          render: (text, record) => {
            const editable = this.isEditing(record, 'sebgmentCount');
            const component = <InputNumber size='small' precision={0} min={1} ref={node => {this.sebgmentCountInput = node}} onPressEnter={this.save} onBlur={this.save} />;
            const params = {
              name: 'sebgmentCount', 
              component, 
              initialValue: text,
              rules: [
                { required: true, message: ' ' }
              ]
            };
            return editable ? this.getItem(params) : <div className={styles.editCell} onClick={()=>{this.edit(record.tableCode, 'sebgmentCount')}}>{text}</div>
          }
        }
      ] : [
        {
          title: formatMessage({ id: 'activityConfigManage.sample.maxcount' }), // '最大数量',
          dataIndex: 'maxCount',
          width: '10%',
          render: (text, record) => {
            const editable = this.isEditing(record, 'maxCount');
            const component = <InputNumber size='small' precision={0} min={1} ref={node => {this.maxCountInput = node}} onPressEnter={this.save} onBlur={this.save} />;
            const params = {
              name: 'maxCount', 
              component, 
              initialValue: text,
              rules: [
                { required: true, message: ' ' }
              ]
            };
            return editable ? this.getItem(params) :  <div className={styles.editCell} onClick={()=>{this.edit(record.tableCode, 'maxCount')}}>{text}</div>
          }
        }       
      ]
    ];

    return (
      <Table
        className={styles.editTable}
        size='small'
        dataSource={data}
        rowKey='tableCode'
        columns={columns}
        rowClassName={commonStyles.editableRow}
        pagination={false}
      />
    );
  }
}

export default Form.create()(EditableTable)
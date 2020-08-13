import React, { Fragment } from 'react';
import { Table, Input, InputNumber, Divider, Form, Select, Icon, Tooltip, Popconfirm } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
import commonStyles from '../common.less';
import AlgorithmChoose from './AlgorithmChoose';
import InterventionRuleChoose from './InterventionRuleChoose';

class EditableTable extends React.Component {

  constructor(props) {
    super(props);
    const { ireGroupsMap = [] } = props;
    this.state = { 
      bucketData: ireGroupsMap, // 列表数据
      editingKey: '', // 编辑的行
      count: ireGroupsMap.length || 0,
      algorithmVisible: false, // 选择算法规则弹窗
      interventionRuleVisible: false, // 选择算法规则弹窗
      currentAlgo: {}, // 正在编辑时选中的算法
      currentIntervention: {} // 正在编辑时选中的干预规则
    };
  }

  // 是否是编辑的行
  isEditing = record => {
    const { editingKey } = this.state;
    return record.id === editingKey
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

  // 新增一行桶
  handleAdd = () => {
    const { bucketData, count } = this.state;
    const id = `add${count}`;
    bucketData.push({
      id,
      timeStamp: new Date().getTime()
    });
    this.edit(id);
    this.setState({
      bucketData,
      count: count + 1,
    });
  }

  // 保存桶修改
  save = () => {
    const { form } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      this.saveItemData(row, 'success');
    });
  }
  
  // 保存
  saveItemData = (newValues) => {
    const { bucketData, editingKey, currentAlgo, currentIntervention } = this.state;
    const newData = [...bucketData];
    const index = newData.findIndex(item => editingKey === item.id);
    const closeObj = {editingKey:'', currentAlgo: {}, currentIntervention: {}};
    if (index > -1) {
      const item = newData[index];
      let { id } = item;
      // 给取消的时候取消要直接删掉还是取消修改
      if(typeof id === 'string' && id.indexOf('add') > -1) {
        id = `m${id}`;
      }
      newData.splice(index, 1, {
        ...item,
        ...newValues,
        id,
        ...currentAlgo.algoId ? {
          algoName: currentAlgo.algoName,
          algoId: currentAlgo.algoId
        } : {},
        ...currentIntervention.id ? {
          ruleId: currentIntervention.id,
          offerId: currentIntervention.offerId
        } : {}
      });
    } else {
      newData.push(newValues);
    }
    this.setState({ bucketData: newData, ...closeObj });
  }

  // 取消编辑
  cancel = () => {
    const { editingKey, bucketData } = this.state;
    const newData = [...bucketData];
    // 新增的取消直接删掉
    if(editingKey.indexOf('add') > -1 && editingKey.indexOf('madd') < 0){
      const index = newData.findIndex(item => editingKey === item.id);
      newData.splice(index, 1);
    }
    this.setState({ bucketData: newData, editingKey: '', currentAlgo: {}, currentIntervention: {} });
  }

  // 编辑行
  edit = (id) => {
    this.setState({ editingKey: id });
  }

  // 删除行
  delete = (id) => {
    const { bucketData } = this.state;
    const newData = [...bucketData];
    const index = newData.findIndex(item => id === item.id);
    newData.splice(index, 1);
    this.setState({ bucketData: newData });
  }

  // 剩余可填的百分百（全部加起来不多于100）
  getRestRatio = (dividBucketIndex) => {
    const { bucketData } = this.state;
    let restRatio = 100;
    bucketData.forEach((item, index) => {
      if(item.baseLine != '1' && dividBucketIndex != index && item.flowRatio){
        restRatio -= item.flowRatio;
      }
    });
    return restRatio
  }

  // 默认的桶类型(只能有一个默认)
  getDefaultBaseLine = (dividBucketIndex) => {
    const { bucketData } = this.state;
    let baseLine = '1'; // 默认
    bucketData.forEach((item, index) => {
      if(item.baseLine === '1' && dividBucketIndex != index){
        baseLine = '2';
      }
    });
    return baseLine
  }

  render() {
    const { form, divinBucketTypes } = this.props;
    const { bucketData, algorithmVisible, interventionRuleVisible, currentAlgo, currentIntervention } = this.state;
    const { getFieldValue } = form;

    const columns = [
      {
        title: formatMessage({ id: 'activityConfigManage.ire.dividingBucketName' }), // '桶名称',
        dataIndex: 'dividingBucketName',
        width: 150,
        render: (text, record) => {
          const editable = this.isEditing(record);
          const component = <Input size='small' />
          const params = {
            name: 'dividingBucketName', 
            component, initialValue: 
            text,
            rules: [
              { required: true, whitespace: true, min:1, max: 64, message: formatMessage({ id: 'activityConfigManage.ire.dividingBucketNameRule' }) }
            ]
          };
          return editable 
          ? this.getItem(params) 
          : (
            <Tooltip title={text}>
              <div className={styles.textEllipsis}>{text}</div>
            </Tooltip>
          )
        }
      },
      {
        title: formatMessage({ id: 'activityConfigManage.ire.abTag' }), // '桶标签',
        dataIndex: 'abTag',
        width: 150,
        render: (text, record) => {
          const editable = this.isEditing(record);
          const component = <Input size='small' />
          const params = {
            name: 'abTag', 
            component, 
            initialValue: text,
            rules: [
              { required: true, whitespace: true, min:1, max: 64, message: formatMessage({ id: 'activityConfigManage.ire.dividingBucketNameRule' }) }
            ]
          };
          return editable 
          ? this.getItem(params) 
          : (
            <Tooltip title={text}>
              <div className={styles.textEllipsis}>{text}</div>
            </Tooltip>
          )
        }
      },
      {
        title: formatMessage({ id: 'activityConfigManage.ire.algoInfo' }), // '算法',
        dataIndex: 'algoName',
        width: '10%',
        render: (text, record) => {
          const editable = this.isEditing(record);
          const params = {
            name: 'algoName', 
            component: <a onClick={()=>{this.setState({ algorithmVisible: true })}} className={styles.choose}>{currentAlgo.algoName || text || formatMessage({ id: 'activityConfigManage.flow.choose' })}</a>, 
            initialValue: text,
            rules: [
              { required: true, message: ' ' }
            ]
          };
          return editable ? this.getItem(params) : text
        }
      },
      {
        title: formatMessage({ id: 'activityConfigManage.ire.interveneRule' }), // '干预规则',
        dataIndex: 'offerId',
        width: '10%',
        render: (text, record) => {
          const editable = this.isEditing(record);
          const params = {
            name: 'offerId', 
            component: <a onClick={()=>{this.setState({ interventionRuleVisible: true })}} className={styles.choose}>{currentIntervention.offerId || text || formatMessage({ id: 'activityConfigManage.flow.choose' })}</a>, 
            initialValue: text
          };
          return editable ? this.getItem(params) : text
        }
      },
      {
        title: formatMessage({ id: 'activityConfigManage.ire.abType' }), // '桶类型',
        dataIndex: 'baseLine',
        width: '14%',
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          let textName = '';
          const component = (
            <Select size='small'>
              {
                divinBucketTypes && divinBucketTypes.map((item) => {
                  if(text && text === item.attrValueCode) {
                    textName = item.attrValueName;
                  }
                  return <Select.Option key={item.attrValueCode} value={item.attrValueCode}>{item.attrValueName}</Select.Option>
                })
              }
            </Select>
          );
          const params = {
            name: 'baseLine', 
            component, 
            initialValue: text || this.getDefaultBaseLine(index)
          };
          
          return editable ? this.getItem(params) : textName
        }
      },
      {
        title: formatMessage({ id: 'activityConfigManage.ire.flowRatio' }), // '流量设定',
        dataIndex: 'flowRatio',
        width: '10%',
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          const component = <InputNumber size='small' precision={0} min={0} max={this.getRestRatio(index)} style={{width: '90%'}} />
          const params = {
            name: 'flowRatio', 
            component, 
            initialValue: text,
            rules: [
              { required: true, message: ' ' }
            ],
            otherComponent: <span className={styles.ratioText}>%</span>
          };
          if(editable) {
            return getFieldValue('baseLine') === '2' ? this.getItem(params) : ''
          }
          return record.baseLine === '2' ? `${text}%` : ''
        }
      },
      {
        title: formatMessage({ id: 'common.table.action' }), // '操作',
        dataIndex: 'operation',
        width: 105,
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
                <a onClick={this.save}>
                  {formatMessage({ id: 'common.btn.submit' })}
                </a>
                <Divider type='vertical' />
                <a onClick={this.cancel}>
                  {formatMessage({ id: 'common.btn.cancel' })}
                </a>
            </span>
          ) : (
            <span>
              {/* 编辑 */}
              <a id='1' disabled={editingKey !== ''} onClick={() => this.edit(record.id)}>
                {formatMessage({ id: 'common.table.action.edit' })}
              </a>
              <Divider type='vertical' />
              {/* 删除 */}
              <Popconfirm
                title={`${formatMessage({id:'common.title.isConfirm'})}${formatMessage({ id: 'common.table.action.delete' })}${record.dividingBucketName}`}
                onConfirm={() => this.delete(record.id)}
              >
                <a id='2' disabled={editingKey !== ''}>
                {formatMessage({ id: 'common.table.action.delete' })}
                </a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const algorithmProps = {
      onCancel: () => {
        this.setState({ algorithmVisible: false });
      },
      onOk: (values) => { 
        const { algoName } = values;
        this.setState({ currentAlgo: values, algorithmVisible: false });
        form.setFieldsValue({algoName})
      }
    }

    const interventionRuleProps = {
      onCancel: () => {
        this.setState({ interventionRuleVisible: false });
      },
      onOk: (values) => { 
        const { offerId } = values;
        this.setState({ currentIntervention: values, interventionRuleVisible: false });
        form.setFieldsValue({offerId})
      }
    }

    return (
      <Fragment>
        {algorithmVisible ? <AlgorithmChoose {...algorithmProps} /> : null}
        {interventionRuleVisible ? <InterventionRuleChoose {...interventionRuleProps} /> : null}
        <Table
          className={styles.editTable}
          size='small'
          dataSource={bucketData}
          rowKey='id'
          columns={columns}
          rowClassName={commonStyles.editableRow}
          pagination={false}
          footer={() => 
            <a onClick={this.handleAdd}><Icon type='plus' className={styles.mr10} />
              {formatMessage({ id: 'common.table.action.new' })}
            </a>
          }
        />
      </Fragment>
    );
  }
}

export default Form.create()(EditableTable)
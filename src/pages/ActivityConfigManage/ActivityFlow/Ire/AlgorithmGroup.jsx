import React, { Fragment } from 'react';
import { Button, Divider, Row, Col, Form, Input, Modal, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import commonStyles from '../common.less';
import styles from './index.less';
import AlgorithmGroupItem from './AlgorithmGroupItem';

const GroupNameForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    
    onOk = () => {
      const { form, onCreate } = this.props;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
  
        onCreate(values);
      });
    }

    render() {
      const { visible, onCancel, form, currentRecord } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={formatMessage({ id: 'activityConfigManage.contact.cellName' })}
          onCancel={onCancel}
          onOk={this.onOk}
        >
          {/* 分组名称 */}
          <Form layout='vertical'>
            <Form.Item label={formatMessage({ id: 'activityConfigManage.ire.interGroupName' })}>
              {getFieldDecorator('groupsName', {
                rules: [{ required: true, whitespace: true, message: formatMessage({ id: 'common.form.required' }) }],
                initialValue: currentRecord.groupsName
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

class AlgorithmGroup extends React.Component {

  constructor(props) {
    super(props);
    const { processId, ireProcessDto } = props;
    const { algorithmGroupings } = ireProcessDto;
    let myGroups = [];
    if(processId && algorithmGroupings && algorithmGroupings.length) {
      myGroups = algorithmGroupings.map((item) => ({
        tempId: item.tempId || item.id,
        ...item
      }));
    }
    else {
      myGroups = [
        {
          processId,
          groupsName: `${formatMessage({ id: 'activityConfigManage.ire.group' })}1`,
          tempId:'ALGORITHM_GROUPING_1'
        }
      ];
    }
    this.state = {
      algorithmGroupings: myGroups, // 算法组
      groutCount: myGroups.length + 1,
      visible: false, // 编辑组名称弹窗
      currentRecord: {}, // 正在编辑的组
    };
    this.ireGroupRefs = {};
  }

  // 新增组
  addGroup = () => {
    const { processId } = this.props;
    const { algorithmGroupings, groutCount } = this.state;
    const tempId = `ALGORITHM_GROUPING_${groutCount}`;
    algorithmGroupings.push({
      processId,
      tempId,
      groupsName: `${formatMessage({ id: 'activityConfigManage.ire.group' })}${groutCount}`
    });
    this.setState({
      algorithmGroupings,
      groutCount: groutCount + 1,
    });
  }

  // 删除组
  delGroupName = (index) => {
    const { algorithmGroupings } = this.state;
    const newData = [...algorithmGroupings];
    newData.splice(index, 1);
    this.setState({ algorithmGroupings: newData });
  }

  // 编辑组名称
  editGroupName = (record) => {
    this.setState({ currentRecord: record, visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = (values) => {
    const { algorithmGroupings, currentRecord } = this.state;
    const newData = [...algorithmGroupings];
    const index = newData.findIndex(item => currentRecord.tempId === item.tempId);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        groupsName: values.groupsName
      });
    }
    this.setState({ algorithmGroupings: newData, currentRecord: {}, visible: false });
  };

  // 校验并处理最后保存数据
  getGroupInfo = () => {
    const { algorithmGroupings } = this.state;
    let isVilid = true;
    const ireGroupsMapTemp = {};
    for(let i = 0; i < algorithmGroupings.length; i += 1) {
      const item = algorithmGroupings[i];
      // const groupMap = ireGroupsMapTemp[item.tempId];
      const { form } = this.ireGroupRefs[item.tempId].props;
      const { editingKey, bucketData } = this.ireGroupRefs[item.tempId].state;
      const hasDefault = bucketData && bucketData.length && (bucketData.findIndex(mitem => mitem.baseLine === '1') > -1);
      const formError = this.checkItemForm(form);
      if(!formError) {
        isVilid = false;
        break
      }
      if(editingKey) {
        isVilid = false;
        message.info(formatMessage({ id: 'activityConfigManage.dividBucketNoSumbit' }));
        break
      }
      if(!hasDefault) {
        isVilid = false;
        message.info(`${formatMessage({ id: 'activityConfigManage.ire.group' })}[${item.groupsName}]:${formatMessage({ id: 'activityConfigManage.pleaseAddDefaultDividBucket' })}`);
        break
      }
      ireGroupsMapTemp[item.tempId] = this.controlBucketData(bucketData);
    }
    if(isVilid) {
      return { algorithmGroupings, ireGroupsMapTemp }
    }
    return false
  }
  
  // 检查分组桶是否有没提交数据
  checkItemForm = (form) => {
    let isVilid = true;
    form.validateFields((error) => {
      if (error) {
        isVilid = false;
      }
    })
    return isVilid
  }

  // 处理分桶数据id
  controlBucketData = data => data.map(item => ({
    id: (item.id && typeof item.id === 'string' &&  item.id.indexOf('add') > -1) ? '' : item.id,
    ...item
  }));
 
  render() {
    const { divinBucketTypes, ireProcessDto } = this.props;
    const { algorithmGroupings, visible, currentRecord } = this.state;
    const { ireGroupsMap } = ireProcessDto;

    return (
      <Fragment>
        {
          visible ?
          <GroupNameForm
            visible={visible}
            currentRecord={currentRecord}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
          : null
        }
        <div className={commonStyles.block}>
          {/* 算法分组 */}
          <p className={commonStyles.title}>
            {formatMessage({ id: 'ctivityConfigManage.ire.algorithmGrouping' })}
            <Button onClick={this.addGroup} size='small' type='primary' className={commonStyles.titleMore}>
              {formatMessage({ id: 'activityConfigManage.ire.groupAdd' })}
            </Button>
          </p>
          {
            algorithmGroupings && algorithmGroupings.map((item, index) => {
              return (
                <div key={item.tempId} className={styles.greyBlock}>
                  <Row type='flex' justify='space-between' className={styles.title}>
                    <Col>{item.groupsName}</Col>
                    <div>
                      <a onClick={this.editGroupName.bind(this,item)}>{formatMessage({ id:'activityConfigManage.ire.groupNameEdit' })}</a>
                      {
                        algorithmGroupings.length === 1 ? null : [
                          <Divider key='1' type='vertical' />,
                          <a key='2' onClick={this.delGroupName.bind(this,index)}>{formatMessage({ id: 'activityConfigManage.ire.groupDel' })}</a>
                        ]
                      }
                    </div>
                  </Row>
                  <AlgorithmGroupItem 
                    wrappedComponentRef={(group) => {this.ireGroupRefs[item.tempId] = group}} 
                    divinBucketTypes={divinBucketTypes} 
                    ireGroupsMap={item.id && ireGroupsMap[item.id] || []}
                  />
                </div>
              )
            })
          }
        </div>
      </Fragment>
    );
  }
}

export default AlgorithmGroup
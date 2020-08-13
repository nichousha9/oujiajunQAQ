import shortId from 'shortid';
import React from 'react';
import {connect} from 'dva';
import {Table, Input, Modal, Form, Icon, Button, Spin, Row,message,Popconfirm} from 'antd';
import EditSelectCells from '../../DialogReply/EditSelectCells';
import SplitSentenceToWord from './SplitSentenceToWord';
import styles from './index.less';
import EditInputCells from "../../DialogReply/EditInputCells";


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
@Form.create()
@connect((props) => {
  const {loading, sceneIntention} = props;
  return {
    sceneIntention,
    loading: loading.models.sceneIntention,
  }
})
export default class AddDialogSample extends React.Component {
  state = {
    id: this.props.dialogSample.id,
    sentence: this.props.dialogSample.sentence,
    pickupEntityList: [],
    slotList: [],
    selectItem: {},
    // pickupEntityList:[],
    SpecNoun:[],// 专有名词
  };

  componentWillMount(){
    const { dispatch,dialogSample } = this.props;
    console.log("父组件传来的id:");
    console.log(dialogSample);

    

    // 根据对话样本的id去查询意图短语，然后读取，展示。修改的时候再把值传过去。
    dispatch({
      type: 'sceneIntention/fetchIntentionSlot',
      payload: {
        id: dialogSample.id,
      },
    }).then(res => {
      if (res && res.status === 'OK') {
        console.log(res.data);
        const slotList = res.data.map(o => ({
          key: o.id,
          start:  o.start,
          end:  o.end,
          labelName: o.labelName,
          name: o.name,
        }));
        this.setState({
          slotList,
        })
      }
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   const {sceneIntention: {pickupEntityList}} = nextProps;
  //   if (JSON.stringify(pickupEntityList) !== JSON.stringify(this.state.pickupEntityList)) {
  //     const slotList = this.getSlotListByPickupEntityList(nextProps)
  //     this.setState({slotList, pickupEntityList})
  //   }

   
  // };


  onChange(key, value) {
    if (this.state[key] !== value) {
      this.setState({[key]: value});
    }
  };

  onRowChange(filterKey, key, value) {
    const {slotList} = this.state;
    const filteredObj = slotList.filter(o => o.key === filterKey)[0];
    if (!filterKey && key === 'start') {
      this.handleAdd(value);
    }
    else if (filteredObj && filteredObj[key] !== value) {
      filteredObj[key] = value;
      this.setState({slotList});
    }
  };

  onRowClick(record) {
    this.setState({selectItem: record});
  }

  getSlotListByPickupEntityList(props = this.props) {
    const {pickupEntityList} = props.sceneIntention;
    if (!pickupEntityList) {
      return [];
    }
    const slotList = pickupEntityList.map(o => ({
      entity: o.entity,
      start: o.start,
      end: o.end,
      code: '',
      key: `tp${shortId.generate()}`,
    }));
    return slotList;
  }

  getSlotListByDialogSample(props = this.props) {
    const {id} = props.dialogSample;
    // if (!annotations) {
    //   return [];
    // }
    // console.log("父组件传值:");
    // console.log(annotations); 
    // const test = [{"start":1,"end":2,"text":"量发"}];
    const {dispatch} = this.props;
    

    
   
  }


  getColumns() {
    const {sentence} = this.state;
    const keys = ['code', 'code'];
    console.log(sentence);
    return [
    
      {
        title: '对应标签',
        dataIndex: 'labelName',
        width: '25%',
        render: (text,record) => {
          return (
            <div>
              {sentence.substring(record.start, record.end)}
            </div>
          )
        },
      }, 
      
      
      {
        title: '词槽名称',
        dataIndex: 'name',
        width: '25%',
        render: (text,record) => {
          return (
            <Input
              onChange={(e) => {
                this.handleChangeData(record, 'name', e.target.value);
              }}
              placeholder="请输入词槽名称"
              defaultValue={text}
            />
          )
        },
      },  
      {
        title: '操作',
        width: '25%',
        key: 'operator',
        render: (record) => {
          return (
            <div>
              <Popconfirm title="删除后不可撤销，确定删除?" onConfirm={()=>this.handleDelete(record)}  okText="确认" cancelText="取消">

                <a onClick={(e) => {
                }}
                >
                  删除
                </a>
              </Popconfirm>
            </div>
          )
        },
      }];
  }

  // 数据修改
  handleChangeData(record, key, value) {
    const {slotList} = this.state;
    const alterObj = slotList.filter(o => o.key === record.key)[0];
    if (alterObj[key] !== value) {
      alterObj[key] = value;
      this.setState({slotList});
    }
  };

  // 删除
  handleDelete(record) {
    const {slotList} = this.state;
    const filteredList = slotList.filter(o => o.key !== record.key);
    this.setState({slotList: filteredList});
    // 执行删除操作
    console.log(record.key);
    if(record.key.substring(0,2)!=="tp"){
      const {dispatch,handleOk} = this.props;
      dispatch({
        type: 'sceneIntention/deleteIntentSlots',
        payload: {
          id: record.key,
        },
      }).then((res)=>{
        if(res && res.status === 'OK'){
           const param = this.convertSaveData();
           handleOk(param);
        }
        
      })

    }
  }

  // 新增
  handleAdd(start) {
    const {slotList} = this.state;
    const addObj = {
      key: `tp${shortId.generate()}`,
      entity: '',
      start,
      end: start+1,
      code: '',
    };
    slotList.push(addObj);
    this.setState({slotList, selectItem: addObj});
  }

  saveChange() {
    const {handleOk,form:{ validateFieldsAndScroll }} = this.props;
    validateFieldsAndScroll((errors) => {
      if(errors || !handleOk) return;
      if(this.handleValidateSlotList()){
        message.error('取词存在空对象，请认真检查');
        return;
      }
      const param = this.convertSaveData();
      handleOk(param);
    })

  }

  pickUpEntity() {
    const {dispatch, sceneId: sceneid} = this.props;
    const {sentence} = this.state;
    dispatch({
      type: 'sceneIntention/fetchPickupEntity',
      payload: {
        sentence,
        sceneid,
      },
    });
    this.setState({selectItem:{}});
  }
  handleValidateSlotList = () => {
    const {slotList,sentence} = this.state;
    return slotList.some((o ={})=>{
      // 如果当前的有用的取词对象
      // if(!Object.keys(o).length) return true;
      if( !sentence.substring(o.start, o.end) || $.trim(o.name).length === 0 ) return true;
      return false;
    })
  }
  convertSaveData() {
    const {sceneId, intention, sceneEntityList,dialogSample = {}} = this.props;
    const {sentence, slotList= []} = this.state;
    // slotList
    
    return {
      id:dialogSample.id || '',
      sceneId,
      sentence,
      sentenceAnnot:sentence,
      intent: intention.code,
      intentId: intention.id,
      annotations: JSON.stringify(slotList.map(o => ({
        id:o.key.substring(0,2)==="tp"?'':o.key,
        start: o.start,
        end: o.end,
        name: o.name,
        labelName: sentence.substring(o.start, o.end),
      }))),
    }
  }


  render() {
    const {loading, closeModal, visible,dialogSample={},form:{ getFieldDecorator}} = this.props;
    const {id, sentence, slotList, selectItem} = this.state;
    const {start = 0, end = 0} = selectItem;
    const splitPros = {
      sentence,
      start,
      end,
      onChange: ((key, value) => this.onRowChange(selectItem.key, key, value)),
      onAddRow: this.handleAdd,
    };
    const columns = this.getColumns();
    return (
      <Modal
        className="commonModal"
        maskClosable={false}
        visible={visible}
        title={id ? '编辑对话样本' : '新建对话样本'}
        onCancel={closeModal}
        bodyStyle={{padding: 0}}
        footer={[
          // <Button key="get" onClick={this.pickUpEntity.bind(this)}>获取实体</Button>,
          <Button key="back" onClick={closeModal}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.saveChange.bind(this)}>
            确认
          </Button>,
        ]}
      >
        <Spin spinning={false}>
          <Form className={styles.form}>
            <Row>
              <FormItem  {...formItemLayout} label="对话样本">
                {getFieldDecorator('sentence',{
                  rules: [{
                    required: true,
                    message: '请填写对话样本',
                  }],
                  initialValue:dialogSample.sentence || '',
                })(
                  <Input
                    onChange={(e) => {
                      this.onChange('sentence', e.target.value);
                    }}
                    placeholder="请输入"
                  />
                )}
              </FormItem>
            </Row>
            <Row className={styles.wordRow}>
              <SplitSentenceToWord {...splitPros} />
            </Row>
            <Row>
              <Table
                loading={loading}
                dataSource={slotList}
                columns={columns}
                pagination={false}
                onRow={(record) => {
                  return {
                    onClick: (e) => {
                      this.onRowClick(record, e);
                    },
                  };
                }}
                rowClassName={(record) => {
                  return record.key === selectItem.key ? 'active' : '';
                }}
              />
            </Row>
            <Row>
              <p className={styles.p}>
                <Icon
                  type="plus"
                  onClick={() => this.handleAdd()}
                />
              </p>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

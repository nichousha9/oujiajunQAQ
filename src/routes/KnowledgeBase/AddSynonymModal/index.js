/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Modal, Button,Icon, Row, Col, Input, message,Spin,Form  } from 'antd';
import { getStandardWordDetail } from '../../../services/api'
import { getResMsg } from  '../../../utils/codeTransfer';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
export default class AddSynonymModal extends React.Component{
  state = {
    standardWord: '', // 标准词
    standardWordId: '', // 标准词Id
    synonymWordList: [{}] ,// 同义词列表
  }
  componentDidMount(){
    const { id } = this.props;
    if(id){
      getStandardWordDetail({standardwordid: id}).then((res) => {
        if(res.status === 'OK'){
          this.setState({
            standardWord: res.data.word, // 标准词
            standardWordId: res.data.id, // 标准词Id
            synonymWordList: res.data.synonmylist || [{}] ,// 同义词列表
          });
        }else {
          getResMsg(res.status);
        }
      });
    }
  }
  standardWordChange = (e) => {
    if( this.setState.standardWord !== e.target.value){
      this.setState({standardWord: e.target.value});
    }
  }
  synonymWordChange = (e,index) => {
    const { synonymWordList } = this.state;

    // 没有id只能手动删除
    if(synonymWordList[index]){
      synonymWordList[index].word = e.target.value;
    }
    this.setState({
      synonymWordList,
    })
  }
  // 添加新的同义词
  addNewSynonymWord = () => {
    const {synonymWordList} = this.state;
    synonymWordList.push({});
    this.setState({synonymWordList});
  }
  // 移除同义词
  deleteSynonymWord = (word,index) => {
    const {synonymWordList} = this.state;
    if(synonymWordList.length <= 1){
      message.error('当前为最后一个同义词，不能移除')
      return;
    }
    // 过滤已经删除的信息
    const newSynonymWordList =  synonymWordList.filter((synonym,i) => {
      if(word.id){
        return word.id !== synonym.id;
      }else{
        return index !== i;
      }
    });
    this.setState({synonymWordList: newSynonymWordList});
  }
  // 提交
  handleOk = () => {
    // 校验同义词是否都填些
    const { synonymWordList, standardWord ,standardWordId} = this.state;
    const { onOk,kdbid } = this.props;
    const isEmptySynonym = synonymWordList.some((synonym) => {
      return !synonym.word;
    });
    if(isEmptySynonym){
      message.error('当前存在未填些的同义词！')
      return;
    }
    const synonmywords = synonymWordList.map( (synonym) => {
      return synonym.word;
    }).join(',');
    const obj = {
      kdbid,
      standardword: standardWord,
      standardwordid: standardWordId,
      synonmywords,
    }
    if(onOk) onOk(obj,() => {
      message.success(standardWordId ? '修改成功' : '添加成功');
    });
  }
  render(){
    const { visible, closeModal,loading } = this.props;
    const { synonymWordList, standardWord } = this.state;
    return (
      <Modal
        className="commonModal"
        maskClosable={false}
        visible={visible}
        title="新增同义词"
        onOk={this.handleOk}
        onCancel={closeModal}
        bodyStyle={{padding:0}}
        footer={[
          <Button key="back" onClick={closeModal}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            提交
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Form onSubmit={this.handleSubmit}  style={{ marginTop: 8 }}>
            <Row>
              <FormItem  {...formItemLayout} required label="标准词">
                <Input
                  value={standardWord}
                  onChange={(e) => {
                    this.standardWordChange(e);
                  }}
                  placeholder="请输入标准词"
                />
              </FormItem>
            </Row>
            <Row>
              <FormItem  {...formItemLayout} required label="同义词">
                {synonymWordList.map((word,index) => {
                  return (
                    <Col md={16} style={{ marginBottom: 10}} sm={20} key={`synonymWord${index}`}>
                      <Col md={14} sm={20}>
                        <div style={{width:'100%', paddingLeft:2}}>
                          <Input onChange={(e) => { this.synonymWordChange(e,index)}} value={word.word} placeholder="请输入同义词" />
                        </div>
                      </Col>
                      <Col md={2} sm={20}>
                        <div style={{float:'left', paddingLeft:6}}>
                          <Button onClick={() => {this.deleteSynonymWord(word,index)}} ><Icon type='minus' /></Button>
                        </div>
                      </Col>
                    </Col>
                  )
                })}
              </FormItem>
            </Row>
            <Row>
              <div style={{width:'100%', paddingLeft:'21%'}}>
                <a onClick={this.addNewSynonymWord}><Icon type="plus-circle-o" style={{ paddingLeft:2}} />添加同义词</a>
              </div>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

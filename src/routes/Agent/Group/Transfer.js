import React from 'react';
import { Button,Modal,Input,message } from 'antd';
import { connect } from 'dva';
import StandardTable from '../../../components/StandardTable';
import { getResMsg } from '../../../utils/codeTransfer';

const TextArea = Input.TextArea;

@connect(({transfer, loading}) =>({transfer,tabeloading: loading.effects['transfer/fetchSkillOnlineUserList']}))
class Transfer extends  React.PureComponent{

  componentWillReceiveProps(nextProps){
    const { selectedSkill={} } = nextProps;
    if(JSON.stringify(selectedSkill) !== JSON.stringify(this.props.selectedSkill)){
      this.handleLoadOnlineUser(selectedSkill);
    }
  }
  // 表格
  tableChange = (data) =>{
    const { selectedSkill={} } = this.props;
    this.handleLoadOnlineUser(selectedSkill,data);

  }
  // 获取当前组织下的在线用户
  handleLoadOnlineUser =(selectedSkill,pagedata ={})=>{
    const { dispatch } = this.props;
    dispatch({
      type:'transfer/fetchSkillOnlineUserList',
      payload:{
        skill_id: selectedSkill.id,
        p:pagedata.page || 0,
        ps:pagedata.pageSize || 10,
      },
    })
  }
  // 显示当前用的详情
  showTansfer =(data) =>{
    // 有data的时候显示转接Modal,否则关闭modal
    const { dispatch } = this.props;
    dispatch({
      type:'transfer/updateCurTransferUser',
      payload:data || {},
    })
  }
  handleTransfer =() =>{

  }
  // 转接成功的
  handleOk = async () =>{
    const { onCancel,transfer: { curTransferUser },transferProps={},dispatch } = this.props;
    // 转接坐席还是技能组
    const post = curTransferUser.skill_id? 'fetchTransferOrg': 'fetchTransferAgent';
    const obj = {
      agentno: curTransferUser.id || null,
      skill_id:curTransferUser.skill_id || null,
      userid: transferProps.userid || "",// 坐席页面传过来的参数
      agentserviceid: transferProps.agentserviceid || "",
      agentuserid: transferProps.agentuserid ||"",
    }
    dispatch({
      type:`transfer/${post}`,
      payload:{memo:this.memoRef.textAreaRef.value,...obj},
    }).then((res)=>{
      if(res){
        if(!res) return;
        if(res.status==='OK'){
          message.success('转接成功')
          // 成功
          this.showTansfer();
          const { transfOk } = transferProps;
          if(transfOk) transfOk();
          if(onCancel) onCancel();
          return;
        }
        message.error(getResMsg(res.status));
      }
    });
  }
  render(){
    const columns = [{
      title: '坐席',
      dataIndex: 'nickname',
      width: 100,
    }, {
      title: '登录时间',
      dataIndex: 'logintime',
      width: 100,
    },{
      title: '服务用户数',
      dataIndex: 'users',
      width: 100,
    }, {
      title: '操作',
      key: 'action',
      width: 60,
      render: (text, record) => (
        <span>
          <a onClick={()=>{ this.showTansfer(record) }}>转接</a>
        </span>
      ),
    }];
    const { tabeloading,onCancel = ()=> {},selectedSkill,transfer: { skillOnlineUser,curTransferUser } } = this.props;
    const isVisible = !!curTransferUser.id || !! curTransferUser.skill_id; // 有组织id或者有坐席id的时候
    return(
      <div className="padding-left-10">
        <div>转接到组织</div>
        <div className="margin-top-10 padding-left-10 padding-top-10 padding-bottom-10 bgLightBlue">
          {selectedSkill.name}
          <a
            className="floatRight margin-right-50 margin-left-10"
            onClick={()=>{this.showTansfer({...selectedSkill,skill_id:selectedSkill.id})}}
          >
            转接
          </a>
        </div>
        <div className="margin-top-10 margin-bottom-10">转接到坐席</div>
        <StandardTable
          loading={tabeloading}
          noTotal
          noSelect
          columns={columns}
          data={skillOnlineUser}
          onChange={this.tableChange}
          ref={(ele) => {this.tableRef = ele;}}
        />
        <div
          className="border-top bgWhite padding-top-15"
          style={{ position:'absolute',bottom:-60,height:60,lineHeight:60,left:0,width:'100%'}}
        >
          <Button  className="floatRight margin-right-10" type="primary" onClick={this.handleOk}>确定</Button>
          <Button className="floatRight margin-right-10" onClick={onCancel}>取消</Button>
        </div>
        <Modal
          maskClosable={false}
          title="转接坐席"
          visible={isVisible}
          onOk={this.handleOk}
          onCancel={this.showTansfer}
        >
          <TextArea ref={(ele) => { this.memoRef = ele }} rows="4" placeholder="转接附言（255字符以内）" />
        </Modal>
      </div>
    )
  }
}

export default Transfer;

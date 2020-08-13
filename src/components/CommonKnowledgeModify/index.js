import React from 'react';
import { connect } from 'dva';
import { Icon, Row, Col,message, Form } from 'antd';
import classnames from 'classnames';
import CommonEditor from '../../components/CommonEditor';
import CommonModalArea from '../../components/CommonModalArea';
import CommonTreeSelect from '../../components/CommonTreeSelect';
import CommonSelect from '../../components/CommonSelect';
import styles from './index.less';
import {formatDatetime} from "../../utils/utils";
import CommonKdbCate from "../CommonKdbCate";
import { getCurUserArea } from '../../services/systemSum';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
@connect(({dataDic})=>({dataDic:dataDic.dataDic}))
export default class KnowledgeModify extends React.PureComponent{
  constructor(props){
    super(props);
    const { knowledgeInfo={} } = props;
    this.state = {
      selectItemIndex:0, // 默认选中第一个
      questionIndex:0,// 默认第一条是问题
      editItem: this.handleMessge(knowledgeInfo) || {},
    }
  }
  componentDidMount(){
    const { dispatch,dataDic = {}, type = 'pickup' } = this.props;
    dispatch({ type:'dataDic/fetchGetKnowledgeType'})
    const curType = type === 'pickup' ? 'common_region_type_kdbPickup' : 'common_region_type_kdb';
    const curUserAreaList = dataDic[`curUserAreaList${curType}`] || [];
    if (!curUserAreaList.length) {
      // 获取树
      dispatch({
        type: 'dataDic/fetchGetCurUserAreaList',
        payload: {
          type: curType,
          parentId: 0,
        },
      });
    }
  }
  componentWillReceiveProps(nextProps){
    const { errorsArr=[] } = nextProps;
    if(JSON.stringify(errorsArr) !== JSON.stringify(this.props.errorsArr)){
      const { form:{ validateFieldsAndScroll }} = this.props;
      if(validateFieldsAndScroll)validateFieldsAndScroll();
    }
  }
  onLoadData = treeNodeProps =>
    new Promise(resolve => {
      getCurUserArea({ parentId: treeNodeProps.regionId }).then(res => {
        resolve(res.data);
      });
  });
  // 选择问题和答案
  checkQA =(type,index) => {
    const {knowledgeInfo = {},changeQuestionIndex} = this.props;
    // 如果是已经保存过后的是不能在切换了
    if (knowledgeInfo.id) return '';
    const {questionIndex} = this.state;
    if (type === 'Q' && questionIndex === index) return;
    if (type === 'A' && questionIndex !== index) return;
    // 保证有一个是问题
    if(changeQuestionIndex) changeQuestionIndex(type === 'Q' ? index : 0)
    this.setState({questionIndex: type === 'Q' ? index : 0})
  }
  handleMessge =(knowledgeInfo={}) =>{
    if(knowledgeInfo.id){
      return knowledgeInfo;
    }
    const { selectMessage=[] } = knowledgeInfo;
    const newArr = [];
    selectMessage.forEach((msg)=>{
      if(msg.replyto){
        newArr.push(this.handleMsgItem(msg.replyTo))
        newArr.push(this.handleMsgItem(msg))
      }else{
        newArr.push(this.handleMsgItem(msg))
      }
    })
    const { changeSelectMessage}  = this.props;
    if(changeSelectMessage) changeSelectMessage(newArr);
    return {
      ...knowledgeInfo,
      selectMessage: [...newArr],
    }
  }
  handleMsgItem(message={}){
    const obj = {...message};
    const { type,msgtype,message:msg} = obj;
    if(msgtype==='text'){
       const arr = msg.match(/<img[^>]*>/g);
       if(arr && arr.length){
         return {...obj,message:this.handleMeaasge(msg,arr)};
       }
       return obj;
    }
    if(msgtype==='image'){
      return {...obj,message: `<p></p><p><img style="max-width: 300px;"src=${global.req_url}${msg} /></p>`}
    }
    return obj;
  }
  // 删除
  handleDelete = (index) =>{
    const { editItem={},questionIndex,selectItemIndex } = this.state;
    const { selectMessage=[] } = editItem;
    if(editItem.id){
      message.error('至少保证一条问题和答案');
    }else{
      if(selectMessage.length <=2){
        message.error('至少保证一条问题和答案');
        return;
      }
      const newArr = selectMessage.filter((item,i)=>{ return i!==index});
      const obj = {}
      if(index === questionIndex){
        obj [questionIndex] = 0;
      }
      if(index===selectItemIndex){
        obj [questionIndex] = 0;
      }
      this.setState({
        ...obj,
        editItem:{
          ...editItem,
          selectMessage: newArr,
        },
      })
    }
  }
  // 切换修改的item
  handleChangeEdit =(index) =>{
    this.setState({selectItemIndex: index});
  }
  // 编辑器失去焦点的时候吧当前的内容替换成问题
  handleCommonEditorBlur =(value)=>{
    const { selectItemIndex,editItem } = this.state;
    const { changeEditItem } = this.props;
    let newEditItem = {};
    if(editItem.id){
      // 当前如果是有id
      if(selectItemIndex===0){
        newEditItem = {
          ...editItem,
          question: value,
        }
      }
      if(selectItemIndex===1){
        newEditItem={
          ...editItem,
          content: value,
        }
      }
       this.setState({editItem: newEditItem})
    }else{
      const { editItem:{ selectMessage=[] } } = this.state;
      const newSelectMessage = selectMessage.map((item,i)=>{
        if(i===selectItemIndex){
          return {
            ...item,
            message: value,
          }
        }
        return item;
      })
      this.setState({
        editItem: {
          ... editItem,
          selectMessage: newSelectMessage,
        },
      });
    }
     if(changeEditItem)changeEditItem(newEditItem);
  }
  handleMeaasge = (text='',arr=[]) =>{
    let newMsg = '';
    let lastEnd = 0;
    if(arr.length>0){
      arr.forEach((msg,index)=>{
        const start = text.indexOf(msg);
        const end = start + msg.length;
        const noimgStr = text.substring(lastEnd,start);
        newMsg = `${newMsg }<p>${noimgStr}</p>`+`<p>${msg}</p>`;
        lastEnd= end;
      })
      if(lastEnd < text.length){
        const noImgStr = text.substring(lastEnd,text.length)
        newMsg +=`<p>${noImgStr}</p>`
      }
    }
    return newMsg;
  }
  // 获取编辑器的默认的文案
  editorDefaultValue =() => {
    const {selectItemIndex,editItem} = this.state;
    if (editItem.id) {
      // 修改
      if (selectItemIndex === 0) return editItem.question;
      if (selectItemIndex === 1) return editItem.content;
    } else {
      const {selectMessage = []} = editItem;
      const message = (selectMessage[selectItemIndex]||{}).message || '';
      return message;
    }
  }
  renderItem = (item,type,index)=>{
    let activeQ = false;
    let activeA = false;
    let text='';
    const { selectItemIndex } = this.state;
    // 如果是type
    if(type){
      const {content = '', question = ''} = item;
        if(type==='A'){
          activeA = true;
          text = content;
        }
        if(type==='Q'){
          activeQ = true;
          text = question;
        }
    }else{
      const{ questionIndex }= this.state;
      text = item.message;
      activeQ = questionIndex===index;
      activeA = questionIndex!==index;
    }
    const { editItem } = this.state;
    return (
      <div key={!editItem.id ? item.id : (activeA? 'question':'content')} className={classnames(styles.qAItem,'pointer',selectItemIndex===index ? styles.activeQAItem:'')}>
        <div>
          <span onClick={()=>{this.checkQA('Q',index)}} className={classnames(styles.questionIcon,activeQ ? styles.activeQ:'')}>Q</span>
          <span onClick={()=>{this.checkQA('A',index)}} className={classnames(styles.questionIcon,activeA ? styles.activeA:'')}>A</span>
        </div>
        <div className="flex1 one-line-text" style={{overflow:'hidden'}}dangerouslySetInnerHTML={{__html:text}} />
        <div className={classnames(styles.action)}>
          { selectItemIndex!==index && <Icon className="margin-right-10"onClick={()=>{this.handleChangeEdit(index)}} type="edit" />}
          { selectItemIndex===index && <a className="margin-right-10"><Icon type="save" /></a>}
          <Icon className="margin-right-10" onClick={()=>{this.handleDelete(index)}} type="delete" />
        </div>
      </div>
    )
  }
  renderQuestionList =()=>{
    const key = 'id';
    const { editItem ={}} = this.state;
    // 有id则是一问一答;
    if(editItem[key]) {
      return (
        <React.Fragment>
          {this.renderItem(editItem, 'Q', 0)}
          {this.renderItem(editItem, 'A', 1)}
        </React.Fragment>
      )
    }else{
      const { selectMessage=[] } = editItem;
      return (
        <React.Fragment>
          { selectMessage.map((item,index) =>{
            return this.renderItem(item, '', index)
          })}
        </React.Fragment>
      )
    }
  }
  render(){
    const { dataDic, dataDic:{ knowledgeType=[] },form:{ getFieldDecorator },changeItemInf,knowledgeInfo={},showCreateUser= false,type='pickup' } = this.props;
    const { submitterName,submitTime,catecodeId='',areaList=[],area} = knowledgeInfo;
    const curType = type === 'pickup' ? 'common_region_type_kdbPickup' : 'common_region_type_kdb';
    const curUserAreaList = dataDic[`curUserAreaList${curType}`] || [];
    
    return(
      <div>
        <div className="margin-bottom-20">
          { this.renderQuestionList()}
        </div>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem  {...formItemLayout} label="分类">
                {getFieldDecorator('sortId',{
                  rules: [{
                    required: true,
                    message: '请选择分类',
                  }],
                  initialValue: knowledgeInfo.sortId || '',
                })(
                  <CommonSelect
                    style={{width:'calc(100% - 60px)'}}
                    defaultVal={knowledgeInfo.sortId || ''}
                    onChange={(e)=>{if(changeItemInf)changeItemInf('sortId',e)}}
                    optionData={{
                      optionName: 'paramName',
                      optionId: 'id',
                      datas:knowledgeType,
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formItemLayout} label="发布地区">
                {getFieldDecorator('area',{
                  rules: [{
                    required: true,
                    message: '请选择发布地区',
                  }],
                })(
                  <CommonTreeSelect
                    onChange={(e)=>{if(changeItemInf)changeItemInf('area',e)}}
                    treeCheckStrictly
                    defaultVal={{value: area}}
                    // value={this.showOrgan.organList}
                    treeCheckable="true"
                    loadCallBack={this.onLoadData}
                    treeData={curUserAreaList}
                    nofilter="true"
                    type={{ value: 'regionId', name: 'regionName' }}
                    placeholder="请选择"
                    ref={ele => {
                        this.treeRef = ele;
                      }}
                  />
                  // <CommonModalArea areaList={areaList}area={area} onChange={(e)=>{if(changeItemInf)changeItemInf('area',e)}} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formItemLayout} label="目录">
                {getFieldDecorator('catecodeId',{
                  rules: [{
                    required: true,
                    message: '请选择目录',
                  }],
                  initialValue:catecodeId,
                })(
                  <CommonKdbCate defaultVal={catecodeId} style={{width:'calc(100% - 60px)'}} onChange={(e)=>{if(changeItemInf)changeItemInf('catecodeId',e)}} />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        { showCreateUser && (
          <div className="margin-bottom-20 label">
            <div className="line-height32">
              <span>提交人：</span><span>{ submitterName}</span>
            </div>
            <div className="line-height32">
              <span>提交时间：</span><span>{ formatDatetime(submitTime)}</span>
            </div>
          </div>
        )}
        <div>
          <CommonEditor onBlur={this.handleCommonEditorBlur} defaultValue={this.editorDefaultValue()} />
        </div>
      </div>
    )
  }
}

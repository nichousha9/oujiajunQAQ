import React from 'react';
import { connect } from 'dva';
import {  Row, Col, Form } from 'antd';
import CommonEditor from '../../components/CommonEditor';
import CommonModalArea from '../../components/CommonModalArea';
import CommonSelect from '../../components/CommonSelect';
import styles from './index.less';
import CommonKdbCate from "../CommonKdbCate";

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
    this.state = {}
  }
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({ type:'dataDic/fetchGetKnowledgeType'})
  }

  componentWillReceiveProps(nextProps){
    const { errorsArr=[] } = nextProps;
    if(JSON.stringify(errorsArr) !== JSON.stringify(this.props.errorsArr)){
      const { form:{ validateFieldsAndScroll }} = this.props;
      if(validateFieldsAndScroll)validateFieldsAndScroll();
    }
  }

  // 编辑器失去焦点的时候吧当前的内容替换成问题
  handleCommonEditorBlur =(value)=>{
    const {changeItemInf} = this.props
    if(changeItemInf) {
      changeItemInf('content', value)
    }
  }

  changeFormValue = (type, value) => {
    const {changeItemInf} = this.props
    if(changeItemInf) {
      changeItemInf(type, value)
    }
  }
  render(){
    const { dataDic:{ knowledgeType=[] },form:{ getFieldDecorator },knowledgeInfo={} } = this.props;
    const { catecodeId='',areaList=[], area=''} = knowledgeInfo;
    return(
      <div className={styles.qAItem}>
        <div className={styles.question}>
          <span>问题：</span>
          <span>{knowledgeInfo.question}</span>
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
                    optionData={{datas:knowledgeType}}
                    defaultVal={knowledgeInfo.sortId || ''}
                    onChange={(e)=>{this.changeFormValue('sortId',e)}}
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
                  <CommonModalArea 
                    areaList={areaList} 
                    area={area}
                    onChange={(e)=>{this.changeFormValue('area',e)}} 
                  />
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
                  <CommonKdbCate 
                    defaultVal={catecodeId} 
                    style={{width:'calc(100% - 60px)'}} 
                    onChange={(e)=>{this.changeFormValue('catecodeId',e)}} 
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>

        <div>
          <CommonEditor onBlur={this.handleCommonEditorBlur} />
        </div>
      </div>
    )
  }
}

import React from 'react';
import { Button,Form,Input,Select} from 'antd';
import { EditorState,Modifier,RichUtils } from 'draft-js';
import {
  getSelectionText,
  getEntityRange,
  getSelectionEntity,
} from 'draftjs-utils';


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

@Form.create()
export default class CustomLink extends React.Component {
  state = {
    showLink: false,
  }
  componentWillMount() {
    const { editorState } = this.props;
    if (editorState) {
      this.setState({
        currentEntity: getSelectionEntity(editorState),
      });
    }
  }
  componentWillReceiveProps(properties = {}) {
    const newState = {};
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      newState.currentEntity = getSelectionEntity(properties.editorState);
    }
    this.setState(newState);
  }

  toggleLink = (e) => {
    if(e && e.stopPropagation){
      e.stopPropagation();
    }
    const { showLink } = this.state;
    this.setState({showLink: !showLink})
  }
  getCurrentValues = () => {
    const { editorState } = this.props;
    const { currentEntity } = this.state;
    const contentState = editorState.getCurrentContent();
    const currentValues = {};
    if (currentEntity && (contentState.getEntity(currentEntity).get('type') === 'LINK')) {
      currentValues.link = {};
      const entityRange = currentEntity && getEntityRange(editorState, currentEntity);
      currentValues.link.target = currentEntity && contentState.getEntity(currentEntity).get('data').url;
      currentValues.link.targetOption = currentEntity && contentState.getEntity(currentEntity).get('data').targetOption;
      currentValues.link.title = (entityRange && entityRange.text);
    }
    currentValues.selectionText = getSelectionText(editorState);
    return currentValues;
  }
  getAttrFromUrl = () =>{
    const currentValues = this.getCurrentValues() || {};
    const { link = {},selectionText='' } = currentValues;
    const { target = '', title=''} = link;
    const attrArr = target.split('/');
    return {
      url:attrArr[5] || '',
      title: title || selectionText,
      code:attrArr[4] || '',
      source:attrArr[3] || '',
      acttype:attrArr[2] || '',
    }
  }
  getContent =(values = {})=>{
    const {acttype = '', code = '',url,source=''} = values;
    const { editorState, onChange } = this.props;
    const { currentEntity } = this.state;
    const { title : linkTitle } = values;
    let selection = editorState.getSelection();


    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity);
      selection = selection.merge({
        anchorOffset: entityRange.start,
        focusOffset: entityRange.end,
      });
    }
    const curUrl = 'sim://'+acttype+'/'+source+'/'+code+'/'+url;
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('LINK', 'MUTABLE', { url: curUrl })
      .getLastCreatedEntityKey();
    let contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      `${linkTitle}`,
      editorState.getCurrentInlineStyle(),
      entityKey,
    );
    let newEditorState = EditorState.push(editorState, contentState, 'insert-characters');

    // insert a blank space after link
    selection = newEditorState.getSelection().merge({
      anchorOffset: selection.get('anchorOffset') + linkTitle.length,
      focusOffset: selection.get('anchorOffset') + linkTitle.length,
    });
    newEditorState = EditorState.acceptSelection(newEditorState, selection);
    contentState = Modifier.insertText(
      newEditorState.getCurrentContent(),
      selection,
      ' ',
      newEditorState.getCurrentInlineStyle(),
      undefined,
    );
    onChange(EditorState.push(newEditorState, contentState, 'insert-characters'));
    this.toggleLink();
  }
  stopPropagation = (e) =>{
    e.stopPropagation();
  }
  renderContent = () =>{
    const { form:{ getFieldDecorator}} = this.props;
    const link = this.getAttrFromUrl() || {};
    return (
      <div
        onClick={this.stopPropagation}
        className="bgWhite borderRadius4 border"
        style={{width:400,position:'absolute',top:5,zIndex:'999',paddingTop:24,boxShadow:'3px 3px 3px #BFBDBD'}}
      >
        <Form>
          <FormItem  {...formItemLayout} label="名称">
            {getFieldDecorator('title', {
              rules: [
                {
                  message: '请输入名称！',
                  required:true,
                },
              ],
              initialValue:link.title || '',
            })(<Input  placeholder="名称" />)}
          </FormItem>
          <FormItem  {...formItemLayout} label="动作">
            {getFieldDecorator('acttype', {
              rules: [
                {
                  message: '请选择动作！',
                  required:true,
                },
              ],
              initialValue:link.acttype || '1',
            })(<Select>
              <Select.Option value='1'>复制</Select.Option>
              <Select.Option value='2'>新窗口打开</Select.Option>
            </Select>)}
          </FormItem>
          <FormItem  {...formItemLayout} label="超链接">
            {getFieldDecorator('url', {
              rules: [
                {
                  message: '请输入超链接！',
                  required:true,
                },
              ],
              initialValue:link.url || '',
            })(<Input  placeholder="超链接" />)}
          </FormItem>
          <FormItem  {...formItemLayout} label="来源">
            {getFieldDecorator('source', {
              rules: [
                {
                  message: '请输入来源！',
                },
              ],
              initialValue:link.source || '',
            })(<Input  placeholder="来源" />)}
          </FormItem>
          <FormItem  {...formItemLayout} label="对象编码">
            {getFieldDecorator('code', {
              rules: [
                {
                  message: '请输入对象编码！',
                },
              ],
              initialValue:link.code || '',
            })(<Input  placeholder="对象编码" />)}
          </FormItem>
          <FormItem style={{textAlign:'center'}}>
            <Button type='primary' onClick={this.addLink}>添加</Button>
            <Button style={{marginLeft: 10}} onClick={this.toggleLink} type='default'>取消</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
  removeLink=() => {
    const { editorState, onChange } = this.props;
    const { currentEntity } = this.state;
    let selection = editorState.getSelection();
    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity);
      selection = selection.merge({
        anchorOffset: entityRange.start,
        focusOffset: entityRange.end,
      });
      onChange(RichUtils.toggleLink(editorState, selection, null));
    }
  };
  addLink = (e) => {
    if(e && e.stopPropagation){
      e.stopPropagation();
    }
    const { form:{ validateFieldsAndScroll}} = this.props;
    validateFieldsAndScroll((errors,values)=>{
      if(errors) return;
      this.getContent(values)
    })
  }
  render() {

    const { showLink } = this.state;
    return (
      <div style={{position:'relative'}}>
        <div className="rdw-option-wrapper floatLeft" onClick={this.toggleLink}>
          <i className="iconfont icon-link icon bold" />
        </div>
        <div className="rdw-option-wrapper floatLeft" onClick={this.removeLink}>
          <i className="iconfont icon-unlink icon bold" />
        </div>
        {showLink && this.renderContent()}
      </div>
    );
  }
}


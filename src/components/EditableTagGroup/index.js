import { Tag, Input, Tooltip, Icon,message } from 'antd';
import React from 'react';

export default class EditableTagGroup extends React.Component {
  state = {
    tags: '',
    inputVisible: false,
    inputValue: '',
    showAdd:true,
  };

  componentDidMount(){
      this.props.onRef(this)
  }

  changeTags=(e)=>{
      console.log(e)
      this.setState({
          tags:e,
      })
  }

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    const {getAllTags} = this.props;
    getAllTags(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
   
    // 在这里添加一个判断
    const {judgeTags} = this.props;
    judgeTags(inputValue);
    
  };

  dealData = (flag) =>{
     let { tags } = this.state;
     const { inputValue } = this.state;
     if (flag) {
        this.setState({
            showAdd:true,
        })
    }else{
        this.setState({
            showAdd:false,
        })
        message.error("同义词输入错误！");
        return;
    };
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    // console.log(tags);
   const {getAllTags} = this.props;
    getAllTags(tags);
   
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  }

  saveInputRef = input => {this.input = input};

  render() {
    const { tags, inputVisible, inputValue,showAdd} = this.state;
    return (
      <div>
        {tags && tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable onClose={() => this.handleClose(tag)} >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && showAdd && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" />添加
          </Tag>
        )}
      </div>
    );
  }
}

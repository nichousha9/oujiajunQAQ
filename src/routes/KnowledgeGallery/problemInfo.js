/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import { Input, Form, DatePicker, Tag, Tooltip, Icon } from 'antd';

import styles from './index.less';

const { RangePicker } = DatePicker;

@Form.create()
export default class Knowledgebase extends Component {
  state = {
    tags: ['Unremovable', 'Tag 2', 'Tag 3'],
    inputVisible: false,
    inputValue: '',
  };
  componentDidMount() {}

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter((tag) => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = (input) => (this.input = input);

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const { tags, inputVisible, inputValue } = this.state;

    const { getFieldDecorator } = this.props.form;

    // rowSelection object indicates the need for row selection

    // className="selfAdapt"
    return (
      <div className={styles.selfAdapt}>
        <div style={{ width: '556px', marginLeft: '241px' }}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="问题">
              {getFieldDecorator('problem', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="相似问题">
              {getFieldDecorator('problem', {
                rules: [],
              })(
                <div>
                  {/* <Button shape="circle" icon="plus" /> */}
                  <a>添加相似问题</a>
                </div>
              )}
            </Form.Item>
            <Form.Item label="标准答案">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input.TextArea />)}
            </Form.Item>
            <Form.Item label="时效">
              {getFieldDecorator('email', {
                rules: [],
              })(<RangePicker />)}
            </Form.Item>
            <Form.Item label="核心词">
              {getFieldDecorator('email', {
                rules: [],
              })(<Input.TextArea />)}
            </Form.Item>
            <Form.Item label="同义词">
              {getFieldDecorator('email', {
                rules: [],
              })(
                <div>
                  {tags.map((tag) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                      <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
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
                  {!inputVisible && (
                    <Tag
                      onClick={this.showInput}
                      style={{ background: '#fff', borderStyle: 'dashed' }}
                    >
                      <Icon type="plus" />
                      添加
                    </Tag>
                  )}
                </div>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

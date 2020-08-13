/* eslint-disable no-unused-vars */
/* eslint-disable import/first */
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState, ContentState, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { importImg } from '../../services/api';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import CustomLink from '../CommonEditorLink/CommonEditorLink';
import './index.less';

const imgUpload = (file) => {
  return new Promise((resolve, reject) => {
    importImg({ file }).then((res) => {
      if (res && res.status === 'OK') {
        // 图片回传的格式 { data: { link: <THE_URL>}}. 手动的修改图片回传的格式
        resolve({ data: { link: res.data.fileURL } });
      } else {
        reject(res.status);
      }
    });
  });
};
const toolbar = {
  // 'blockType'
  options: ['history', 'fontSize', 'fontFamily', 'inline', 'list', 'textAlign', 'image', 'link'],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['bold', 'italic', 'underline'],
  },
  image: {
    uploadCallback: imgUpload,
    previewImage: true,
    urlEnabled: false,
    uploadEnabled: true,
    defaultSize: {
      height: 'auto',
      width: '400px',
    },
  },
  link: {
    inDropdown: false,
    className: 'link_modal',
    component: undefined, // CustomLink ,
    popupClassName: undefined,
    dropdownClassName: undefined,
    showOpenOptionOnHover: true,
    defaultTargetOption: '_brank',
    options: ['link'],
    link: { className: { height: '300px' } },
  },
};
const newToolbar = {
  // 'blockType'
  options: ['history', 'fontSize', 'fontFamily', 'inline', 'list', 'textAlign', 'image'],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ['bold', 'italic', 'underline'],
  },
  image: {
    uploadCallback: imgUpload,
    previewImage: true,
    urlEnabled: false,
    uploadEnabled: true,
    defaultSize: {
      height: 'auto',
      width: '400px',
    },
  },
  link: {
    inDropdown: false,
    className: 'link_modal',
    component: undefined, // CustomLink ,
    popupClassName: undefined,
    dropdownClassName: undefined,
    showOpenOptionOnHover: true,
    defaultTargetOption: '_brank',
    options: ['link'],
    link: { className: { height: '300px' } },
  },
};

const htmlToEditor = (html = '') => {
  // 富文本的回显 参考https://jpuri.github.io/react-draft-wysiwyg/#/docs?_k=jjqinp HTML
  const contentBlock = htmlToDraft(html);
  if (!contentBlock) return EditorState.createEmpty();
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  const editorState = EditorState.createWithContent(contentState);
  return editorState;
};

export default class CommonEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: htmlToEditor(
        this.props.defaultVal || this.props.echoValue || this.content || ''
      ),
      init: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps) === JSON.stringify(this.props)) {
      return;
    }
    const echoValue = nextProps.defaultVal || nextProps.echoValue || '';
    if (!this.content && echoValue && !this.state.init) {
      this.setState({
        editorState: htmlToEditor(echoValue),
        init: true,
      });
    }
  }

  onFocus = (event) => {};

  onEditorStateChange = (editorState) => {
    const { onChangeCallBack } = this.props;
    const contentObj = convertToRaw(editorState.getCurrentContent());
    this.content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.setState({ editorState });
    if (onChangeCallBack) {
      // 富文本编辑器聚焦会自动有一个p标签，但是P标签没有内容，用户是没有输入的；

      const { blocks = [] } = contentObj;
      const isNotEmpty = blocks.some((item) => {
        return item.text;
      });
      this.content = isNotEmpty ? this.content : '';
      onChangeCallBack(this.content);
    }
  };
  // 编辑器失去焦点
  editorBlur = () => {
    const { onBlur } = this.props;
    const arr = (this.content || '').match(/<img[^>]*>/g) || [];
    if (
      arr.length === 1 &&
      ((arr[0] || '1').indexOf('<img') === 0 || arr[0].indexOf('<IMG') === 0) &&
      onBlur
    ) {
      onBlur('<p></p>');
    }
    if (onBlur) onBlur(this.content);
  };
  content; // 当前的内容
  render() {
    const { editorState } = this.state;
    const { toolbarHidden = false, style = {}, newLink = false } = this.props;

    let editorProps = {
      onBlur: this.editorBlur,
      localization: { locale: 'zh' },
      editorState,
      onFocus: this.onFocus,
      toolbarClassName: 'commonEditor-toolbarClassName',
      wrapperClassName: 'commonEditor-wrapperClassName',
      editorClassName: 'commonEditor-editorClassName',
      onEditorStateChange: this.onEditorStateChange,
      editorStyle: { minHeight: '200px', ...style },
      toolbar: newLink ? newToolbar : toolbar,
      toolbarHidden,
    };
    if (newLink) {
      editorProps = {
        ...editorProps,
        toolbarCustomButtons: [<CustomLink />],
      };
    }
    return <Editor {...editorProps} />;
  }
}

import React from 'react';
import { Upload, message } from 'antd';

export default class CommonUpload extends React.Component{
  onChange = (res) => {
    const {file} = res;
    let loading = true;
    if (file.status === 'error') {
      // 导入失败
      loading = false;
      message.error(`${file.originFileObj.name}上传失败`);
      return;
    }
    if (file.status === 'done'&& file.response.status!=='OK') {
      // 导入失败
      loading = false;
      message.error(`${file.originFileObj.name}上传失败`);
      return;
    }
    if (file.status === 'done' && file.response.status==='OK') {
      loading = false;
      message.success(`${file.originFileObj.name}上传成功`);
    }

    // 处理导入中的数据
    const {onProcess} = this.props;
    if (onProcess) onProcess(res.fileList,file.response && file.response.data.fileURL, loading)
  }

  beforeUpload = (file) =>{
    const { fileType,fileSize }= this.props;
    const fileTypeReg =fileType ?  new RegExp(fileType) : /(\.xls|\.xlsx)$/; // 默认上传excel
    const isDOC = fileTypeReg.test(file.name);
    const isSize = file.size < (fileSize || 2097152);
    if (!isDOC) {
      message.error('上传文件格式不对');
    }
    if(!isSize){ // 默认制定文件是2M
      message.error('上传文件大于指定大小');
    }
     return isDOC && isSize;
  }

  render(){
    const { importProps, accept, action_url, compo, listType,showUploadList = false } = this.props;
    const uploadProps = {
      name:'file',
      withCredentials: true,
      listType,
      action: global.req_url + action_url,
      onChange: this.onChange,
      showUploadList,
      beforeUpload: this.beforeUpload,
      data:importProps, // 上传的参数,
      accept:accept || 'xls,xlsx',
    }
    return (
      <Upload {...uploadProps}>
        {compo}
      </Upload>
    );
  }
}

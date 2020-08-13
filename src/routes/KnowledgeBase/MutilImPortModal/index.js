/* eslint-disable react/no-unused-state */
import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Steps, message, Icon, Progress, Popover } from 'antd';
import CommonUpload from '../../../components/CommonUpload';
import CommonButton from '../../../components/CommonButton';
// import CommonModalArea from '../../../components/CommonModalArea';
import { createFileDown } from '../../../utils/utils';
import { kdbTempletDown, kdbfileParse } from '../../../services/api';
import { getCurUserArea } from '../../../services/systemSum';
// import styles from './index.less';

const { Step } = Steps;
const { confirm } = Modal;

@connect(({ dataDic, loading }) => {
  return { dataDic: dataDic.dataDic, loading: loading.models.dataDic };
})
export default class MutilImPortModal extends React.Component {
  state = {
    stepCurrent: 0, // 默认处于第一步
    fileList: [], // 上传的文件列表
    area: [],
  };
  componentDidMount() {
    const { dataDic = {} } = this.props;
    // const curType = type === 'pickup' ?  : 'common_region_type_kdb';
    const curUserAreaList = dataDic.curUserAreaListcommon_region_type_kdbPickup || [];
    if (!curUserAreaList.length) {
      const { dispatch } = this.props;
      // 获取树
      dispatch({
        type: 'dataDic/fetchGetCurUserAreaList',
        payload: {
          type: 'common_region_type_kdbPickup',
          parentId: 0,
        },
      });
    }
  }
  onProcess = (fileList) => {
    // 只要当前有一个文件导入成功，则为导入完成
    const stepCurrent = fileList.some((file) => {
      return file.status === 'done';
    })
      ? 1
      : 0;
    this.setState({
      fileList: fileList.filter((file) => {
        return file.status;
      }), // 过滤掉不合法的文件
      stepCurrent,
    });
  };
  onLoadData = (treeNodeProps) =>
    new Promise((resolve) => {
      getCurUserArea({ parentId: treeNodeProps.regionId }).then((res) => {
        resolve(res.data);
      });
    });
  // 地区选择变化
  areaSelectChange = (value) => {
    // console.log(value)
    this.setState({ area: value });
  };
  handleOk = () => {
    const { importProps, onOk, importtype } = this.props;
    const { fileList } = this.state;
    if (!fileList.length) {
      message.error('还未成功上传文件哟');
      return;
    }
    // if(importtype !=='kdb_synonym_import' && !area.length){
    //   message.error('地区分布还没有选择！');
    //   return;
    // }
    // 遍历当前的文件
    const isloading = fileList.some((file) => {
      return file.status === 'uploading';
    });
    if (isloading) {
      message.error('当前有文件正在上传');
      return;
    }
    const importIdArr = fileList.map((file) => {
      const {
        response: { data },
      } = file;
      return data.id;
    });
    kdbfileParse({
      ...importProps,
      area: '',
      attachmentids: importIdArr.join(','),
      importtype,
    }).then((res) => {
      if (res && res.status === 'OK') {
        // 如果导入失败的条数大于0时
        const failList = res.data && res.data.failList;
        if (failList.length > 0) {
          confirm({
            title: '存在导入失败的数据是否查看？',
            content: '失败详细信息',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              if (onOk) onOk(res.data);
            },
            onCancel() {
              if (onOk) onOk(); // 在父级关闭掉Modal
            },
          });
          message.success('导入完成');
        } else if (onOk) {
          onOk(); // 在父级关闭掉Modal
        }
      }
    });
  };
  // 下载模板
  dowonTemplte = () => {
    //  {/*href="http://10.45.54.31:8091/smartim/kdb/file/templet?importtype=kdb_standard_ques_import"*/}
    const { importtype } = this.props;
    kdbTempletDown({ importtype }).then((res) => {
      createFileDown(res);
    });
  };
  // 删除已上传的文件
  deleteImportFile = (index) => {
    const doDetele = () => {
      const { fileList } = this.state;
      this.setState({
        fileList: fileList.filter((file, i) => {
          return index !== i;
        }),
      });
    };
    confirm({
      title: '确定删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        doDetele();
      },
    });
  };
  area = '';
  render() {
    const { visible, closeModal, importtype, loading = false } = this.props;
    const { stepCurrent, fileList } = this.state;
    const upprops = {
      name: 'file',
      headers: {
        authorization: 'authorization-text',
      },
      importProps: this.props.importProps,
      onProcess: this.onProcess,
      multiple: true,
      action_url: '/smartim/system/attachment/upload',
      compo: <Button> 上传附件 </Button>,
    };
    return (
      <Modal
        maskClosable={false}
        className="mutilImPortModal"
        visible={visible}
        title="批量导入"
        onOk={this.handleOk}
        onCancel={closeModal}
        bodyStyle={{ padding: 0 }}
        footer={[
          <Button key="back" onClick={closeModal}>
            取消
          </Button>,
          <CommonButton loading={loading} key="submit" type="primary" onClick={this.handleOk}>
            开始导入
          </CommonButton>,
        ]}
      >
        <Steps
          size="small"
          current={stepCurrent}
          style={{ backgroundColor: '#F7F9FA', width: '100%', padding: '20px 10%' }}
        >
          <Step title="上传文件" />
          <Step title="导入数据" />
          <Step title="完成" />
        </Steps>
        <div style={{ padding: 20, paddingLeft: 40 }}>
          <div style={{ marginBottom: 10 }}>1. 请按照模版格式准备需要导入的数据</div>
          <a href={`${global.req_url}/smartim/knowledge/file/templet?importtype=${importtype}`}>
            <Icon type="download" />
            下载模版
          </a>
          <div style={{ marginBottom: 10, marginTop: 30 }}>2. 请选择需要导入的文件</div>
          <div style={{ display: 'inline-flex', width: '100%' }}>
            <CommonUpload {...upprops} />
            <div className="modal_tips">支持xls,xlsx文件，单个文件不得大于2M</div>
          </div>
          <div style={{ overflow: 'hidden', width: '100%', marginTop: 10 }}>
            {fileList.length > 0 &&
              fileList.map((file, index) => {
                const toopContent = (
                  <div key={file.uid} style={{ marginTop: 10 }}>
                    <Icon type="paper-clip" style={{ marginTop: 4 }} />
                    <span style={{ marginLeft: 5, marginRight: 5 }}>{file.originFileObj.name}</span>
                    <div style={{ width: '40%', display: 'inline-block' }}>
                      <Progress percent={file.percent} strokeWidth={3} status="active" />
                    </div>
                  </div>
                );
                if (file.response && file.response.status === 'OK' && file.status === 'done') {
                  return (
                    <Popover
                      content={
                        <a
                          onClick={() => {
                            this.deleteImportFile(index);
                          }}
                        >
                          <Icon type="close-circle" />
                        </a>
                      }
                    >
                      {toopContent}
                    </Popover>
                  );
                }
                return toopContent;
              })}
          </div>
          {/* { importtype !=='kdb_synonym_import' && (
            <React.Fragment>
              <div className="margin-top-20" style={{marginBottom:10}}>3. 选择导入的地区</div>
              <CommonTreeSelect
                style={{width: '100%'}}
                onChange={this.areaSelectChange}
                treeCheckStrictly
                // defaultVal={orgScope}
                treeCheckable="true"
                loadCallBack={this.onLoadData}
                treeData={curUserAreaList}
                nofilter="true"
                type={{name:'regionName',value:'regionId'}}
                placeholder="请选择地区"
                ref={ele => {
                  this.treeRef = ele;
                }}
              />
              <CommonModalArea noWidth onChange={(e)=>{this.area = e;}} />
            </React.Fragment>
          )} */}
        </div>
      </Modal>
    );
  }
}

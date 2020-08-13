import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Upload, Icon, message, Modal, Form, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { Dragger } = Upload;
@Form.create()
@connect(({ recoRuleManage }) => ({
  ifShowBatchImportModal: recoRuleManage.ifShowBatchImportModal,
  recoListClickItem: recoRuleManage.recoListClickItem,
  recoRuleHotSaleList: recoRuleManage.recoRuleHotSaleList,
  recoListType: recoRuleManage.recoListType,
  recoListTotal: recoRuleManage.recoListTotal,
  recoListCurPage: recoRuleManage.recoListCurPage,
  recoListCurPageSize: recoRuleManage.recoListCurPageSize,
}))
class BatchImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFailBtn: false, // 是否显示导出失败结果按钮
      showCountMessage: false,
      batchCode: '',
      failCount: 0, // 失败条数
      successCount: 0, // 成功条数
    };
  }

  componentWillUnmount() {
    this.setState({
      showFailBtn: false,
      showCountMessage: false,
      batchCode: '',
    });
  }

  handleOk = () => {
    const {
      dispatch,
      recoListClickItem,
      recoListType,
      recoListCurPage,
      recoListCurPageSize,
    } = this.props;
    const { batchCode } = this.state;
    let searchType = '';
    const searchObj = {};
    if (recoListType === 'addRule') {
      // 新增状态下的批量导入查询的是临时表
      if (batchCode) {
        searchObj.batchCode = batchCode;
      }
      searchType = 'getTempRulesGoodsList';
      searchObj.pageInfo = { pageNum: '1', pageSize: '5' };
      searchObj.typeCode = recoListClickItem.rulesType;
    } else {
      searchType = 'getRuleClickList';
      searchObj.rulesId = recoListClickItem.rulesId;
      searchObj.pageInfo = { pageNum: recoListCurPage, pageSize: recoListCurPageSize }; // 功能待添加
      searchObj.goodsObjectName = ''; // 功能待添加
      searchObj.typeCode = recoListClickItem.rulesType;
    }
    dispatch({
      type: `recoRuleManage/${searchType}`,
      payload: searchObj,
    }).then(res => {
      // 如果是新增状态下的批量导入才需要去更新列表
      // 编辑模式下直接请接口即可
      if (recoListType === 'addRule' && res && res.svcCont && res.svcCont.data) {
        const resData = this.handleBatchImportData(res.svcCont.data);
        let dispatchType = '';
        switch (recoListClickItem.rulesType) {
          case 'MCC_RULES_IMPLEMENTS_HOTSALE':
            dispatchType = 'changeRecoRuleHotSaleList';
            break;
          case 'MCC_RULES_IMPLEMENTS_FAVOR':
            dispatchType = 'changeRecoRuleFavorList';
            break;
          case 'MCC_RULES_IMPLEMENTS_SIMILAR':
            dispatchType = 'changeRecoRuleSimilarList';
            break;
          default:
        }
        dispatch({
          type: `recoRuleManage/${dispatchType}`,
          // payload: resData,
          payload: {
            data: resData,
            pageInfo: {
              total: resData.length,
            },
          },
        });
      }
    });
    this.handleCancel();
  };

  // 批量导入弹窗点击返回
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/hiddenBatchImportModal',
    });
    this.setState({
      showFailBtn: false,
      showCountMessage: false,
      batchCode: '',
    });
  };

  // 处理批量导入的数据
  handleBatchImportData = item => {
    const { recoListClickItem } = this.props;
    const type = recoListClickItem.rulesType;
    let result = [];
    if (type === 'MCC_RULES_IMPLEMENTS_HOTSALE') {
      result = this.handleHotSaleData(item);
    }
    if (type === 'MCC_RULES_IMPLEMENTS_FAVOR') {
      result = this.handleFavorData(item);
    }
    if (type === 'MCC_RULES_IMPLEMENTS_SIMILAR') {
      result = this.handleSimilarData(item);
    }
    return result;
  };

  // 处理热卖数据
  handleHotSaleData = item => {
    return item.map(curItem => {
      const newData = {};
      newData.goodsObjectCode = curItem.goodsObjectCode;
      newData.goodsObjectId = curItem.goodsObjectId;
      newData.goodsObjectName = curItem.goodsObjectName;
      newData.rcmRate = curItem.rcmRate;
      newData.rgType = '00';
      newData.relId = curItem.relId;
      return newData;
    });
  };

  // 处理个人喜欢数据
  handleFavorData = item => {
    return item.map(curItem => {
      const newData = {};
      newData.goodsObjectId = curItem.goodsObjectId;
      newData.goodsObjectName = curItem.goodsObjectName;
      newData.rcmRate = curItem.rcmRate;
      newData.subsId = curItem.subsId;
      newData.subsName = curItem.subsName;
      newData.relId = curItem.relId;
      newData.userName = curItem.userName;
      return newData;
    });
  };

  // 处理相似数据
  handleSimilarData = item => {
    return item.map(curItem => {
      const newData = {};
      newData.goodsObjectId = curItem.goodsObjectId;
      newData.goodsObjectName = curItem.goodsObjectName;
      newData.rcmRate = curItem.rcmRate;
      newData.goodsSimilarId = curItem.goodsSimilarId;
      newData.goodsSimilarName = curItem.goodsSimilarName;
      newData.relId = curItem.relId;
      return newData;
    });
  };

  // 导出失败结果
  getFailResult = () => {
    const { batchCode } = this.state;
    const { recoListClickItem } = this.props;
    const target = window.location.origin;
    const url = `${target}/mccm-service/mccm/marketmgr/RCMDRulesListController/exportFailedRulesGoods?typeCode=${recoListClickItem.rulesType}&batchCode=${batchCode}`;
    const a = document.createElement('a');
    a.href = url;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // 修改下拉框状态和新增按钮
  changeAddSelectType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeAddSelectType',
      payload: true,
    });
    // 操作了批量导入，禁用新增操作
    dispatch({
      type: 'recoRuleManage/changeAddBtnType',
      payload: true,
    });
  };

  render() {
    const { recoListClickItem, ifShowBatchImportModal } = this.props;
    const target = window.location.origin;
    const { showFailBtn, failCount, successCount, showCountMessage } = this.state;
    const props = {
      name: 'file',
      multiple: true,
      action: `${target}/mccm-service/mccm/marketmgr/RCMDRulesListController/importRulesGoods`,
      data: {
        rulesId: recoListClickItem.rulesId || '',
        typeCode: recoListClickItem.rulesType,
      },
      beforeUpload(file) {
        const isExecl =
          file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type == 'application/vnd.ms-excel' ||
          /(\.(xlsx|xls))$/.test(file.name);
        if (!isExecl) {
          message.error(formatMessage({ id: 'rulesManage.recoRule.fileTypeError' }, '只能上传execl格式的文件(.xlsx结尾)'));
        }
        return isExecl;
      },
      onChange: info => {
        const { status } = info.file;
        if (status == 'done') {
          const result = info.file.response;
          if (result && result.topCont && result.topCont.resultCode == -1) {
            message.error(result.topCont.remark);
          } else if (result && result.svcCont.data) {
            // 如果存在成功导入条数就代表成功
            if (result.svcCont.data.successCount >= 0) {
              // 如果存在失败条数
              if (result.svcCont.data.failCount > 0) {
                message.info(`存在导入失败数据${result.svcCont.data.failCount}条`);
              } else {
                message.success(`成功导入${result.svcCont.data.successCount}条数据.`);
              }
              // 导入成功
              this.setState({
                successCount: result.svcCont.data.successCount,
                failCount: result.svcCont.data.failCount,
                showCountMessage: true,
              });
            }
            // 存在失败条数
            if (result.svcCont.data.failCount > 0) {
              this.setState({
                showFailBtn: true,
              });
            } else {
              this.setState({
                showFailBtn: false,
              });
            }
            this.setState({
              batchCode: result.svcCont.data.batchCode,
            });
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
        this.changeAddSelectType();
      },
    };

    return (
      <Modal
        title={formatMessage({ id: 'rulesManage.recoRule.batchImport' }, '批量导入')}
        className={styles.batchImport}
        visible={ifShowBatchImportModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        showUploadList={false}
        footer={
          <React.Fragment>
            <Button size="small" key="submit" type="primary" onClick={this.handleOk}>
              {formatMessage({ id: 'rulesManage.recoRule.submit' }, '提交')}
            </Button>
            <Button size="small" key="back" onClick={this.handleCancel}>
              {formatMessage({ id: 'rulesManage.recoRule.back' }, '返回')}
            </Button>
          </React.Fragment>
        }
      >
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">
            {formatMessage({ id: 'rulesManage.recoRule.batchImportFile' }, '点击此处进行文件上传')}
          </p>
          <p className="ant-upload-hint">
            {formatMessage({ id: 'rulesManage.recoRule.fileType' }, '支持扩展名: .xlsx .xls')}
          </p>
        </Dragger>
        {showCountMessage ? (
          <div className={styles.countMessage}>
            <span className={styles.successCount}>成功条数：{successCount}</span>
            <span className={styles.failCount}>失败条数：{failCount}</span>
          </div>
        ) : null}

        {showFailBtn ? (
          <a onClick={this.getFailResult} className={styles.failResult}>
            {formatMessage({ id: 'rulesManage.recoRule.getFailResult' }, '导出失败结果')}
          </a>
        ) : null}
      </Modal>
    );
  }
}

export default BatchImport;

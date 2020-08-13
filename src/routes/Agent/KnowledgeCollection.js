/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React from 'react';
import { Modal, Steps, Button, message } from 'antd';
import { connect } from 'dva';
import KnowledgeModify from '../../components/CommonKnowledgeModify';
import SimilarQuestionTable from '../../components/SimilarQuestionTable';
import CommonButton from '../../components/CommonButton';
import CommonEndPage from '../../components/CommonEndPage';

const steps = [
  { key: 'collection', title: '知识录入' },
  { key: 'similar', title: '相似问题' },
  { key: 'end', title: '结束' },
];
const { Step } = Steps;

@connect(({ knowPickUpSaveAudite, loading }) => {
  return {
    knowPickUpSaveAudite,
    draftLoading: loading.effects['knowPickUpSaveAudite/fetchSaveKnowPickUpDraft'],
    submitLoading: loading.effects['knowPickUpSaveAudite/fetchKnowSubmitToAudit'],
  };
})
export default class KnowledgeCollection extends React.PureComponent {
  constructor(props) {
    super(props);
    const { editItem = {}, selectedMessage = [] } = this.props;
    this.state = {
      errorsArr: [],
      currentStep: 0,
      editItem: { ...editItem, selectMessage: selectedMessage }, // 当前收录问题的信息
      qIndex: 0, // 当前的问题的序号，
    };
  }
  // 获取问题
  handleGetQuestion = () => {
    const { qIndex = 0, editItem = {} } = this.state;
    const { selectMessage = [] } = editItem;
    if (editItem.id) {
      if (qIndex === 0) return editItem.question;
      if (qIndex === 1) return editItem.content;
    } else {
      return (selectMessage[qIndex] || {}).message || '';
    }
  };
  // 获取答案
  handleGetAnswer = () => {
    const { qIndex = 0, editItem = {} } = this.state;
    const { selectMessage = [] } = editItem;
    if (editItem.id) {
      if (qIndex === 0) return editItem.content;
      if (qIndex === 1) return editItem.question;
    } else {
      const newContentArr = selectMessage
        .filter((item, i) => {
          return qIndex !== i;
        })
        .map((msg) => msg.message);
      return newContentArr.join(' ');
    }
  };
  changeSelectMessage = (arr = []) => {
    const { editItem = {} } = this.state;
    if (arr.length && !editItem.id) {
      this.setState({ editItem: { selectMessage: arr } });
    }
  };
  // 提交审核
  submitToAudit = (callBack) => {
    const { dispatch } = this.props;
    const { editItem } = this.state;
    dispatch({
      type: 'knowPickUpSaveAudite/fetchKnowSubmitToAudit',
      payload: { id: editItem.id || '' },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('提交审核成功！');
        // this.setState({editItem: res.data})
        callBack();
      }
    });
  };
  // 校验
  handleValidate = () => {
    const { editItem } = this.state;
    if (!editItem.sortId || !editItem.area || !editItem.catecodeId) {
      const arr = [];
      if (!editItem.sortId) arr.push('sortId');
      if (!editItem.area) arr.push('area');
      if (!editItem.catecodeId) arr.push('catecodeId');
      this.setState({ errorsArr: arr });
      return true;
    }
    this.setState({ errorsArr: [] });
    return false;
  };
  // 保存草稿
  saveDraft = (callBack) => {
    const validate = this.handleValidate();
    if (validate) {
      return;
    }
    const { dispatch } = this.props;
    const { editItem } = this.state;
    dispatch({
      type: 'knowPickUpSaveAudite/fetchSaveKnowPickUpDraft',
      payload: {
        id: editItem.id || '',
        content: this.handleGetAnswer(),
        question: this.handleGetQuestion(),
        sortId: editItem.sortId || '',
        area: editItem.area || '',
        catecodeId: editItem.catecodeId || '',
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('暂存成功！');
        this.setState({ editItem: res.data });
        callBack();
      }
    });
  };
  changeStep = (type) => {
    const { currentStep } = this.state;
    if (!currentStep && type === 'reduce') {
      const { onCancel } = this.props;
      onCancel();
      return;
    }
    if (currentStep === 0 && type === 'add') {
      this.saveDraft(() => {
        this.updateStep('add');
      });
    } else if (currentStep === 1 && type === 'add') {
      this.submitToAudit(() => {
        this.updateStep('add');
      });
    } else {
      this.setState({ currentStep: type === 'add' ? currentStep + 1 : currentStep - 1 });
    }
  };
  updateStep = (type) => {
    const { currentStep } = this.state;
    this.setState({ currentStep: type === 'add' ? currentStep + 1 : currentStep - 1 });
  };
  changeQuestionIndex = (index) => {
    this.setState({ qIndex: index });
  };
  changeEditItem = (editItem) => {
    this.setState({ editItem });
  };
  handleKnowChange = (type, value) => {
    if (!type) return;
    const { editItem = {} } = this.state;
    const obj = {};
    obj[type] = value;
    this.setState({ editItem: { ...editItem, ...obj } });
  };
  // 获取操作按钮
  getButton = () => {
    const { currentStep, editItem = {} } = this.state;
    const { draftLoading = false, submitLoading = false, onCancel } = this.props;
    if (editItem.status && editItem.status !== 'pick_up_draft')
      return [
        <Button
          type="primary"
          onClick={() => {
            if (onCancel) onCancel();
          }}
        >
          关闭
        </Button>,
      ];
    if (currentStep > 1) {
      return [
        <Button
          type="primary"
          onClick={() => {
            if (onCancel) onCancel();
          }}
        >
          关闭
        </Button>,
      ];
    }
    return [
      <Button
        key="back"
        onClick={() => {
          this.changeStep('reduce');
        }}
      >
        {currentStep === 0 ? '取消' : '返回上一级'}
      </Button>,
      <CommonButton
        key="submit"
        type="primary"
        loading={draftLoading || submitLoading}
        onClick={() => {
          this.changeStep('add');
        }}
      >
        {currentStep === 1 ? '提交审核' : '下一级'}
      </CommonButton>,
    ];
  };
  render() {
    const { visible, onCancel, selectedMessage = [], curUserAreaList } = this.props;
    const { currentStep, editItem = {}, errorsArr = [] } = this.state || {};
    const knowledgeInfo = editItem.id ? editItem : { selectMessage: selectedMessage };
    return (
      <Modal
        width="750px"
        onCancel={onCancel}
        visible={visible}
        maskClosable={false}
        title="知识收录"
        footer={this.getButton()}
      >
        <div className="border-bottom" style={{ paddingBottom: 24 }}>
          <Steps size="small" current={currentStep}>
            {steps.map((item) => (
              <Step key={item.key} title={item.title} />
            ))}
          </Steps>
        </div>
        {steps[currentStep].key === 'collection' && (
          <KnowledgeModify
            curUserAreaList={curUserAreaList}
            changeSelectMessage={this.changeSelectMessage}
            errorsArr={errorsArr}
            changeItemInf={this.handleKnowChange}
            changeEditItem={this.changeEditItem}
            changeQuestionIndex={this.changeQuestionIndex}
            knowledgeInfo={knowledgeInfo}
          />
        )}
        {steps[currentStep].key === 'similar' && (
          <SimilarQuestionTable question={this.handleGetQuestion()} />
        )}
        {steps[currentStep].key === 'end' && <CommonEndPage text="提交结束" />}
      </Modal>
    );
  }
}

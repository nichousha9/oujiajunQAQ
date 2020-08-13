import React from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import CustomSelect from '@/components/CustomSelect';
import commonStyles from '../../common.less';
import TemplateModal from './TemplateModal';

@connect(({ activityFlowContact }) => ({
  activityFlowContact,
}))
class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModelList: [],
      templateModalVisible: false,
    }
  }

  componentDidMount() {
    this.qrySelectedTemplateList();
  }

  // 查询当前节点的模板数据
  qrySelectedTemplateList = () => {
    const { dispatch, nodeData = {} } = this.props;
    const processId = nodeData.PROCESS_ID;
    if (!processId) return;

    dispatch({
      type: 'activityFlowContact/qryProcessModelRel',
      payload: {
        processId,
      },
      success: svcCont => {
        if(svcCont && svcCont.data) {
          const { data = {} } = svcCont;
          this.setState({
            selectedModelList: [data],
          });
        }
      }
    });
  }

  addTemplate = () => {
    this.setState({
      templateModalVisible: true
    });
  }

  saveModelRel = () => {
    const { dispatch } = this.props;
    const { selectedModelList } = this.state;
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        processModelRel: selectedModelList[0],
      }
    });
  }

  onOk = selectedModelList=> {
    this.setState({
      templateModalVisible: false,
      selectedModelList,
    }, () => {
      this.saveModelRel();
    });
  }

  onCancel = () => {
    this.setState({
      templateModalVisible: false,
    });
  }

  onClose = () => {
    this.setState({
      selectedModelList: [],
    }, () => {
      this.saveModelRel();
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { selectedModelList, templateModalVisible } = this.state;

    const templateCustomSelectProps = {
      mode: 'tags',
      dataSource: selectedModelList.map(selectedModel => ({
        label: selectedModel.modelName,
        value: selectedModel.modelId,
      })),
      onClose: this.onClose,
      otherNode: <a onClick={this.addTemplate}>{formatMessage({ id: 'activityConfigManage.flow.add' })}</a>
    };

    const modelProps = {
      chooseMultiple: false,
      visible: templateModalVisible,
      onOk: this.onOk,
      onCancel: this.onCancel,
    }

    return (
      <>
        <div className={commonStyles.block}>
          <p className={commonStyles.title}>
            {formatMessage({ id: 'activityConfigManage.contact.addTemplate' })}
          </p>
          <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.content' })}>
            {getFieldDecorator('selectTemplate', {
              initialValue: [],
            })(<CustomSelect {...templateCustomSelectProps} />)}
          </Form.Item>
        </div>
        {templateModalVisible ? <TemplateModal {...modelProps}/> : null}
      </>
    );
  }
}

export default Template;

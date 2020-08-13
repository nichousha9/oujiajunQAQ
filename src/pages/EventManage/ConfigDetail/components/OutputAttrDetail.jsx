import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Select, Radio, Button } from 'antd';
import { getAttrValueByCode } from '../../untils';
import style from '../index.less';

const { Option } = Select;

const mapStateToProps = ({ configDetail, eventManageComm, common }) => ({
  isShowOutputAttrForm: configDetail.isShowOutputAttrForm,
  attrSpecCodeList: common.attrSpecCodeList,
  eventItme: eventManageComm.itemDetail,
  currentOutputAttrItem: configDetail.currentOutputAttrItem,
  outputAttrCodeFields: configDetail.outputAttrCodeFields,
  eventOutputDetail: configDetail.eventOutputDetail,
});

function OutputAttrDetail(props) {
  const {
    form,
    isShowOutputAttrForm,
    attrSpecCodeList,
    eventItme,
    currentOutputAttrItem,
    outputAttrCodeFields = [],
    eventOutputDetail,
    dispatch,
  } = props;
  const { getFieldDecorator, getFieldValue, getFieldsValue, setFieldsValue, validateFields } = form;
  const { DATA_TYPE } = attrSpecCodeList;

  // 根据 isShowOutputAttrForm 渲染表单
  const formConfig = {
    null: {
      formItemSpan: 0, // 表单项栅格数,
      readonly: true,
    },
    false: {
      formItemSpan: 0, // 表单项栅格数,
      readonly: true,
    },
    add: {
      formItemSpan: 12, // 表单项栅格数,
      readonly: false,
    },
    edit: {
      formItemSpan: 8,
      readonly: false,
    },
    readonly: {
      formItemSpan: 8,
      readonly: true,
    },
  };

  // 处理输出属性详情表单显示形式
  function handleShowOutputAtrrForm(type) {
    dispatch({
      type: 'configDetail/handleShowOutputAtrrForm',
      payload: type,
    });
  }

  // 校验名称是否已经存在
  // async function asyncValidateName(_, val, callback) {
  //   const result = await dispatch({
  //     type: 'configDetail/validateInputAttrName',
  //     payload: {
  //       inputId: eventItme.id,
  //       name: val,
  //     },
  //   });
  //   if (result && result.topCont && result.topCont.resultCode == 0) {
  //     if (result.svcCont && result.svcCont.data && result.svcCont.data.length == 0) {
  //       callback();
  //     } else if (result.svcCont && result.svcCont.data && result.svcCont.data.length != 0) {
  //       callback('名称已存在');
  //     }
  //   } else {
  //     callback('未知错误');
  //   }
  // }

  // 强制刷新输入属性列表数据
  function forceGetOutputAttrList() {
    dispatch({
      type: 'configDetail/forceGetOutputAttrList',
    });
  }

  // 提交表单
  // @params { Object } params 额外的参数
  function submitForm(method, params) {
    // 表单验证
    validateFields(async (err, val) => {
      if (!err) {
        await dispatch({
          type: 'configDetail/saveOutputAttr',
          payload: {
            inputId: eventItme.id,
            outputId: eventOutputDetail.id,
            ...val,
            ...params,
          },
          method,
        });
        forceGetOutputAttrList();
      }
    });
  }

  // 获取数字字典
  useEffect(() => {
    if (!DATA_TYPE) {
      getAttrValueByCode(dispatch, 'event', 'DATA_TYPE');
    }
  }, []);

  // 获取属性编码列表值
  useEffect(() => {
    dispatch({
      type: 'configDetail/getOutputAttrCodeFields',
      payload: {
        inputId: eventItme.id,
      },
    });
  }, []);

  // 设置表单值
  useEffect(() => {
    const { name, code, lineSequence, dataType, isNull, length, isKey } = currentOutputAttrItem;
    setFieldsValue(
      {
        name,
        code,
        lineSequence,
        dataType,
        isNull: isNull || 'Y',
        isKey: isKey || 'N',
      },
      () => {
        const allFields = Object.keys(getFieldsValue());
        if (allFields.includes('length')) {
          // 判断是否有 length（长度） 字段
          setFieldsValue({
            length,
          });
        }
      },
    );
  }, []);

  return (
    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} className={style.inputAttrDetail}>
      <Row gutter={24}>
        <Col span={formConfig[isShowOutputAttrForm].formItemSpan}>
          <Form.Item hasFeedback label="名称">
            {getFieldDecorator('name', {
              validateTrigger: ['onBlur'],
              validateFirst: true,
              rules: [
                { required: true, message: '请输入名称' },
                // {
                //   validator:
                //     getFieldValue('name') != currentOutputAttrItem.name ? asyncValidateName : null,
                // },
              ],
            })(
              <Input
                size="small"
                placeholder="请输入名称"
                disabled={formConfig[isShowOutputAttrForm].readonly}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowOutputAttrForm].formItemSpan}>
          <Form.Item label="代码">
            {getFieldDecorator('code', {
              rules: [{ required: true, message: '请选择代码' }],
            })(
              <Select
                size="small"
                placeholder="请选择代码"
                disabled={formConfig[isShowOutputAttrForm].readonly}
              >
                {Array.isArray(outputAttrCodeFields) &&
                  outputAttrCodeFields.map(item => (
                    <Option key={item.code} value={item.code}>
                      {item.code}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowOutputAttrForm].formItemSpan}>
          <Form.Item label="是否为空">
            {getFieldDecorator('isNull', {
              rules: [{ required: true, message: '请选择是否为空' }],
              initialValue: 'Y',
            })(
              <Radio.Group>
                <Radio value="Y" disabled={formConfig[isShowOutputAttrForm].readonly}>
                  是
                </Radio>
                <Radio value="N" disabled={formConfig[isShowOutputAttrForm].readonly}>
                  否
                </Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowOutputAttrForm].formItemSpan}>
          <Form.Item label="关键">
            {getFieldDecorator('isKey', {
              rules: [{ required: true, message: '请选择关键' }],
              initialValue: 'N',
            })(
              <Radio.Group>
                <Radio value="Y" disabled={formConfig[isShowOutputAttrForm].readonly}>
                  是
                </Radio>
                <Radio value="N" disabled={formConfig[isShowOutputAttrForm].readonly}>
                  否
                </Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowOutputAttrForm].formItemSpan}>
          <Form.Item label="数据类型">
            {getFieldDecorator('dataType', {
              rules: [{ required: true, message: '请选择数据类型' }],
            })(
              <Select
                size="small"
                placeholder="请选择数据类型"
                disabled={formConfig[isShowOutputAttrForm].readonly}
              >
                {Array.isArray(DATA_TYPE) &&
                  DATA_TYPE.map(item => (
                    <Option key={item.attrValueCode} value={item.attrValueCode}>
                      {item.attrValueName}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        {(getFieldValue('dataType') == '2' || getFieldValue('dataType') == '3') && (
          <Col span={formConfig[isShowOutputAttrForm].formItemSpan}>
            <Form.Item label="长度">
              {getFieldDecorator('length', {
                rules: [{ required: true, message: '请输入长度' }],
              })(
                <Input
                  size="small"
                  placeholder="请输入长度"
                  disabled={formConfig[isShowOutputAttrForm].readonly}
                />,
              )}
            </Form.Item>
          </Col>
        )}
        <Col span={formConfig[isShowOutputAttrForm].formItemSpan}>
          <Form.Item label="序列">
            {getFieldDecorator('lineSequence', {
              rules: [{ required: true, message: '请输入序列' }],
            })(
              <Input
                size="small"
                placeholder="请输入序列"
                disabled={formConfig[isShowOutputAttrForm].readonly}
              />,
            )}
          </Form.Item>
        </Col>
        {isShowOutputAttrForm !== 'readonly' && (
          <Col span={24}>
            <div className={style.formButtonContainer}>
              <Button
                size="small"
                type="primary"
                onClick={() => submitForm(isShowOutputAttrForm, { id: currentOutputAttrItem.id })}
              >
                保存
              </Button>
              &nbsp;&nbsp;
              <Button
                onClick={() => {
                  handleShowOutputAtrrForm(false);
                }}
                size="small"
              >
                取消
              </Button>
            </div>
          </Col>
        )}
      </Row>
    </Form>
  );
}

export default Form.create()(connect(mapStateToProps)(OutputAttrDetail));

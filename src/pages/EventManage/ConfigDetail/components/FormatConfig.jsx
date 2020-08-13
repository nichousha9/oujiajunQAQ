import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Select, Row, Col, Input, Button } from 'antd';
import { getAttrValueByCode } from '../../untils';

const { Option } = Select;
const { TextArea } = Input;

const mapStateToProps = ({ configDetail, eventManageComm, common, loading }) => ({
  attrSpecCodeList: common.attrSpecCodeList,
  itemDetail: eventManageComm.itemDetail,
  eventOutputDetail: configDetail.eventOutputDetail,
  updateLoading: loading.effects['configDetail/updateEvtEventOutput'],
  insertLoading: loading.effects['configDetail/insertEvtEventOutput'],
});

function FormatConfig(props) {
  const {
    eventOutputDetail = {},
    itemDetail,
    attrSpecCodeList,
    form,
    updateLoading,
    insertLoading,
    dispatch,
  } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue, getFieldsValue, validateFields } = form;
  const { CON_TYPE_OUT, YES_OR_NO } = attrSpecCodeList;

  // 表单是否可编辑
  const [formEditabled, setFormEditabled] = useState(false);

  // 根据 “输出连接类型” 的值渲染不同的字段
  const mapConcatTypeToField = {
    '1000': () => (
      <Fragment>
        <Col span={24}>
          <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="HTTP请求路径">
            {getFieldDecorator('requestUrl', {
              rules: [{ required: true, message: '请输入 HTTP 请求路径' }],
            })(
              <Input
                disabled={!formEditabled}
                size="small"
                placeholder={formEditabled ? '请输入http请求路径' : ''}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="HTTP请求用户">
            {getFieldDecorator('requestUser', {
              rules: [{ required: true, message: '请输入 HTTP 请求用户' }],
            })(
              <Input
                disabled={!formEditabled}
                size="small"
                placeholder={formEditabled ? '请输入 HTTP 请求用户' : ''}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="HTTP请求密钥">
            {getFieldDecorator('requestPassword', {
              rules: [{ required: true, message: '请输入 hTTP 请求密钥' }],
            })(
              <Input
                disabled={!formEditabled}
                size="small"
                type="password"
                placeholder={formEditabled ? '请输入 hTTP 请求密钥' : ''}
              />,
            )}
          </Form.Item>
        </Col>
      </Fragment>
    ),
  };

  // 获取表单详情
  function getEventOutputDetail(id) {
    dispatch({
      type: 'configDetail/getEventOutputDetail',
      payload: {
        eventId: id || itemDetail.id,
      },
    });
  }

  // 提交表单
  function submitForm() {
    validateFields(async (err, val) => {
      if (!err) {
        if (eventOutputDetail.id != null) {
          // 配置详情 id 存在，表示修改
          await dispatch({
            type: 'configDetail/updateEvtEventOutput',
            payload: { ...val, id: eventOutputDetail.id },
          });
        } else if (itemDetail.id != null) {
          // 只是事件 id 存在，表示插入
          await dispatch({
            type: 'configDetail/insertEvtEventOutput',
            payload: { ...val, eventId: itemDetail.id },
          });
        }

        getEventOutputDetail(itemDetail.id);
      }
    });
  }

  // 获取数字字典
  useEffect(() => {
    if (!CON_TYPE_OUT || !YES_OR_NO) {
      getAttrValueByCode(dispatch, 'event', [
        'CON_TYPE_OUT', // 输出连接类型
        'YES_OR_NO',
      ]);
    }
  }, []);

  // 获取表单详情
  useEffect(() => {
    getEventOutputDetail(itemDetail.id);
  }, [formEditabled]);

  // 设置表单值
  useEffect(() => {
    setFieldsValue(
      {
        conType: eventOutputDetail.conType,
      },
      () => {
        const fiedlsVal = {}; // 用来保存所有字段键值
        const allFields = Object.keys(getFieldsValue()); // 获取所有字段键
        allFields.forEach(item => {
          fiedlsVal[item] = eventOutputDetail[item];
        });
        setFieldsValue(fiedlsVal);
      },
    );
  }, [eventOutputDetail]);

  return (
    <Form labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setFormEditabled(true);
            }}
          >
            编辑
          </Button>
        </Col>
        <Col span={8}>
          <Form.Item label="输出连接类型">
            {getFieldDecorator('conType', {
              rules: [{ required: true, message: '请选择输出连接类型' }],
            })(
              <Select
                allowClear
                size="small"
                disabled={!formEditabled}
                placeholder={formEditabled ? '请选择输出连接类型' : ''}
              >
                {Array.isArray(CON_TYPE_OUT) &&
                  CON_TYPE_OUT.map(item => (
                    <Option key={item.attrValueCode} value={item.attrValueCode}>
                      {item.attrValueName}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="是否数据库">
            {getFieldDecorator('isDatabase', {
              rules: [{ required: true, message: '请选择是否数据库' }],
            })(
              <Select
                allowClear
                size="small"
                placeholder={formEditabled ? '请选择是否数据库' : ''}
                disabled={!formEditabled}
              >
                {Array.isArray(YES_OR_NO) &&
                  YES_OR_NO.map(item => (
                    <Option key={item.attrValueCode} value={item.attrValueCode}>
                      {item.attrValueName}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        {mapConcatTypeToField[getFieldValue('conType')] &&
          mapConcatTypeToField[getFieldValue('conType')]()}
        <Col span={24}>
          <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="描述">
            {getFieldDecorator('description')(
              <TextArea
                disabled={!formEditabled}
                placeholder={formEditabled ? '请输入描述' : ''}
                autosize={{ minRows: 2, maxRows: 6 }}
              />,
            )}
          </Form.Item>
        </Col>
        {formEditabled && (
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button
              loading={updateLoading || insertLoading}
              size="small"
              type="primary"
              onClick={submitForm}
            >
              保存
            </Button>
            &nbsp;&nbsp;
            <Button
              size="small"
              onClick={() => {
                setFormEditabled(false);
              }}
            >
              取消
            </Button>
          </Col>
        )}
      </Row>
    </Form>
  );
}

export default Form.create()(connect(mapStateToProps)(FormatConfig));

import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Select, Row, Col, Input, Button, DatePicker } from 'antd';
import { getAttrValueByCode } from '../../untils';

const { Option } = Select;

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
  const { getFieldDecorator, setFieldsValue, getFieldsValue, validateFields } = form;
  const { CON_TYPE_OUT, YES_OR_NO } = attrSpecCodeList;

  // 表单是否可编辑
  const [formEditabled, setFormEditabled] = useState(false);

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
          <Form.Item label="窗口类型">
            {getFieldDecorator('conType', {
              rules: [{ required: true, message: '请选择窗口类型' }],
            })(
              <Select
                allowClear
                size="small"
                disabled={!formEditabled}
                placeholder={formEditabled ? '请选择窗口类型' : ''}
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
          <Form.Item label="开始时间">
            {getFieldDecorator('startTime', {
              rules: [{ required: true, message: '请选择开始时间' }],
            })(<DatePicker size="small" disabled={!formEditabled} />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="结束时间">
            {getFieldDecorator('endTime', {
              rules: [{ required: true, message: '请选择结束时间' }],
            })(<DatePicker size="small" disabled={!formEditabled} />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="持续时长">
            {getFieldDecorator('time', {
              rules: [{ required: true, message: '请选择持续时长' }],
            })(
              <Input
                allowClear
                size="small"
                placeholder={formEditabled ? '请输入持续时长' : ''}
                disabled={!formEditabled}
              />,
            )}
            {getFieldDecorator('isDatabase', {
              rules: [{ required: true, message: '请选择持续时长' }],
            })(
              <Select
                allowClear
                size="small"
                placeholder={formEditabled ? '请选择持续时长' : ''}
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

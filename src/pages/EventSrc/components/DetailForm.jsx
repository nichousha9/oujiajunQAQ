import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Col, Row, Select, Button } from 'antd';
import Catalogue from './Catalogue';
import style from './index.less';
import { getAttrValueByCode } from '../untils';

const { Option } = Select;

const mapStateToProps = ({ eventSrcComm, common, loading }) => ({
  isShowDetailForm: eventSrcComm.isShowDetailForm,
  attrSpecCodeList: common.attrSpecCodeList,
  fieldsDetail: eventSrcComm.itemDetail,
  submitLoading: loading.effects['eventSrcComm/saveEventDetailsEffect'],
  validateNameLoading: loading.effects['eventSrcComm/validateNameEffect'],
});

function DetailForm(props) {
  const {
    isShowDetailForm,
    attrSpecCodeList = {},
    form,
    fieldsDetail = {},
    submitLoading,
    validateNameLoading,
    dispatch,
  } = props;
  const { CON_TYPE } = attrSpecCodeList;
  const { getFieldDecorator, getFieldValue, getFieldsValue, validateFields, setFieldsValue } = form;
  const { inputType, id } = fieldsDetail;

  // 根据 isShowDetailForm 渲染表单
  const formConfig = {
    add: {
      formItemSpan: 12, // 表单项栅格数
      readonly: false, // 表单项是否禁用
    },
    edit: {
      formItemSpan: 12,
      readonly: false,
    },
    readonly: {
      formItemSpan: 8,
      readonly: true,
    },
  };

  // 根据 链接类型字段 渲染不同的表单字段
  const mapFieldsByConType = {
    '1000': () => (
      // HTTP
      <Fragment>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="http请求路径">
            {getFieldDecorator('httpUrl', {
              rules: [{ required: true, whitespace: true, message: '请输入http请求路径' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={
                  formConfig[isShowDetailForm].readonly ? undefined : '请输入http请求路径'
                }
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="提供者">
            {getFieldDecorator('interfaceProvider')(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入提供者'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="http请求用户">
            {getFieldDecorator('httpUser')(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={
                  formConfig[isShowDetailForm].readonly ? undefined : '请输入http请求用户'
                }
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="http请求密钥">
            {getFieldDecorator('httpPassword')(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={
                  formConfig[isShowDetailForm].readonly ? undefined : '请输入http请求密钥'
                }
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="接收者">
            {getFieldDecorator('interfaceReceiver')(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入接收者'}
              />,
            )}
          </Form.Item>
        </Col>
      </Fragment>
    ),
    '2000': () => (
      // FTP
      <Fragment>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="FTP地址">
            {getFieldDecorator('ftpUrl', {
              rules: [{ required: true, whitespace: true, message: '请输入FTP地址' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入FTP地址'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="FTP接口">
            {getFieldDecorator('ftpInterface', {
              rules: [{ required: true, whitespace: true, message: '请输入FTP接口' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入FTP接口'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="FTP用户">
            {getFieldDecorator('ftpUser', {
              rules: [{ required: true, whitespace: true, message: '请输入FTP用户' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入FTP用户'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="FTP密码">
            {getFieldDecorator('ftpPassword', {
              rules: [{ required: true, whitespace: true, message: '请输入FTP密码' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入FTP密码'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="文件名称">
            {getFieldDecorator('fileName', {
              rules: [{ required: true, whitespace: true, message: '请输入文件名称' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入文件名称'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="文件名匹配">
            {getFieldDecorator('fileMatch', {
              rules: [{ required: true, whitespace: true, message: '请输入文件名匹配' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入文件名匹配'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="文件处理名称">
            {getFieldDecorator('fileDeal', {
              rules: [{ required: true, whitespace: true, message: '请输入文件处理名称' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={
                  formConfig[isShowDetailForm].readonly ? undefined : '请输入文件处理名称'
                }
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="来源路径">
            {getFieldDecorator('srcUrl', {
              rules: [{ required: true, whitespace: true, message: '请输入来源路径' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入来源路径'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="备份路径">
            {getFieldDecorator('backupUrl', {
              rules: [{ required: true, whitespace: true, message: '请输入备份路径' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入备份路径'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="错误路径">
            {getFieldDecorator('errUrl', {
              rules: [{ required: true, whitespace: true, message: '请输入错误路径' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入错误路径'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="行开始">
            {getFieldDecorator('rowStart', {
              rules: [{ required: true, whitespace: true, message: '请输入行开始' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入行开始'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="行结束">
            {getFieldDecorator('rowEnd', {
              rules: [{ required: true, whitespace: true, message: '请输入行结束' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入行结束'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="行开头">
            {getFieldDecorator('rowheader', {
              rules: [{ required: true, whitespace: true, message: '请输入行开头' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入行开头'}
              />,
            )}
          </Form.Item>
        </Col>
      </Fragment>
    ),
    '3000': () => (
      // DB
      <Fragment>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="事件名">
            {getFieldDecorator('eventName', {
              rules: [{ required: true, whitespace: true, message: '请选择事件名' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请选择事件名'}
              />,
            )}
          </Form.Item>
        </Col>
      </Fragment>
    ),
    '5000': () => (
      // SOCKET
      <Fragment>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="socket 端口">
            {getFieldDecorator('socketPort', {
              rules: [{ required: true, whitespace: true, message: '请输入 socket 端口' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={
                  formConfig[isShowDetailForm].readonly ? undefined : '请输入 socket 端口'
                }
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="socket 地址">
            {getFieldDecorator('socketAddress', {
              rules: [{ required: true, whitespace: true, message: '请输入 socket 地址' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={
                  formConfig[isShowDetailForm].readonly ? undefined : '请输入 socket 地址'
                }
              />,
            )}
          </Form.Item>
        </Col>
      </Fragment>
    ),
    '6000': () => (
      // 中间对象
      <Fragment>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="Database表名">
            {getFieldDecorator('databaseTableName', {
              rules: [{ required: true, whitespace: true, message: '请输入 Database 表名' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={
                  formConfig[isShowDetailForm].readonly ? undefined : '请输入 Database 表名'
                }
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="Database表简称">
            {getFieldDecorator('databaseTableSimple', {
              rules: [{ required: true, whitespace: true, message: '请输入 Database 表简称' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={
                  formConfig[isShowDetailForm].readonly ? undefined : '请输入 Database 表简称'
                }
              />,
            )}
          </Form.Item>
        </Col>
      </Fragment>
    ),
  };

  // 当前选中的目录树名
  const [selectedCatague, setSelectedCatague] = useState();
  // 目录树下拉框 DOM
  const [catagueSelectDOM, setCatagueSelectDOM] = useState();

  // 处理详情表单的显示类型(新建add / 编辑edit / 查看readonly )
  function showDetailForm(type = 'readonly', item = {}) {
    dispatch({
      type: 'eventSrcComm/showDetailForm',
      payload: {
        type,
        item,
      },
    });
  }

  // 保存表单接口（新增、编辑）
  function saveEventDetailsEffect(params) {
    const defaultParams = {
      userId: 100, // 写死
      statusCd: '1200', // 状态, 新增时默认待生效
      createTime: moment().format('YYYY-MM-DD hh:mm:ss'),
      isHead: '',
    };

    return dispatch({
      type: 'eventSrcComm/saveEventDetailsEffect',
      payload: { ...defaultParams, ...params },
      method: isShowDetailForm,
    });
  }

  // 强制重新获取列表数据
  function forceGetEventsList() {
    dispatch({
      type: 'eventSrc/forceGetEventsList',
    });
  }

  // 处理表单提交
  function handleSumbit() {
    // 表单校验
    validateFields(async (err, val) => {
      if (!err) {
        const newVal = val;
        if (isShowDetailForm === 'add') {
          delete newVal.code;
        }
        if (isShowDetailForm === 'edit') {
          newVal.id = id;
        }
        await saveEventDetailsEffect(newVal);
        forceGetEventsList();
      }
    });
  }

  // 使目录树选择器失去焦点
  function blurSelectCatague() {
    catagueSelectDOM.blur();
  }

  // 保存目录字段目录树选中值
  function saveSelectedCatague(catalogueInfo) {
    // 将选择框的值改变为 selectedCatague.name
    setSelectedCatague(catalogueInfo.name);

    // 设置表单值
    setFieldsValue({
      catalogId: catalogueInfo.id,
    });

    // 使目录树选择器失去焦点
    blurSelectCatague();
  }

  // 校验名称是否已经存在
  async function asyncValidateName(_, val, callback) {
    const result = await dispatch({
      type: 'eventSrcComm/validateNameEffect',
      payload: {
        name: val,
      },
    });
    if (result && result.topCont && result.topCont.resultCode == 0) {
      if (result.svcCont && result.svcCont.data == 0) {
        callback();
      } else if (result.svcCont && result.svcCont.data == 1) {
        callback('名称已存在');
      }
    } else {
      callback('未知错误');
    }
  }

  // 获取数字字典
  useEffect(() => {
    if (!CON_TYPE) {
      getAttrValueByCode(dispatch, 'event', 'CON_TYPE');
    }
  }, []);

  // 设置表单数据
  useEffect(() => {
    if (inputType) {
      setSelectedCatague(fieldsDetail.catalogName); // 设置目录树名

      setFieldsValue(
        {
          inputType, // 先设置链接类型，让其渲染出对应的其他字段
        },
        () => {
          const fiedlsVal = {}; // 用来保存所有字段键值
          const allFields = Object.keys(getFieldsValue()); // 获取所有字段键
          allFields.forEach(item => {
            fiedlsVal[item] = fieldsDetail[item];
          });
          setFieldsValue(fiedlsVal);
        },
      );
    }
  }, []);

  return (
    <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} className={style.detailForm}>
      <Row gutter={24}>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item hasFeedback={validateNameLoading} label="名称">
            {getFieldDecorator('name', {
              validateTrigger: ['onBlur'],
              validateFirst: true,
              rules: [
                { required: true, whitespace: true, message: '请输入名称' },
                {
                  validator: getFieldValue('name') != fieldsDetail.name ? asyncValidateName : null,
                },
              ],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入名称'}
              />,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="代码">
            {getFieldDecorator('code')(<Input size="small" disabled placeholder="后台自动生成" />)}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="链接类型">
            {getFieldDecorator('inputType', {
              rules: [{ required: true, whitespace: true, message: '请选择链接类型' }],
              initialValue: '1000',
            })(
              <Select
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请选择链接类型'}
              >
                {Array.isArray(CON_TYPE) &&
                  CON_TYPE.map(item => (
                    <Option key={item.attrValueCode} value={item.attrValueCode}>
                      {item.attrValueName}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="目录">
            {getFieldDecorator('catalogId', {
              rules: [{ required: true, message: '请选择目录' }],
            })(
              <div
                onMouseDown={e => {
                  e.preventDefault();
                  return false;
                }} // 阻止点击下拉框默认关闭下拉框事件
              >
                <Select
                  disabled={formConfig[isShowDetailForm].readonly}
                  ref={e => setCatagueSelectDOM(e)}
                  value={selectedCatague}
                  size="small"
                  placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请选择目录'}
                  dropdownRender={() => (
                    <Fragment>
                      <Catalogue saveSelectedCatague={saveSelectedCatague} />
                    </Fragment>
                  )}
                />
              </div>,
            )}
          </Form.Item>
        </Col>
        <Col span={formConfig[isShowDetailForm].formItemSpan}>
          <Form.Item label="来源频道">
            {getFieldDecorator('sourceChannal', {
              rules: [{ required: true, whitespace: true, message: '请输入来源频道' }],
            })(
              <Input
                disabled={formConfig[isShowDetailForm].readonly}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入来源频道'}
              />,
            )}
          </Form.Item>
        </Col>
        {/* 动态渲染表单字段 */}
        {mapFieldsByConType[getFieldValue('inputType')]()}
        {/* 动态渲染表单字段 */}
        <Col span={24}>
          <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="描述">
            {getFieldDecorator('description', {
              rules: [{ max: 150, message: '内容请控制在150个字符以内' }],
            })(
              <Input.TextArea
                maxLength={151}
                disabled={formConfig[isShowDetailForm].readonly}
                autosize={{ minRows: 2, maxRows: 6 }}
                size="small"
                placeholder={formConfig[isShowDetailForm].readonly ? undefined : '请输入描述'}
              />,
            )}
          </Form.Item>
        </Col>
        {isShowDetailForm !== 'readonly' && (
          <Col span={24}>
            <div className={style.formButtonContainer}>
              <Button loading={submitLoading} size="small" type="primary" onClick={handleSumbit}>
                保存
              </Button>
              &nbsp;&nbsp;
              <Button
                size="small"
                onClick={() => {
                  showDetailForm('readonly');
                }}
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

export default Form.create()(connect(mapStateToProps)(DetailForm));

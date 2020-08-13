import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Select, List } from 'antd';
import style from '../index.less';

const { Option } = Select;

const mapStateToProps = ({ srcConfigDetail, eventSrcComm, loading }) => ({
  centerObjEditable: srcConfigDetail.centerObjEditable,
  eventItem: eventSrcComm.itemDetail,
  centerObjectInfo: srcConfigDetail.centerObjectInfo,
  centerObjList: srcConfigDetail.centerObjList,
  timeInputNodePageInfo: srcConfigDetail.timeInputNodePageInfo,
  timeInputNodeList: srcConfigDetail.timeInputNodeList,
  insertLoading: loading.effects['srcConfigDetail/insertCenterObj'],
  updateLoading: loading.effects['srcConfigDetail/updateCenterObj'],
});

function CenterObject(props) {
  const {
    form,
    centerObjEditable,
    eventItem,
    centerObjList,
    timeInputNodePageInfo = {},
    timeInputNodeList,
    centerObjectInfo = [],
    insertLoading,
    updateLoading,
    dispatch,
  } = props;
  const [centerObjectTabs = {}] = centerObjectInfo;
  const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue } = form;
  const { pageNum, pageSize, total } = timeInputNodePageInfo;

  // 中心对象节点下拉框列表值
  const [objNodeList, setObjNodeList] = useState([]);
  // 时间输入节点下拉框 DOM 元素
  const [timeInputSelectDom, setTimeInputSelectDom] = useState();

  // 处理事件中心可编辑性
  function handleEditable(bool) {
    dispatch({
      type: 'srcConfigDetail/hanleCenterObjEditable',
      payload: bool,
    });
  }

  // 中心对象查询
  function getCenterObject(inputId) {
    return dispatch({
      type: 'srcConfigDetail/getCenterObject',
      payload: {
        inputId,
      },
    });
  }

  // 获取中心对象下拉框选项值
  function getCenterObjList(params) {
    const defaultParams = {
      inputType: '6000',
      statusCd: '1000',
    };

    dispatch({
      type: 'srcConfigDetail/getCenterObjList',
      payload: { ...defaultParams, ...params },
    });
  }

  // 改变中心节点下拉框列表
  function changeObjNodeList(list) {
    setObjNodeList(list);
  }

  // 获取当前被选择的 中心对象 下拉框值
  function getSelectedCenterObj(val) {
    // 把中心对象节点值清除掉
    setFieldsValue({
      evtCenterObject: undefined,
    });

    const currentItem = centerObjList.filter(item => {
      return item.inputSource.id == val;
    });
    // 改变中心节点下拉框列表
    changeObjNodeList((currentItem[0] && currentItem[0].inputAttrList) || []);
  }

  // 获取时间输入节点列表(即输入属性)
  function getTimeInputNodeList(params) {
    const defaultParams = {
      inputId: eventItem.id,
      pageInfo: {
        pageNum,
        pageSize,
      },
    };

    dispatch({
      type: 'srcConfigDetail/getTimeInputNodeList',
      payload: { ...defaultParams, ...params },
    });
  }

  // 选中事件输入节点
  function selectedTimeInputNode(item) {
    // 设置值
    setFieldsValue({
      inputAttrId: item.id, // 用于请求发送给服务器
      inputAttrCode: item.code,
    });

    // 让下拉框失焦
    timeInputSelectDom.blur();
  }

  // 提交表单
  async function handleSumbit() {
    const { centerInputId, evtCenterObject, inputAttrCode, inputAttrId } = getFieldsValue();

    const defaultParams = {
      centerInputId, // 中心对象
      evtCenterObjectId: evtCenterObject && JSON.parse(evtCenterObject).id, // 中心对象节点
      objectCode: evtCenterObject && JSON.parse(evtCenterObject).code, // 中心对象节点
      inputAttrCode, // 时间输入节点
      inputAttrId, // 时间输入节点
      inputId: eventItem.id, // 事件源
      id: centerObjectTabs.id || '', // 如果 centerObjectTabs，本身没有值，表示插入，id 为 '',否则修改对应 ID 的数据
    };

    if (centerObjectInfo.length === 0) {
      // 如果中心对象 tab 本身没有值，则插入
      await dispatch({
        type: 'srcConfigDetail/insertCenterObj',
        payload: defaultParams,
      });
      getCenterObject(eventItem.id);
    } else {
      // 否则修改
      await dispatch({
        type: 'srcConfigDetail/updateCenterObj',
        payload: defaultParams,
      });
      getCenterObject(eventItem.id);
    }
  }

  // 中心对象查询
  useEffect(() => {
    getCenterObject(eventItem.id);
  }, []);

  // 设置表单值
  useEffect(() => {
    const {
      centerInputId,
      inputAttrCode,
      inputAttrId,
      evtCenterObjectId,
      objectCode,
    } = centerObjectTabs;
    if (centerInputId || inputAttrId) {
      // 中心对象或者时间节点有一个存在，表示表单有初始值，设置它
      setFieldsValue(
        {
          centerInputId: centerInputId || undefined,
          inputAttrCode: inputAttrCode || undefined,
          inputAttrId: inputAttrId || undefined,
        },
        () => {
          if (centerObjList.length > 0 && evtCenterObjectId) {
            getSelectedCenterObj(getFieldValue('centerInputId'));
            setFieldsValue({
              evtCenterObject: JSON.stringify({ id: evtCenterObjectId, code: objectCode }),
            });
          }
        },
      );
    }
  }, [centerObjectTabs, centerObjList]);

  // 获取中心对象下拉框选项值
  useEffect(() => {
    getCenterObjList();
  }, []);

  // 获取时间节点列表值
  useEffect(() => {
    getTimeInputNodeList();
  }, [pageNum, pageSize]);

  return (
    <div className={style.centerObject}>
      <div className={style.inputSearch}>
        <Button
          size="small"
          type="primary"
          onClick={() => {
            handleEditable(true);
          }}
        >
          新增
        </Button>
        {/* &nbsp;&nbsp; */}
        {/* <Input.Search size="small" /> */}
      </div>
      <Form labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="中心对象">
              {getFieldDecorator('centerInputId', {})(
                <Select
                  disabled={!centerObjEditable}
                  allowClear
                  size="small"
                  placeholder="请选择中心对象"
                  onSelect={getSelectedCenterObj}
                >
                  {Array.isArray(centerObjList) &&
                    centerObjList.map(item => {
                      const { inputSource = {} } = item;
                      const { id, name } = inputSource;
                      return (
                        <Option key={id} value={id}>
                          {name}
                        </Option>
                      );
                    })}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="中心对象节点">
              {getFieldDecorator('evtCenterObject', {})(
                <Select
                  disabled={!centerObjEditable}
                  allowClear
                  size="small"
                  placeholder="请选择中心对象节点"
                >
                  {Array.isArray(objNodeList) &&
                    objNodeList.map(item => {
                      const { id, code } = item;
                      return (
                        <Option key={id} value={JSON.stringify({ id, code })}>
                          {code}
                        </Option>
                      );
                    })}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="时间输入节点">
              <div
                onMouseDown={e => {
                  e.preventDefault();
                  return false;
                }} // 阻止点击下拉框默认关闭下拉框事件
              >
                {getFieldDecorator('inputAttrId')}
                {getFieldDecorator('inputAttrCode', {})(
                  <Select
                    disabled={!centerObjEditable}
                    allowClear
                    ref={e => {
                      setTimeInputSelectDom(e);
                    }}
                    size="small"
                    placeholder="请选择时间输入节点"
                    dropdownRender={() => (
                      <Fragment>
                        <List
                          pagination={{
                            size: 'small',
                            pageSize: 100,
                            total,
                            style: { padding: '0 3px 8px' },
                          }}
                          size="small"
                          bordered={false}
                          split={false}
                          dataSource={timeInputNodeList}
                          renderItem={item => (
                            <List.Item
                              style={{ cursor: 'pointer', padding: '8px 16px' }}
                              onClick={() => {
                                selectedTimeInputNode(item);
                              }}
                            >
                              {item.code}
                            </List.Item>
                          )}
                        />
                      </Fragment>
                    )}
                  />,
                )}
              </div>
            </Form.Item>
          </Col>
          {centerObjEditable && (
            <Col span={24}>
              <div className={style.formButtonContainer}>
                <Button
                  loading={insertLoading || updateLoading}
                  size="small"
                  type="primary"
                  onClick={handleSumbit}
                >
                  保存
                </Button>
                &nbsp;&nbsp;
                <Button
                  size="small"
                  onClick={() => {
                    handleEditable(false);
                  }}
                >
                  取消
                </Button>
              </div>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
}

export default Form.create()(connect(mapStateToProps)(CenterObject));

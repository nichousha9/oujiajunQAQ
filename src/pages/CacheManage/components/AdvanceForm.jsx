import React from 'react';
import { Form, Select, Button, Col, Row } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import classnames from 'classnames';
import styles from '../index.less';

const { Option } = Select;

@connect(({ cacheManage }) => ({
  pageInfo: cacheManage.pageInfo,
}))
class AdvanceForm extends React.Component {
  constructor(props) {
    super(props);

    this.attrSpecTypeList = [
      {
        attrValueCode: '1000',
        attrValueName: formatMessage({ id: 'cacheManage.staticData' }, '静态数据'),
      },
      //   , {
      //   attrValueCode: '2000',
      //   attrValueName: formatMessage({ id: 'cacheManage.tempData' }, '临时数据'),
      // }, {
      //  attrValueCode:'3000',
      //  attrValueName: formatMessage({ id: 'cacheManage.dynamicData' }, '动态数据'),
      //   }
    ];
  }

  // handleSearch = async () => {
  //   const { form, dispatch, pageInfo, qryCacheList } = this.props;
  //   await dispatch({
  //     type: 'cacheManage/getCachePageInfo',
  //     payload: { ...pageInfo, pageNum: 1 },
  //   });

  //   const fieldValues = form.getFieldsValue();
  //   await qryCacheList(fieldValues);
  // }

  flushCache = async () => {
    const { form, dispatch, qryCacheList, pageInfo } = this.props;
    const fieldValues = form.getFieldsValue();
    await dispatch({
      type: 'cacheManage/qryAttrSpecAllInCache',
      payload: fieldValues,
      callback: async () => {
        await dispatch({
          type: 'cacheManage/getCachePageInfo',
          payload: { ...pageInfo, pageNum: 1 },
        });

        await qryCacheList(fieldValues);
      },
    });
  };

  render() {
    const { form, resetForm, handleSearch } = this.props;
    const { getFieldDecorator } = form;

    const colLayout = {
      md: {
        span: 8,
      },
      sm: {
        span: 24,
      },
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <>
        <Row gutter={16} className="row-bottom-line">
          <Col {...colLayout}>
            <Form.Item
              {...formItemLayout}
              label={formatMessage({ id: 'cacheManage.cacheType' }, '缓存类型')}
            >
              {getFieldDecorator('attrSpecType', {
                initialValue: '1000',
              })(
                <Select>
                  {this.attrSpecTypeList.map(type => (
                    <Option key={type.attrValueCode}>{type.attrValueName}</Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          {/* <Col {...colLayout}>
            <Form.Item label={formatMessage({ id: 'cacheManage.cacheKey' }, '缓存KEY')}>
              {getFieldDecorator('attrSpecCode')(
                <Input 
                  size="small"
                  placeholder={formatMessage(
                    {
                      id: 'cacheManage.cacheKeyPlaceholder',
                    },
                    '请输入编码',
                  )}
                />
              )}
            </Form.Item>
          </Col> */}
          <Col className={styles.btnGroup}>
            <Button
              className={styles.btn}
              size="small"
              onClick={() => {
                resetForm();
              }}
            >
              {formatMessage(
                {
                  id: 'common.btn.reset',
                },
                '重置',
              )}
            </Button>
            <Button
              className={classnames([styles.btn, styles.flushBtn])}
              size="small"
              onClick={this.flushCache}
            >
              {formatMessage(
                {
                  id: 'cacheManage.flushCache',
                },
                '刷新缓存',
              )}
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                handleSearch();
              }}
            >
              {formatMessage(
                {
                  id: 'common.btn.search',
                },
                '搜索',
              )}
            </Button>
          </Col>
        </Row>
        {/* <Row gutter={16} className="row-bottom-line">
         
        </Row> */}
      </>
    );
  }
}

export default AdvanceForm;

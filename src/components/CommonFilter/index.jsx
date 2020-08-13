/* 列表搜索组件
参数：
handleSubmit, 搜索函数
handleReset, 重置函数
gutter = { xs: 8, sm: 16, md: 24}, 网格间隔
span = 6, 网格宽度
children = [], 子元素
formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}, 
responsive, 是否自适应
className = '', 表单类名 */
import React from 'react';
import { Row, Col, Button, Form } from 'antd';
import classnames from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

class CommonFilter extends React.PureComponent {

  render() {
    const {
      handleSubmit,
      handleReset,
      gutter = { xs: 8, sm: 16, md: 24},
      span = 6,
      children = [],
      formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      responsive = true,
      className = '',
    } = this.props;
    let childrenTemp = [];
    if (children instanceof Array) {
      childrenTemp = childrenTemp.concat(children);
    } else {
      childrenTemp.push(children);
    }

    const column = 24 / span;
    let childrenSpanSum = 0;

    const childrenDom = childrenTemp.map((node, index) => {
      let nodeSpan = node.props.span;
      if (!nodeSpan || Number.isNaN(nodeSpan)) {
        nodeSpan = span;
      }
      childrenSpanSum += nodeSpan;
      let nodeSpanObj = {};
      if (responsive) {
        nodeSpanObj = {
          lg: nodeSpan,
          md: 12,
          sm: 24,
        };
      } else {
        nodeSpanObj = {
          span: nodeSpan,
        };
      }

      return (
        <Col
          {...nodeSpanObj}
          key={index}
          className='row-bottom-line'
        >
          {node}
        </Col>
      );
    });
    
    let btnSpan = span * (column - (childrenTemp.length % column)); // 如果每列都一样长
    // 如果有某个比较长
    if(childrenSpanSum > childrenTemp.length * span) {
      btnSpan = span * (column - (childrenSpanSum / span) % column);
    }
    let btnSpanObj = {};
    if(responsive) {
      btnSpanObj = {
        lg: btnSpan,
        md: 12,
        sm: 24,
      };
    } else {
      btnSpanObj = {
        span: btnSpan
      }
    }

    return (
      <div className='show-advanced-div'>
        <Form
          {...formItemLayout}
          className={classnames('formStyle', className)}
        >
          <Row
            gutter={gutter}
          >
            {childrenDom}
            <Col
              {...btnSpanObj}
              className='row-bottom-line'
            >
              <Form.Item wrapperCol={{ span: 24 }} className={styles.btnItem}>
                <Button
                  type='primary'
                  onClick={handleSubmit}
                  size='small'
                >
                  {formatMessage({
                    id: 'common.btn.toSearch',
                  })}
                </Button>
                <Button
                  size='small'
                  onClick={handleReset}
                >
                  {formatMessage({
                    id: 'common.btn.reset',
                  })}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default CommonFilter;

import React from 'react';
import { Row, Col, Button, Form, Icon } from 'antd';
import classnames from "classnames";
import Style from './index.less';

const FormItem = Form.Item;
class CommonFilter extends React.Component {
  state = {
    expanded: false,
  };

  onExpand = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }));
  };
  showOneLineBut = (childrenTemp) =>{
    const { expanded } = this.state;
    const len = childrenTemp.length;
    if(len<3) return false;
    if(len %3 === 0) return true;
    if(!expanded && len >3) return true;
    if(expanded && len % 3 !==0 ) return false;
  }
  render() {
    const { handleSubmit, handleReset, gutter = 10, span = 8, noExpandFlag, children = [] } = this.props;
    const { expanded } = this.state;
    let childrenTemp = [];
    if (children instanceof Array) {
      childrenTemp = childrenTemp.concat(children);
    } else {
      childrenTemp.push(children);
    }
    const buttonGroup = (
      <div className="floatRight">
        <Button type="primary" onClick={handleSubmit}>
          查询
        </Button>
        <Button className="margin-left-10" onClick={handleReset}>
          重置
        </Button>
        {childrenTemp.length>3 && (
          <a className={classnames('filter-expand','margin-left-10', Style['filter-expand'])} onClick={this.onExpand}>
            <span>{expanded ? '收起' : '展开'}</span>
            {expanded ? <Icon type="up" /> : <Icon type="down" />}
          </a>
        )}
      </div>
    )
    let buttonNew = '';
    const newChildren = childrenTemp.map((node, index) => {
      let nodeSpan = node.props.span;
      if (isNaN(nodeSpan)) {
        nodeSpan = span;
      }
      // 只获取一次Button
      if(index===0){
        buttonNew = (
          <Col span={nodeSpan} style={{ marginRight: '0' }} className={classnames(Style['filter-col'],'floatRight')}>
            {buttonGroup}
          </Col>
        )
      }
      return (
        <Col span={nodeSpan} key={index} style={{ marginRight: '0' }} className={Style['filter-col']}>
          {node}
        </Col>
      );
    });
    const isLineBtn = this.showOneLineBut(childrenTemp);
    return (
      <Form>
        <Row gutter={gutter} className={classnames(Style['filter-row'], { [Style.unExpanded]: !expanded })}>
          <Col className={Style['filter-content']} span="24">
            {newChildren}
            {!isLineBtn && buttonNew}
            <div style={{ clear: 'both' }} />
          </Col>
        </Row>
        {!!isLineBtn && (
          <Row>
            <Col className={Style['filter-btn-search']} span="24">
              <FormItem>
                {buttonGroup}
              </FormItem>
            </Col>
          </Row>
        )}
      </Form>
    );
  }
}

export default CommonFilter;

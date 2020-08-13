/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
import shortId from 'shortid';
import React from 'react';
import { Row, Col, Button } from 'antd';
import styles from './index.less';

export default class SplitSentenceToWord extends React.Component {
  state = {
    values: this.getValues(),
    start: this.props.start ? this.props.start : 0,
    end: this.props.end ? this.props.end : 0,
    // disableValues: SplitSentenceToWord.getDisableValues(this.props.otherSelectWords),
  };

  componentWillReceiveProps(nextProps) {
    const values = this.getValues(nextProps);
    const start = nextProps.start ? nextProps.start : 0;
    const end = nextProps.end ? nextProps.end : 0;
    this.setState({ values, start, end });
  }

  onChange(item) {
    const { values } = this.state;
    let { start, end } = this.state;
    // 设置开始 结束 标志
    if (item.value === '') {
      return;
    }
    const i = item.index;
    if (i < start) {
      start = i;
    } else if (i >= end) {
      if (start === end) {
        start = i;
      }
      end = i + 1;
    } else {
      end = i;
    }

    if (start === end) {
      start = 0;
      end = 0;
    }

    // // 选中状态
    // const flag = values[item.index].isSelected;
    // // 已选中
    // if (flag) {
    //   // 设置结束点为选中的位置
    //   end = item.index;
    //   if (start >= end) {
    //     start = 0;
    //     end = 0;
    //   }
    // } else {
    //   // 选中的位置大于选中结束点
    //   if(item.index>end){
    //     end=item.index+1;
    //   }else{
    //     // 选中的位置小于选中开始点
    //     start = item.index;
    //   }
    //   if (end <= start) {
    //     end = start + 1;
    //   }
    // }
    // 设置选中状态
    _.forEach(values, (o) => {
      o.isSelected = o.index >= start && o.index < end;
    });
    this.setState({ start, end, values });
    // 保存更改
    this.saveChange({ start, end, values });
  }

  getValues(props) {
    if (!props) {
      props = this.props;
    }
    const { sentence, start, end } = props;
    let times = parseInt(sentence.length / 12, 10);
    times = sentence.length % 12 > 0 || sentence.length === 0 ? times + 1 : times;
    const values = new Array(times * 12);
    const content = sentence.split('');
    for (let i = 0; i < times * 12; i += 1) {
      const value = i < content.length ? content[i] : '';
      values[i] = {
        key: shortId.generate(),
        value,
        index: i,
        isSelected: i >= start && i < end,
      };
    }
    return values;
  }

  static getDisableValues(values) {
    if (!values || values.length === 0) {
      return [];
    }

    const str = values.reduce((x, y) => {
      return x + y;
    });
    return str.split('');
  }

  saveChange(obj) {
    const { start, end } = obj;
    if (this.props.onChange) {
      this.props.onChange('start', start);
      this.props.onChange('end', end);
    }
  }

  render() {
    const { values } = this.state;
    return (
      <Row gutter={8}>
        {values.map((item) => {
          return (
            <Col span={2} key={item.key}>
              <Button
                onClick={() => this.onChange(item)}
                className={styles.button}
                type={item.value === '' ? 'dashed' : item.isSelected ? 'primary' : ''}
              >
                {item.value}
              </Button>
            </Col>
          );
        })}
      </Row>
    );
  }
}

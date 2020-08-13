import shortId from 'shortid';
import React from 'react';
import {Row, Col, Button} from 'antd';
import styles from './index.less';

export default class SplitSentenceToWord extends React.Component {
  state = {
    values: SplitSentenceToWord.getValues(this.props.sentence, this.props.selectwords),
    disableValues: SplitSentenceToWord.getDisableValues(this.props.otherSelectWords),
  };

  componentWillReceiveProps(nextProps) {
    const values = SplitSentenceToWord.getValues(nextProps.sentence, nextProps.selectwords);
    const disableValues = SplitSentenceToWord.getDisableValues(nextProps.otherSelectWords);
    this.setState({values, disableValues});

  };

  onChange(item) {
    const {values, disableValues} = this.state;
    if (item.value === ''||disableValues.indexOf(item.value) > -1) {
      return;
    }
    const filterObj = values.filter(o => o.key === item.key)[0];
    filterObj.isSelected = !filterObj.isSelected;
    this.setState({values});
    this.saveChange();
  };

  static getValues(sentence = '', selectWords = '') {
    let times = parseInt(sentence.length / 12, 10);
    times = sentence.length % 12 > 0 || sentence.length === 0 ? times + 1 : times;
    const values = new Array(times * 12);
    const content = sentence.split('');
    const select = selectWords.split('');
    for (let i = 0; i < times * 12; i += 1) {
      const value = i < content.length ? content[i] : '';
      values[i] = {
        key: shortId.generate(),
        value,
        isSelected: select.indexOf(value) > -1,
      }
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

  saveChange() {
    if (this.props.onChange) {
      const {values} = this.state;
      const selectWords = values.filter(o => o.isSelected).map(o => o.value).join('');
      this.props.onChange('text', selectWords)
    }
  }

  render() {
    const {values, disableValues} = this.state;
    return (
      <Row gutter={8}>
        {
          values.map((item) => {
            return (
              <Col span={2} key={item.key}>
                <Button
                  onClick={() => this.onChange(item)}
                  className={styles.button}
                  type={item.value === '' || disableValues.indexOf(item.value) > -1 ? 'dashed' : item.isSelected ? 'primary' : ''}
                >
                  {item.value}
                </Button>
              </Col>
            )
          })
        }
      </Row>
    );
  }
}

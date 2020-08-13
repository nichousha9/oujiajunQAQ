import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Icon } from 'antd';
import { connect } from 'dva';
import styles from '../index.less';

@connect(() => ({}))
class CommodityType extends PureComponent {
  state = {
    stateType: [
      // 状态编码
      // ------------------------- 暂时先展示 TRT ----------------
      // {
      //   attrValueName: 'Package',
      //   attrValueCode: 'P',
      // },
      {
        attrValueName: 'Product',
        attrValueCode: '2',
      },
      // ---------------------- 暂时先展示 TRT ----------------
      // {
      //   attrValueName: 'TRT',
      //   attrValueCode: 'T',
      // },
    ],
    // chooseType: 0, // 选择的商品类型
  };

  componentWillMount() {}

  render() {
    const { stateType } = this.state;
    const { handleClick, chooseType, chooseTypeFlag } = this.props;
    function TypeCard(props) {
      const { offerTypeName, offerType } = props.value;
      let cardStyle = '';
      cardStyle = chooseType === offerType ? { border: '1px solid #1890FF' } : {};

      return (
        // eslint-disable-next-line react/style-prop-object
        <div className={styles.typeCardStyle} style={cardStyle}>
          <Row>
            <Col span={8} key={offerTypeName.concat('1')}>
              <div className={styles.leftImg} />
            </Col>
            <Col span={14} key={offerTypeName.concat('2')}>
              <div className={styles.rightType}>{offerTypeName}</div>
            </Col>
            {chooseType === offerType ? (
              <Col span={2} key={offerTypeName.concat('3')}>
                <Icon type="check-circle" theme="filled" style={{ color: '#36C626' }} />
              </Col>
            ) : (
              ''
            )}
          </Row>
        </div>
      );
    }
    return (
      <Fragment>
        <Row gutter={32}>
          {stateType.map(item => {
            return (
              <Col
                key={item.attrValueCode}
                span={6}
                onClick={() => {
                  if (chooseTypeFlag) {
                    handleClick({
                      offerType: item.attrValueCode,
                      offerTypeName: item.attrValueName,
                    });
                  }
                }}
                style={{ marginBottom: '20px' }}
              >
                <TypeCard
                  key={item.attrValueCode}
                  value={{ offerTypeName: item.attrValueName, offerType: item.attrValueCode }}
                />
              </Col>
            );
          })}
        </Row>
      </Fragment>
    );
  }
}
export default CommodityType;

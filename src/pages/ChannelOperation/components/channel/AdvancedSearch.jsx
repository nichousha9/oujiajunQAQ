import React, { Fragment } from 'react';
import { Input, Row, Col } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import style from '../../index.less';

function AdvancedFilterInput(props) {
  const { changeSearchInputOfCode, searchInputOfCode } = props;

  return (
    <Fragment>
      <div className={style.advanceFilterInputContainer}>
        <Row>
          <Col span={3} className={style.labelCol}>
            <span>
              {formatMessage(
                {
                  id: 'channelOperation.channel.channelCode',
                },
                '渠道编码',
              )}
              <span>：</span>
            </span>
          </Col>
          <Col span={5}>
            <Input
              value={searchInputOfCode}
              size="small"
              onChange={e => {
                changeSearchInputOfCode(e.target.value);
              }}
            />
          </Col>
        </Row>
      </div>
    </Fragment>
  );
}

export default AdvancedFilterInput;

import React from 'react';
import { Tag, Col, Row } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const SelectedTagArea = props => {
  const { handleTagClose, list, color, label, name, className, style } = props;

  const onClose = item => {
    handleTagClose(item);
  };

  return (
    <Row className={classNames([styles.tagArea, className])} style={style}>
      <Col span={4} className={styles.tagTitle}>
        {label}:{' '}
      </Col>
      <Col span={20}>
        {list.map(item => (
          <Tag
            key={item.id}
            color={color || ''}
            onClick={() => onClose(item)}
            onClose={() => onClose(item)}
            className={styles.tag}
            closable
          >
            {item[name]}
          </Tag>
        ))}
      </Col>
    </Row>
  );
};

export default SelectedTagArea;

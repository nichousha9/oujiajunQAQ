import React from 'react';
import Iconfont from '@/components/Iconfont/index';
import styles from '../index.less';

function InfoBox(props) {
  const { icon, title, description, backgroundColor } = props;
  return (
    <div className={styles.infoBox}>
      <span
        className={styles.iconItem}
        style={{ backgroundColor }}
      >
        <Iconfont type={icon} className={styles.icon} />
      </span>
      <div className={styles.content}>
        <span className={styles.name}>{title}</span>
        <span className={styles.desc}>
          {description}
        </span>
      </div>
    </div>
  ); 
}

export default InfoBox;

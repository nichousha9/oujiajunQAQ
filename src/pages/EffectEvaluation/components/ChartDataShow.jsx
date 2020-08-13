/**
 * @backgroundColor 背景颜色
 * @type icon 图标
 * @name 名称
 * @value 值
 */
import React from 'react';
import { Icon } from 'antd';
import styles from '../index.less';

function ChartDataShow(props) {
  const { backgroundColor, type, name, value } = props;
  return (
    <div style={{ backgroundColor }} className={styles.chartIconContainer}>
      <Icon type={type} style={{ color: '#fff' }} className={styles.icon} />
      <div>
        <span>{name}</span>
        <span>{Number.isNaN(parseInt(value, 10)) ? 0 : value}</span>
      </div>
    </div>
  );
}
export default ChartDataShow;

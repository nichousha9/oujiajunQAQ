import React from 'react';
import { connect } from 'dva';
import Avatar from './AvatarDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';

const GlobalHeaderRight = props => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <SelectLang />
      <Avatar />
    </div>
  );
};

export default connect(({ global }) => ({
  theme: global.navTheme,
  layout: global.layout,
}))(GlobalHeaderRight);

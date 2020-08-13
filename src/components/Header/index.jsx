import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from '@/components/GlobalHeader/RightContent';
// import Iconfont from '@/components/Iconfont/index';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;

    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { collapsed, isMobile, logo } = this.props;
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" />
          </Link>
        )}
        {!isMobile && (
          <div className={styles.logo} id="logo">
            <Link to="/">
              <img src={logo} alt="logo" />
              <h1>{formatMessage({ id: 'app.title', defaultMessage: '商品推荐' })}</h1>
            </Link>
          </div>
        )}

        <RightContent {...this.props} />
      </div>
    );
  }
}

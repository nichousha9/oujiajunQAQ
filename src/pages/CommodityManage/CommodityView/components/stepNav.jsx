import React, { PureComponent } from 'react';
import { Card, Anchor } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '../index.less';

const { Link } = Anchor;

export default class StepNav extends PureComponent {
  state = {};

  render() {
    return (
      <Card title={formatMessage({ id: 'commodityManage.name.anchor' })}>
        <Anchor>
          <Link
            href="#commodityType"
            title={formatMessage({ id: 'commodityManage.name.offerType' })}
            className={styles.anchorLink}
          />
          <Link
            href="#basicInfo"
            title={formatMessage({ id: 'commodityManage.name.basicInfo' })}
            className={styles.anchorLink}
          />
          <Link
            href="#validityPeriod"
            title={formatMessage({ id: 'commodityManage.name.validityPeriod' })}
            className={styles.anchorLink}
          />
          <Link
            href="#package"
            title={formatMessage({ id: 'commodityManage.name.package' })}
            className={styles.anchorLink}
          />
        </Anchor>
      </Card>
    );
  }
}

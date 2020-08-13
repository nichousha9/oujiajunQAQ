import React from 'react';
import classnames from 'classnames';
import styles from './index.less';

/**
 * coverHeader 可以用该参数覆盖原来的头
 */
class CommonTableHeaderExtral extends React.Component {
  render() {
    const { listName,extralContent, pagination, coverHeader,noTotalPage } = this.props;
    return (
      <div className={classnames(styles.tableOperations,'border-bottom')}>
        {!noTotalPage &&(
          <div className={styles.pagination}>
            {coverHeader || <span>{listName ? `${listName} (${(pagination || {}).total || 0})`: `共${(pagination || {}).total || 0}条`}</span>}
          </div>
        )}

        {extralContent && <div className={styles.tableExtarContent}>{extralContent}</div>}
      </div>
    );
  }
}

export default CommonTableHeaderExtral;

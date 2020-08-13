import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input } from 'antd';
import style from '../../index.less';

function OperationSearch(props) {
  const { saveSearchInputCode, searchOperationBitListByChannelId, channelItem } = props;

  return (
    <div className={style.operationBitListCardExtra}>
      <Input
        className={style.searchInput}
        size="small"
        placeholder={formatMessage(
          {
            id: 'channelOperation.operation.operationCode',
          },
          '运营位编码',
        )}
        onChange={e => {
          saveSearchInputCode(e.target.value);
        }}
      />
      <Input.Search
        className={style.searchInput}
        size="small"
        placeholder={formatMessage(
          {
            id: 'channelOperation.operation.operationName',
          },
          '运营位名称',
        )}
        onSearch={val => {
          searchOperationBitListByChannelId({
            channelId: channelItem.channelId,
            operationName: val,
          });
        }}
      />
    </div>
  );
}

export default OperationSearch;

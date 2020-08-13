import React from 'react';
import { Input, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import style from '../../index.less';

function ChannelCardHeaderExtra(props) {
  const {
    pageSize,
    handleShowListItemForm,
    getChannelListData,
    changeSearchInputOfName,
    searchInputOfCode,
    changeSearchOfCode,
    searchInputOfName,
  } = props;

  return (
    <div className={style.channelCardHeaderExtra}>
      <Button
        size="small"
        onClick={() => {
          handleShowListItemForm('add');
        }}
        type="primary"
      >
        {formatMessage(
          {
            id: 'channelOperation.channel.addChannel',
          },
          '新增渠道',
        )}
      </Button>
      <Input.Search
        defaultValue={searchInputOfName}
        size="small"
        placeholder={formatMessage(
          {
            id: 'channelOperation.channel.channelName',
          },
          '渠道名称',
        )}
        maxLength={21}
        onSearch={value => {
          changeSearchInputOfName(value);
          changeSearchOfCode(searchInputOfCode);
          getChannelListData({
            channelName: String(value),
            channelCode: String(searchInputOfCode) || '',
            pageInfo: {
              pageNum: 1,
              pageSize,
            },
          });
        }}
      />
      {/* <a onClick={handleShowAdvanceFilterInput}>
        {formatMessage(
          {
            id: 'channelOperation.channel.advanceFilter',
          },
          '高级筛选',
        )}
        &nbsp;
        <Icon
          className={[style.arrowIcon, showAdvancedFilterInput ? style.arrowUp : ''].join(' ')}
          type="down"
        />
      </a> */}
    </div>
  );
}

export default ChannelCardHeaderExtra;

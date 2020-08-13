import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SearchTree from '@/components/SearchTree/index';

@connect(() => ({}))
class ActivityCatalogue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      returnData: [],
      defaultSelectedKeys: [],
    };
  }

  componentWillMount() {
    this.getTreeData({ setDefault: true });
  }

  componentDidMount() {}

  componentDidUpdate() {}

  getTreeData = options => {
    const { dispatch, getNodeInfo } = this.props;
    dispatch({
      type: 'campaignMonitor/getMccFolderList',
      payload: {
        fold: -1,
        objType: 2,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const newArr = this.dealData(res.svcCont.data);
        const defaultSelectedKey =
          newArr && newArr.length && newArr[0].key && newArr[0].key.toString();
        const pathCode = newArr && newArr.length && newArr[0].pathCode;
        if (options && options.setDefault) {
          this.setState({
            treeData: newArr,
            returnData: res.svcCont.data,
            defaultSelectedKeys: [defaultSelectedKey],
          });
          getNodeInfo(defaultSelectedKey, pathCode);
        } else {
          this.setState({
            treeData: newArr,
            returnData: res.svcCont.data,
          });
        }
      }
    });
  };

  dealData = data => {
    const len = data.length;
    const treeArr = data.map(item => ({
      title: item.name,
      key: item.fold,
      comments: item.comments,
      pathCodeLen: item.pathCode.split('.').length,
      parentKey: item.parentFold || '',
      children: [],
      used: false,
      curOperate: '',
      curItem: {},
      pathCode: item.pathCode,
    }));
    const newArr = [];
    const getChild = (node, index) => {
      // 拿到当前节点的子节点
      if (index === len - 1) {
        return;
      }
      for (let i = 0; i < len; i += 1) {
        // 如果当前节点的路径长度大于 node 且 parentKey = node.key 那么它就是 node 的子元素
        if (
          treeArr[i].pathCodeLen > node.pathCodeLen &&
          treeArr[i].parentKey === node.key &&
          !treeArr[i].used
        ) {
          node.children.push(treeArr[i]);
          treeArr[i].used = true;
          getChild(treeArr[i], i);
        }
      }
    };
    for (let i = 0; i < len; i += 1) {
      if (treeArr[i].pathCodeLen === 1) {
        newArr.push(treeArr[i]);
        treeArr[i].used = true;
        getChild(treeArr[i], i);
      }
    }
    return newArr;
  };

  getPathCode = key => {
    const { returnData } = this.state;
    let pathcode = '';
    returnData.forEach(item => {
      if (String(item.fold) === String(key)) {
        pathcode = `${pathcode}${item.pathCode}`;
      }
    });
    return pathcode;
  };

  onSelectCallBack = key => {
    const { getNodeInfo } = this.props;
    const pathCode = this.getPathCode(key);
    getNodeInfo(key, pathCode);
  };

  render() {
    const { treeData, defaultSelectedKeys } = this.state;
    const treeProps = {
      defaultSelectedKeys,
      treeData,
      onSelectCallBack: this.onSelectCallBack,
      hideSearch: true,
      showButtons: false,
    };
    return (
      <Card
        title={formatMessage({
          id: 'activityConfigManage.marketingActivityList.treeTitle',
        })}
        size="small"
        className="common-card"
      >
        {treeData && treeData.length > 0 && <SearchTree {...treeProps} />}
      </Card>
    );
  }
}

export default ActivityCatalogue;

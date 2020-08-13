import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
// import { formatMessage } from 'umi-plugin-react/locale';
import SearchTree from '@/components/SearchTree';

@connect(() => ({}))
class Catalogue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      returnData: [],
    };
  }

  componentWillMount() {
    this.getTreeData({ setDefault: false });
  }

  componentDidUpdate() {}

  getTreeData = options => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/getTreeList',
      payload: {
        // id: -1,
        statusCd: '1000',
        catalogType: '2',
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const newArr = this.dealData(res.svcCont.data);
        if (options && options.setDefault) {
          this.setState({
            treeData: newArr,
            returnData: res.svcCont.data,
          });
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
    const treeArr = data.map(item => ({
      title: item.name,
      key: item.id,
      comments: item.comments,
      pathCodeArr: item.pathCode.split('.'),
      parentKey: item.parentId || '',
      children: [],
      used: false,
      curOperate: '',
      curItem: {},
      pathCode: item.pathCode,
    }));

    // 过滤脏数据
    // treeArr = treeArr.filter((item) => {
    //   return !Number.isNaN(Number(item.pathCodeArr[0], 10)) &&
    //          item.key == item.pathCodeArr[item.pathCodeArr.length-1]
    // })
    const len = treeArr.length;
    const newArr = [];
    const getChild = node => {
      // 拿到当前节点的子节点

      // 递归出口,
      // if (index === len - 1) {
      //   return;
      // }

      for (let i = 0; i < len; i += 1) {
        // 遍历所有元素，找到其父节点key === 参数node节点key，这个就是node节点的子节点
        if (treeArr[i].parentKey === node.key && !treeArr[i].used) {
          node.children.push(treeArr[i]);
          treeArr[i].used = true;
          getChild(treeArr[i]);
        }
      }
    };
    for (let i = 0; i < len; i += 1) {
      if (treeArr[i].pathCodeArr.length === 2) {
        newArr.push(treeArr[i]);
        treeArr[i].used = true;
        getChild(treeArr[i]);
      }
    }
    return newArr;
  };

  getSelectedCatague = key => {
    const { returnData } = this.state;
    let name = '';
    returnData.forEach(item => {
      const { id, name: pName } = item;
      if (String(id) === String(key)) {
        name = pName;
      }
    });
    return {
      id: key,
      name,
    };
  };

  onSelectCallBack = key => {
    const { saveSelectedCatague } = this.props;
    const selectedCatague = this.getSelectedCatague(key);
    saveSelectedCatague(selectedCatague); // 保存选中的项，供表单使用
  };

  render() {
    const { treeData } = this.state;
    const treeProps = {
      treeData,
      add: false,
      edit: false,
      del: false,
      showButtons: false,
      hideSearch: true,
      onSelectCallBack: this.onSelectCallBack,
    };
    return (
      <Card title="事件目录" size="small" className="common-card">
        {treeData && treeData.length > 0 && <SearchTree {...treeProps} />}
      </Card>
    );
  }
}

export default Catalogue;

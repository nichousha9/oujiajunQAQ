import React from 'react';

import { Spin,Tree } from 'antd';
import { getChildRegions} from '../../services/systemSum';
// import CommonTree from '../../components/CommonTree'

const { TreeNode } = Tree;




export default class AreaDataManager extends React.PureComponent{
  state={

    treeData: [],
    loading: false,
  }

  componentDidMount(){
    this.loadTree();
  }

  onLoadData = treeNode => new Promise((resolve) => {
    if (treeNode.props.children) {
      resolve();
      return;
    }
    getChildRegions({parentId: treeNode.props.regionId}).then(res => {
      
      Object.assign(treeNode.props.dataRef,{children: res.data})
      const {treeData} = this.state
      treeData.forEach(v => {
        if (v.id === treeNode.props.dataRef.id) {
          Object.assign(v,{children: res.data})
        }
      })
      this.setState({treeData: [...treeData]});
      resolve();
    })
  })

  loadTree=()=>{
    this.setState({loading: true})
    getChildRegions({parentId:0}).then(res => {
      this.setState({
        treeData: res.data,
        loading: false,
      })
    })
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.regionName} key={item.regionId} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} title={item.regionName} key={item.regionId} dataRef={item} />;
  })



  render(){
    const { treeData,loading} = this.state;

    return (
      <div className="scrollY height100" style={{background: '#fff'}}>
        <div className="height48 line-height48 border-bottom padding-left-10">地区管理</div>
        <div className="flex-auto">
          <Spin spinning={loading}>
            <div style={{ width: '80%'}}>
              <Tree loadData={this.onLoadData} defaultExpandAll>
                {this.renderTreeNodes(treeData)}
              </Tree>
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}

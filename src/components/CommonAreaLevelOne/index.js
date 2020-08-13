import  React from 'react';
import { Modal,Tree } from 'antd';
import { connect } from 'dva';
import CommonSelect from '../../components/CommonSelect';

const TreeNode = Tree.TreeNode;

@connect(({commonAreaLevelOne})=>(commonAreaLevelOne))
class CommonAreaLevelOne extends React.Component{
  state ={
    showMore: false,// 选择更多的地区
  }
  componentWillMount(){
    const { areaLevelOneList =[],dispatch} = this.props;
    
    if(!areaLevelOneList.length){
      dispatch({
        type:'commonAreaLevelOne/fetchGetAreaLevelOneList',
        payload:{
          pId:'1000000',
          status:'indexArea',
        },
      })
    }
  }

  componentDidMount(){
    console.log(this.props);
  }

  closeModal= ()=>{
    this.setState({
      showMore:false,
    });
  }
  doSearh = (value) => {
    const { loadPageByArea} = this.props;
    this.areaData = {
      areapath:value,
      names:'',
    }
    loadPageByArea && loadPageByArea(value);
  }
  handleClick =(seletValue) =>{
    if(seletValue === 'null'){
      this.setState({
        showMore: true,
      });
    }
  }
  handleChange =(value) => {
    const {dispatch, allAreaList} = this.props;
    if (value === 'null') {
      if (!allAreaList.length) {
        dispatch({
          type: 'commonAreaLevelOne/fetchGetAllAreaList',
        });
      }
      this.setState({
        showMore: true,
      });
      return;
    }
    
    this.doSearh(value);
  }

  handleCheck=(checkInfo) => {
    const { checked=[]} = checkInfo;
    const newChecked = checked.length > 1 ? [checked[checked.length-1]]: checked;
    this.setState({ checkedKeys: newChecked});
  }
  handleExpand=(expanIno) => {
    this.setState({ expandedKeys: expanIno});
  }
  handleOk =() =>{
    const { checkedKeys =[] } = this.state;
    this.doSearh(checkedKeys);
    this.closeModal();
  }
  renderTree = (data) => {
    const {name='regionname',value="pathcode" } = this.props.type || {};
    return data.map((tree,index) => {
      const fun = () => {
        if (tree.children && tree.children.length) {
          return (
            <TreeNode value={tree[value]} title={tree[name]} key={tree[value] || index} dataRef={tree}>
              {this.renderTree(tree.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...tree} value={tree[value]} title={tree[name]} key={tree[value]} dataRef={tree} />;
      }
      return  fun();
    })
  }
  areaData = {}
  render(){
    const { allAreaList=[],areaLevelOneList=[],defaultText='' } = this.props;
    const { showMore,expandedKeys=[],checkedKeys=[] } = this.state;
    return (
      <div>
        <CommonSelect
          onSelect={this.handleClick}
          onChange={this.handleChange}
          className="width100"
          addUnknown
          unknownText={defaultText}
          placeholder={defaultText}
          optionData={{datas:areaLevelOneList,optionName:'regionName',optionId:'pathCode'}}
        />
        { showMore && (
          <Modal
            visible={showMore}
            onOk={this.handleOk}
            onCancel={this.closeModal}
            title='选择其他地区'
          >
            <Tree
              expandedKeys={expandedKeys}
              checkedKeys={checkedKeys}
              onCheck={this.handleCheck}
              onExpand={this.handleExpand}
              checkable
              checkStrictly
            >
              {this.renderTree(allAreaList)}
            </Tree>
          </Modal>
        )}
      </div>
    )
  }
}
export default  CommonAreaLevelOne;

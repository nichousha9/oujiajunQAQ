import React from 'react';
import { TreeSelect } from 'antd';

const {TreeNode} = TreeSelect;

 export default class CommonTreeSelect extends React.Component {
   state ={
     value: this.props.defaultVal || this.props.value || "",
     treeData: this.props.treeData || [],
   }

   componentWillReceiveProps(nextProps){
     const { treeCheckStrictly,treeData,treeCheckable } = nextProps;
     const  value  = nextProps.defaultVal || nextProps.value ;
     const { value: oldValue='' } = this.state;
     if(treeCheckStrictly && oldValue.length && treeCheckable) return;
     if(!treeCheckStrictly && !!oldValue) return;
     if(JSON.stringify(value)!==JSON.stringify(this.state.value)){
       this.setState({value})
     }
     if(JSON.stringify(treeData)!==JSON.stringify(this.props.treeData)){
      this.setState({treeData})
    }
   }

   onLoadData = treeNode => new Promise((resolve) => {
    if (treeNode.props.children) {
      resolve();
      return;
    }
    const {loadCallBack,labelObj = {}} = this.props
    const {id ='id'} = labelObj
    loadCallBack(treeNode.props).then(res => {
      Object.assign(treeNode.props.dataRef,{children: res})
      const {treeData} = this.state
      treeData.forEach(v => {
        if (v[id] === treeNode.props.dataRef[id]) {
          Object.assign(v,{children: res})
        }
      })
      this.setState({treeData: [...treeData]});
      resolve();
    })
  })

   handleChange =(value) =>{
     const { onChange} = this.props;
     if(onChange) onChange(value)
     this.setState({value});
   }
   renderTree = (data) => {
     const { nofilter} = this.props;
     const {name='cate',value="id" } = this.props.type || {};
     return data.map((tree,index) => {
       const fun = () => {
        const curValue =  tree[value];
         if (tree.children && tree.children.length) {          
           return (
             <TreeNode value={curValue} title={tree[name]} key={tree[value] || index} dataRef={tree}>
               {this.renderTree(tree.children)}
             </TreeNode>
           );
         }
         return <TreeNode {...tree} value={curValue} title={tree[name]} key={tree[value]} dataRef={tree} />;
       }
       if(nofilter){
        return  fun();
       }else{
         if(tree.isenable === '1' && tree.isdel === '0'){
         return  fun();
         }
         return null;
       }
     })
   }
   render() {
     const { style,placeholder="请选择分类",dropdownStyle={},treeCheckable=false,treeDefaultExpandAll = false,treeCheckStrictly= false,loadCallBack,myDefaultValue} = this.props;
     const { value,treeData } = this.state;
     const treeProps = {
      style,
      placeholder,
      defaultValue: myDefaultValue,
      treeCheckStrictly: !!treeCheckStrictly,
      onChange: this.handleChange,
      treeDefaultExpandAll,
      dropdownStyle:dropdownStyle ||{maxHeight: 400, overflow: 'auto' },
      treeCheckable,
      loadData: loadCallBack ? this.onLoadData : null,
      value: (treeCheckStrictly&&!value) ? [] : value,
    }

     return (
       <TreeSelect {...treeProps}>
         {this.renderTree(treeData)}
       </TreeSelect>)
   }
 }

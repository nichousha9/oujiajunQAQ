/* eslint-disable react/no-unused-state */
import React from 'react';
import { connect } from 'dva';
import AddEditModal from './AddEditModal';
import CommonKnowledgeTree from '../../components/CommonKnowledgeTree';
import { getClientHeight } from '../../utils/utils';


@connect(({knowledgeTreeSetting})=>({knowledgeTreeSetting}))
export default  class TreeSetting extends React.PureComponent{
  state ={
    cateAllList:[],// 树的数据
    editModalVisible: false,
    editId:'',
    editItem:{},
  }
  componentDidMount(){
    this.loadPage()
  }
  loadPage(){
    const { dispatch } = this.props;
    // 获取当前用户的知识库id，在根据知识库id获取知识树
    dispatch({type:'knowledgeTreeSetting/fetchGetUserKdbList'}).then((res)=>{
      if(!res || res.status!=='OK') return;
      dispatch({
        type:'knowledgeTreeSetting/fetchGetCateAllList',
        payload:{
          kdbid:(res.data[0] || {} ).id,
        },
      })
    })
  }
  // 打开添加，或者的Modal
  handleAddEditTreeNode = (node,isAdd) => {
    const { knowledgeTreeSetting:{ kdbid } } = this.props;
    if(isAdd){
      this.setState({
        editItem: {
          pcateid: node.id,
          cate: '',
          kdbid,
        },
        editId: '',
        editModalVisible: true})
    }else{
      this.setState({
        editItem: {
          pcateid: node.parentid,
          cate: node.cate,
          kdbid,
        },
        editId: node.id,
        editModalVisible: true,
      })
    }
  }
  closeModal = () =>{
    this.setState({editItem: {},editId: '',editModalVisible: false})
  }
  treeRef ={} // 当前知识树
  render(){
    const clientHeight = getClientHeight() - 112;
    const { knowledgeTreeSetting:{ kdbid,cateAllList } } = this.props;
    const { editModalVisible= false, editId='', editItem={}} = this.state;
    const commonKnowledgeTreeProps = {
      addEditTreeNode: this.handleAddEditTreeNode,
      editFlag: true,
      scrollY:clientHeight,
      treeData: cateAllList,
      kdbid,
    }
    const modalProps = {
      visible:editModalVisible,
      editId,
      editItem,
      closeModal:this.closeModal,
    }
    return (
      <div>
        <CommonKnowledgeTree {...commonKnowledgeTreeProps} />
        {editModalVisible && <AddEditModal {...modalProps} />}
      </div>
    )
  }
}

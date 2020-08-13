import React from 'react';
import { connect }from 'dva';
import { Row, Col, Tooltip,message,Modal} from 'antd';
import StandardTable from '../../../components/StandardTable';
import CommonSwitch from '../../../components/CommonSwitch';
import ActionButtonList from '../ActionButtonList';
import AddSynonymModal from '../AddSynonymModal';
import MutilImPortModal from '../MutilImPortModal';
import ImportResModal from '../../../components/ImportResModal';
import { formatDatetime, commonSubString, getSetAbleValueByIsenable,getBoolStatus }  from '../../../utils/utils'
import { standardWordDelete,standardWordSetAble } from '../../../services/api'
import {getResMsg} from "../../../utils/codeTransfer";

const importStandardWordColumns = [
  {
    title: '关键词',
    dataIndex:'sword',
  },
  {
    title:'原因',
    dataIndex: 'cause',
    render: data => getResMsg(data),
  },
];

@connect((props)=>{
  const { loading, synonymTab} = props;
  return {
    synonymTab,
    loading:loading.models.synonymTab,
  }
})
export default class SynonymTab extends React.Component{
  state = {
    editSynonymId: '',// 当前Modal修改的id
    mutilImPortModalVisible: false, // 批量导入的Modal,
    addSynonymModalVisible: false, // 新增同义词的Modal
    importResModalVisible: false, // 导入结果的列表
    importResData: false, // 导入的数据信息
  };

  componentDidMount(){
    this.loadTabList();
  }

  // 相似的查询
  onSearch = () => {
    this.loadTabList();
  };

  loadTabList = (page) => {
    const { dispatch,kdbid }= this.props;
    const { pagination = {}} = this.tableRef || {};
    dispatch({
      type:'synonymTab/fetchStandardWordList',
      payload:{
        kdbid,
        p: page || 0,
        ps: pagination.pageSize || 10,
        wordlike: this.actionButtonRef.searchValue || '',
      },
    })
  };

  mutilImPortShow =() => {
    this.setState({mutilImPortModalVisible: true});
  };

  mutilImPortOk = (resData) => {
    if(resData && resData.failList){
      // 查看失败
      this.setState({importResModalVisible: true,importResData: resData})
    } else {
      // 直接关闭Modal,刷新页面列表
      this.closeModal();
      this.loadTabList();
    }
  };

  showAddSynonymModal = (record)=> {
    this.setState({
      editSynonymId: record && record.id || '',
      addSynonymModalVisible: true,
    })
  };

  // 添加同义词成功回调
  addSynonymOnOk = (obj, okCallBack) => {
    const { dispatch } = this.props;
    dispatch({
      type:'synonymTab/fetchSaveStandardWord',
      payload:obj,
    }).then(() => {
      if(okCallBack) okCallBack();
      this.loadTabList();
      this.closeModal();
    })
  };

  closeModal = () => {
    this.setState({
      addSynonymModalVisible: false,
      mutilImPortModalVisible: false,
      importResModalVisible: false,
    })
  };

  // 处理选中的数据
  doSelect = () => {
    const { state:{ selectedRowKeys } } = this.tableRef;
    if(!selectedRowKeys.length){
      message.error('请选择要操作的数据')
      return false;
    }
    return selectedRowKeys.join(',');
  };

  // 删除
  synonymDelete = (recode) => {
    const ids = recode && recode.id ? recode.id : this.doSelect();
    if(!ids) return;
    const that = this;
    Modal.confirm({
      title: '确认删除？',
      okText:"确认",
      cancelText:"取消",
      onOk() {
        standardWordDelete({standardids : ids}).then((res) => {
          if(res.status === 'OK'){
            message.success('删除成功');
            that.loadTabList();
          }
        });
      },
    });
  };

  // 启用/停用
  synonymSetAble = (value, record) => {
    const ids = record ? record.id : this.doSelect();
    const ablevalue = value || getSetAbleValueByIsenable(record.isenable);
    if(!ids) return;
    standardWordSetAble({
      ablevalue,
      standardids: ids,
    }).then((res) => {
      if(res.status === 'OK'){
        message.success('操作成功');
        this.loadTabList();
      }
    })
  };

  // 表格翻页
  tableOnChange = (pagination) => {
    this.loadTabList(pagination.current || 0);
  };


  tableRef; // 存放表的数据
  actionButtonRef;
  count=1;
  render() {
    const { selectedRows, loading,kdbid ,synonymTab:{standardWordList}} = this.props;
    const { editSynonymId,importResModalVisible,importResData,addSynonymModalVisible,mutilImPortModalVisible } = this.state;
    const columns = [
      {
        title: '标准词',
        dataIndex: 'word',
      },
      {
        title: '同义词',
        dataIndex: 'synonmylist',
        render : (list = []) => {
          const words = list.map((word) => {
            return word.word;
          }).join(',')
          if(words.length >15 ){
            return (
              <Tooltip placement="topLeft" title={words} arrowPointAtCenter>
                {commonSubString(words)}
              </Tooltip>
            )
          }
          return words;
        },
      },
     {
        title: '修改时间',
        width:180,
        dataIndex: 'updatedAt',
        render: val => formatDatetime(val),
      },
      {
        title: '状态',
        dataIndex: 'isenable',
        width:100,
        render:(val,record) => {
          return <CommonSwitch onSwitch={() => {this.synonymSetAble(null,record);}} unCheckedChildren="停用" isSwitch={getBoolStatus(val)} />;
        },
      },
      {
        title: '操作',
        width:60,
        render: (record) => {
          const that = this;
          return <a onClick={()=>{that.showAddSynonymModal(record)}}>修改</a>;
        },
      },
    ];
    const addSynonymModalProps = {
      id: editSynonymId,
      closeModal: this.closeModal,
      onOk: this.addSynonymOnOk,
      visible: addSynonymModalVisible,
      kdbid:this.props.kdbid ,
      loading,
    };
    const actionButtonListProps = {
      loading,
      onSetAble: this.synonymSetAble,
      onDelete: this.synonymDelete,
      onNewItem: this.showAddSynonymModal,
      onSearch: this.onSearch,
      onImport: this.mutilImPortShow,
    };
    const importResModalProps = {
      visible: importResModalVisible,
      importResData,
      closeModal: this.closeModal,
      onOk: this.mutilImPortOk,
      columns: importStandardWordColumns,
    };
    const mutilImPortModalProps = {
      loading,
      visible: mutilImPortModalVisible,
      importtype: 'kdb_synonym_import',
      closeModal: this.closeModal,
      onOk: this.mutilImPortOk,
      importProps:{
        kdbid,
        importtype: 'kdb_synonym_import' ,
      },
    };

    return (
      <Row>
        <Col sm={24} xs={24}>
          <div style={{ marginTop:20, marginBottom:20}}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                <div style={{marginTop:6, marginLeft:6}}> 全部同义词 </div>
              </Col>
              <Col md={17} sm={24} style={{paddingRight:0, paddingLeft:10}}>
                <div style={{display:'inline-flex', float:'right'}}>
                  <ActionButtonList ref={(ele) => { this.actionButtonRef = ele }}{...actionButtonListProps} />
                </div>
              </Col>
            </Row>
          </div>
          <StandardTable
            key={this.count}
            loading={loading}
            onChange={this.tableOnChange}
            rowKey={(record) => (record.id)}
            ref={(ele) => {this.tableRef = ele;}}
            selectedRows={selectedRows}
            data={standardWordList}
            columns={columns}
          />
          {addSynonymModalVisible && <AddSynonymModal {...addSynonymModalProps} />}
          {mutilImPortModalVisible && <MutilImPortModal {...mutilImPortModalProps} />}
          {importResModalVisible && <ImportResModal {...importResModalProps} />}
        </Col>
      </Row>
    );
  }
}

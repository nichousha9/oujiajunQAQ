import React from 'react';
import {connect} from 'dva';
import {Row, Col,Button} from 'antd';
import CommonSelect from '../../../../components/CommonSelect';
import CommonSearch from '../../../../components/CommonSearch';
import StandardTable from '../../../../components/StandardTable';
import styles from './index.less';

@connect(({sceneIntentionTest,loading}) =>{
  return {
    sceneIntentionTest,
    loading: loading.effects['sceneIntentionTest/fetchSaveSceneIntentionTestList'],
  }
})
export default class SceneIntentionTest extends React.Component {
  state = {
    sentence: '',
    type: '',
  }
  componentDidMount(){
      const { dispatch} = this.props;
      dispatch({type:'sceneIntentionTest/fetchGetSimpleSceneList'})
  }
  componentWillUnmount(){
    const { dispatch } = this.props;
    dispatch({type:'sceneIntentionTest/clearState'})
  }
  onChange(key, value) {
    if (this.state[key] !== value) {
      this.setState({[key]:value},()=>{
        if(key==='type'){
          this.loadPage();
        }
      });
    }
  }
  // 测试
  loadPage = (p=1,ps=10,value) => {
    const {dispatch} = this.props;
    const { sentence,type } = this.state;
    dispatch({
      type:'sceneIntentionTest/fetchSaveSceneIntentionTestList',
      payload:{
        sceneid:type,
        sentence: value || sentence,
        p,
        ps,
      },
    })
  }
  tableChange = (data={}) => {
    const {current,pageSize} = data;
    this.loadPage(current,pageSize);
  }
  doSearch = (value)=>{
    this.loadPage(1,10,value)
  }
  // 列
  columns = [
    {
      title: '意图编码',
      dataIndex: 'code',
      width: '34%',
    }, {
      title: '意图名称',
      dataIndex: 'name',
      width: '33%',
    }, {
      title: '得分',
      dataIndex: 'confidence',
      width: '33%',
    },
  ];

  render() {
    const {sentence, type} = this.state;
    const { sceneIntentionTest:{ sceneIntentionTestList ={},simpleSceneList= []},loading } = this.props;
    return (
      <div className={styles.container}>
        <Row className="margin-bottom-20" gutter={10}>
          <Col key="1" span={14}>
            <CommonSearch
              width="100%"
              doSearch={this.doSearch}
              value={sentence}
              onChange={(value) => {
                this.onChange('sentence', value);
              }}
              placeholder="请输入"
            />
          </Col>
          <Col key="2" span={6}>
            <CommonSelect
              noWidth
              style={{width: '100%'}}
              defaultValue={type}
              addUnknown
              unknownText="全部"
              onChange={(e) => this.onChange('type', e)}
              optionData={{datas:simpleSceneList}}
            />
          </Col>
          <Col key="3" span={4}>
            <Button type="primary" onClick={()=>{this.loadPage()}}>
              意图测试
            </Button>
          </Col>
        </Row>
        <Row >
          <StandardTable
            cutHeight={480}
            loading={loading}
            data={sceneIntentionTestList}
            noSelect
            onChange={this.tableChange}
            columns={this.columns}
          />
        </Row>
      </div>
    );
  }
}

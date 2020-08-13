/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Form, Affix, Modal, Row, Col, Input, Button, Pagination } from 'antd';
import KnowledgebaseTab from './KnowledgebaseTab';
import KnowledgeAudit from './KnowledgeAudit';
import green from '../../assets/green.png';
import style from './Knowledgebase.less';

const { TabPane } = Tabs;

@connect((props) => {
  const { knowLedgebaseinfo } = props;
  return {
    knowLedgebaseinfo,
  };
})
@Form.create()
export default class Knowledgebase extends Component {
  state = {
    kdbid: '',
    selectedRows: [],
    btnLoading: false,
    modalVisible: false,
    modalTitle: '健康检查',
    allRedundantList: [], // 获取所有问题列表
    curRedundantList: [], // 展示在界面上的列表
    pageTotal: 0, // 总页数
    pageSize: 5, // 分页
    curPage: 1, // 当前页数
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'knowLedgebaseinfo/fetchGetUserKdbList' });
  }
  componentWillReceiveProps(nextProps) {
    const {
      knowLedgebaseinfo: { kdbid },
    } = nextProps;
    if (kdbid !== this.state.kdbid) {
      this.setState({ kdbid });
    }
  }
  handleOk = () => {
    this.setState({ btnLoading: true });
    setTimeout(() => {
      this.setState({ btnLoading: false, visible: false });
    }, 3000);
  };

  onAffixClick = () => {
    this.setState({
      modalVisible: true,
    });
    this.getKdbHealth();
    // this.setState({
    //   curRedundantList:[{s1_id:1,s1_question:'测试问题111',s2_id:2,s2_question:'测试问题222'}],
    // })
  };

  getKdbHealth = (page) => {
    const { kdbid } = this.state;
    const arr = [kdbid];
    const { dispatch } = this.props;
    dispatch({
      type: 'knowLedgebaseinfo/getKdbHealth',
      payload: {
        kdbid: arr,
      },
    }).then((res) => {
      const { pageSize } = this.state;
      const len = res.data.redundant_list.length;
      const curList = [];
      res.data.redundant_list.forEach((item, index) => {
        if (page) {
          if (index >= (page - 1) * 5 && index < page * 5) {
            curList.push(item);
          }
        } else if (index >= 0 && index < 5) {
          curList.push(item);
        }
      });
      this.setState({
        allRedundantList: res.data.redundant_list,
        curRedundantList: curList,
        pageTotal: len % pageSize === 0 ? len / pageSize : len / pageSize + 1,
      });
    });
  };

  listPageChange = (e) => {
    const { allRedundantList, pageSize } = this.state;
    const curarr = allRedundantList.slice((e - 1) * pageSize, e * pageSize);
    this.setState({
      curPage: e,
      curRedundantList: Object.assign([], curarr),
    });
  };

  editCurList = (item, index, curQuestion) => {
    const { curRedundantList } = this.state;
    const arr = [...curRedundantList];
    if (curQuestion === 1) {
      arr[index].mode1 = 'edit';
    } else {
      arr[index].mode2 = 'edit';
    }
    this.setState({
      curRedundantList: arr,
    });
  };

  confirmCurList = (id, index, curQuestion) => {
    //
    const { curRedundantList } = this.state;
    const arr = [...curRedundantList];
    if (curQuestion === 1) {
      arr[index].mode1 = 'query';
    } else {
      arr[index].mode2 = 'query';
    }
    this.setState({
      curRedundantList: arr,
    });

    // 发送修改请求并刷新当前页面
    const { dispatch } = this.props;
    dispatch({
      type: 'knowLedgebaseinfo/updateKdbQuestion',
      payload: {
        id,
        question: curQuestion === 1 ? arr[index].s1_question : arr[index].s2_question,
      },
    }).then((res) => {
      // 如果成功，刷新当前列表
      if (res.status === 'OK') {
        const { curPage } = this.state;
        this.getKdbHealth(curPage);
      }
    });
  };

  cancelCurList = (item, index, curQuestion) => {
    // 取消就重新载入
    const { allRedundantList, curPage, pageSize } = this.state;
    const arr = allRedundantList.slice((curPage - 1) * pageSize, curPage * pageSize);
    if (curQuestion === 1) {
      arr[index].mode1 = 'query';
    } else {
      arr[index].mode2 = 'query';
    }
    this.setState({
      curRedundantList: Object.assign([], arr),
    });
  };

  changeQuestion = (index, curQuestion, e) => {
    const val = e.target.value;
    const { curRedundantList } = this.state;
    const arr = [...curRedundantList];
    if (curQuestion === 1) {
      arr[index].s1_question = val;
    } else {
      arr[index].s2_question = val;
    }
    this.setState({
      curRedundantList: arr,
    });
  };

  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleModalOK = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { dispatch } = this.props;
    const {
      location: { query = {} },
    } = this.props;
    const from = query.from || '';
    const {
      selectedRows,
      btnLoading,
      kdbid,
      modalVisible,
      modalTitle,
      curRedundantList,
      pageTotal,
      curPage,
    } = this.state;
    const knowledgebaseTabProps = {
      dispatch,
      kdbid,
      selectedRows,
      loading: btnLoading,
      from,
    };
    const sceneTabProps = {
      loading: btnLoading,
      kdbid,
    };
    // className="selfAdapt"
    return (
      <div
        style={{ background: '#fff', minHeight: 'calc(100% - 16px)', padding: '24px 32px 0 32px' }}
      >
        {kdbid && (
          <div>
            <Tabs
              type="card"
              tabBarStyle={{ paddingLeft: 230 }}
              tabBarExtraContent={<div style={{ position: 'absolute', left: 10 }}>鲸智小蜜</div>}
            >
              <TabPane tab="知识库" key="1">
                <KnowledgebaseTab {...knowledgebaseTabProps} />
              </TabPane>
              {/* <TabPane tab="同义词" key="2">
                <SynonymTab {...synonymTabProps} />
              </TabPane> 
               <TabPane tab="场景" key="3">
                <SceneTab {...sceneTabProps} />
              </TabPane> */}
              <TabPane tab="审核" key="4">
                <KnowledgeAudit {...sceneTabProps} />
              </TabPane>
            </Tabs>
          </div>
        )}
        <Affix onClick={this.onAffixClick} style={{ position: 'absolute', top: 360, right: 20 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: `url(${green})`,
              backgroundSize: 'cover',
              color: '#fff',
              fontSize: '14px',
              letterSpacing: '2px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <p style={{ lineHeight: '26px' }}>健康</p>检查
          </div>
        </Affix>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onOk={this.handleModalOK}
          onCancel={this.handleModalCancel}
          width={800}
        >
          <div> 相似度 98% </div>
          <div> 相似的问题 </div>
          {curRedundantList.map((item, index) => (
            <div style={{ margin: 10 }}>
              <Row className={style.listStyle}>
                <Col span={4}>
                  <div className={style.leftContent}>{`${String(item.score).substr(2, 2)}%`}</div>
                </Col>
                <Col span={20}>
                  {item.mode1 && item.mode1 === 'edit' ? (
                    <div className={style.rightContent}>
                      <span style={{ color: '#999' }}>问题</span>
                      <Input
                        style={{ width: '300px', marginLeft: '10px' }}
                        value={item.s1_question}
                        onChange={this.changeQuestion.bind(this, index, 1)}
                      />
                      <Button
                        type="primary"
                        style={{ marginLeft: '10px' }}
                        onClick={() => this.confirmCurList(item.s1_id, index, 1)}
                      >
                        确认
                      </Button>
                      <Button
                        style={{ marginLeft: '10px' }}
                        onClick={() => this.cancelCurList(item, index, 1)}
                      >
                        取消
                      </Button>
                    </div>
                  ) : (
                    <div className={style.rightContent} style={{ borderBottom: '1px solid #ccc' }}>
                      <span style={{ color: '#999' }}>问题</span>
                      <span style={{ paddingLeft: '10px' }}>{item.s1_question}</span>
                      <span
                        style={{ color: '#1791FF', float: 'right', cursor: 'pointer' }}
                        onClick={() => this.editCurList(item, index, 1)}
                      >
                        编辑
                      </span>
                    </div>
                  )}
                  {item.mode2 && item.mode2 === 'edit' ? (
                    <div className={style.rightContent}>
                      <span style={{ color: '#999' }}>问题</span>
                      <Input
                        style={{ width: '300px', marginLeft: '10px' }}
                        value={item.s2_question}
                        onChange={this.changeQuestion.bind(this, index, 2)}
                      />
                      <Button
                        type="primary"
                        style={{ marginLeft: '10px' }}
                        onClick={() => this.confirmCurList(item.s2_id, index, 2)}
                      >
                        确认
                      </Button>
                      <Button
                        style={{ marginLeft: '10px' }}
                        onClick={() => this.cancelCurList(item, index, 2)}
                      >
                        取消
                      </Button>
                    </div>
                  ) : (
                    <div className={style.rightContent}>
                      <span style={{ color: '#999' }}>问题</span>
                      <span style={{ paddingLeft: '10px' }}>{item.s2_question}</span>
                      <span
                        style={{ color: '#1791FF', float: 'right', cursor: 'pointer' }}
                        onClick={() => this.editCurList(item, index, 2)}
                      >
                        编辑
                      </span>
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          ))}
          <div style={{ marginTop: 10, marginRight: 10, textAlign: 'right' }}>
            <Pagination current={curPage} total={pageTotal} onChange={this.listPageChange} />
          </div>
        </Modal>
      </div>
    );
  }
}

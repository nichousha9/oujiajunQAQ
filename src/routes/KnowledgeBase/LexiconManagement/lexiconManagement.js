/* eslint-disable no-param-reassign */
/* eslint-disable react/sort-comp */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Input,
  Button,
  Table,
  Divider,
  Pagination,
  Modal,
  Tooltip,
  Icon,
  Popconfirm,
  Form,
  Tag,
  message,
  Spin,
  Upload,
  InputNumber,
  Progress,
} from 'antd';
import { connect } from 'dva';
import { sortMemList, uploadmyExcel, uploadProcessData } from '../../../services/lexiconManagement';

// import { Input, DatePicker, Select, Table, Button, Pagination, Form } from 'antd';

const { Search, TextArea } = Input;
const FormItem = Form.Item;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  dataLoading: loading.effects['lexiconManagement/getPageList'],
}))
@Form.create()
class LexiconManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RegularVisible: false,
      StandardVisible: false,
      visible1: false,
      visible2: false,
      listData: [],
      pageSize: 10,
      totalElements: 0,
      curPage: 1,
      searchResult: false,
      searchValue: '',
      record: {
        pnounMem: [],
      },
      tempRecord: '',
      tagInputVisible: false,
      tagInputValue: '',
      selectedTagId: '',
      isNew: false,
      represult: '无匹配内容',
      curType: this.props.sceneId,
      color1: '#1890FF',
      color2: '',
      visibility: 'visible',
      currentPnounMem: 1,
      totalCount: 0, // 查询分类结果总数
      search: '',
      tableSize: 8,
      selectedRows: [],
      curRecord: {},
      uploadProcess: 0,
      standardButtonLoad: false,
    };
  }

  componentDidMount() {
    this.loadPageList();
  }

  // 表格行选择
  onSelectRowChange = (e) => {
    this.setState({
      selectedRows: e,
    });
  };

  getSearchResult = () => {
    if (this.state.searchValue.length === 0) {
      this.loadPageList();
      //  此时转化为非搜索结果
      this.setState({
        searchResult: false,
      });
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'lexiconManagement/searchPageList',
      payload: {
        ps: this.state.pageSize,
        p: this.state.curPage,
        queryParam: this.state.searchValue,
        sceneId: this.props.sceneId,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.setState({
          listData: res.data.list,
          totalElements: res.data.total,
        });
      }
    });
  };

  getSortName = (e) => {
    const newRecord = this.state.record;
    newRecord.sortName = e.target.value;
    this.setState({
      record: newRecord,
    });
  };

  getCurRecordId = (id) => {
    this.setState({
      selectedTagId: id,
    });
  };

  getRegSortname = (e) => {
    const newRecord = this.state.record;
    newRecord.sortName = e.target.value;
    this.setState({
      record: newRecord,
    });
  };

  getRegrep = (e) => {
    const newRecord = this.state.record;
    newRecord.rep = e.target.value;
    this.setState({
      record: newRecord,
    });
  };

  handleSearch = (value) => {
    // 点击搜索键地时候，就把 curPage 设置为 1
    this.setState(
      {
        curPage: 1,
        searchValue: value,
        searchResult: true,
      },
      () => {
        this.getSearchResult(value);
      }
    );
  };

  loadPageList = (pageSize = 10) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lexiconManagement/getPageList',
      payload: {
        ps: pageSize,
        p: this.state.curPage,
        sceneId: this.state.curType,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.setState({
          listData: res.data.list,
          totalElements: res.data.total,
        });
      }
    });
  };

  showNewRegular = () => {
    const newRecord = {
      pnounMem: [],
      createTime: '',
      creater: '',
      id: '',
      rep: '',
      sortDesc: '',
      sortName: '',
      status: '',
      type: '',
      updateTime: '',
      updater: '',
    };
    this.setState({
      RegularVisible: true,
      record: newRecord,
      isNew: true,
    });
  };
  handleCancelRegular = () => {
    this.setState({
      RegularVisible: false,
    });
    if (this.state.searchResult) {
      // 如果是搜索结果
      this.getSearchResult(this.state.searchValue);
    } else {
      this.loadPageList();
    }
  };

  showNewStandard = () => {
    const newRecord = {
      pnounMem: [],
      // createTime: '',
      // creater: '',
      // id: '',
      // rep: '',
      // sortDesc: '',
      sortName: '',
      // status: '',
      // type: '',
      // updateTime: '',
      // updater: '',
    };
    this.setState({
      StandardVisible: true,
      record: newRecord,
      isNew: true,
      totalCount: 0,
    });
  };

  handleCancelStandard = () => {
    this.setState({
      StandardVisible: false,
      // record:this.state.tempRecord,
    });
    // 暂时还没有考虑到如果当前是在某一页或者搜索结果怎么办，大概是获取
    if (this.state.searchResult) {
      // 如果是搜索结果
      this.getSearchResult(this.state.searchValue);
    } else {
      this.loadPageList();
    }
  };

  handleOkStandard = () => {
    // 通知修改成功的消息
    // message.success('操作成功！');
    // 关闭弹窗
    this.setState({
      standardButtonLoad: true,
    });

    if (this.state.record.sortName.length === 0) {
      message.info('类名词为必填字段');
      this.loadPageList();
      return;
    }

    const { form } = this.props;

    form.validateFields((error, value) => {
      if (!error) {
        // 发送请求

        if (this.state.isNew) {
          // 如果是新增一条新的数据，就是插入名词项
          const newRecord = this.state.record;
          newRecord.pnounMem.forEach((item) => {
            delete item.id;
          });
          this.saveStandardNoun();
        } else {
          // 如果是是编辑数据，就是发起插入数据的请求 其实可以判断 id 的， 没必要新加一个变量
          // 去除名词成员的 临时 id
          const { record } = this.state;
          const { tempRecord } = this.state;
          const newRecord = { ...record };
          newRecord.pnounMem = [...record.pnounMem, ...tempRecord.pnounMem];
          newRecord.pnounMem.forEach((item) => {
            if (item.id.substring(0, 2) === 'tp') {
              delete item.id;
            }
          });
          this.setState(
            {
              record: newRecord,
            },
            () => {
              this.updateStandardNoun();
            }
          );
        }
      } else {
        message.info('名词成员和澄清优先级为必填字段！');
        this.setState({
          standardButtonLoad: false,
        });
      }
    });
  };

  updateStandardNoun = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lexiconManagement/updateStandardNoun',
      payload: {
        id: this.state.record.id,
        sortName: this.state.record.sortName,
        memString: JSON.stringify(this.state.record.pnounMem),
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('修改成功！');
        this.setState({
          standardButtonLoad: false,
        });
        if (this.state.isNew) {
          this.setState({
            StandardVisible: false,
          });
          this.getRegSortname(this.state.searchValue);
        } else {
          // this.loadPageList();
          this.getSortMemList(this.state.record);
        }
      } else {
        this.loadPageList();
      }
    });
  };

  saveStandardNoun = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lexiconManagement/saveStandardNoun',
      payload: {
        sortName: this.state.record.sortName,
        memString: JSON.stringify(this.state.record.pnounMem),
        sceneId: this.props.sceneId,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.setState({
          standardButtonLoad: false,
        });
        if (res.data === 'pnounSort_save_exist') {
          message.info('该名词已经存在！');
          return;
        }
        this.setState({
          StandardVisible: false,
          searchResult: false,
          standardButtonLoad: false,
        });

        message.success('添加成功！');
        this.setState(
          {
            curPage: 1,
          },
          () => {
            this.loadPageList();
          }
        );
      } else {
        this.loadPageList();
      }
    });
  };

  handleOkRegular = () => {
    // 通知修改成功的消息
    // message.success('操作成功！');
    // 关闭弹窗
    // 点击确定地时候判断一下数据是否为空
    if (this.state.record.sortName.length === 0 || this.state.record.rep.length === 0) {
      message.info('必填数据不能为空');
      this.loadPageList();
      return;
    }

    // 发送请求
    if (this.state.isNew) {
      // 如果是新增一条新的数据，就是插入名词项
      const { dispatch } = this.props;
      dispatch({
        type: 'lexiconManagement/saveRegularNoun',
        payload: {
          sortName: this.state.record.sortName,
          rep: this.state.record.rep,
          sceneId: this.props.sceneId,
        },
      }).then((res) => {
        if (res && res.status === 'OK') {
          if (res.data === 'pnounSort_save_exist') {
            message.info('该名词已经存在！');
            return;
          }
          this.setState({
            RegularVisible: false,
            searchResult: false,
          });
          message.success('保存成功！');
          this.setState(
            {
              curPage: 1,
            },
            () => {
              this.loadPageList();
            }
          );
        } else {
          this.loadPageList();
        }
      });
    } else {
      // 如果是是编辑数据，就是发起插入数据的请求 其实可以判断 id 的， 没必要新加一个变量
      const { dispatch } = this.props;
      dispatch({
        type: 'lexiconManagement/updateRegularNoun',
        payload: {
          id: this.state.record.id,
          sortName: this.state.record.sortName,
          rep: this.state.record.rep,
        },
      }).then((res) => {
        if (res && res.status === 'OK') {
          message.success('修改成功！');
          // this.loadPageList();
          this.setState({
            RegularVisible: false,
          });
          if (this.state.isNew) {
            this.getRegSortname(this.state.searchValue);
          } else {
            this.loadPageList();
            this.getSortMemList(this.state.record);
          }
        } else {
          this.loadPageList();
        }
      });
    }
  };

  overRegular = () => {
    this.setState({
      visible1: true,
    });
  };
  outRegular = () => {
    this.setState({
      visible1: false,
    });
  };

  overStandard = () => {
    this.setState({
      visible2: true,
    });
  };
  outStandard = () => {
    this.setState({
      visible2: false,
    });
  };
  deleteReq = (record) => {};
  // 删除名词
  deleteList = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lexiconManagement/deleteRegularNoun',
      payload: {
        id: record.id,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        if (this.state.searchResult) {
          // 如果是搜索结果
          this.getSearchResult(this.state.searchValue);
        } else {
          this.loadPageList();
        }
      }
    });
  };
  deleteMember = (id) => {
    // 如果还没有存入数据库的时候点击了删除

    const newRecord = this.state.record;
    const tempArray = newRecord.pnounMem.filter((item) => item.id !== id);
    newRecord.pnounMem = tempArray;
    this.setState({
      record: newRecord,
    });
    if (id.substring(0, 2) === 'tp') {
      return;
    }
    // 发起请求 更新数据
    const { dispatch } = this.props;
    dispatch({
      type: 'lexiconManagement/deleteStandardNoun',
      payload: {
        id,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('删除成功！');
        if (this.state.searchResult) {
          // 如果是搜索结果
          this.getSearchResult(this.state.searchValue);
        } else {
          this.loadPageList();
        }
      } else {
        this.loadPageList();
      }
    });
  };

  changePage = (page) => {
    this.setState(
      {
        curPage: page,
      },
      () => {
        // 修改分页
        if (this.state.searchResult) {
          // 如果是搜索结果
          this.getSearchResult(this.state.searchValue);
        } else {
          this.loadPageList();
        }
      }
    );
  };

  pnounMemChange = (current) => {
    this.getSortMemList('', current);
  };
  pnounMemSearch = (value) => {
    this.setState({ search: value }, () => {
      this.getSortMemList('', 1);
    });
  };
  // 查询名词分类
  getSortMemList = (recordParam, current) => {
    const { record, search } = this.state;
    const myRecord = recordParam || record;
    const param = {
      sortId: myRecord.id,
      memName: search || '',
      p: current || 1,
      ps: 8,
    };
    sortMemList(param).then((res) => {
      if (res.status === 'OK') {
        const pnounMem = res.data.list;
        const totalCount = res.data.total;
        Object.assign(myRecord, { pnounMem });
        this.setState({
          tableSize: 8,
          record: myRecord,
          tempRecord: myRecord,
          totalCount,
          currentPnounMem: current || 1,
        });
      }
    });
  };

  timer = '';
  // 上传exel文件
  beforeUpload = (file) => {
    this.setState({
      loading: true,
    });
    const { curRecord } = this.state;
    const sortId = curRecord.id;
    const param = {
      file,
      sortId,
    };
    // 调用上传进度
    // this.getUploadProcess();

    uploadmyExcel(param).then((res) => {
      this.setState({
        loading: false,
        // uploadProcess:'100',
      });
      if (res.status === 'OK') {
        message.info('开始上传');
        this.timer = setInterval(() => {
          this.getUploadProcess(res.data);
        }, 3000);
        this.getSortMemList(curRecord);
      } else {
        message.warning('上传文件失败！');
      }
    });
    return false;
  };

  getUploadProcess = (id) => {
    uploadProcessData({ fileId: id }).then((res) => {
      this.setState({
        uploadProcess: res.data,
      });
      if (res.data >= 100) {
        this.setState({
          uploadProcess: 100,
        });
        clearInterval(this.timer);
        message.success('文件上传完成！');
      }
    });
  };

  editNoun = (record) => {
    this.getSortMemList(record);
    this.setState(
      {
        // tempRecord:record,
        isNew: false,
        curRecord: record,
        uploadProcess: 0,
      },
      () => {
        if (record.type === '1') {
          this.setState({ RegularVisible: true });
        } else {
          this.setState({ StandardVisible: true });
        }
      }
    );
  };

  addNewStandarrColumn = () => {
    // 创建临时 id
    const { isNew, record, tempRecord } = this.state;
    if (isNew) {
      // 如果是新增数据就限制一下，一次性添加数据不能超过八条
      this.createNewRecord();
    } else {
      // 如果不是新增数据
      // 清空现有数据
      // 表单校验
      const { form } = this.props;
      form.validateFields((error) => {
        if (!error) {
          if (tempRecord === record) {
            this.setState(
              {
                record: {
                  ...tempRecord,
                  pnounMem: [],
                },
                totalCount: 0,
              },
              () => {
                this.createNewRecord();
              }
            );
          } else {
            this.createNewRecord();
          }
        }
      });
    }
  };

  // 新建行
  createNewRecord = () => {
    const { record } = this.state;
    if (record.pnounMem && record.pnounMem.length === 8) {
      message.info('一次性的新增数据不能超过 8 条！');
      return;
    }
    const tempId = new Date().getTime().toString();
    const newData = {
      id: `tp${tempId}`,
      memName: '',
      synonyms: '',
      priority: '',
    };
    const newRecordAddPnoun = this.state.record;
    newRecordAddPnoun.pnounMem.push(newData);
    this.setState({
      tableSize: 9,
      record: newRecordAddPnoun,
    });
  };

  // 删除某个tag
  // 后面需要统一一下数据的存储格式，每个词之后都加英文逗号
  deleteStaMem = (removedtag, id) => {
    const deleteTagRecord = this.state.record;
    deleteTagRecord.pnounMem.forEach((item) => {
      if (item.id === id) {
        const newSyn = item.synonyms.replace(`${removedtag},`, '');
        Object.assign(item, {
          synonyms: newSyn,
        });
      }
    });
    this.setState({
      record: deleteTagRecord,
    });
  };
  // 添加tag
  showTagInput = (id) => {
    this.setState({
      tagInputVisible: true,
      selectedTagId: id,
    });
  };
  handleTagInputChange = (e) => {
    this.setState({
      tagInputValue: e.target.value,
    });
  };

  handleTagInputConfirm = () => {
    const newRecord = this.state.record;
    newRecord.pnounMem.forEach((item) => {
      if (item.id === this.state.selectedTagId) {
        Object.assign(item, {
          synonyms: `${item.synonyms}${this.state.tagInputValue},`,
        });
      }
    });
    // 更改record
    this.setState({
      record: newRecord,
      tagInputVisible: false,
      tagInputValue: '',
    });
  };

  changeMemName = (e) => {
    const newRecord = this.state.record;
    newRecord.pnounMem.forEach((item) => {
      if (item.id === this.state.selectedTagId) {
        Object.assign(item, {
          memName: e.target.value,
        });
      }
    });
    // 更改record
    this.setState({
      record: newRecord,
    });
  };

  changePriority = (e) => {
    const newRecord = this.state.record;
    newRecord.pnounMem.forEach((item) => {
      if (item.id === this.state.selectedTagId) {
        Object.assign(item, {
          priority: typeof e === 'undefined' ? '' : e,
        });
      }
    });
    // 更改record
    this.setState({
      record: newRecord,
    });
  };

  testRep = (e) => {
    // 这里有一个小 bug ,那就是正则表达式只能输入字符串
    const text = e.target.value;
    const Rep = this.state.record.rep;
    const patt = new RegExp(Rep, 'g');
    // const result = patt.test(text);
    const result = text.match(Rep);
    if (result) {
      this.setState({
        represult: result,
      });
    } else {
      this.setState({
        represult: '无匹配内容',
      });
    }
  };

  clickSpeNoun = () => {
    this.setState(
      {
        curType: this.props.sceneId,
        color1: '#1890FF',
        color2: '#707070',
        visibility: 'visible',
      },
      () => {
        this.loadPageList();
      }
    );
  };

  clickComNoun = () => {
    this.setState(
      {
        curType: -1,
        color2: '#1890FF',
        color1: '#707070',
        visibility: 'hidden',
      },
      () => {
        this.loadPageList();
      }
    );
  };

  // 批量删除
  batchDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      message.info('没有选中行！');
    } else {
      const arr = selectedRows.filter((item) => String(item).substr(0, 2) !== 'tp');
      dispatch({
        type: 'lexiconManagement/memDelete',
        payload: {
          ids: arr,
        },
      }).then((res) => {
        if (res && res.status === 'OK') {
          message.success('删除成功！');
          const { curRecord } = this.state;
          this.getSortMemList(curRecord);
        }
      });
    }
  };

  render() {
    const { dataLoading, form } = this.props;
    const { getFieldDecorator } = form;
    const { totalCount, currentPnounMem, tableSize, uploadProcess } = this.state;
    const columns = [
      {
        title: '专有名词类',
        dataIndex: 'sortName',
        key: 'sortName',
      },
      // {
      //   title: '名词成员及同义词',
      //   dataIndex: 'type',
      //   key: 'type',
      //   render: (type, record) =>
      //     type === '1' ? (
      //       <span>{record.rep} </span>
      //     ) : (
      //       <span>
      //         {record.sortName}
      //       </span>
      //     ),
      // },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span style={{ visibility: this.state.visibility }}>
            <a onClick={() => this.editNoun(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除该条名词吗?"
              okText="确认"
              cancelText="取消"
              onConfirm={() => this.deleteList(record)}
            >
              <a href="">删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    const columns1 = [
      {
        title: '名词成员',
        dataIndex: 'memName',
        render: (text, record) => (
          <Form>
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`memName${record.id}`, {
                rules: [
                  {
                    required: true,
                    message: `必填字段`,
                  },
                ],
                initialValue: text,
              })(
                <Input
                  key={record.id}
                  style={{
                    padding: '6px 8px',
                    border: '1px solid #E8E8E8',
                    borderRadius: '6px',
                    width: '200px',
                  }}
                  onChange={this.changeMemName}
                  onClick={() => this.getCurRecordId(record.id)}
                />
              )}
            </FormItem>
          </Form>
        ),
      },
      {
        title: '同义词',
        dataIndex: 'synonyms',
        render: (tags, record) => (
          <span>
            {tags &&
              tags.length !== 0 &&
              tags.split(/[,，]/).map((tag) =>
                tag.length > 0 ? (
                  <Tag
                    style={{ marginTop: 10 }}
                    closable
                    key={tag}
                    onClose={() => this.deleteStaMem(tag, record.id)}
                  >
                    {tag}
                  </Tag>
                ) : (
                  ''
                )
              )}
            {/* <div color="blue" className={styles.tagStyle} style={{cursor:'pointer'}}>+ New Tags</div> */}
            {this.state.tagInputVisible && record.id === this.state.selectedTagId && (
              <Input
                ref={this.saveInputRef}
                type="text"
                size="small"
                style={{ width: 78, marginTop: 10 }}
                value={this.state.tagInputValue}
                onChange={this.handleTagInputChange}
                onBlur={this.handleTagInputConfirm}
                onPressEnter={this.handleTagInputConfirm}
              />
            )}
            {!this.state.tagInputVisible && (
              <Tag
                onClick={() => this.showTagInput(record.id)}
                style={{ background: '#fff', borderStyle: 'dashed', marginTop: 10 }}
              >
                <Icon type="plus" /> New Tag
              </Tag>
            )}
          </span>
        ),
      },
      {
        title: '澄清优先级',
        dataIndex: 'priority',
        render: (text, record) => (
          <Form>
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`priority${record.id}`, {
                rules: [
                  {
                    required: true,
                    message: `必填字段，请输入数字！`,
                  },
                ],
                initialValue: text,
              })(
                <InputNumber
                  key={record.id}
                  onChange={this.changePriority}
                  onClick={() => this.getCurRecordId(record.id)}
                />
              )}
            </FormItem>
          </Form>
        ),
      },
      {
        title: '操作',
        dataIndex: 'delete',
        render: (text, record) => (
          <Popconfirm
            title="确认删除该条名词成员吗?"
            okText="确认"
            cancelText="取消"
            onConfirm={() => this.deleteMember(record.id)}
          >
            <div style={{ color: '#31A3F4', cursor: 'pointer', textAlign: 'center' }}>
              <Icon type="delete" className="margin-right-5" />
              {text}
            </div>
          </Popconfirm>
        ),
      },
    ];

    const rowSelection = {
      onChange: this.onSelectRowChange,
    };

    const { loading, isNew, standardButtonLoad } = this.state;

    return (
      <div
        className="selfAdapt"
        style={this.state.StandardVisible ? { overflow: 'hidden' } : { overflow: 'auto' }}
      >
        <div>
          <span onClick={this.clickSpeNoun} style={{ cursor: 'pointer', color: this.state.color1 }}>
            专有名词
          </span>
          <Divider type="vertical" />
          <span onClick={this.clickComNoun} style={{ cursor: 'pointer', color: this.state.color2 }}>
            {' '}
            通用名词{' '}
          </span>
        </div>
        <div style={{ marginTop: 20 }}>
          <Search
            placeholder="请输入搜索内容"
            onSearch={this.handleSearch}
            style={{ width: 250 }}
            enterButton
          />
          {/* <Tooltip
            placement="leftTop"
            title="正则名词是用创建一个有正则格式规范的方法来增强名词识别能力的类型"
            onConfirm={confirm}
            okText={false}
            cancelText={false}
            visible={this.state.visible1}
          >
            <Button
              type="primary"
              style={{ float: 'right',visibility:this.state.visibility}}
              onClick={this.showNewRegular}
              onMouseEnter={this.overRegular}
              onMouseLeave={this.outRegular}
            >
              新建正则名词
            </Button>
          </Tooltip> */}
          <Tooltip
            placement="leftTop"
            title="标准名词是用创建多个同义词的方法来增强名词识别能力的类型"
            onConfirm={confirm}
            okText={false}
            cancelText={false}
            visible={this.state.visible2}
          >
            <Button
              type="primary"
              style={{ float: 'right', marginRight: 20, visibility: this.state.visibility }}
              onClick={this.showNewStandard}
              onMouseEnter={this.overStandard}
              onMouseLeave={this.outStandard}
            >
              新建标准名词
            </Button>
          </Tooltip>
          <Modal
            title="编辑名词"
            visible={this.state.StandardVisible}
            onOk={this.handleOkStandard}
            onCancel={this.handleCancelStandard}
            width={1000}
            height={document.body.height}
            // style={{overflow:'auto'}}
            confirmLoading={standardButtonLoad}
          >
            <div>
              <span style={{ display: 'inline-block', width: 100, textAlign: 'right' }}>
                <span style={{ color: 'red', textAlign: 'right' }}>*</span>
                类名词：
              </span>
              <Input
                placeholder="请输入类名词"
                value={this.state.record.sortName}
                style={{ width: 800 }}
                onChange={this.getSortName}
              />
            </div>
            <div style={{ marginTop: 15 }}>
              <span style={{ display: 'inline-block', width: 100, textAlign: 'right' }}>
                模糊搜索：
              </span>
              <Search
                placeholder="请输入搜索名词"
                onSearch={this.pnounMemSearch}
                style={{ width: 800 }}
                // enterButton
              />
            </div>
            {!isNew && (
              <div style={{ marginTop: 15 }}>
                <span style={{ display: 'inline-block', width: 100, textAlign: 'right' }}>
                  excel导入：
                </span>
                <div style={{ display: 'inline-block', width: '800px' }}>
                  <Upload
                    accept=".xls,.xlsx"
                    showUploadList={false}
                    beforeUpload={this.beforeUpload}
                  >
                    <Button>
                      <Icon type="upload" />
                      上传附件
                    </Button>
                    <span style={{ padding: 20 }}>目前进度：</span>
                    <div style={{ width: 140, display: 'inline-block' }}>
                      <Progress size="small" percent={Number(uploadProcess)} />
                    </div>
                  </Upload>
                  <a
                    href={`${global.req_url}/smartim/knowledge/file/templet?importtype=file_scene_import`}
                    style={{ float: 'right' }}
                    download="模板"
                  >
                    模板下载
                  </a>
                </div>
              </div>
            )}
            <div style={{ marginTop: 20 }}>
              <span
                style={{ display: 'inline-block', width: 100, textAlign: 'right', float: 'left' }}
              >
                名词成员：
              </span>
              <div
                style={{
                  marginLeft: 10,
                  cursor: 'pointer',
                  color: '#31A3F4',
                  width: 98,
                  float: 'left',
                }}
                onClick={this.addNewStandarrColumn}
              >
                +新增测试成员
              </div>
              <div
                style={{
                  marginLeft: 20,
                  cursor: 'pointer',
                  color: '#31A3F4',
                  width: 60,
                  float: 'left',
                }}
              >
                <Popconfirm
                  title="确定批量删除选中行吗?"
                  onConfirm={this.batchDelete}
                  okText="确定"
                  cancelText="取消"
                >
                  批量删除
                </Popconfirm>
              </div>
              <Table
                columns={columns1}
                rowKey="id"
                dataSource={this.state.record.pnounMem}
                style={{ width: 800, display: 'inline-block', marginLeft: 100, marginTop: 20 }}
                bordered
                loading={loading}
                pagination={{
                  showQuickJumper: true,
                  onChange: this.pnounMemChange,
                  current: currentPnounMem,
                  // showSizeChanger: true,
                  total: totalCount,
                  pageSize: tableSize,
                }}
                rowSelection={rowSelection}
              />
            </div>
          </Modal>
          <Modal
            title="编辑名词"
            visible={this.state.RegularVisible}
            onOk={this.handleOkRegular}
            onCancel={this.handleCancelRegular}
            width={800}
          >
            <div>
              <span style={{ display: 'inline-block', width: 100, textAlign: 'right' }}>
                <span style={{ color: 'red', textAlign: 'right' }}>*</span>
                名称：
              </span>
              <Input
                placeholder="请输入名称"
                style={{ width: 600 }}
                value={this.state.record.sortName}
                onChange={this.getRegSortname}
              />
            </div>
            <div style={{ marginTop: 20 }}>
              <span style={{ display: 'inline-block', width: 100, textAlign: 'right' }}>
                <span style={{ color: 'red', textAlign: 'right' }}>*</span>
                正则表达式：
              </span>
              <Input
                placeholder="请输入正则表达式"
                style={{ width: 600 }}
                value={this.state.record.rep}
                onChange={this.getRegrep}
              />
            </div>
            <div style={{ marginTop: 20 }}>
              <span
                style={{ display: 'inline-block', width: 100, textAlign: 'right', float: 'left' }}
              >
                测试表达式：
              </span>
              <TextArea rows={4} style={{ width: 600 }} onChange={this.testRep} />
            </div>
            <div style={{ marginTop: 20 }}>
              <span style={{ display: 'inline-block', width: 100, textAlign: 'right' }}>
                测试结果：
              </span>
              <span>{this.state.represult}</span>
            </div>
          </Modal>
        </div>
        <div style={{ marginTop: 20 }}>
          <Spin spinning={dataLoading}>
            <Table
              columns={columns}
              dataSource={this.state.listData}
              rowKey="id"
              // loading={dataLoading}
              // dataSource={data1}
              pagination={false}
            />
          </Spin>
        </div>
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <Pagination
            onChange={this.changePage}
            current={this.state.curPage}
            pageSize={10}
            total={this.state.totalElements}
          />
        </div>
      </div>
    );
  }
}

export default LexiconManagement;

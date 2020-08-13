/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-string-refs */
/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
import { connect } from 'dva';
import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';

import {
  Select,
  Input,
  Form,
  Button,
  Icon,
  Table,
  Pagination,
  List,
  Row,
  Col,
  message,
  Mentions,
} from 'antd';

import { getUserInfo } from '../../../../../utils/userInfo';

// import 'brace/ext/language_tools';

const { Option } = Select;

@connect()
@Form.create()
export default class RecoveryConfiguration extends React.Component {
  state = {
    firstModelVisible: 'block',
    secondModelVisible: 'none',
    thirdModelVisible: 'none',
    forthModelVisible: 'none',
    lineCount: [],
    functionType: [],
    tableList: [],
    connectionSuccess: false,
    tableColumnsList: [],
    tptableColumnsList: [],
    connectParam: {},
    lexNameList: [],
    tplexNameList: [],
    globalLexNameList: [],
    tpglobalLexNameList: [],
    selectedType: 501,
    resultStr: '',
    kgList: [], // 图谱列表
    curKg: '', // 当前选中图谱
    conceptList: [], // 概念列表
    curConcept: '',
    attrList: [], // 属性列表
    entityList: [], // 实体列表
    settingResult: '',
    allLexNameList: [],
    attrValue: '',
    codeEditorAllList: [],
    apiParams: '',
    apiParamsStatus: true, // 代表 json 字符串的输入格式是否正确
    codeRequestvalue: '',
    codeResponseValue: '',
    apiTest: false,
    response: '',
  };

  componentWillMount() {
    this.getByIntentId('global');
  }

  componentDidMount() {
    this.getFunctionType();
    this.getConfigInfo();
    this.getKgList();
  }

  componentWillReceiveProps() {}

  onLexNameSelect = () => {};

  // 获取图谱列表
  getKgList = () => {
    const userInfo = getUserInfo();
    const userId = userInfo.id;
    const { dispatch } = this.props;
    dispatch({
      type: 'recoveryConfiguration/getKgList',
      payload: { userId },
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.setState({
          kgList: res.data,
        });
      }
    });
  };

  // 获取概念列表
  getConceptList = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoveryConfiguration/getConceptList',
      payload: {
        kgCode: e,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.setState({
          conceptList: res.data,
        });
      }
    });
  };

  // 获取属性列表
  getAttrList = (e, val) => {
    const { curKg, curConcept } = this.state;
    const { dispatch, form } = this.props;
    dispatch({
      type: 'recoveryConfiguration/getAttrList',
      payload: e || {
        kgCode: curKg,
        conceptCode: curConcept,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.setState(
          {
            attrList: res.data,
          },
          () => {
            if (val && val.type && val.id && val.name) {
              form.setFieldsValue({ attr: `${val.type},${val.id},${val.name}` });
              this.setState({
                attrValue: val,
              });
            } else {
              this.setState({
                attrValue: '',
              });
            }
          }
        );
      }
    });
  };

  // 获取实体列表
  getEntityList = (e, val) => {
    const { curKg, curConcept } = this.state;
    const { dispatch, form } = this.props;
    dispatch({
      type: 'recoveryConfiguration/getEntityList',
      payload: e || {
        kgCode: curKg,
        conceptCode: curConcept,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.setState(
          {
            entityList: res.data,
          },
          () => {
            if (val) {
              form.setFieldsValue({ entity: `${val.type},${val.id},${val.name}` });
            }
          }
        );
      }
    });
  };

  getConfigInfo = () => {
    const { dispatch, intentId, form } = this.props;
    dispatch({
      type: 'recoveryConfiguration/getFunctionExampleByIntentId',
      payload: {
        intentId,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.handleChange((res.data && res.data.type) || 501);
        this.setState({
          selectedType: (res.data && res.data.type) || 501,
        });
        if (!res.data || !res.data.params) return;
        // 有数据的话，必然是连接成功
        const configInfo = JSON.parse(res.data.params);
        const {
          dbType,
          dbUrl,
          userName,
          password,
          resultColumn,
          kgCode,
          conceptCode,
          entity,
          attr,
          url,
          params,
          response,
          responseResult,
        } = configInfo;
        const { result } = res.data;
        const param = { dbType, dbUrl, userName, password };
        let showStr = result;
        const { tpglobalLexNameList } = this.state;
        tpglobalLexNameList.forEach((item) => {
          if (result.length !== 0 && result.indexOf(`@${item}@`) !== -1) {
            showStr = showStr.replace(`@${item}@`, `@${item}`);
          }
        });
        this.setState({
          connectParam: param, // 用于获取表字段
          connectionSuccess: true,
          settingResult: showStr,
        });
        // 给表单赋值
        form.setFieldsValue({ dbType, dbUrl, userName, password, resultColumn });
        // 获取四个下拉框值
        // && conceptCode && entity && attr
        this.getKgList();
        if (kgCode) {
          form.setFieldsValue({ kgCode });
          if (conceptCode) {
            form.setFieldsValue({ conceptCode });
            this.getConceptList(kgCode);
            if (entity) {
              this.getEntityList({ kgCode, conceptCode }, entity);
            } else {
              this.getEntityList({ kgCode, conceptCode });
            }

            if (attr) {
              this.getAttrList({ kgCode, conceptCode }, attr);
            } else {
              this.getAttrList({ kgCode, conceptCode });
            }
          }
        }

        this.getTables(param, configInfo.tableName); // 获取所有表格,选中存储表格
        if (configInfo.tableName)
          this.getTableColumns(configInfo.tableName, configInfo.sqlCondition); // 如果表格存在的话，加载表格的字段名
        this.getByIntentId(configInfo.sqlCondition);
        // 获取当前数据库下所有表格
        if (configInfo.sqlCondition && configInfo.sqlCondition.length > 0) {
          // 如果存在条件
          form.setFieldsValue({
            con1: configInfo.sqlCondition[0].key,
            con2: configInfo.sqlCondition[0].value,
          });
          // 处理数据
          const arr = [];
          for (let i = 1; i < configInfo.sqlCondition.length; i += 1) {
            const k = i - 1;
            arr.push({
              tpId: k,
              value1: configInfo.sqlCondition[i].key,
              value2: configInfo.sqlCondition[i].value,
            });
          }
          this.setState({
            lineCount: arr,
          });
        }

        // 查询接口处理
        // if (response) { // 测试成功

        // 增加词槽的去 @ 处理
        let str2 = params;
        tpglobalLexNameList.forEach((item) => {
          if (params && params.length !== 0 && params.indexOf(`@${item}@`) !== -1) {
            str2 = str2.replace(`@${item}@`, `${item}`);
          }
        });

        this.setState({
          apiTest: true,
          codeRequestvalue: (str2 && JSON.stringify(JSON.parse(str2), null, '\t')) || '',
          codeResponseValue: (response && JSON.stringify(JSON.parse(response), null, '\t')) || '',
          apiParams: params,
        });
        form.setFieldsValue({
          url,
          responseResult,
        });
        // }
      }
    });
  };

  getFunctionType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoveryConfiguration/getFunctionType',
      payload: {},
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.setState({
          functionType: res.data,
        });
      }
    });
  };

  getTables = (param, curTableName) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'recoveryConfiguration/getTables',
      payload: param,
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.setState({
          tableList: res.data,
        });
        if (curTableName) {
          form.setFieldsValue({
            tableName: curTableName,
          });
        }
      }
    });
  };

  // 获取表所有字段
  getTableColumns = (e, sql) => {
    const { dispatch } = this.props;
    const { connectParam } = this.state;
    dispatch({
      type: 'recoveryConfiguration/getTableColumns',
      payload: {
        ...connectParam,
        tableName: e,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        if (sql) {
          const arr = sql.map((item) => item.key);
          const restarr = res.data.filter((item) => arr.indexOf(item) === -1);
          this.setState({
            tableColumnsList: restarr,
            tptableColumnsList: res.data,
          });
        } else {
          this.setState({
            tableColumnsList: res.data,
            tptableColumnsList: res.data,
          });
        }
      }
    });
  };

  getSelectedTable = (e) => {
    const { form } = this.props;
    const conArr = form.getFieldsValue(['con1', 'con2']);
    if (conArr.con1 || conArr.con2) {
      form.resetFields(['con1', 'con2']);
      this.setState(
        {
          lineCount: [],
        },
        () => {
          this.getTableColumns(e);
        }
      );
    } else {
      this.getTableColumns(e);
    }
  };

  onCodeChange = (e) => {
    const eidtor1 = this.refs.editor.editor;
    const { codeEditorAllList } = this.state;
    const arr = [];
    const str = String(e);
    codeEditorAllList.forEach((item) => {
      if (str.indexOf(item) === -1) {
        arr.push(item);
      }
    });
    const arr1 = arr.map((item) => ({
      name: item,
      value: item,
      score: 100,
      meta: '',
    }));
    this.addCompleters(eidtor1, arr1, true);
  };

  onCodeBlur = (event, e) => {
    const value2 = e.getValue();
    if (e.getSession().getAnnotations().length !== 0) {
      message.error('必须输入 json 格式字符串！');
      this.setState({
        apiParamsStatus: false,
        codeRequestvalue: value2,
      });
      return;
    }
    const val3 = (value2 && String(e.getValue()).replace(/[\r\n]/g, '')) || '';
    let val4 = (val3 && val3.replace(/\ +/g, '')) || '';
    const { codeEditorAllList } = this.state;
    codeEditorAllList.forEach((item) => {
      if (val4.indexOf(item) !== -1) {
        val4 = val4.replace(`@${item}`, `@${item}@`);
      }
    });
    const val5 = val4 !== '' ? val4 && JSON.parse(JSON.stringify(val4)) : '';
    const val6 = val5 !== '' ? val5 && JSON.stringify(val5) : '';
    const { apiParams } = this.state;
    if (val6 !== apiParams) {
      this.setState({
        apiTest: false,
      });
    }
    e.setValue(value2);
    this.setState({
      apiParams: val6,
      apiParamsStatus: true,
      codeRequestvalue: value2,
    });
  };

  // 获取词槽
  getByIntentId = (sqlCon) => {
    const { dispatch, intentId } = this.props;
    dispatch({
      type: 'sceneIntention/getByIntentId',
      payload: {
        intentId,
      },
    }).then((res) => {
      const list =
        res.data.list && res.data.list.filter((item) => item.isRequired && item.isRequired === 'Y');
      const allList = res.data.list.map((item) => item.name);
      const codeEditorAllList = res.data.list.map((item) => item.name);
      const lexNameList = res.data.list && list.map((item) => item.name);
      if (sqlCon) {
        if (sqlCon === 'global') {
          this.setState({
            globalLexNameList: allList,
            allLexNameList: allList,
            tpglobalLexNameList: [...allList, 'result'],
            codeEditorAllList,
          });
        } else {
          const arr = sqlCon.map((item) => item.value);
          const restarr = lexNameList.filter((item) => arr.indexOf(item) === -1);
          this.setState({
            lexNameList: restarr,
            tplexNameList: lexNameList,
          });
        }
      } else {
        this.setState({
          lexNameList,
          tplexNameList: lexNameList,
        });
      }
    });
  };

  handleChange = (e) => {
    this.setState({
      selectedType: e,
    });
    if (e === 501) {
      this.setState({
        firstModelVisible: 'block',
        secondModelVisible: 'none',
        thirdModelVisible: 'none',
        forthModelVisible: 'none',
      });
    } else if (e === 502) {
      this.setState({
        firstModelVisible: 'none',
        secondModelVisible: 'block',
        thirdModelVisible: 'none',
        forthModelVisible: 'none',
      });
    } else if (e === 503) {
      this.setState({
        firstModelVisible: 'none',
        secondModelVisible: 'none',
        thirdModelVisible: 'block',
        forthModelVisible: 'none',
      });
    } else {
      this.setState({
        firstModelVisible: 'none',
        secondModelVisible: 'none',
        thirdModelVisible: 'none',
        forthModelVisible: 'block',
      });
    }
  };

  // handleTextareaChange = (e) => {
  //   console.log(e);
  //   this.setState({
  //     resultStr: toString(e),
  //   });
  //   const val = toString(e);
  //   const arr = [];
  //   const { tpglobalLexNameList } = this.state;
  //   tpglobalLexNameList.forEach((item) => {
  //     if (val.indexOf(item) === -1) {
  //       arr.push(item);
  //     }
  //   });
  //   this.setState({
  //     globalLexNameList: arr,
  //   });
  // };

  handleNewTextareaChange = (value) => {
    this.setState({
      resultStr: value,
    });
    const arr = [];
    const { tpglobalLexNameList } = this.state;
    tpglobalLexNameList.forEach((item) => {
      if (value.indexOf(item) === -1) {
        arr.push(item);
      }
    });
    this.setState({
      globalLexNameList: arr,
    });
  };

  addNewLine = () => {
    // const tpId = new Date().getTime().toString();
    const { lineCount } = this.state;
    const tpId = lineCount.length;
    const newarr = [...lineCount, { tpId, value1: '', value2: '' }];
    this.setState({
      lineCount: newarr,
    });
  };

  delLine = (id) => {
    const { lineCount, tableColumnsList, lexNameList } = this.state;
    const { form } = this.props;
    lineCount.forEach((item) => {
      if (item.tpId === id) {
        // 如果当前删减的数据有内容
        if (form.getFieldValue(`con1${id}`)) {
          const newarr = [...tableColumnsList, form.getFieldValue(`con1${id}`)];
          this.setState({
            tableColumnsList: newarr,
          });
        }
        if (form.getFieldValue(`con2${id}`)) {
          const newarr = [...lexNameList, form.getFieldValue(`con2${id}`)];
          this.setState({
            lexNameList: newarr,
          });
        }
      }
    });
    const newLine = lineCount.filter((item) => item.tpId !== id);
    const newarr = newLine.map((item, index) => ({
      tpId: index,
      value1: item.value1,
      value2: item.value2,
    }));
    this.setState({
      lineCount: newarr,
    });
  };

  testConnectDB = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { dbType, dbUrl, userName, password } = values;
        const param = { dbType, dbUrl, userName, password };
        dispatch({
          type: 'recoveryConfiguration/testConnectDB',
          payload: param,
        }).then((res) => {
          if (res && res.status === 'OK') {
            message.success('连接成功！');
            this.setState({
              connectionSuccess: true,
              connectParam: param,
            });
            this.getTables(param);
            this.getByIntentId(); // 连接成功之后才获取词槽
          } else {
            message.error('连接失败！');
          }
        });
      }
    });
  };

  dbTestConChange = () => {
    this.setState({
      connectionSuccess: false,
      lineCount: [], // 清空数据
      tableList: [],
      tableColumnsList: [],
      tptableColumnsList: [],
    });
    const { form } = this.props;
    form.resetFields(['tableName', 'con1', 'con2']);
  };

  handleSubmitDatabase = () => {
    const { form } = this.props;
    const { lineCount, apiParams, response, selectedType } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const {
          dbType,
          dbUrl,
          userName,
          password,
          tableName,
          resultColumn,
          con1,
          con2,
          kgCode,
          conceptCode,
          entity,
          attr,
          url,
          responseResult,
        } = values;
        // sqlCondition
        const sqlCondition = [{ key: con1, value: con2 }];
        for (let i = 0; i < lineCount.length; i += 1) {
          sqlCondition.push({ key: values[`con1${i}`], value: values[`con2${i}`] });
        }
        const obj1 = entity && entity.split(',');
        const newentity = obj1 && { id: obj1[1], type: obj1[0], name: obj1[2] };
        const obj2 = attr && attr.split(',');
        const newattr = obj2 && { id: obj2[1], type: obj2[0], name: obj2[2] };
        let param = {};
        if (selectedType === 501) {
          param = { dbType, dbUrl, userName, password, tableName, resultColumn, sqlCondition };
          form.resetFields(['kgCode', 'conceptCode', 'entity', 'attr', 'url', 'responseResult ']);
          this.setState({
            apiParams: '',
            response: '',
            codeRequestvalue: '',
            codeResponseValue: '',
            apiTest: false,
          });
          this.refs.editor.editor.setValue('');
        } else if (selectedType === 502) {
          form.resetFields([
            'dbType',
            'dbUrl',
            'userName',
            'password',
            'tableName',
            'resultColumn ',
            'con1',
            'con2',
            'responseResult',
            'url',
          ]);
          this.setState({
            lineCount: [],
            apiParams: '',
            response: '',
            codeRequestvalue: '',
            codeResponseValue: '',
            apiTest: false,
          });
          this.refs.editor.editor.setValue('');
          param = { kgCode, conceptCode, entity: newentity || '', attr: newattr || {} };
        } else {
          form.resetFields([
            'dbType',
            'dbUrl',
            'userName',
            'password',
            'tableName',
            'resultColumn ',
            'con1',
            'con2',
            'kgCode',
            'conceptCode',
            'entity',
            'attr',
          ]);
          this.setState({
            lineCount: [],
          });
          param = { params: apiParams, url, responseResult, response };
        }
        // const param = {dbType,dbUrl,userName,password,tableName,resultColumn,sqlCondition,kgCode,conceptCode,entity:newentity||'',attr:newattr||{},params:apiParams,url,responseResult,response}
        this.saveConfig(JSON.stringify(param));
      }
    });
  };

  saveConfig = (params) => {
    const { selectedType, resultStr, tpglobalLexNameList } = this.state;
    let str = resultStr;
    tpglobalLexNameList.forEach((item) => {
      if (resultStr.length !== 0 && resultStr.indexOf(`@${item}`) !== -1) {
        str = str.replace(`@${item}`, `@${item}@`);
      }
    });
    const type = selectedType;
    const { intentId, dispatch } = this.props;
    dispatch({
      type: 'recoveryConfiguration/saveFunctionExample',
      payload: {
        type,
        intentId,
        result: str,
        params,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('保存成功！');
      } else {
        message.error('保存失败！');
      }
    });
  };

  changeCon1 = (id, value) => {
    const { tptableColumnsList, lineCount } = this.state;
    const { form } = this.props;
    const obj = form.getFieldsValue();
    obj[id] = value;
    const formSelected = []; // 把最新选中的放入表单选中项中
    // 获取表单之前的选中项
    if (obj.con1) formSelected.push(obj.con1);
    for (let i = 0; i < lineCount.length; i += 1) {
      if (obj[`con1${i}`]) formSelected.push(obj[`con1${i}`]);
    }

    const newarr = tptableColumnsList.filter((item) => formSelected.indexOf(item) === -1); // 滤除不在表单选中项中的项

    this.setState({
      tableColumnsList: newarr,
    });
  };

  changeCon2 = (id, value) => {
    const { tplexNameList, lineCount } = this.state;
    const { form } = this.props;
    const obj = form.getFieldsValue();
    obj[id] = value;
    const formSelected = []; // 把最新选中的放入表单选中项中
    // 获取表单之前的选中项
    if (obj.con2) formSelected.push(obj.con2);
    for (let i = 0; i < lineCount.length; i += 1) {
      if (obj[`con2${i}`]) formSelected.push(obj[`con2${i}`]);
    }

    const newarr = tplexNameList.filter((item) => formSelected.indexOf(item) === -1); // 滤除不在表单选中项中的项

    this.setState({
      lexNameList: newarr,
    });
  };

  kgChange = (e) => {
    this.setState({
      curKg: e,
    });
    // 获取概念名称
    this.getConceptList(e);
  };

  conceptChange = (e) => {
    this.setState(
      {
        curConcept: e,
      },
      () => {
        this.getAttrList();
        this.getEntityList();
      }
    );
  };

  complete = (codeEditorAllList, editor) => {
    // const {allLexNameList} = this.state;
    const completers = codeEditorAllList.map((item) => ({
      name: item,
      value: item,
      score: 100,
      meta: '',
    }));

    this.addCompleters(editor, completers);
    // editor.completers.push(completers);
  };

  addCompleters = (editor, completers, completersNew) => {
    if (completersNew) {
      const arr = [];
      editor.completers = arr;
      editor.completers.push({
        getCompletions(callback) {
          callback(null, completers);
        },
      });
      return;
    }
    editor.completers.push({
      getCompletions(callback) {
        callback(null, completers);
      },
    });
  };

  clearAttrCon = () => {
    const { form } = this.props;
    form.setFieldsValue({
      attr: '',
    });
    this.setState({
      attrValue: '',
    });
  };

  attrChange = (e) => {
    this.setState({
      attrValue: e,
    });
  };

  apiTestConnect = () => {
    const { apiParamsStatus } = this.state;
    if (!apiParamsStatus) {
      message.error('json 字符串输入有误，无法开始测试！');
      return;
    }
    const { form, dispatch } = this.props;
    const { apiParams } = this.state;
    // const requestType = form.getFieldValue("requestType");
    const url = form.getFieldValue('url');
    const obj = { params: apiParams, url };

    dispatch({
      type: 'recoveryConfiguration/interfaceTest',
      payload: obj,
    }).then((res) => {
      if (res) {
        message.success('连接成功！');
        const val = res;

        this.setState({
          apiTest: true,
          codeResponseValue: JSON.stringify(val, null, '\t'),
          response: JSON.stringify(val),
        });
      } else {
        message.error('连接失败！');
        this.setState({
          codeResponseValue: '',
        });
      }
    });
  };

  urlChange = () => {
    this.setState({
      apiTest: false,
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    const columns1 = [
      {
        title: '语句',
        dataIndex: 'name',
      },
      {
        title: '标注结果',
        dataIndex: 'age',
      },
      {
        title: '创建时间',
        dataIndex: 'address',
      },
      {
        title: '操作',
        dataIndex: 'address1',
        render: () => <a href="">删除</a>,
      },
    ];
    const data = [
      'Racing car sprays burning fuel into crowd.',
      'Japanese princess to wed commoner.',
      'Australian walks 100km after outback crash.',
      'Man charged over missing wedding girl.',
      'Los Angeles battles huge wildfires.',
    ];
    const { getFieldDecorator } = this.props.form;
    const {
      selectedType,
      firstModelVisible,
      secondModelVisible,
      thirdModelVisible,
      forthModelVisible,
      lineCount,
      functionType,
      connectionSuccess,
      tableList,
      tableColumnsList,
      lexNameList,
      settingResult,
      kgList,
      conceptList,
      attrList,
      entityList,
      globalLexNameList,
      allLexNameList,
      attrValue,
      codeEditorAllList,
      codeRequestvalue,
      codeResponseValue,
      response,
    } = this.state;
    return (
      <div style={{ width: '80%', margin: '10px auto' }}>
        <div style={{ width: '90%', margin: '0 auto' }}>
          <span>查询类型：</span>
          <Select defaultValue={501} onChange={this.handleChange} value={selectedType}>
            {functionType &&
              functionType.map((item) => (
                <Option value={item.functionId} key={item.functionId}>
                  {item.functionDesc}
                </Option>
              ))}
          </Select>
        </div>
        <div style={{ width: '90%', margin: '20px auto 0' }}>
          <div style={{ float: 'left', height: 100 }}>回复设置：</div>
          <div style={{ width: '84%', height: 100, display: 'inline-block' }}>
            {settingResult && (
              <Mentions
                placeholder="配置格式为 @XXX"
                style={{ width: '100%', height: 100, display: 'inline-block' }}
                suggestions={globalLexNameList}
                onChange={this.handleNewTextareaChange}
                defaultValue={settingResult}
                prefix="@"
              >
                {globalLexNameList.map((value) => (
                  <Option key={value} value={value}>
                    {value}
                  </Option>
                ))}
              </Mentions>
            )}

            {!settingResult && (
              <Mentions
                placeholder="配置格式为 @XXX"
                style={{ width: '100%', height: 100, display: 'inline-block' }}
                suggestions={globalLexNameList}
                onChange={this.handleNewTextareaChange}
                prefix="@"
              >
                {globalLexNameList.map((value) => (
                  <Option key={value} value={value}>
                    {value}
                  </Option>
                ))}
              </Mentions>
            )}
          </div>

          {/* <TextArea rows={4} style={{width:'80%',display:'inline-block'}} onChange={this.handleTextareaChange} value={resultStr} /> */}
        </div>
        {/* 数据库查询 */}
        <div style={{ marginTop: 80, marginBottom: 40, display: firstModelVisible }}>
          <Form onSubmit={this.handleSubmitDatabase}>
            <Form.Item label="数据库系统" {...formItemLayout}>
              {getFieldDecorator('dbType', {
                rules: [{}, {}],
              })(
                <Select onChange={this.dbTestConChange}>
                  <Option value="mysql">MySql</Option>
                  <Option value="oracle">Oracle</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="数据库地址url" {...formItemLayout}>
              {getFieldDecorator('dbUrl', {
                rules: [{}, {}],
              })(<Input onChange={this.dbTestConChange} />)}
            </Form.Item>
            <Form.Item label="用户名" {...formItemLayout}>
              {getFieldDecorator('userName', {
                rules: [{}, {}],
              })(<Input onChange={this.dbTestConChange} />)}
            </Form.Item>
            <Form.Item label="密码" {...formItemLayout}>
              {getFieldDecorator('password', {
                rules: [],
              })(<Input type="password" onChange={this.dbTestConChange} />)}
            </Form.Item>
            <div style={{ display: connectionSuccess ? 'block' : 'none' }}>
              <Form.Item label="表名" {...formItemLayout}>
                {getFieldDecorator('tableName', {
                  rules: [],
                })(
                  <Select onChange={this.getSelectedTable}>
                    {tableList.map((item) => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <div
                style={{
                  paddingLeft: '18%',
                  lineHeight: '36px',
                  color: '#eb9797',
                  marginBottom: 12,
                }}
              >
                注意：一次性只能在一个表中添加查询条件。若更换表，则清空当前查询条件。
              </div>
              <div>
                <Row>
                  <Col span={12}>
                    <Form.Item label="查询条件" {...formItemLayout1}>
                      {getFieldDecorator('con1', {
                        rules: [],
                      })(
                        <Select onChange={this.changeCon1.bind(this, 'con1')}>
                          {tableColumnsList.map((item) => (
                            <Option value={item} key={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={1} style={{ textAlign: 'center' }}>
                    <span style={{ padding: '0 10px' }}>=</span>
                  </Col>
                  <Col span={7}>
                    <Form.Item>
                      {getFieldDecorator('con2', {
                        rules: [],
                      })(
                        <Select onChange={this.changeCon2.bind(this, 'con2')}>
                          {lexNameList.map((item) => (
                            <Option value={item} key={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Icon
                      type="plus-circle"
                      style={{
                        fontSize: '20px',
                        padding: '0 10px',
                        cursor: 'pointer',
                        lineHeight: '36px',
                      }}
                      onClick={() => this.addNewLine(-1)}
                    />
                  </Col>
                </Row>
              </div>

              {lineCount &&
                lineCount.map((lineItem) => (
                  <div key={lineItem.tpId}>
                    <Row>
                      <Col span={12}>
                        <Form.Item label="查询条件" {...formItemLayout1}>
                          {getFieldDecorator(`con1${lineItem.tpId}`, {
                            rules: [],
                            initialValue: lineItem.value1,
                          })(
                            <Select onChange={this.changeCon1.bind(this, `con1${lineItem.tpId}`)}>
                              {tableColumnsList.map((item) => (
                                <Option value={item} key={item}>
                                  {item}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={1} style={{ textAlign: 'center' }}>
                        <span style={{ padding: '0 10px' }}>=</span>
                      </Col>
                      <Col span={7}>
                        <Form.Item>
                          {getFieldDecorator(`con2${lineItem.tpId}`, {
                            rules: [],
                            initialValue: lineItem.value2,
                          })(
                            <Select onChange={this.changeCon2.bind(this, `con2${lineItem.tpId}`)}>
                              {lexNameList.map((item) => (
                                <Option value={item} key={item}>
                                  {item}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Icon
                          type="plus-circle"
                          style={{
                            fontSize: '20px',
                            padding: '0 10px',
                            cursor: 'pointer',
                            lineHeight: '36px',
                          }}
                          onClick={() => this.addNewLine(-1)}
                        />
                        <Icon
                          type="minus-circle"
                          style={{
                            fontSize: '20px',
                            lineHeight: '36px',
                            padding: '0px 0px',
                            cursor: 'pointer',
                          }}
                          onClick={() => this.delLine(lineItem.tpId)}
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
              <Form.Item label="查询结果" {...formItemLayout}>
                {getFieldDecorator('resultColumn', {
                  rules: [],
                })(
                  <Select>
                    {tableColumnsList.map((item) => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </div>
            <div
              style={{
                textAlign: 'center',
                marginTop: '40px',
                display: connectionSuccess ? 'none' : 'block',
              }}
            >
              <Button type="primary" onClick={this.testConnectDB}>
                测试连接
              </Button>
            </div>
            <div
              style={{
                textAlign: 'center',
                marginTop: '40px',
                display: connectionSuccess ? 'block' : 'none',
              }}
            >
              <Button type="primary" htmlType="submit">
                {' '}
                确定
              </Button>
              <Button type="default" style={{ marginLeft: 20 }}>
                取消
              </Button>
            </div>
          </Form>
        </div>

        {/* 图谱查询设置 */}
        <div style={{ marginTop: 80, marginBottom: 40, display: secondModelVisible }}>
          <p>图谱查询设置</p>
          <Form onSubmit={this.handleSubmitDatabase} style={{ marginTop: 20 }}>
            <Form.Item label="图谱名称" {...formItemLayout}>
              {getFieldDecorator('kgCode', {
                rules: [{}, {}],
              })(
                <Select onChange={this.kgChange}>
                  {kgList.map((item) => (
                    <Option value={item.kgCode} key={item.kgCode}>
                      {item.kgName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="概念名称" {...formItemLayout}>
              {getFieldDecorator('conceptCode', {
                rules: [{}, {}],
              })(
                <Select onChange={this.conceptChange}>
                  {conceptList.map((item) => (
                    <Option value={item.code} key={item.code}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="实体名称" {...formItemLayout}>
              {getFieldDecorator('entity', {
                rules: [{}, {}],
              })(
                <Select>
                  {entityList.map((item) => (
                    <Option value={`1,${item.id},${item.name}`} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                  {allLexNameList.map((item) => (
                    <Option value={`0,'',${item}`} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="查询属性" {...formItemLayout}>
              {getFieldDecorator('attr', {
                rules: [{}, {}],
              })(
                <Select
                  suffixIcon={
                    attrValue ? (
                      <Icon type="close-circle" onClick={this.clearAttrCon} />
                    ) : (
                      <Icon type="down" />
                    )
                  }
                  onChange={this.attrChange}
                >
                  {attrList.map((item) => (
                    <Option value={`1,${item.id},${item.name}`} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                  {allLexNameList.map((item) => (
                    <Option value={`0,'',${item}`} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button type="default" style={{ marginLeft: 20 }}>
                取消
              </Button>
            </div>
          </Form>
          <div style={{ width: '100%', height: 80 }}>&nbsp;</div>
        </div>

        {/* 接口编辑 */}
        <div style={{ marginTop: 80, marginBottom: 40, display: thirdModelVisible }}>
          <div>
            <Form onSubmit={this.handleSubmitDatabase}>
              <Row>
                <Col span={10}>
                  <Form.Item>
                    {getFieldDecorator('requestType', {
                      rules: [{}, {}],
                      initialValue: 'post',
                    })(
                      <Select>
                        <Option value="post">POST</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={14}>
                  <Form.Item>
                    {getFieldDecorator('url', {
                      rules: [{}, {}],
                    })(<Input style={{ marginLeft: 10 }} onChange={this.urlChange} />)}
                  </Form.Item>
                </Col>
              </Row>
              <div>
                <p>请求参数：</p>
                <div style={{ marginTop: 20, marginBottom: 20 }}>
                  {codeEditorAllList.length !== 0 ? (
                    <AceEditor
                      ref="editor"
                      mode="java"
                      theme="monokai"
                      onChange={this.onCodeChange}
                      onBlur={this.onCodeBlur}
                      enableBasicAutocompletion
                      enableLiveAutocompletion
                      enableSnippets
                      name="UNIQUE_ID_OF_DIV"
                      value={codeRequestvalue}
                      editorProps={{ $blockScrolling: true }}
                      fontSize={16}
                      onLoad={this.complete.bind(this, codeEditorAllList)}
                      width="100%"
                    />
                  ) : (
                    <AceEditor
                      ref="editor"
                      mode="java"
                      theme="monokai"
                      onChange={this.onCodeChange}
                      onBlur={this.onCodeBlur}
                      enableBasicAutocompletion
                      enableLiveAutocompletion
                      enableSnippets
                      name="UNIQUE_ID_OF_DIV"
                      value={response}
                      editorProps={{ $blockScrolling: true }}
                      fontSize={16}
                      width="100%"
                    />
                  )}
                </div>
                <Form.Item label="返回值表达式">
                  {getFieldDecorator('responseResult', {
                    rules: [{}, {}],
                  })(<Input style={{ width: '100%' }} />)}
                </Form.Item>
              </div>
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: 20 }}>
                  保存
                </Button>
                <Button type="primary" onClick={this.apiTestConnect}>
                  测试连接
                </Button>
              </div>
              <div>
                <div>
                  <p>返回参数：</p>
                  <div style={{ marginTop: 20, marginBottom: 20 }}>
                    <AceEditor
                      ref="editor2"
                      mode="java"
                      theme="monokai"
                      name="UNIQUE_ID_OF_DIV2"
                      editorProps={{ $blockScrolling: true }}
                      fontSize={16}
                      readOnly
                      value={codeResponseValue}
                      width="100%"
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: 20 }} />
              </div>
            </Form>
          </div>
        </div>

        {/* {allLexNameList.length!==0 &&
         (
           <AceEditor
             ref="editor"
             mode="java"
             theme="monokai"
             onChange={this.onCodeChange.bind(this)}
             enableBasicAutocompletion
             enableLiveAutocompletion
             enableSnippets
             name="UNIQUE_ID_OF_DIV"
             editorProps={{ $blockScrolling: true }}
             fontSize={16}
             onLoad={this.complete.bind(this,allLexNameList)}
          
           />)} */}
        {/* 模型训练 */}
        <div style={{ marginTop: 80, marginBottom: 40, display: forthModelVisible }}>
          <div>
            <div style={{ textAlign: 'right', margin: '10px 0' }}>
              <Button type="primary" htmlType="submit" style={{ marginLeft: 20 }}>
                发起训练
              </Button>
            </div>
            <List
              header={<div>Header</div>}
              footer={<div>Footer</div>}
              bordered
              dataSource={data}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
            <div style={{ textAlign: 'right', marginTop: 10 }}>
              <Pagination defaultCurrent={1} total={50} />
            </div>
          </div>
          <div style={{ marginTop: 40 }}>
            <div style={{ textAlign: 'right', margin: '10px 0' }}>
              <Button type="primary" htmlType="submit" style={{ marginLeft: 20 }}>
                导入
              </Button>
            </div>
            <Table columns={columns1} />
            <div style={{ textAlign: 'right', marginTop: 10 }}>
              <Pagination defaultCurrent={1} total={50} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

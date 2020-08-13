/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-comp */
import shortId from 'shortid';
import React from 'react';
import { connect } from 'dva';
import { Modal, Table, Tooltip, Select, Form, Icon, Radio, Button, message } from 'antd';
import CommonSelect from '../../../../../../components/CommonSelect';
import EditInputCells from './EditInputCells';
import EditSelectCells from './EditSelectCells';
import ReplayType from './ReplayType';
import { quickReplayType } from '../../../../../../utils/resource';
import styles from '../../index.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

@connect((props) => {
  const { loading, sceneIntention } = props;
  return {
    sceneIntention,
    loading: loading.models.sceneIntention,
  };
})
export default class DialogReply extends React.Component {
  state = {
    rules: this.props.reply.rules || [],
    replyType: 'text',
    response: this.props.reply.response ? JSON.parse(this.props.reply.response) : [{}],
    errType: this.props.reply.errType || '0',
    errRetry: this.props.reply.errRetry || '3',
  };

  onchange(key, value) {
    if (this.state[key] !== value) {
      this.setState({ [key]: value });
    }
    this.callBackDataSourceChange();
  }
  renderPdesc = (record) => {
    const key1 = ['code', 'code'];
    const {
      sceneIntention: { intentionSlotList, sceneIntentionList: intentionList = [] },
    } = this.props;
    const ptype = record.ptype || quickReplayType[0].id;
    const word = record.pdesc;
    const available = record.available === '0';
    const content =
      ptype === 'intent' ? (
        <CommonSelect
          classNames={available ? 'redBorderSelect' : ''}
          defaultValue={word || intentionList[0].id}
          style={{ width: '100%' }}
          optionData={{ datas: intentionList }}
          onChange={(val) => {
            this.handleChangeReplyData(record, 'pdesc', val);
          }}
        />
      ) : (
        <EditSelectCells
          classNames={available ? 'redBorderSelect' : ''}
          value={word}
          keys={key1}
          dataSource={intentionSlotList}
          onChange={(v) => {
            this.handleChangeReplyData(record, 'pdesc', v);
          }}
        />
      );
    if (!available) return content;
    return (
      <Tooltip title="当前词槽/意图已禁用">
        <div>{content}</div>
      </Tooltip>
    );
  };
  // 回复列
  getColumns() {
    const key2 = ['code', 'description'];
    const {
      sceneIntention: { intentionOperatorList },
    } = this.props;
    return [
      {
        title: '方式',
        dataIndex: 'ptype',
        width: 100,
        render: (value, record) => {
          return (
            <CommonSelect
              defaultValue={value || quickReplayType[0].id}
              style={{ width: '100%' }}
              optionData={{ datas: quickReplayType }}
              onChange={(val) => {
                this.handleChangeReplyData(record, 'ptype', val);
              }}
            />
          );
        },
      },
      {
        title: '词槽/意图',
        dataIndex: 'pdesc',
        key: 'pdesc',
        width: 100,
        render: (word, record) => {
          return this.renderPdesc(record);
        },
      },
      {
        title: '状态',
        dataIndex: 't',
        key: 't',
        width: 100,
        render: (operator, record) => {
          return (
            <EditSelectCells
              value={operator}
              keys={key2}
              dataSource={intentionOperatorList}
              onChange={(v) => {
                this.handleChangeReplyData(record, 't', v);
              }}
            />
          );
        },
      },
      {
        title: '内容',
        dataIndex: 'v',
        key: 'v',
        width: 200,
        render: (values, record) => {
          if (record.ptype === 'intent') {
            return null;
          }
          return (
            <EditInputCells
              values={values}
              length={record.t === 'between' ? 2 : 1}
              onChange={(v) => {
                this.handleChangeReplyData(record, 'v', v);
              }}
            />
          );
        },
      },
      {
        title: '操作',
        width: 70,
        key: 'operatorI',
        render: (record) => {
          return (
            <div>
              <a
                onClick={() => {
                  this.handleReplyDelete(record);
                }}
              >
                删除
              </a>
            </div>
          );
        },
      },
    ];
  }
  doReplay = (last, index) => {
    const { response = [] } = this.state;
    if (last) {
      response.push({ respType: 'txt' });
      this.newResponse = response;
      this.setState({ response });
      return;
    }
    const newRes = response.filter((item, i) => {
      return index !== i;
    });
    this.newResponse = newRes;
    this.setState({ response: newRes });
  };
  // 快速回复改变
  replayCallBack = (index, resp, type) => {
    const response = this.newResponse || [];
    const newArr = response.map((res = {}, i) => {
      if (index === i) {
        return resp;
      } else {
        return res;
      }
    });
    this.newResponse = newArr;
    if (type === 'respText') return;
    this.onchange('response', newArr);
  };
  // 回复删除
  handleReplyDelete(record) {
    const { rules } = this.state;
    const filteredList = rules.filter((o) => o.key !== record.key);
    this.setState({ rules: filteredList });
    this.callBackDataSourceChange(filteredList);
  }

  // 回复新增
  handleReplyAdd() {
    const { rules } = this.state;
    const addObj = { key: shortId.generate(), p: '', t: '', v: '' };
    rules.push(addObj);
    this.setState({ rules });
    this.callBackDataSourceChange(rules);
  }

  callBackDataSourceChange() {
    if (this.props.onChange) {
      // 暂时不需要回传
      // this.props.onChange(rules);
    }
  }

  // 回复数据修改
  handleChangeReplyData(record, key, value) {
    const { rules } = this.state;
    const alterObj = rules.filter((o) => o.key === record.key)[0];
    if (alterObj[key] !== value) {
      alterObj[key] = value;
      // 方式改变内容清空
      if (key === 'ptype') {
        alterObj.p = '';
        alterObj.pdesc = '';
      }
      this.setState({ rules });
      this.callBackDataSourceChange();
    }
  }

  save() {
    const { rules, errType, errRetry } = this.state;
    const {
      sceneId,
      intention,
      reply: { id },
    } = this.props;
    const response = this.newResponse || [{}];
    if (response.length === 1) {
      if (!response[0].respText) {
        message.error('请填写回复方式');
        return;
      }
    }
    const addRules = rules.map((o) => {
      return {
        t: o.t,
        pdesc: o.pdesc,
        ptype: o.ptype || 'slot',
        ...o,
        v: o.ptype === 'intent' ? o.pdesc : o.v,
        p: o.ptype === 'intent' ? 'NLU.intent.id' : `${o.ptype || 'slot'}.${o.pdesc}`,
      };
    });
    const addObj = {
      enterChat: {
        rules: addRules,
      },
      stateChat: {
        errRetry,
        errType,
        response,
      },
    };
    // dispatch({
    //   type: 'sceneIntention/fetchSaveIntentionDialogReply',
    //   payload: playObj,
    // });
  }
  doDelete = () => {
    const {
      sceneId: sceneid,
      reply: { id, key },
      intention: { code: intent, id: intentid },
      dispatch,
    } = this.props;
    if (id !== '') {
      dispatch({
        type: 'sceneIntention/fetchDeleteIntentionDialogReply',
        payload: { id, sceneid, intent, intentid },
      });
    } else if (this.props.onDelete) {
      const { onDelete } = this.props;
      onDelete(key);
    }
  };
  delete() {
    const {
      reply: { id },
    } = this.props;
    if (!id) return;
    const that = this;
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.doDelete();
      },
    });
  }
  newResponse = this.props.reply.response ? JSON.parse(this.props.reply.response) : [{}];
  render() {
    const { loading } = this.props;
    const { rules, response = [], errType, errRetry } = this.state;
    const columns = this.getColumns();
    return (
      <React.Fragment>
        <Form className={styles.replyform}>
          <div className={styles.item}>
            <FormItem label="触发条件：">
              <Table
                loading={loading}
                dataSource={rules}
                columns={columns}
                pagination={false}
                footer={() => {
                  return (
                    <a>
                      <Icon type="plus" className="bold" onClick={() => this.handleReplyAdd()} />
                    </a>
                  );
                }}
              />
            </FormItem>
          </div>
          <div className={styles.item}>
            <FormItem label="回复方式：">
              {response.map((item, index) => {
                return (
                  <ReplayType
                    handleCols={this.doReplay}
                    replayCallBack={this.replayCallBack}
                    last={index === response.length - 1}
                    item={item}
                    index={index}
                  />
                );
              })}
            </FormItem>
          </div>
          <div className={styles.item}>
            <FormItem label="异常处理">
              <RadioGroup
                onChange={(e) => {
                  this.onchange('errType', e.target.value);
                }}
                value={errType}
              >
                <Radio value="0">直接跳转</Radio>
                <Radio value="1">重试后跳转</Radio>
              </RadioGroup>
            </FormItem>
          </div>
          <div className={styles.item}>
            <FormItem label="重复次数">
              <Select
                defaultValue={errRetry}
                style={{ width: 90 }}
                onChange={(value) => {
                  this.onchange('errRetry', value);
                }}
              >
                <Select.Option value="1">1次</Select.Option>
                <Select.Option value="2">2次</Select.Option>
                <Select.Option value="3">3次</Select.Option>
              </Select>
            </FormItem>
          </div>
          <div className={styles.replyButDiv}>
            <Button style={{ marginRight: 20 }} onClick={this.save.bind(this)}>
              保存
            </Button>
            <Button onClick={this.delete.bind(this)}>删除</Button>
          </div>
        </Form>
      </React.Fragment>
    );
  }
}

/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import { connect } from 'dva';
import { Card, Icon, Collapse } from 'antd';
import update from 'immutability-helper';
import { formatMessage } from 'umi-plugin-react/locale';
import Area from './Area'
import Element from './Element';
import ItemTypes from './ItemTypes';
import styles from './index.less';
import Iconfont from '@/components/Iconfont';

const { Panel } = Collapse;

@connect(({ loading }) => ({
  loading: loading.effects['activityTemplateDetail/qryColsGroupByCamType'],
}), null, null, {withRef: true})
class ActivityTemplateCon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTableArea: false,
      elements: {},
      contentList: [],
      tableList: [],
    }
  }

  componentDidMount () {
    this.qryColsGroupByCamType();
  }

  componentDidUpdate (prevProps) {
    const { contentList, tableList, camType } = this.props;
    if(JSON.stringify(prevProps.contentList) != JSON.stringify(contentList)) {
      this.setState({ contentList });
    }
    if(JSON.stringify(prevProps.tableList) != JSON.stringify(tableList)) {
      this.setState({ tableList, showTableArea: tableList && tableList.length });
    }
    if(JSON.stringify(prevProps.camType) != JSON.stringify(camType)) {
      this.qryColsGroupByCamType();
    }
  }

  qryColsGroupByCamType = () => {
    const { dispatch, camType } = this.props;
    dispatch({
      type: 'activityTemplateDetail/qryColsGroupByCamType',
      payload: {
        orderType: camType
      },
      success: (svcCont) => {
        const { data } = svcCont;
        const activeKeys = [];
        Object.keys(data).map(key => activeKeys.push(key));
        this.setState({
          elements: data,
          activeKeys
        })
      }
    })
  }

  // 打开表格控制区域
  openTableArea = () => {
    this.setState({ showTableArea: true });
  }

  delTableArea = () => {
    this.setState({ showTableArea: false, tableList: [] });
  }

  // 放置到区域内
  onDrop = (areaType, item) => {
    const { state } = this;
    const data = [...state[areaType]];
    const index = data.findIndex(fitem => !fitem);
    const itemIndex = item && item.columnId ? data.findIndex(fitem => fitem && fitem.columnId === item.columnId) : -1;
    if(index > -1) {
      if(itemIndex < 0) {
        this.save({[areaType]:
          update(data, {
            $splice: [[index, 1], [index, 0, item]],
          }),
        }, this.clear)
      }
      else {
        this.save({[areaType]:
          update(data, {
            $splice: [[index, 1]],
          }),
        }, this.clear)
      }
    } else if(itemIndex < 0) {
      this.save({[areaType]: [...data,item]}, this.clear);
    }
  }

  // 区域内块hover经过
  moveCard = (areaType, dragIndex, hoverIndex) => {
    const { state } = this;
    const data = [...state[areaType]];
    const dragCard = data[dragIndex];
    if(dragIndex || dragIndex === 0){
      const newData = update(data, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
      })
      this.save({[areaType]: newData});
    }
    else {
      const newData = update(data, {
        $splice: [[hoverIndex, 0, dragCard]],
      })
      this.save({[areaType]: newData});
    }
  }

  delElement = (areaType, deleteIndex) => {
    const { state } = this;
    const data = [...state[areaType]];
    if(deleteIndex >= 0) {
      // this.setState({[areaType]:
      //   update(data, {
      //     $splice: [[deleteIndex, 1]],
      //   }),
      // });
      this.save({[areaType]:
        update(data, {
          $splice: [[deleteIndex, 1]],
        }),
      });
    }
  }

  save = (data, callback) => {
    this.setState(data, callback);
  }

  // 清除多余
  clear = () => {
    const { contentList, tableList } = this.state;
    this.setState({
      contentList: contentList.filter(citem => !!citem),
      tableList: tableList.filter(citem => !!citem)
    })
  }

  // 控件区移出模板区域
  elementDragEnd = (item, monitor) => {
    const target = monitor.getDropResult();
    const { contentList, tableList } = this.state;
    if(!target) {
      this.setState({
        contentList: contentList.filter(citem => !!citem),
        tableList: tableList.filter(citem => !!citem)
      })
    }
  }

  // 处理提交数据
  getTemplateInfo = () => {
    const { contentList, tableList } = this.state;
    return {
      contentList: contentList.map(item => { return item.columnId }),
      tableList: tableList.map(item => { return item.columnId })
    }
  }

  // 控件区切换
  collapseChange = (keys) => {
    this.setState({ activeKeys: keys})
  }

  // 判断表格区域是否超上限 
  getTableLimit = () => {
    const { tableList } = this.state;
    const validList = tableList.filter(item => !!item );
    return validList.length >= 15;
  }

  render() {
    const {
      showTableArea,
      elements,
      contentList,
      tableList,
      activeKeys,
    } = this.state;

    const { disabled, getCamTypeName } = this.props;

    return (
      <>
        <p className={styles.title}>{formatMessage({ id: 'activityTemplate.elementTitle', defaultMessage: '要素控制' })}</p>
        <div className={styles.templateCon}>
          <div className={styles.left}>
            <Card size="small" title={formatMessage({ id: 'activityTemplate.elementArea', defaultMessage: '控件区' })}>
              <div className={styles.controlCollapse}>
                <Collapse
                  activeKey={activeKeys}
                  bordered={false}
                  expandIcon={({ isActive }) => (
                    <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                  )}
                  onChange={this.collapseChange}
                >
                  {Object.keys(elements).map(key => {
                    return (
                      <Panel header={getCamTypeName(key)} key={key} className={styles.customPannel}>
                        <div className={styles.elementsCon}>
                          {elements[key].map(item => (
                            <Element
                              disabled={disabled}
                              type={ItemTypes.FORM}
                              key={item.columnId}
                              dragEnd={this.elementDragEnd}
                              {...item}
                            />
                          ))}
                        </div>
                      </Panel>
                    );
                  })}
                </Collapse>
              </div>
            </Card>
          </div>
          <div className={styles.right}>
            <Card size="small" title={formatMessage({ id: 'activityTemplate.templateConfiguration', defaultMessage: '模板配置' })} className={styles.templateAreaCard}>
              <div>
                <Area
                  disabled={disabled}
                  areaType="contentList"
                  accept={ItemTypes.FORM}
                  elementType={ItemTypes.FORM}
                  data={contentList}
                  onDrop={this.onDrop}
                  moveCard={this.moveCard}
                  delElement={this.delElement}
                />
                <div className={styles.tableAreaControl}>
                  {!showTableArea ? (
                    <a onClick={this.openTableArea}>
                      <Icon type="plus" />
                      {formatMessage({ id: 'activityTemplate.addTable', defaultMessage: '添加表格' })}
                    </a>
                  ) : (
                    <Iconfont onClick={this.delTableArea} type="iconshanchux" className={styles.delBtn} />
                  )}
                </div>
                {
                  showTableArea ? (
                    <Area
                      disabled={disabled}
                      areaType="tableList"
                      accept={ItemTypes.FORM}
                      elementType={ItemTypes.TABLE}
                      data={tableList}
                      onDrop={this.onDrop}
                      moveCard={this.moveCard}
                      delElement={this.delElement}
                      outLimit={this.getTableLimit()}
                    />
                  ) : null
                }
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  }

}

export default ActivityTemplateCon;


import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';

// 活动管理配置页面
import activityFlow from './zh-CN/ActivityConfigManage/activityFlow';
import marketingActivityList from './zh-CN/ActivityConfigManage/marketingActivityList';

// 商品管理页面
import commodityManage from './zh-CN/CommodityManage';

// 标签管理及配置页面
import labelManage from './zh-CN/LabelConfigManage/labelManage';
import labelConfig from './zh-CN/LabelConfigManage/labelConfig';

// 渠道运营位管理页面
import channel from './zh-CN/ChannelOperation/channel';
import operation from './zh-CN/ChannelOperation/operation';

// 规则管理页面
import rulesInfo from './zh-CN/RulesManage/rulesInfo';
import recoRule from './zh-CN/RulesManage/recoRule';

// 推荐监控页面
import campaignMonitor from './zh-CN/CampaignMonitor/campaignMonitor'

import scheduleMonitor from './zh-CN/ScheduleMonitor/scheduleMonitor';
// 特殊分群管理页面
import specialGroup from './zh-CN/SpecialGroup/specialGroup'

// 订购监控页面
import responseMonitor from './zh-CN/ResponseMonitor/responseMonitor';

import campaignModal from './zh-CN/CampaignModal';

import marketingMonitor from './zh-CN/MarketingMonitor/marketingMonitor';

// 活动审批
import approvalManage from './zh-CN/ActivityApproval/approvalManage'
import approvalTemplate from './zh-CN/ActivityApproval/approvalTemplate'

// 缓存数据管理
import cacheManage from './zh-CN/CacheManage/cacheManage';

// 日志管理
import logManage from './zh-CN/LogManage/logManage';

// 特征视图
import feature from './zh-CN/feature';

// 欠费信息
import arrearageInfo from './zh-CN/ArrearageInfo/arrearageInfo';

// 客户欠费
import customerArrearage from './zh-CN/CustomerArrearage/customerArrearage';

// 活动模板要素配置
import templateElement from './zh-CN/TemplateElement/templateElement';

// 算法模型
import algorithmModel from './zh-CN/AlgorithmModel/algorithmModel';

// 干预规则
import intervene from './zh-CN/Intervene/intervene';

// 流程审批
import approve from './zh-CN/approve';

// 工单
import workOrder from './zh-CN/workOrder';

// 欠费管理
import arrearage from './zh-CN/arrearage';

// 活动模板
import activityTemplate from './zh-CN/activityTemplate';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.title': '商品推荐',
  'app.preview.down.block': '下载此页面到本地项目',
  ...globalHeader,
  ...menu,
  ...component,
  ...activityFlow,
  ...marketingActivityList,
  ...labelConfig,
  ...labelManage,
  ...channel,
  ...operation,
  ...commodityManage,
  ...rulesInfo,
  ...recoRule,
  ...campaignMonitor,
  ...scheduleMonitor,
  ...specialGroup,
  ...responseMonitor,
  ...campaignModal,
  ...marketingMonitor,
  ...approvalManage,
  ...approvalTemplate,
  ...cacheManage,
  ...logManage,
  ...feature,
  ...arrearageInfo,
  ...customerArrearage,
  ...templateElement,
  ...algorithmModel,
  ...intervene,
  ...approve,
  ...workOrder,
  ...arrearage,
  ...activityTemplate,
};

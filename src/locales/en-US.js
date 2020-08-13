import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';

// 活动管理配置页面
import activityFlow from './en-US/ActivityConfigManage/activityFlow';
import marketingActivityList from './en-US/ActivityConfigManage/marketingActivityList';

// 商品管理页面
import commodityManage from './en-US/CommodityManage';

// 标签管理及配置页面
import labelManage from './en-US/LabelConfigManage/labelManage';
import labelConfig from './en-US/LabelConfigManage/labelConfig';

// 渠道运营位管理页面
import channel from './en-US/ChannelOperation/channel';
import operation from './en-US/ChannelOperation/operation';

// 规则管理页面
import rulesInfo from './en-US/RulesManage/rulesInfo';
import recoRule from './en-US/RulesManage/recoRule';

// 推荐监控页面
import campaignMonitor from './en-US/CampaignMonitor/campaignMonitor'

import scheduleMonitor from './en-US/ScheduleMonitor/scheduleMonitor';
// 订购监控页面
import responseMonitor from './en-US/ResponseMonitor/responseMonitor';

import campaignModal from './en-US/CampaignModal';

// 缓存数据管理
import cacheManage from './en-US/CacheManage/cacheManage';

import marketingMonitor from './en-US/MarketingMonitor/marketingMonitor';

// 日志管理
import logManage from './en-US/LogManage/logManage';

import specialGroup from './en-US/SpecialGroup/specialGroup';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.title': 'MCCM',
  'app.preview.down.block': 'Download this page to your local project',
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
  ...recoRule,
  ...rulesInfo,
  ...campaignMonitor,
  ...scheduleMonitor,
  ...responseMonitor,
  ...campaignModal,
  ...cacheManage,
  ...marketingMonitor,
  ...logManage,
  ...specialGroup,
};

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
import campaignMonitor from './zh-CN/CampaignMonitor/campaignMonitor';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.title': '舆情分析',
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
};

const routes = [
  {
    path: '/login',
    component: './User/login',
  },
  {
    path: '/403',
    component: './403.jsx',
  },
  {
    path: '/',
    component: '../layouts/TabMenuLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        redirect: '/labelManage',
      },
      // {
      //   path: '/campaignMonitor', // 推荐监控
      //   name: 'campaignMonitor',
      //   icon: 'iconjiankong',
      //   component: './CampaignMonitor/index',
      // },
      {
        path: 'labelManage', // 标签管理
        name: 'labelManage',
        component: './LabelConfigManage/LabelManage/index',
        icon: 'iconbiaoqianguanli',
      },
      {
        path: 'channelOperation', // 渠道运营位管理
        component: './ChannelOperation/index',
        name: 'channelOperation',
        icon: 'iconyunyingwei',
      },
      {
        path: '/commodityManage', // 商品管理
        name: 'commodityManage',
        icon: 'iconshangpinguanli',
        routes: [
          {
            path: './',
            component: './CommodityManage/index',
          },
          {
            path: 'commodityView',
            component: './CommodityManage/CommodityView/index',
            name: 'commodityManage',
            hideInMenu: true,
          },
        ],
      },

      // 屏蔽创意管理
      {
        path: '/creativeIdeaManage',
        name: 'creativeIdeaManage',
        icon: 'smile',
        component: './CreativeIdeaManage/index.jsx',
      },

      // 特殊分群
      // {
      //   path: '/specialGroup',
      //   name: 'specialGroup',
      //   icon: 'iconhuodongguanli',
      //   component: './SpecialGroup/index',
      // },

      // 模板要素配置
      // {
      //   path: '/templateElement',
      //   name: 'templateElement',
      //   icon: 'iconshangpinguanli',
      //   component: './TemplateElement/index',
      // },

      {
        path: '/activityConfigManage', // 活动管理
        name: 'activityConfigManage',
        icon: 'iconhuodongguanli',
        routes: [
          {
            path: '/',
            redirect: '/campaignMonitor',
          },
          {
            path: 'marketingActivityList',
            component: './ActivityConfigManage/MarketingActivityList/index',
            name: 'marketingActivityList',
          },
          {
            path: 'activityFlow',
            component: './ActivityConfigManage/ActivityFlow/CreateFlow/index',
            name: 'activityFlow',
            hideInMenu: true,
          },
          // 日常工单任务
          // {
          //   path: 'dailyWorkOrder',
          //   name: 'dailyWorkOrder',
          //   component: './ActivityConfigManage/DailyWorkOrder',
          // },
        ],
      },

      // // 渠道容量管理
      // {
      //   path: '/channelCapacity',
      //   name: 'channelCapacity',
      //   icon: 'iconjiankong',
      //   component: './ChannelCapacity/index',
      // },

      // 缓存数据管理
      {
        path: '/cacheManage',
        name: 'cacheManage',
        icon: 'iconshangpinguanli',
        component: './CacheManage/index',
      },

      // 活动审批
      // {
      //   path: '/approve',
      //   name: 'approve',
      //   icon: 'iconshangpinguanli',
      //   routes: [
      //     {
      //       path: './',
      //       component: './Approve/List',
      //     },
      //     {
      //       path: 'detail',
      //       component: './Approve/Detail',
      //       name: 'approveDetail',
      //       hideInMenu: true,
      //     },
      //   ],
      // },

      // 活动审批管理
      // {
      //   path: '/activityReview',
      //   name: 'activityReview',
      //   icon: 'iconjiankong',
      //   routes: [
      //     {
      //       path: './',
      //       component: './ActivityReview/Table',
      //     },
      //     {
      //       path: 'detail',
      //       component: './ActivityReview/Detail',
      //       name: 'ActivityReviewDetail',
      //       hideInMenu: true,
      //     },
      //   ],
      // },

      // 工单信息
      {
        path: '/workOrder',
        name: 'workOrder',
        icon: 'iconshangpinguanli',
        routes: [
          {
            path: './',
            component: './WorkOrder',
          },
          {
            path: 'detail',
            name: 'detail',
            component: './WorkOrder/Detail',
            hideInMenu: true,
          },
        ],
      },

      // 活动视图
      {
        path: '/activityWork',
        name: 'activityWork',
        icon: 'iconshangpinguanli',
        component: './WorkOrder/ActivityWork/index',
      },

      // {
      //   path: '/rulesManage', // 规则信息管理
      //   name: 'rulesManage',
      //   icon: 'iconguizezu',
      //   routes: [
      //     {
      //       path: './',
      //       redirect: '/rulesManage/rulesInfoManage',
      //     },
      //     {
      //       path: 'recommendRuleManage',
      //       component: './RulesManage/RecommendRuleManage/index',
      //       name: 'recommendRuleManage',
      //     },
      //     {
      //       path: 'rulesInfoManage',
      //       component: './RulesManage/RulesInfoManage/index',
      //       name: 'rulesInfoManage',
      //     },
      //     {
      //       path: '/rulesManage/addRule',
      //       component: './RulesManage/RecommendRuleManage/RecoRule.jsx',
      //       name: 'addRule',
      //       hideInMenu: true,
      //     },
      //     {
      //       path: '/rulesManage/editRule',
      //       component: './RulesManage/RecommendRuleManage/RecoRule.jsx',
      //       name: 'editRule',
      //       hideInMenu: true,
      //     },
      //     {
      //       path: '/rulesManage/viewRule',
      //       component: './RulesManage/RecommendRuleManage/RecoRule.jsx',
      //       name: 'viewRule',
      //       hideInMenu: true,
      //     },
      //   ],
      // },

      /* 暂时屏蔽掉标签关联度配置 */
      // {
      //   path: '/labelConfigManage',
      //   name: 'labelConfigManage',
      //   icon: 'tags',
      //   routes: [
      //     {
      //       path: '/',
      //       redirect: 'labelManage',
      //     },
      //     {
      //       path: 'labelManage',
      //       name: 'labelManage',
      //       component: './LabelConfigManage/LabelManage/index',
      //     },
      //     {
      //       path: 'labelConfig',
      //       name: 'labelConfig',
      //       component: './LabelConfigManage/LabelConfig/index',
      //     },
      //   ],
      // },

      // {
      //   path: '/scheduleMonitor', // 推荐监控
      //   name: 'scheduleMonitor',
      //   icon: 'iconjiankong',
      //   component: './ScheduleMonitor/index',
      // },

      // {
      //   path: '/eventSrc', // 事件源配置
      //   name: 'eventSrc',
      //   icon: 'iconshangpinguanli',
      //   routes: [
      //     {
      //       path: './',
      //       component: './EventSrc/EventSrc/index',
      //     },
      //     {
      //       path: './configDetail',
      //       component: './EventSrc/ConfigDetail/index',
      //       name: 'configDetail',
      //       hideInMenu: true,
      //     },
      //   ],
      // },
      // {
      //   path: '/eventManage', // 事件管理
      //   name: 'eventManage',
      //   icon: 'iconshangpinguanli',
      //   routes: [
      //     {
      //       path: './',
      //       component: './EventManage/EventManage/index',
      //     },
      //     {
      //       path: './configDetail',
      //       component: './EventManage/ConfigDetail/index',
      //       name: 'configDetail',
      //       hideInMenu: true,
      //     },
      //   ],
      // },
      // {
      //   path: '/responseMonitor',
      //   name: 'responseMonitor',
      //   icon: 'iconjiankong',
      //   component: './ResponseMonitor/index',
      // },
      // // 营销活动监控
      {
        path: '/marketingMonitor',
        name: 'marketingMonitor',
        icon: 'iconjiankong',
        component: './MarketingMonitor/index',
      },

      // {
      //   path: '/logManage',
      //   name: 'logManage',
      //   icon: 'iconshangpinguanli',
      //   component: './LogManage/index',
      // },
      // 特征视图
      // {
      //   path: '/feature',
      //   name: 'feature',
      //   icon: 'iconshangpinguanli',
      //   routes: [
      //     {
      //       path: './',
      //       component: './Feature/FeatureList/index',
      //     },
      //     {
      //       path: 'detail',
      //       component: './Feature/FeatureDetail/index',
      //       name: 'detail',
      //       hideInMenu: true,
      //     },
      //   ],
      // },
      {
        path: '/feature/detail',
        name: 'feature',
        icon: 'iconshangpinguanli',
        component: './Feature/FeatureDetail/index',
        hideInMenu: true,
      },
      // 欠费信息
      // {
      //   path: '/arrearageInfo',
      //   name: 'arrearageInfo',
      //   icon: 'iconshangpinguanli',
      //   component: './ArrearageInfo/index',
      // },
      // 客户欠费视图
      // {
      //   path: '/customerArrearage',
      //   name: 'customerArrearage',
      //   icon: 'iconshangpinguanli',
      //   component: './CustomerArrearage/index',
      // },

      // 欠费管理
      // {
      //   path: '/arrearage',
      //   name: 'arrearage',
      //   icon: 'iconshangpinguanli',
      //   routes: [
      //     {
      //       path: './',
      //       component: './Arrearage/ArrearageAnalyze/index',
      //     },
      //     {
      //       path: 'detail',
      //       component: './Arrearage/ArrearageDetails/index',
      //       name: 'detail',
      //       hideInMenu: true,
      //     },
      //   ],
      // },

      // // 活动基础设置（模板）
      // {
      //   path: '/activityBase',
      //   name: 'activityBase',
      //   icon: 'iconshangpinguanli',
      //   routes: [
      //     {
      //       path: 'activityTemplate',
      //       component: './ActivityBase/ActivityTemplate/List',
      //       name: 'activityTemplate',
      //     },
      //     {
      //       path: 'templateDetail',
      //       component: './ActivityBase/ActivityTemplate/Detail',
      //       name: 'templateDetail',
      //       hideInMenu: true,
      //     },
      //   ],
      // },

      {
        path: '/activityScheduling',
        name: 'activityScheduling',
        icon: 'iconshangpinguanli',
        component: './EvaluationAnalysis',
      },
      {
        path: '/campaignMarketingComparison',
        name: 'campaignMarketingComparison',
        icon: 'iconshangpinguanli',
        component: './EvaluationAnalysis/contrast',
        hideInMenu: true,
      },
      {
        path: '/activityConfigModel',
        name: 'activityConfigModel',
        icon: 'iconshangpinguanli',
        component: './ActivityConfigModel/index',
      },
      // {
      //   path: '/algorithmModel',
      //   name: 'algorithmModel',
      //   icon: 'iconpricetag',
      //   routes: [
      //     {
      //       path: './',
      //       component: './AlgorithmModel',
      //     },
      //     {
      //       path: 'detail',
      //       name: '查看详情',
      //       component: './AlgorithmModel/Detail',
      //       hideInMenu: true,
      //     },
      //   ],
      // },
      // {
      //   path: '/intervene',
      //   name: 'intervene',
      //   icon: 'iconicon',
      //   component: './Intervene',
      // },

      // // 派单规则
      // {
      //   path: '/distributionRules',
      //   name: 'distributionRules',
      //   icon: 'iconshangpinguanli',
      //   component: './DistributionRules',
      // },
      // 活动效果评估
      // {
      //   path: '/effectEvaluation',
      //   name: 'effectEvaluation',
      //   hideInMenu: true,
      //   icon: 'iconshangpinguanli',
      //   component: './EffectEvaluation',
      // },
    ],
  },
  {
    component: './404',
  },
];

export default routes;

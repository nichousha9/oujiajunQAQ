// 页面统计的权限对应表
module.exports = {
    resource:{
      'statisticAgent': '4028b881641ac80401641c7f2eec0407', // 统计页面-访客统计tab
      'statisticAgentCity': '4028b881641ac80401641c8568e2040a', // 统计页面-访客统计tab-城市图表
      'statisticAgentGuest': '4028b881642007280164203e1dab03ee', // 统计页面-访客统计tab-会话量统计
      'statisticAgentUser': '4028b881641ac80401641c7fa28c0409', // 统计页面-客服统计tab
      'statisticRobot': '4028b881641ac80401641c7f5dcb0408', // 统计页面-机器人统计tab
      'statisticCommunication': '4028b881641ac80401641c7f5dcb0408', // 统计页面-通讯统计tab
    },
  // 节点的图片信息
    sceneDialogSetNode: {
      "function":require('../assets/function.png'),
      "state":require('../assets/state.png'),
      "UMI":require('../assets/router.png'),
      "start":require('../assets/enterchatflow.png'),
      "end":require('../assets/leftchatflow.png'),
      "enter":require('../assets/cond.png'),
      "ai.nlu":require('../assets/ai.nlu.png'),
      "sqa":require('../assets/sqa.png'),
      "fqa":require('../assets/fqa.png'),
    },
  // 快速回复的了类型
    quickReplayType:[
      {id:'word',name:'名词'},
      {id:'intent',name:'意图'},
      // {id:'custom',name:'自定义'},
    ],
  // 知识收录审核状态
  knowCollectStatus:[
    { id:'pick_up_accept',name:'已采纳'},
    { id:'pick_up_unaccept',name:'不采纳'},
    { id:'pick_up_draft',name:'草稿'},
    { id:'pick_up_auditing',name:'审核中'},
  ],
  knowCollectStatusClass:{
    '00A':['审核通过','online'],
    '00X':['审核驳回','unAccept'],
    '00D':['草稿','busy'],
    '00P':['待审核','offline'],
  },
  locationPathName:{
      '/system/summary':{
        label:'设置-用户账号',
      },
      '/system/userAccount':{
        label:'设置-用户账号',
      },
      '/system/systemRole':{
        label:'设置-系统角色',
      },
      '/system/organization':
      {
        label:'设置-组织结构',
      },
      '/system/publicchat':{
        label:'设置-公聊区',
      },
      // '/system/snsaccount':{
      //   label:'设置-网络列表',
      // },
      '/workorder/config':{
        label:'设置-工单配置',
      },
      '/knowledge/treeSetting':{
        label:'设置-知识树',
      },
      '/agent/index':{
        label:'坐席',
      },
      '/index':{
        label:'首页',
      },
      '/knowledgebase/info':{
        label:'知识库',
      },
      '/history/list':{
        label:'历史',
      },
      '/statistics/basicIndex':{
        label:'统计',
      },
      '/knowCollection/collectList':{
        label:'知识收录',
      },
      '/history/detail':{
        label:'历史详情',
        back: true,
      },
      '/knowledgebase/add-question':{
        label:'问题修改/添加',
        back:true,
      },
      '/operationView/operationView':{
        label:'运营视图',
      },
      '/knowledgeSupplement/knowledgeSupplement':{
        label:'知识新增',
      },
      '/robotManagement/robotManagement':{
        label:'机器人管理',
      },
      '/knowledgebase/knowledgeGallery':{
        label:'知识管理',
      },
      '/knowledgebase/knowledegereview':{
        label:'知识审核',
      },
      '/knowledgebase/heathTest':{
        label:'知识健康度',
      },
      '/knowledgebase/sceneTab':{
        label:'场景管理',
      },
  },
}

const processTypeRules = [
  {
    name: 'Listener',
    processType: 'LISTENER',
    type: 'com.ztesoft.cms.cmsnode.JListener',
    toScope: 'LISTENER,DIRECTBONUS,CONTACT',
    popBtns: {
      edit: 'optmNode,testNode,editNode,delNode,listNode',
      audit: 'optmNode,testNode,editNode,listNode',
      release: 'optmNode,runNode,testNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Twitter',
    processType: 'TWITTER',
    type: 'com.ztesoft.cms.cmsnode.JTwitter',
    toScope: 'LISTENER',
    popBtns: {
      edit: 'editNode,delNode,listNode',
      audit: 'editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'IRE',
    processType: 'IRE',
    type: '',
    toScope: 'LISTENER,NEXTSTAGE,CONTACT',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'editNode,listNode',
      release: 'runNode,testNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },

  {
    name: 'directBonus',
    processType: 'DIRECT_BONUS',
    type: 'com.ztesoft.cms.cmsnode.JGift',
    toScope: 'LISTENER',
    popBtns: {
      edit: 'optmNode,testNode,editNode,delNode,listNode',
      audit: 'optmNode,testNode,editNode,listNode',
      release: 'optmNode,runNode,testNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Omni',
    processType: 'OMNI',
    type: 'com.ztesoft.cms.cmsnode.JOmniChannel',
    toScope: '',
    popBtns: {
      edit: 'optmNode,testNode,editNode,delNode,listNode',
      audit: 'optmNode,testNode,editNode,listNode',
      release: 'optmNode,runNode,testNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Select',
    processType: 'SELECT',
    type: 'com.ztesoft.cms.cmsnode.JSelect',
    toScope: 'CONTACT,APP',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Cloud',
    processType: 'CLOUD',
    type: 'com.ztesoft.cms.cmsnode.JCloud',
    toScope: 'IRE,CONTACT',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Pattern',
    processType: 'PATTERN',
    type: 'com.ztesoft.cms.cmsnode.JPattern',
    toScope:
      'SEGMENT,SNAPSHOT,GENSEGMENT,SET,CROSS,EXCLUDE,DIRECTBONUS,IRE,OMNI,TWITTER,LISTENER,CONTACT',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Segment',
    processType: 'SEGMENT',
    type: 'com.ztesoft.cms.cmsnode.JSegment',
    toScope:
      'SEGMENT,SET,AB_DECISION,AGGREGATE,CROSS,EXCLUDE,GENSEGMENT,SNAPSHOT,DIRECTBONUS,IRE,OMNI,LISTENER,TWITTER,CONTACT,SAMPLE',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'AB_Decision',
    processType: 'AB_DECISION',
    type: '',
    toScope: 'IRE,CONTACT',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Sample',
    processType: 'SAMPLE',
    type: 'com.ztesoft.cms.cmsnode.JSample',
    toScope:
      'SET,CROSS,GENSEGMENT,SNAPSHOT,EXCLUDE,DIRECTBONUS,AB_DECISION,IRE,OMNI,TWITTER,LISTENER,CONTACT',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Set',
    processType: 'SET',
    type: '',
    toScope:
      'SET,AGGREGATE,CROSS,SEGMENT,SAMPLE,GENSEGMENT,EXCLUDE,SNAPSHOT,DIRECTBONUS,IRE,OMNI,TWITTER,LISTENER,CONTACT',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        editNodeUrl: 'mccm/modules/mccm/marketmgr/flow/set/views/SetPopupView.js',
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Aggregate',
    processType: 'AGGREGATE',
    type: 'com.ztesoft.cms.cmsnode.JAggregate',
    toScope:
      'SET,AGGREGATE,SAMPLE,AB_DECISION,CROSS,EXCLUDE,GENSEGMENT,SNAPSHOT,DIRECTBONUS,IRE,OMNI,TWITTER,LISTENER,CONTACT',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Cross',
    processType: 'CROSS',
    type: 'com.ztesoft.cms.cmsnode.JCross',
    toScope:
      'SET,AGGREGATE,CROSS,SEGMENT,GENSEGMENT,EXCLUDE,SNAPSHOT,DIRECTBONUS,IRE,OMNI,TWITTER,LISTENER,CONTACT',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Exclude',
    processType: 'EXCLUDE',
    type: 'com.ztesoft.cms.cmsnode.JExclude',
    toScope:
      'SET,AGGREGATE,CROSS,EXCLUDE,SEGMENT,SAMPLE,AB_DECISION,CREATESEGMENT,GIFT,FACEBOOK,TWITTER,LISTENER,OMNICHANNEL,SNAPSHOT,CONTACT',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'GenSegment',
    processType: 'GENSEGMENT',
    type: 'com.ztesoft.cms.cmsnode.JCreateSegment',
    toScope: '',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Merge',
    processType: 'MERGE',
    type: 'com.ztesoft.cms.cmsnode.',
    toScope: '',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Snapshot',
    processType: 'SNAPSHOT',
    type: 'com.ztesoft.cms.cmsnode.JSnapshot',
    toScope: '',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Schedule',
    processType: 'SCHEDULE',
    type: 'com.ztesoft.cms.cmsnode.',
    toScope: 'SELECT',
    popBtns: {
      edit: 'editNode,delNode',
      audit: 'editNode',
      release: 'runNode,editNode',
      suspend: 'editNode',
      termination: 'editNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'APP',
    processType: 'APP',
    type: 'com.ztesoft.cms.cmsnode.',
    toScope: 'CONTACT',
    popBtns: {
      edit: 'editNode,delNode',
      audit: 'editNode',
      release: 'runNode,editNode',
      suspend: 'editNode',
      termination: 'editNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'SMS_CONTACT',
    processType: 'SMS_CONTACT',
    type: 'com.ztesoft.cms.cmsnode.',
    toScope:
      'CONTACT,SELECT,SELECT_TEST,SET,AGGREGATE,CROSS,EXCLUDE,SEGMENT,SAMPLE,AB_DECISION,NEXTSTAGE,CREATESEGMENT,DIRECTBONUS,IRE,GIFT,FACEBOOK,TWITTER,LISTENER,UNICACONNECTOR,SASCONNECTOR,PATTERN,OMNICHANNEL,SNAPSHOT',
    popBtns: {
      edit: 'editNode,delNode',
      audit: 'editNode',
      release: 'runNode,editNode',
      suspend: 'editNode',
      termination: 'editNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'NextStage',
    processType: 'NEXT_STAGE',
    type: 'com.ztesoft.cms.cmsnode.JSchedule',
    toScope: '',
    popBtns: {
      edit: 'runNode,editNode,delNode,listNode',
      audit: 'runNode,editNode,listNode',
      release: 'runNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
  {
    name: 'Contact',
    processType: 'CONTACT',
    type: '',
    toScope: 'LISTENER,NEXTSTAGE',
    popBtns: {
      edit: 'optmNode,testNode,editNode,delNode,listNode',
      audit: 'optmNode,testNode,editNode,listNode',
      release: 'optmNode,runNode,testNode,editNode,listNode',
      suspend: 'editNode,listNode',
      termination: 'editNode,listNode',
      url: {
        listNodeUrl: 'mccm/modules/mccm/marketmgr/flow/common/views/CustomerListPopView.js',
      },
    },
  },
];

const defStyles = {
  connectorPaintStyle: {
    strokeWidth: 1,
    stroke: '#858686',
    joinstyle: 'round',
    outlineStroke: 'transparent',
    outlineWidth: 2,
  },
  connectorHoverStyle: {
    strokeWidth: 2,
    stroke: '#1e8151',
    outlineWidth: 5,
    outlineStroke: 'transparent',
  },
  endpointHoverStyle: {
    fill: '#1e8151',
    stroke: '#1e8151',
  },
};

const JspDefaultOptions = {
  sourceEndpointOpts: {
    endpoint: 'Dot',
    paintStyle: {
      stroke: '#74bee6',
      fill: '#fff',
      radius: 4,
      strokeWidth: 1,
    },
    isSource: true,
    connector: ['Straight'],
    connectorStyle: defStyles.connectorPaintStyle,
    hoverPaintStyle: defStyles.endpointHoverStyle,
    connectorHoverStyle: defStyles.connectorHoverStyle,
    dragOptions: {},
    overlays: [
      [
        'Label',
        {
          location: [0.5, 1.5],
          label: 'Drag',
          cssClass: 'endpointSourceLabel',
          visible: false,
        },
      ],
    ],
  },
  targetEndpointOpts: {
    endpoint: 'Dot',
    paintStyle: {
      stroke: '#ffffff',
      fill: '#BFC4CB',
      radius: 4,
      strokeWidth: 1,
    },
    hoverPaintStyle: defStyles.endpointHoverStyle,
    maxConnections: -1,
    dropOptions: { hoverClass: 'dropHover', activeClass: 'dragActive' },
    isTarget: true,
    overlays: [
      [
        'Label',
        { location: [0.5, -0.5], label: 'Drop', cssClass: 'endpointTargetLabel', visible: false },
      ],
    ],
  },
};

const mccProcessTypeDef = {
  /**
   * 节点类型，与后台的节点类型常量定义MccProcessTypeDef.java中的内容对应
   * 请不要修改此文件中的任何内容
   * @author zhang.xiaofei10
   * @type
   */
  PROCESS_TYPE: {
    SELECT: 'SELECT',
    SELECT_TEST: 'SELECT_TEST',
    CLOUD: 'CLOUD',
    MERGE: 'MERGE',
    SEGMENT: 'SEGMENT',
    SAMPLE: 'SAMPLE',
    GENSEGMENT: 'GENSEGMENT',
    SMS_CONTACT: 'SMS_CONTACT',
    EMAIL_CONTACT: 'EMAIL_CONTACT',
    SCHEDULE: 'SCHEDULE',
    APP: 'APP',
    NEXT_STAGE: 'NEXT_STAGE',
    CREATE_SEGMENGT: 'CREATE_SEGMENT',
    UNICA_CONNECTOR: 'UNICACONNECTOR',
    SAS_CONNECTOR: 'SASCONNECTOR',
    DIRECT_BONUS: 'DIRECT_BONUS',
    EXCLUDE: 'EXCLUDE',
    CROSS: 'CROSS',
    AGGREGATE: 'AGGREGATE',
    LISTENER: 'LISTENER',
    TWITTER: 'TWITTER',
    PATTERN: 'PATTERN',
    OMNI: 'OMNI',
    SNAPSHOT: 'SNAPSHOT',
    IVR: 'IVR',
    SET: 'SET',
    AB_DECISION: 'AB_DECISION',
  },

  /**
   * 节点类型，smart的类型对应关系
   * 请不要修改此文件中的任何内容
   * @author zhang.xiaofei10
   * @type
   */
  SMART_PROCESS_TYPE: {
    SELECT: '2',
    MERGE: 'MERGE',
    SEGMENT: '7',
    SAMPLE: '5',
    GENSEGMENT: 'GENSEGMENT',
    SMS_CONTACT: 'SMS_CONTACT',
    EMAIL_CONTACT: 'EMAIL_CONTACT',
    SCHEDULE: 'SCHEDULE',
    APP: 'APP',
    NEXT_STAGE: 'NEXT_STAGE',
    CREATE_SEGMENGT: 'CREATE_SEGMENT',
    UNICA_CONNECTOR: 'UNICACONNECTOR',
    SAS_CONNECTOR: 'SASCONNECTOR',
    DIRECT_BONUS: 'DIRECT_BONUS',
    EXCLUDE: '4',
    CROSS: '4',
    AGGREGATE: '4',
    LISTENER: 'LISTENER',
    TWITTER: 'TWITTER',
    PATTERN: 'PATTERN',
    OMNI: 'OMNI',
    SNAPSHOT: 'SNAPSHOT',
    IVR: 'IVR',
    SET: '4',
  },

  /**
   * 接触节点
   */
  PROCESS_CONTACT_TYPE: {
    SMS_CONTACT: 'SMS_CONTACT',
    EMAIL_CONTACT: 'EMAIL_CONTACT',
    LISTENER: 'LISTENER',
    TWITTER: 'TWITTER',
    DIRECT_BONUS: 'DIRECT_BONUS',
    OMNI: 'OMNI',
    IVR: 'IVR',
  },

  /** 节点共6中状态：
   *  1：没有配置参数（灰色图标）；
   *  2：已经配置好参数（彩色图标）；
   *  3：右上角一个红色的感叹号（目前没有使用）；
   *  4：右上角一个绿色的对勾（表示运行成功）；
   *  5：右上角一个表示刷新的图标（目前没有使用）；
   *  6：右上角一个红色的叉叉（表示运行失败）；
   */
  NODE_STATUS: { INITIAL: 1, UNCOMPLETE: 2, COMPLETE: 4, FAILED: 6 },

  /**
   * 数据库中节点的状态
   */
  PROCESS_STATE: { INITIAL: 'I', UNCOMPLETE: 'U', COMPLETE: 'C', RUNNING: 'R' },
};

const floatToolBtns = {
  edit: 'flowChartConfig,flowChartSchedule,delFlowChart,flowChartReport',
  audit: 'fflowChartSchedule,flowChartReport',
  release: 'runFlowChart,flowChartSchedule,flowChartReport',
  suspend: 'flowChartReport',
  termination: 'flowChartReport',
};

export { processTypeRules, JspDefaultOptions, mccProcessTypeDef, floatToolBtns };

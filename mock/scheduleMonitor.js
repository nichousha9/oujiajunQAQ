import mockjs from 'mockjs';

const getTimingObj = (req, res) => {
  res.json(
    mockjs.mock({
      svcCont: {
        data: [{
            attrSpecCode: 'PROCESS',
            attrValueCode: 'PROCESS',
            attrValueId: 'PROCESS',
            attrValueName: '进度',
            attrValueNameEn: 'PROCESS',
            id: 'PROCESS',
            name: '进度',
            timingObject: 'PROCESS'
          }, {
            attrSpecCode: 'FLOWCHART',
            attrValueCode: 'FLOWCHART',
            attrValueId: 'FLOWCHART',
            attrValueName: '流程图',
            attrValueNameEn: 'FLOWCHART',
            id: 'FLOWCHART',
            name: '流程图',
            timingObject: 'FLOWCHART'
          }, {
            attrSpecCode: 'REMINDER',
            attrValueCode: 'REMINDER',
            attrValueId: 'REMINDER',
            attrValueName: '提醒',
            attrValueNameEn: 'REMINDER',
            id: 'REMINDER',
            name: '提醒',
            timingObject: 'REMINDER'
          }, {
            attrSpecCode: 'OFFER_SG',
            attrValueCode: 'OFFER_SG',
            attrValueId: 'OFFER_SG',
            attrValueName: '分期报价',
            attrValueNameEn: 'OFFER_SG',
            id: 'OFFER_SG',
            name: '分期报价',
            timingObject: 'OFFER_SG'
          }
        ],
      },
      topCont: { serialVersionUID: 1, resultCode: 0, remark: '↵Succeed in Setting' },
    }),
  );
}

const getSystemUserList = (req, res) => {
  const { pageInfo } = req.body.svcCont;
  const { pageNum = 1, pageSize = 10 } = pageInfo || {};
  res.json(
    mockjs.mock({
      svcCont: {
        'data|10': [
          {
            pwdStatus: '1100',
            staffName: '@name()',
            statusCd: '1000',
            sysUserCode: 'zte',
            'sysUserId|+1': 1,
          },
        ],
        pageInfo: {
          total: 20,
          pageNum,
          pageSize,
        }
      },
      topCont: { serialVersionUID: 1, resultCode: 0, remark: '↵Succeed in Setting' },
    }),
  );
}

const getSystemRoleList = (req, res) => {
  res.json(
    mockjs.mock({
      svcCont: {
        'data|30': [{
            createDate: "@datetime('yyyy-MM-dd HH:mm:ss')",
            'createStaff|1-100': 1965868,
            'regionId|1-100': 1,
            statusCd: '1000',
            sysCode: '727001',
            sysRoleCode: 'testrole321',
            'sysRoleId|+1': 1,
            'sysRoleName|1': ['aaa', 'bbb', 'ccc', 'dddd'],
            sysRoleType: '1000',
            sysRoleTypeName: '普通角色',
            updateDate: "@datetime('yyyy-MM-dd HH:mm:ss')",
          }
        ]
      },
      topCont: { serialVersionUID: 1, resultCode: 0, remark: '↵Succeed in Setting' },
    }),
  );
}

const getScheduleList = (req, res) => {
  const { pageInfo } = req.body.svcCont;
  const { pageNum = 1, pageSize = 5 } = pageInfo || {};
  res.json(mockjs.mock({
   svcCont: {
    'data|5': [{
      'id|+1': 1,
      timingName: '@word(3, 7)',
      createdBy: 'createdBy',
      lastRunDate: 'lastRunDate',
      timingObject: 'timingObject',
      objectName: 'objectName',
      extName: ' extName',
      timingMethodName:' timingMethodName',
      cycleStartDate:'cycleStartDate',
      cycleEndDate:'cycleEndDate',
      cycleTypeName:'cycleTypeName',
      hour: 14,
      minute: 17
    }],
    pageInfo: {
      total: 30,
      pageNum,
      pageSize,
    }
   },
   topCont: {serialVersionUID: 1, resultCode: 0, remark: "↵Succeed in Setting"}
  }));
}

const getAllTimingInstance = (req, res) => {
  const { pageInfo } = req.body.svcCont;
  const { pageNum = 1, pageSize = 10 } = pageInfo || {};
  res.json(mockjs.mock({
    svcCont: {
      'data|10': [{
        'id|+1': 1,
         'runTime': '@datetime(\'yyyy-MM-dd HH:mm:ss\')',
         'stateName|1': ['ALL', 'RUNNING', 'WAITING'],
         'runByName': 'AAA',
         'startTime': '@datetime(\'yyyy-MM-dd HH:mm:ss\')',
         'endTime':  '@datetime(\'yyyy-MM-dd HH:mm:ss\')',
         'retryTimes|1-100': 1,
         'dataId|1-100': 1,
         'timeId|1-100': 1
      }],
      pageInfo: {
        total: 28,
        pageNum,
        pageSize,
      }
    },
    topCont: {serialVersionUID: 1, resultCode: 0, remark: "↵Succeed in Setting"}
  }));
}

const getTimingInstance = (req, res) => {
  const { pageInfo } = req.body.svcCont;
  const { pageNum = 1, pageSize = 10 } = pageInfo || {};
  res.json(mockjs.mock({
    svcCont: {
      'data|10': [{
        'id|+1': 1,
         'runTime': '@datetime(\'yyyy-MM-dd HH:mm:ss\')',
         'stateName': 'running',
         'runByName': 'RRR',
         'startTime': '@datetime(\'yyyy-MM-dd HH:mm:ss\')',
         'endTime': '@datetime(\'yyyy-MM-dd HH:mm:ss\')',
         'retryTimes|1-100': 1,
         'dataId|1-100': 1,
         'timeId|1-100': 1
      }],
      pageInfo: {
        total: 27,
        pageNum,
        pageSize,
      }
    },
    topCont: {serialVersionUID: 1, resultCode: 0, remark: "↵Succeed in Setting"}
  }));
}

const getWaitingTimingInstance = (req, res) => {
  const { pageInfo } = req.body.svcCont;
  const { pageNum = 1, pageSize = 10 } = pageInfo || {};
  res.json(mockjs.mock({
    svcCont: {
      'data|10': [{
        'id|+1': 1,
         'runTime': '@datetime(\'yyyy-MM-dd HH:mm:ss\')',
         'stateName': 'waiting',
         'runByName': 'WWW',
         'startTime': '@datetime(\'yyyy-MM-dd HH:mm:ss\')',
         'endTime': '@datetime(\'yyyy-MM-dd HH:mm:ss\')',
         'retryTimes|1-100': 1,
         'dataId|1-100': 1,
         'timeId|1-100': 1
      }],
      pageInfo: {
        total: 26,
        pageNum,
        pageSize,
      }
    },
    topCont: {serialVersionUID: 1, resultCode: 0, remark: "↵Succeed in Setting"}
  }));
}

const delTimingInstance = (req, res) => {
  res.json(
    mockjs.mock({
      topCont: {
        serialVersionUID: 1,
        'resultCode|0-1': 0,
        remark: '↵Succeed in Setting',
      },
    }),
  );
}

export default {
  'POST /mccm-service/api/timingObject': getTimingObj,
  'POST /mccm-service/api/userList': getSystemUserList,
  'POST /mccm-service/api/role': getSystemRoleList,
  'POST /mccm-service/api/scheduleList': getScheduleList,
  'POST /mccm-service/api/allScheduleDetailList':  getAllTimingInstance,
  'POST /mccm-service/api/timingInstance':  getTimingInstance,
  'POST /mccm-service/api/timingOverInstance': getWaitingTimingInstance,
  'POST /mccm-service/api/delTimingInstance': delTimingInstance
};
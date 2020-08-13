import mockjs from 'mockjs';

export default {
  // 使用 mockjs 等三方库

  // 租户管理租户列表查询
  'POST /smartim-service/smartim/tenantManagement/qryHirerList': (req, res) => {
    const { pageNum, pageSize } = req;
    res.send(
      mockjs.mock({
        status: 'OK',
        msg: 'success',
        data: [
          {
            'list|30': [
              {
                hirerCode: '租户编码',
                hirerName: '租户名称',
                'contactName|1': ['王晴', '吴磊', '张三', '李四', '王五'],
                'contactNumber|1': ['178 9820 9872', '180 2839 2904'],
                createTime: '@date(yyyy-MM-dd)',
              },
            ],
          },
        ],
        page: { total: 30, pageSize: pageSize || 10, pageNum: pageNum || 1 },
      })
    );
  },

  'POST /api/taskManager/addToTaskConfig': (req, res) => {
    res.send(
      mockjs.mock({
        success: true,
        code: 'SUCCESS',
        msg: 'success',
        data: [],
      })
    );
  },

  'POST /api/taskManager/selectFromSubstation': (req, res) => {
    res.send(
      mockjs.mock({
        success: true,
        code: 'SUCCESS',
        msg: 'success',
        data: [
          {
            substationName: '变电站1',
            orgId: null,
            substationDesc: null,
            substationAdminId: null,
            substationMap: null,
            substationType: null,
            createDate: null,
            updateDate: null,
            id: 1,
          },
          {
            substationName: '变电站2',
            orgId: null,
            substationDesc: null,
            substationAdminId: null,
            substationMap: null,
            substationType: null,
            createDate: null,
            updateDate: null,
            id: 2,
          },
          {
            substationName: '变电站3',
            orgId: null,
            substationDesc: null,
            substationAdminId: null,
            substationMap: null,
            substationType: null,
            createDate: null,
            updateDate: null,
            id: 3,
          },
        ],
      })
    );
  },
};

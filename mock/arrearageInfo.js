import mockjs from 'mockjs';

const qryArrearageList = (req, res) => {
  const { pageInfo } = req.body.svcCont;
  const { pageNum = 1, pageSize = 10 } = pageInfo || {};
  res.json(
    mockjs.mock({
      svcCont: {
        'data|10': [
          {
            customerName: '@name()',
            companyName: '@name()',
            area: '天河区',
            net: '网格',
            date: '2019-10',
            totalArrearsAmount: 1342123.45,
            goodName: '@name()',
            'goodCode|+1': 1,
            goodArrearage: 333,
            isArrearageAll: '是',
            accountManager: '@name()',
            'customerCode|+1': 1,
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

const qryAreaList = (req, res) => {
  res.json(
    mockjs.mock({
      svcCont: {
        'data': [
          {
            'value': '广东',
            'id': 1,
            title: '广东',
            'key': 1,
            children: [
              {
                'value': '广州',
                'id': 2,
                'pid': 1,
                'key': 2,
                title: '广州',
                isLeaf: true,
              }
            ]
          },
        
        ],
      },
      topCont: { serialVersionUID: 1, resultCode: 0, remark: '↵Succeed in Setting' },
    }),
  );
}

export default {
  'POST /mccm-service/api/qryArrearageList': qryArrearageList,
  'POST /mccm-service/api/qryAreaList': qryAreaList,
};
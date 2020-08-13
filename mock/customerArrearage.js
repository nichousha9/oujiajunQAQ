import mockjs from 'mockjs';

const qryCustOweList = (req, res) => {
  const { pageInfo } = req.body.svcCont;
  const { pageNum = 1, pageSize = 10 } = pageInfo || {};
  res.json(
    mockjs.mock({
      svcCont: {
        data: [
          {
            monthId: '201909',
            prodName: '移动办公助理',
            accNbr: '18541236987',
            oweAmount: '373',
            prodState: '正常在用',
            lateFee: '0',
          },
          {
            monthId: '201909',
            prodName: '移动OA',
            accNbr: '18541236987',
            oweAmount: '886',
            prodState: '暂停',
            lateFee: '44',
          },
          {
            monthId: '201909',
            prodName: '互联网专线',
            accNbr: '18541236987',
            oweAmount: '307',
            prodState: '正常在用',
            lateFee: '0',
          },
          {
            monthId: '201909',
            prodName: '集团彩铃',
            accNbr: '18541236987',
            oweAmount: '879',
            prodState: '正常在用',
            lateFee: '44',
          },
          {
            monthId: '201909',
            prodName: '语音专线',
            accNbr: '18541236987',
            oweAmount: '474',
            prodState: '暂停',
            lateFee: '24',
          },
        ],
        pageInfo: {
          total: 21,
          pageNum,
          pageSize,
        },
      },
      topCont: { serialVersionUID: 1, resultCode: 0, remark: '↵Succeed in Setting' },
    }),
  );
}

const qryCustOweView = (req, res) => {
  res.json(
    mockjs.mock({
      svcCont: {
       data: {
          "halfYearOweTime": "3",
          "oweAmount": "4643",
          "oweReasonDesc": "资金短缺",
          "ifAllMemOwe": "是",
          "managerName": "李可鹏"
        }
      },
      topCont: { serialVersionUID: 1, resultCode: 0, remark: '↵Succeed in Setting' },
    }),
  );
}

export default {
  'POST /mccm-service/api/qryCustOweList': qryCustOweList,
  'POST /mccm-service/api/qryCustOweView': qryCustOweView,
};
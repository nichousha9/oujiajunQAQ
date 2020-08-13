import mockjs from 'mockjs';

const qryWorkOrderTypeList = (req, res) => {
  res.json(
    mockjs.mock({
      svcCont: {
        data: [{
          title: '工单一',
          value: '1',
        }, {
          title: '工单二',
          value: '2',
        }],
      },
      topCont: { serialVersionUID: 1, resultCode: 0, remark: '↵Succeed in Setting' },
    })
  )
}

const qryFieldTypeList = (req, res) => {
  res.json(
    mockjs.mock({
      svcCont: {
        data: [{
          title: '布尔值',
          value: 'bool',
        }, {
          title: '数字',
          value: 'number',
        }, {
          title: '字符串',
          value: 'string',
        }],
      },
      topCont: { serialVersionUID: 1, resultCode: 0, remark: '↵Succeed in Setting' },
    })
  )
}

const qryTemplateElementList = (req, res) => {
  const { pageInfo } = req.body.svcCont;
  const { pageNum = 1, pageSize = 10 } = pageInfo || {};
  res.json(
    mockjs.mock({
      svcCont: {
        'data|10': [
          {
            elementName: '@name()',
            workOrderType: '@name()',
            fieldType: '字符串',
            mappingAddress: '表->字段',
            createdDate: '@datetime(\'yyyy-MM-dd HH:mm:ss\')',
            totalArrearsAmount: 1342123.45,
            creator: '@name()',
            'isFilling|1': ['是', '否'],
            'isForm|1': ['是', '否'],
            'id|+1': 1,
            'start|+1': [false, true],
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

const addTemplateElement = (req, res) => {
  res.json(
    mockjs.mock({
      topCont: { serialVersionUID: 1, resultCode: 0, remark: '↵Succeed in Setting' },
    }),
  );
}


export default {
  'POST /mccm-service/api/qryWorkOrderTypeList': qryWorkOrderTypeList,
  'POST /mccm-service/api/qryFieldTypeList': qryFieldTypeList,
  'POST /mccm-service/api/qryTemplateElementList': qryTemplateElementList,
  'POST /mccm-service/api/addTemplateElement': addTemplateElement,
  'POST /mccm-service/api/updateTemplateElement': addTemplateElement,
  'POST /mccm-service/api/startTemplateElement': addTemplateElement,
  'POST /mccm-service/api/abortTemplateElement': addTemplateElement,
  'POST /mccm-service/api/deleteTemplateElement': addTemplateElement,
}
import mockjs from 'mockjs';

const qryContactDetail = (req, res) => {
  res.json(
    mockjs.mock({
      svcCont: {
        data: {
          "baseColumns": [
            {
                "columnName": "集团名称",
                "columnCode": "cust_name",
                "belongTable": "zqyth_wid_cust_base_info_d",
                "relType": "01"
            },
            {
                "columnName": "客户地址",
                "columnCode": "cust_addr",
                "belongTable": "zqyth_wid_cust_base_info_d",
                "relType": "01"
            },
            {
                "columnName": "所属客户经理姓名",
                "columnCode": "manager_name",
                "belongTable": "zqyth_wid_cust_base_info_d",
                "relType": "01"
            },
            {
                "columnName": "客户联系人",
                "columnCode": "contact_name",
                "belongTable": "zqyth_wid_cust_base_info_d",
                "relType": "01"
            },
            {
                "columnName": "客户联系人电话",
                "columnCode": "contact_phone",
                "belongTable": "zqyth_wid_cust_base_info_d",
                "relType": "01"
            },
            {
                "columnName": "客户所属一级行业",
                "columnCode": "pri_industry",
                "belongTable": "zqyth_wid_cust_base_info_d",
                "relType": "01"
            }
        ],
        "listColumns": [
          {
              "columnName": "产品名称",
              "columnCode": "PROD_NAME",
              "belongTable": "zqyth_wid_cust_prod_info_d",
              "relType": "02"
          },
          {
              "columnName": "产品类型",
              "columnCode": "PROD_TYPE_NAME",
              "belongTable": "zqyth_wid_cust_prod_info_d",
              "relType": "02"
          },
          {
              "columnName": "受理人姓名",
              "columnCode": "OPER_LOGIN_NAME",
              "belongTable": "zqyth_wid_cust_prod_info_d",
              "relType": "02"
          },
          {
              "columnName": "办理渠道",
              "columnCode": "OPER_CHANNEL",
              "belongTable": "zqyth_wid_cust_prod_info_d",
              "relType": "02"
          },
          {
              "columnName": "欠费金额",
              "columnCode": "OWE_AMOUNT",
              "belongTable": "zqyth_wid_cust_prod_info_d",
              "relType": "02"
          },
          {
              "columnName": "产品办理时间",
              "columnCode": "OPER_DATE",
              "belongTable": "zqyth_wid_cust_prod_info_d",
              "relType": "02"
          }
      ],
      "listList": [
          {
              "OWE_AMOUNT": "2339",
              "OPER_CHANNEL": "123456",
              "OPER_LOGIN_NAME": "蔡旭焜",
              "PROD_NAME": "互联网专线",
              "OPER_DATE": "2019-10-09",
              "PROD_TYPE_NAME": "网络专线"
          },
          {
              "OWE_AMOUNT": "6954",
              "OPER_CHANNEL": "123456",
              "OPER_LOGIN_NAME": "娄得滑",
              "PROD_NAME": "移动OA",
              "OPER_DATE": "2019-10-09",
              "PROD_TYPE_NAME": "基础产品"
          }
      ],
      "baseList": [
          {
              "manager_name": "李可鹏",
              "contact_name": "李铁刚",
              "contact_phone": "13541537100",
              "cust_name": "配龙中心校家属网2",
              "cust_addr": "四川省内江市威远县威远县配龙中心校",
              "pri_industry": "教育"
          }
      ]
        }
      },
      topCont: { serialVersionUID: 1, resultCode: 0, remark: '↵Succeed in Setting' },
    })
  )
}

export default {
  'POST /mccm-service/api/qryContactDetail': qryContactDetail,
}
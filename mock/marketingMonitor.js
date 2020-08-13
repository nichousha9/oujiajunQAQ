import mockjs from 'mockjs';

const getBatchDetailInfo = (req, res) => {
  const { pageInfo } = req.body.svcCont;
  const { pageNum = 1, pageSize = 10 } = pageInfo || {};
  res.json(
    mockjs.mock({
      svcCont: {
        data: [{
          ADVICE_CHANNEL_NAME: "Outbound Call",
          BATCH_NAME: "Run|CONTACT|MKT_CAMPAIGN000028221",
          BATCH_STATE: "F",
          BATCH_TOTAL_NUM: 175,
          CAMPAIGN_NAME: "IVR_test_lk_728",
          CAMPAIGN_SUCC_NUM: "2",
          CAMPAIGN_SUCC_RATIO: "1%",
          CAMPAIGN_TOTAL_NUM: "175",
          CONCAT_CHANNEL: "IVR",
          END_DATE: "2019-07-28 20:24:38",
          FAILED_NUM: "0",
          ID: 4996,
          IS_TEST: "N",
          MEMBER_TABLE: "MCC_X_IVR_281082",
          NAME: "IVR",
          PENDING_NUM: 0,
          PROCESS_ID: 281082,
          PROCESS_TYPE: "IVR",
          SPEED_ADJUST: null,
          START_DATE: "2019-07-28 20:14:09",
          STATE_NAME: "已完成",
          STATE_NAME_EN: "Finished",
          SUCCEED_NUM: "175",
          TOTAL_NUM: "175",
          TOTAL_SUCC_RATIO: "100%",
          TREATMENT_METHOD: null,
          USER_TOTAL_NUM: 175,
          USER_TOTAL_RATIO: "100%",
        }, {
          ADVICE_CHANNEL_NAME: "APP GuessYouLike",
          BATCH_NAME: "Run|CONTACT|MKT_CAMPAIGN000028211",
          BATCH_STATE: "R",
          BATCH_TOTAL_NUM: 0,
          CAMPAIGN_NAME: "1",
          CAMPAIGN_SUCC_NUM: 0,
          CAMPAIGN_SUCC_RATIO: "0%",
          CAMPAIGN_TOTAL_NUM: 0,
          CONCAT_CHANNEL: "APP",
          END_DATE: "2019-08-23 21:10:26",
          FAILED_NUM: "",
          ID: 4994,
          IS_TEST: "N",
          MEMBER_TABLE: "MCC_X_APP_281076",
          NAME: "APP",
          PENDING_NUM: 0,
          PROCESS_ID: 281076,
          PROCESS_TYPE: "APP",
          SPEED_ADJUST: null,
          START_DATE: "2019-07-25 21:25:42",
          STATE_NAME: "运行中",
          STATE_NAME_EN: "Running",
          SUCCEED_NUM: "",
          TOTAL_NUM: "4",
          TOTAL_SUCC_RATIO: "0%",
          TREATMENT_METHOD: null,
          USER_TOTAL_NUM: 0,
          USER_TOTAL_RATIO: "100%",
        }],
        pageInfo: {
          total: 1,
          pageNum,
          pageSize,
        }  
      },
      topCont: {serialVersionUID: 1, resultCode: 0, remark: "↵Succeed in Setting"}
    })
  )
}

const getBatchCellDetailInfo = (req, res) => {
  res.json(
    mockjs.mock({
      svcCont: {
        data: [{
          BATCH_ID: 4996,
          BATCH_NAME: "MCC_X_SELECT_281081_IVR_158956",
          BATCH_STATE: "F",
          CELLID: 170919,
          END_DATE: null,
          FAILED_NUM: 0,
          ID: "4996|170919",
          PENDING_NUM: 0,
          PROCESSING_ID: 158956,
          PROCESS_ID: 281082,
          PROCESS_TYPE: "IVR",
          START_DATE: null,
          STATE_NAME: "已完成",
          SUCCEED_NUM: 175,
          TOTAL_NUM: 175,
          TREATMENT_METHOD: null,
        }],
      },
      topCont: {serialVersionUID: 1, resultCode: 0, remark: "↵Succeed in Setting"}
    })
  )
}

const getContactInfo = (req, res) => {
  const { pageInfo } = req.body.svcCont;
  const { pageNum = 1, pageSize = 10 } = pageInfo || {};
  res.json(
    mockjs.mock({
      svcCont:{
        data: [{
          ADVICE_CHANNEL: "211",
          BATCH_ID: 4996,
          CAMPAIGN_NAME: "IVR_test_lk_728",
          CAMPAIGN_STATE: "0",
          CELL_NAME: "MCC_X_SELECT_281081_IVR_158956",
          COMMENTS: null,
          CONTACT_NUMBER: "13800000946",
          CONTACT_STATE: "Delivered",
          ID: 3665232,
          IS_RESPONSABLE: "N",
          MSG_ID: "3669329",
          MSG_INST_ID: "0913e3f9-6192-4914-b157-f4dc9f7d3f0e",
          MSG_STATE: null,
          PROCESS_CODE: "",
          SENDING_DATE: "2019-07-28 20:14:09",
          STATE_DATE: "2019-07-28 20:14:09",
          SUBS_ID: 946,
          TREATMENTCODE: "00000005224",
        }],
        pageInfo: {
          total: 1,
          pageNum,
          pageSize,
        }  
      },
      topCont: {serialVersionUID: 1, resultCode: 0, remark: "↵Succeed in Setting"}
    })
  )
}

const getOffer = (req, res) => {
  res.json(
    mockjs.mock({
      svcCont: {
        data: {
          offers: [{
            "": "systemId",
            balance: null,
            comments: null,
            createDate: "2019-07-20 17:36:51",
            effDate: null,
            effDateOffset: null,
            effDateOffsetTime: null,
            effDateOffsetUnit: "H",
            effDateScript: null,
            effDateScriptType: null,
            effDateType: 0,
            expDate: null,
            expDateOffset: null,
            expDateOffsetTime: null,
            expDateOffsetUnit: "H",
            expDateScript: null,
            expDateScriptType: null,
            expDateType: 2,
            externalOfferCode: null,
            externalOfferId: null,
            floatBal: null,
            fold: 232,
            isCurrency: null,
            offerEffDate: "2019-07-19 00:00:00",
            offerExpDate: "2019-07-31 00:00:00",
            offerId: 23571,
            offerName: "new_param_test_lk",
            offerType: "2",
            offerTypeName: "Product",
            state: "A",
            zsmartOfferCode: "new_param_test_lk",
            zsmartOfferId: null,
          }],
          creativeInfos: [{
            adviceTypeSortId: 916,
            channelId: "10022",
            comAcctId: 1,
            createDate: "2019-04-24 10:19:54",
            creativeInfoCode: "ZTE",
            creativeInfoId: 199,
            creativeInfoName: "ZTE",
            id: 199,
            isEngine: "0",
            state: "1",
            templateInfoType: "1",
            thumbUrl: "mccm/modules/test/img/philipin/199.png",
          }]
        }
      },
      topCont: {serialVersionUID: 1, resultCode: 0, remark: "↵Succeed in Setting"}
    })
  )
}


const getMessageInfo = (req, res) => {
  res.json(
    mockjs.mock({
      svcCont: {
        data: {
          message: {
            MSG: "strMsg='We recommend iPhone/ HUAWEI and terminal direct drop coupons for you!'"
          }
        }
      },
      topCont: {serialVersionUID: 1, resultCode: 0, remark: "↵Succeed in Setting"}
    })
  )
}

const getSubExtendList = (req, res) => {
  const { pageInfo } = req.body.svcCont;
  const { pageNum = 1, pageSize = 10 } = pageInfo || {};
  res.json(
    mockjs.mock({
      svcCont:{
        data: [{
          ACC_NBR: "13800000946",
          AGE: 23,
          SUBS_ID: 946,
        }],
        pageInfo: {
          total: 1,
          pageNum,
          pageSize,
        }  
      },
      topCont: {serialVersionUID: 1, resultCode: 0, remark: "↵Succeed in Setting"}
    })
  )
}

const getMemberList = (req, res) => {
  const { pageInfo } = req.body.svcCont;
  const { pageNum = 1, pageSize = 10 } = pageInfo || {};
  res.json(
    mockjs.mock({
      svcCont:{
        'data|10': [{
          ACC_NBR: "13800000044",
          COM_ACCT_ID: 1,
          EMAIL: "13800000044@mail.com",
          PREFIX: null,
          'SUBS_ID|+1': 44,
          cust_id: null,
        }],
        pageInfo: {
          total: 20,
          pageNum,
          pageSize,
        }  
      },
      topCont: {serialVersionUID: 1, resultCode: 0, remark: "↵Succeed in Setting"}
    })
  )
}


export default {
  'POST /mccm-service/api/qryBatchDetailInfo': getBatchDetailInfo,
  'POST /mccm-service/api/qryBatchCellDetailInfo': getBatchCellDetailInfo,
  'POST /mccm-service/api/qryContactInfo': getContactInfo,
  'POST /mccm-service/api/qryOffer': getOffer,
  'POST /mccm-service/api/qryMessageInfo': getMessageInfo,
  'POST /mccm-service/api/qrySubExtendList': getSubExtendList,
  'POST /mccm-service/api/qryMemberList': getMemberList,
}
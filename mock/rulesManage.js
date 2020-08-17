export default {
  'GET /mccm-service/api/ruleListsSource': [
    {
      id: 1,
      title: '购物车下方推荐',
      desc: '描述：用于首页个人推荐',
      Modifier: 'rex',
      ModifiTime: '2018-12-30 14:23:377',
      state: '有效',
    },
    {
      id: 2,
      title: '首页个人推荐',
      desc: '描述：用于首页个人推荐',
      Modifier: '张三111',
      ModifiTime: '2018-12-30 14:23:35',
      state: '有效1',
    },
  ],

  'GET /mccm-service/api/childRuleSource': [
    {
      key: '1',
      name: '个人喜欢商品推荐规则',
      num: 1000,
      state: '是',
      defaultNum: 10,
    },
    {
      key: '2',
      name: '热卖商品推荐规则',
      num: 8,
      state: '否',
      defaultNum: 102,
    },
    {
      key: '3',
      name: '个人喜欢商品推荐规则',
      num: 10,
      state: '是',
      defaultNum: 103,
    },
  ],

  'GET /mccm-service/api/recommendRuleSource': [
    // {
    //   key: '1',
    //   name: '这是一个比较长的名称',
    //   id: 'HB_VAL-HBS',
    //   recommendRatio: 0.88,
    // },
    // {
    //   key: '2',
    //   name: '这是一个比较长的名称',
    //   id: 'HB_VAL',
    //   recommendRatio: 0.99,
    // },
    // {
    //   key: '3',
    //   name: '这是一个比较长的名称',
    //   id: 'HB_VAL',
    //   recommendRatio: 0.871,
    // },
    {
      id: 1,
      title: '热卖商品推荐',
      desc: '描述：用于首页个人推荐',
      ruleType: '热卖商品',
      Modifier: 'rex',
      ModifiTime: '2018-12-30 14:23:377',
      state: '有效',
    },
    {
      id: 2,
      title: '首页个人推荐',
      desc: '描述：用于首页个人推荐',
      ruleType: '热卖商品',
      Modifier: '张三111',
      ModifiTime: '2018-12-30 14:23:35',
      state: '有效1',
    },
  ],
};

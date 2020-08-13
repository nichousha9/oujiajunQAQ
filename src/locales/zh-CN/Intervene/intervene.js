export default {
  'intervene.interveneList': '干预规则组列表',
  'intervene.interveneNamePlaceHolder': '请输入干预组名称',
  'intervene.addIntervene': '新增干预组',
  'intervene.interveneName': '干预组名称',
  'intervene.interveneRule': '干预规则',
  'intervene.ruleName': '规则名称',
  'intervene.trigger': '触发条件',
  'intervene.callback': '满足触发条件后执行操作',
  'intervene.sort': '排序',
  'intervene.sample': '示例',
  'intervene.ruleInfo': '干预规则信息',
  'intervene.addRule': '新增规则',
  'intervene.ruleInfoFilter': '推荐条目过滤干预规则',

  'intervene.sample.condition': '//expression 返回值为bool<br/>' +
                                '//比如 ： "\'a\' = \'b\'"  "item.id = \'0001\'"  "item.score > 0.5"<br/>' +
                                '//"返回值为布尔型的表达式"<br/>' +
                                'BOOL_RET("bool_ret", new String[]{"#expression#"})<br/>' +
                                '<br/>' +
                                '//"判断field的值是否在values中，value多值分号分隔"<br/>' +
                                'IN("in", new String[]{"#field#", "#values#"})<br/>' +
                                '<br/>' +
                                '//"判断field的值是否不在values中，value多值分号分隔"<br/>' +
                                'NOT_IN("not_in", new String[]{"#field#", "#values#"})',
  'intervene.sample.action': '//"对满足条件的文档置顶"<br/>' +
                            'TOP("top", null)<br/>' +
                            '//"删除满足条件的文档"<br/>' +
                            'REMOVE("remove", null)<br/>' +
                            '<br/>' +
                            '//act: + | - | * | / (加减乘除)<br/>' +
                            '//weight: 0.5 等<br/>' +
                            '//"调整分档分"<br/>' +
                            'ADJUST("adjust", new String[]{"#act#", "#weight#"})<br/>' +
                            '<br/>' +
                            '//function : 衰减函数<br/>' +
                            '//"对分值根据指定feature做衰减处理"<br/>' +
                            'REDUCTION("reduction", new String[]{"#feature#, #function#"})',
                              
}

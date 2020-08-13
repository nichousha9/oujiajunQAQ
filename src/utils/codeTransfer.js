// 此文件用于服务端返回编码转换
// 后期可扩展国际化
const codeMap = {
  success: '操作成功！',
  username_exist: '该用户名已存在',
  user_username_exist: '该用户名已存在',
  email_exist: '该邮箱已被注册，请使用未注册的邮箱',
  username_null: '用户名不能为空',
  mobile_exist: '该手机号码已被注册，请使用未注册的手机号码',
  user_null: '该用户不存在',
  code_send_toofast: '验证码发送频率太快',
  code_send_number_end: '单位时间内发送次数受限',
  username_pwd_fail: '用户名或密码错误，请重新输入',
  organization_name_format_fail: '企业名称格式异常，请重新输入',
  organization_online_null: '该企业未注册，请重新创建',
  user_organization_exist: '当前已关联企业，请直接前往登录',
  tenant_exist: '该租户已存在',
  tenant_null: '该租户不存在',
  cate_null: '该分类为空',
  kdb_id_null: '该知识库不存在，请重试',
  kdb_standardword_null: '该标准词不存在',
  kdb_standardword_id_null: '该标准词不存在',
  kdb_catecode_differ: '数据与原有的菜单不一致',
  kdb_file_parse_fail: '数据解析失败',
  kdb_file_type_err: '导入的文件类型错误',
  kdb_synonmy_null: '同义词为空',
  admin_role_save_exist: '角色名已存在',
  sms_phone_format_error: '请输入正确的手机号码',
  codetimeout_exist: '验证码已超时，请重新获取',
  code_exist: '验证码错误',
  admin_organ_save_exist: '组织机构名称已存在',
  agent_serviceuser_exit: '用户存在对话不能能修改',
  kdb_question_content_null: '问题答案为空',
  kdb_question_null: '问题为空',
  kdb_knowledge_content_null: '知识点内容为空',
  kdb_knowledge_title_null: '知识点标题为空',
  kdb_cate_context_exist: '菜单下有问题或知识点',
  no_menu_auth: '该用户没有菜单权限，请联系管理员',
  cate_data_restrict: '该分类下有快速词，不能删除',
  group_user_null: '讨论组成员为空不能保存',
  not_online_user: '该技能组下没有在线用户',
  user_organ_null: '当前用户没有组织架构不能查询在现用户',
  'botscene_intent_slotcode null': '词槽编码为空',
  botscene_utterance_getword_invalid: '取词失败',
  botscene_intent_slot_exist: '词槽已经存在',
  botintent_code_exist: '意图编码已存在',
  botscene_not_sys_entity: '',
  botscene_entity_exist: '实体已经存在',
  wrise_null: '连线为空',
  com_static_param_code_exist: '静态数据编码已经存在',
  group_name_exist: '讨论组名称重复',
  FAIL: '保存出错',
  user_not_exit: '该用户不存在',
  user_pwd_err: '密码错误！',
  msg_kdb_question_redundancy: '问题重复，无法保存',
};

export function getResMsg(code) {
  if (code) {
    return codeMap[code.toLowerCase()] || '未知错误';
  }
  return '未知错误';
}

export const EDIT_HINT =
  '<span style="font-family: PingFangSC-Regular; font-size: 14px; color: rgba(0,0,0,0.25); line-height: 22px;">请输入...<span/>';

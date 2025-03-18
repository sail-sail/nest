export function getScalars() {
  const scalars = {
    
    // 后台任务
    "BackgroundTaskId": {
      "input": `import("/gen/base/background_task/background_task.model.ts").BackgroundTaskId`,
      "output": `import("/gen/base/background_task/background_task.model.ts").BackgroundTaskId`,
    },
    
    // 数据权限
    "DataPermitId": {
      "input": `import("/gen/base/data_permit/data_permit.model.ts").DataPermitId`,
      "output": `import("/gen/base/data_permit/data_permit.model.ts").DataPermitId`,
    },
    
    // 部门
    "DeptId": {
      "input": `import("/gen/base/dept/dept.model.ts").DeptId`,
      "output": `import("/gen/base/dept/dept.model.ts").DeptId`,
    },
    
    // 系统字典
    "DictId": {
      "input": `import("/gen/base/dict/dict.model.ts").DictId`,
      "output": `import("/gen/base/dict/dict.model.ts").DictId`,
    },
    
    // 系统字典明细
    "DictDetailId": {
      "input": `import("/gen/base/dict_detail/dict_detail.model.ts").DictDetailId`,
      "output": `import("/gen/base/dict_detail/dict_detail.model.ts").DictDetailId`,
    },
    
    // 业务字典
    "DictbizId": {
      "input": `import("/gen/base/dictbiz/dictbiz.model.ts").DictbizId`,
      "output": `import("/gen/base/dictbiz/dictbiz.model.ts").DictbizId`,
    },
    
    // 业务字典明细
    "DictbizDetailId": {
      "input": `import("/gen/base/dictbiz_detail/dictbiz_detail.model.ts").DictbizDetailId`,
      "output": `import("/gen/base/dictbiz_detail/dictbiz_detail.model.ts").DictbizDetailId`,
    },
    
    // 域名
    "DomainId": {
      "input": `import("/gen/base/domain/domain.model.ts").DomainId`,
      "output": `import("/gen/base/domain/domain.model.ts").DomainId`,
    },
    
    // 字段权限
    "FieldPermitId": {
      "input": `import("/gen/base/field_permit/field_permit.model.ts").FieldPermitId`,
      "output": `import("/gen/base/field_permit/field_permit.model.ts").FieldPermitId`,
    },
    
    // 国际化
    "I18nId": {
      "input": `import("/gen/base/i18n/i18n.model.ts").I18nId`,
      "output": `import("/gen/base/i18n/i18n.model.ts").I18nId`,
    },
    
    // 图标库
    "IconId": {
      "input": `import("/gen/base/icon/icon.model.ts").IconId`,
      "output": `import("/gen/base/icon/icon.model.ts").IconId`,
    },
    
    // 语言
    "LangId": {
      "input": `import("/gen/base/lang/lang.model.ts").LangId`,
      "output": `import("/gen/base/lang/lang.model.ts").LangId`,
    },
    
    // 登录日志
    "LoginLogId": {
      "input": `import("/gen/base/login_log/login_log.model.ts").LoginLogId`,
      "output": `import("/gen/base/login_log/login_log.model.ts").LoginLogId`,
    },
    
    // 菜单
    "MenuId": {
      "input": `import("/gen/base/menu/menu.model.ts").MenuId`,
      "output": `import("/gen/base/menu/menu.model.ts").MenuId`,
    },
    
    // 操作记录
    "OperationRecordId": {
      "input": `import("/gen/base/operation_record/operation_record.model.ts").OperationRecordId`,
      "output": `import("/gen/base/operation_record/operation_record.model.ts").OperationRecordId`,
    },
    
    // 业务选项
    "OptbizId": {
      "input": `import("/gen/base/optbiz/optbiz.model.ts").OptbizId`,
      "output": `import("/gen/base/optbiz/optbiz.model.ts").OptbizId`,
    },
    
    // 系统选项
    "OptionsId": {
      "input": `import("/gen/base/options/options.model.ts").OptionsId`,
      "output": `import("/gen/base/options/options.model.ts").OptionsId`,
    },
    
    // 组织
    "OrgId": {
      "input": `import("/gen/base/org/org.model.ts").OrgId`,
      "output": `import("/gen/base/org/org.model.ts").OrgId`,
    },
    
    // 按钮权限
    "PermitId": {
      "input": `import("/gen/base/permit/permit.model.ts").PermitId`,
      "output": `import("/gen/base/permit/permit.model.ts").PermitId`,
    },
    
    // 角色
    "RoleId": {
      "input": `import("/gen/base/role/role.model.ts").RoleId`,
      "output": `import("/gen/base/role/role.model.ts").RoleId`,
    },
    
    // 租户
    "TenantId": {
      "input": `import("/gen/base/tenant/tenant.model.ts").TenantId`,
      "output": `import("/gen/base/tenant/tenant.model.ts").TenantId`,
    },
    
    // 用户
    "UsrId": {
      "input": `import("/gen/base/usr/usr.model.ts").UsrId`,
      "output": `import("/gen/base/usr/usr.model.ts").UsrId`,
    },
    
    // 微信JSAPI下单
    "PayTransactionsJsapiId": {
      "input": `import("/gen/wx/pay_transactions_jsapi/pay_transactions_jsapi.model.ts").PayTransactionsJsapiId`,
      "output": `import("/gen/wx/pay_transactions_jsapi/pay_transactions_jsapi.model.ts").PayTransactionsJsapiId`,
    },
    
    // 小程序设置
    "WxAppId": {
      "input": `import("/gen/wx/wx_app/wx_app.model.ts").WxAppId`,
      "output": `import("/gen/wx/wx_app/wx_app.model.ts").WxAppId`,
    },
    
    // 小程序接口凭据
    "WxAppTokenId": {
      "input": `import("/gen/wx/wx_app_token/wx_app_token.model.ts").WxAppTokenId`,
      "output": `import("/gen/wx/wx_app_token/wx_app_token.model.ts").WxAppTokenId`,
    },
    
    // 微信支付设置
    "WxPayId": {
      "input": `import("/gen/wx/wx_pay/wx_pay.model.ts").WxPayId`,
      "output": `import("/gen/wx/wx_pay/wx_pay.model.ts").WxPayId`,
    },
    
    // 微信支付通知
    "WxPayNoticeId": {
      "input": `import("/gen/wx/wx_pay_notice/wx_pay_notice.model.ts").WxPayNoticeId`,
      "output": `import("/gen/wx/wx_pay_notice/wx_pay_notice.model.ts").WxPayNoticeId`,
    },
    
    // 小程序用户
    "WxUsrId": {
      "input": `import("/gen/wx/wx_usr/wx_usr.model.ts").WxUsrId`,
      "output": `import("/gen/wx/wx_usr/wx_usr.model.ts").WxUsrId`,
    },
    
    // 公众号设置
    "WxoAppId": {
      "input": `import("/gen/wx/wxo_app/wxo_app.model.ts").WxoAppId`,
      "output": `import("/gen/wx/wxo_app/wxo_app.model.ts").WxoAppId`,
    },
    
    // 小程序接口凭据
    "WxoAppTokenId": {
      "input": `import("/gen/wx/wxo_app_token/wxo_app_token.model.ts").WxoAppTokenId`,
      "output": `import("/gen/wx/wxo_app_token/wxo_app_token.model.ts").WxoAppTokenId`,
    },
    
    // 公众号用户
    "WxoUsrId": {
      "input": `import("/gen/wx/wxo_usr/wxo_usr.model.ts").WxoUsrId`,
      "output": `import("/gen/wx/wxo_usr/wxo_usr.model.ts").WxoUsrId`,
    },
    
  };
  return scalars;
}

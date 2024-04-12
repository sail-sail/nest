export function getScalars() {
  const scalars = {
    
    // 后台任务
    "BackgroundTaskId": {
      "input": "BackgroundTaskId",
      "output": "BackgroundTaskId",
    },
    
    // 数据权限
    "DataPermitId": {
      "input": "DataPermitId",
      "output": "DataPermitId",
    },
    
    // 部门
    "DeptId": {
      "input": "DeptId",
      "output": "DeptId",
    },
    
    // 系统字典
    "DictId": {
      "input": "DictId",
      "output": "DictId",
    },
    
    // 系统字典明细
    "DictDetailId": {
      "input": "DictDetailId",
      "output": "DictDetailId",
    },
    
    // 业务字典
    "DictbizId": {
      "input": "DictbizId",
      "output": "DictbizId",
    },
    
    // 业务字典明细
    "DictbizDetailId": {
      "input": "DictbizDetailId",
      "output": "DictbizDetailId",
    },
    
    // 域名
    "DomainId": {
      "input": "DomainId",
      "output": "DomainId",
    },
    
    // 字段权限
    "FieldPermitId": {
      "input": "FieldPermitId",
      "output": "FieldPermitId",
    },
    
    // 国际化
    "I18nId": {
      "input": "I18nId",
      "output": "I18nId",
    },
    
    // 语言
    "LangId": {
      "input": "LangId",
      "output": "LangId",
    },
    
    // 登录日志
    "LoginLogId": {
      "input": "LoginLogId",
      "output": "LoginLogId",
    },
    
    // 菜单
    "MenuId": {
      "input": "MenuId",
      "output": "MenuId",
    },
    
    // 操作记录
    "OperationRecordId": {
      "input": "OperationRecordId",
      "output": "OperationRecordId",
    },
    
    // 业务选项
    "OptbizId": {
      "input": "OptbizId",
      "output": "OptbizId",
    },
    
    // 系统选项
    "OptionsId": {
      "input": "OptionsId",
      "output": "OptionsId",
    },
    
    // 组织
    "OrgId": {
      "input": "OrgId",
      "output": "OrgId",
    },
    
    // 按钮权限
    "PermitId": {
      "input": "PermitId",
      "output": "PermitId",
    },
    
    // 角色
    "RoleId": {
      "input": "RoleId",
      "output": "RoleId",
    },
    
    // 租户
    "TenantId": {
      "input": "TenantId",
      "output": "TenantId",
    },
    
    // 用户
    "UsrId": {
      "input": "UsrId",
      "output": "UsrId",
    },
    
    // 会员卡
    "CardId": {
      "input": `import("/gen/wshop/card/card.model.ts").CardId`,
      "output": `import("/gen/wshop/card/card.model.ts").CardId`,
    },
    
    // 会员卡消费记录
    "CardConsumeId": {
      "input": `import("/gen/wshop/card_consume/card_consume.model.ts").CardConsumeId`,
      "output": `import("/gen/wshop/card_consume/card_consume.model.ts").CardConsumeId`,
    },
    
    // 会员卡充值记录
    "CardRechargeId": {
      "input": `import("/gen/wshop/card_recharge/card_recharge.model.ts").CardRechargeId`,
      "output": `import("/gen/wshop/card_recharge/card_recharge.model.ts").CardRechargeId`,
    },
    
    // 订单
    "OrderId": {
      "input": `import("/gen/wshop/order/order.model.ts").OrderId`,
      "output": `import("/gen/wshop/order/order.model.ts").OrderId`,
    },
    
    // 产品
    "PtId": {
      "input": `import("/gen/wshop/pt/pt.model.ts").PtId`,
      "output": `import("/gen/wshop/pt/pt.model.ts").PtId`,
    },
    
    // 产品类别
    "PtTypeId": {
      "input": `import("/gen/wshop/pt_type/pt_type.model.ts").PtTypeId`,
      "output": `import("/gen/wshop/pt_type/pt_type.model.ts").PtTypeId`,
    },
    
    // 充值赠送规则
    "RechargeRuleId": {
      "input": `import("/gen/wshop/recharge_rule/recharge_rule.model.ts").RechargeRuleId`,
      "output": `import("/gen/wshop/recharge_rule/recharge_rule.model.ts").RechargeRuleId`,
    },
    
    // 小程序配置
    "WxappConfigId": {
      "input": `import("/gen/wshop/wxapp_config/wxapp_config.model.ts").WxappConfigId`,
      "output": `import("/gen/wshop/wxapp_config/wxapp_config.model.ts").WxappConfigId`,
    },
    
    // 微信JSAPI下单
    "PayTransactionsJsapiId": {
      "input": "PayTransactionsJsapiId",
      "output": "PayTransactionsJsapiId",
    },
    
    // 小程序设置
    "WxAppId": {
      "input": "WxAppId",
      "output": "WxAppId",
    },
    
    // 小程序接口凭据
    "WxAppTokenId": {
      "input": "WxAppTokenId",
      "output": "WxAppTokenId",
    },
    
    // 微信支付设置
    "WxPayId": {
      "input": "WxPayId",
      "output": "WxPayId",
    },
    
    // 微信支付通知
    "WxPayNoticeId": {
      "input": "WxPayNoticeId",
      "output": "WxPayNoticeId",
    },
    
    // 小程序用户
    "WxUsrId": {
      "input": "WxUsrId",
      "output": "WxUsrId",
    },
    
    // 公众号设置
    "WxoAppId": {
      "input": "WxoAppId",
      "output": "WxoAppId",
    },
    
    // 小程序接口凭据
    "WxoAppTokenId": {
      "input": "WxoAppTokenId",
      "output": "WxoAppTokenId",
    },
    
    // 公众号用户
    "WxoUsrId": {
      "input": "WxoUsrId",
      "output": "WxoUsrId",
    },
    
  };
  return scalars;
}

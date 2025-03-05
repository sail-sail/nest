
declare const background_taskId: unique symbol;
/** 后台任务 */
type BackgroundTaskId = Distinct<string, typeof background_taskId>;

declare const data_permitId: unique symbol;
/** 数据权限 */
type DataPermitId = Distinct<string, typeof data_permitId>;

declare const deptId: unique symbol;
/** 部门 */
type DeptId = Distinct<string, typeof deptId>;

declare const dictId: unique symbol;
/** 系统字典 */
type DictId = Distinct<string, typeof dictId>;

declare const dict_detailId: unique symbol;
/** 系统字典明细 */
type DictDetailId = Distinct<string, typeof dict_detailId>;

declare const dictbizId: unique symbol;
/** 业务字典 */
type DictbizId = Distinct<string, typeof dictbizId>;

declare const dictbiz_detailId: unique symbol;
/** 业务字典明细 */
type DictbizDetailId = Distinct<string, typeof dictbiz_detailId>;

declare const domainId: unique symbol;
/** 域名 */
type DomainId = Distinct<string, typeof domainId>;

declare const field_permitId: unique symbol;
/** 字段权限 */
type FieldPermitId = Distinct<string, typeof field_permitId>;

declare const i18nId: unique symbol;
/** 国际化 */
type I18nId = Distinct<string, typeof i18nId>;

declare const iconId: unique symbol;
/** 图标库 */
type IconId = Distinct<string, typeof iconId>;

declare const langId: unique symbol;
/** 语言 */
type LangId = Distinct<string, typeof langId>;

declare const login_logId: unique symbol;
/** 登录日志 */
type LoginLogId = Distinct<string, typeof login_logId>;

declare const menuId: unique symbol;
/** 菜单 */
type MenuId = Distinct<string, typeof menuId>;

declare const operation_recordId: unique symbol;
/** 操作记录 */
type OperationRecordId = Distinct<string, typeof operation_recordId>;

declare const optbizId: unique symbol;
/** 业务选项 */
type OptbizId = Distinct<string, typeof optbizId>;

declare const optionsId: unique symbol;
/** 系统选项 */
type OptionsId = Distinct<string, typeof optionsId>;

declare const orgId: unique symbol;
/** 组织 */
type OrgId = Distinct<string, typeof orgId>;

declare const permitId: unique symbol;
/** 按钮权限 */
type PermitId = Distinct<string, typeof permitId>;

declare const roleId: unique symbol;
/** 角色 */
type RoleId = Distinct<string, typeof roleId>;

declare const tenantId: unique symbol;
/** 租户 */
type TenantId = Distinct<string, typeof tenantId>;

declare const usrId: unique symbol;
/** 用户 */
type UsrId = Distinct<string, typeof usrId>;

declare const cardId: unique symbol;
/** 会员卡 */
type CardId = Distinct<string, typeof cardId>;

declare const card_consumeId: unique symbol;
/** 会员卡消费记录 */
type CardConsumeId = Distinct<string, typeof card_consumeId>;

declare const card_rechargeId: unique symbol;
/** 会员卡充值记录 */
type CardRechargeId = Distinct<string, typeof card_rechargeId>;

declare const orderId: unique symbol;
/** 订单 */
type OrderId = Distinct<string, typeof orderId>;

declare const ptId: unique symbol;
/** 产品 */
type PtId = Distinct<string, typeof ptId>;

declare const pt_typeId: unique symbol;
/** 产品类别 */
type PtTypeId = Distinct<string, typeof pt_typeId>;

declare const recharge_ruleId: unique symbol;
/** 充值赠送规则 */
type RechargeRuleId = Distinct<string, typeof recharge_ruleId>;

declare const wxapp_configId: unique symbol;
/** 小程序配置 */
type WxappConfigId = Distinct<string, typeof wxapp_configId>;

declare const pay_transactions_jsapiId: unique symbol;
/** 微信JSAPI下单 */
type PayTransactionsJsapiId = Distinct<string, typeof pay_transactions_jsapiId>;

declare const wx_appId: unique symbol;
/** 小程序设置 */
type WxAppId = Distinct<string, typeof wx_appId>;

declare const wx_app_tokenId: unique symbol;
/** 小程序接口凭据 */
type WxAppTokenId = Distinct<string, typeof wx_app_tokenId>;

declare const wx_payId: unique symbol;
/** 微信支付设置 */
type WxPayId = Distinct<string, typeof wx_payId>;

declare const wx_pay_noticeId: unique symbol;
/** 微信支付通知 */
type WxPayNoticeId = Distinct<string, typeof wx_pay_noticeId>;

declare const wx_usrId: unique symbol;
/** 小程序用户 */
type WxUsrId = Distinct<string, typeof wx_usrId>;

declare const wxo_appId: unique symbol;
/** 公众号设置 */
type WxoAppId = Distinct<string, typeof wxo_appId>;

declare const wxo_app_tokenId: unique symbol;
/** 小程序接口凭据 */
type WxoAppTokenId = Distinct<string, typeof wxo_app_tokenId>;

declare const wxo_usrId: unique symbol;
/** 公众号用户 */
type WxoUsrId = Distinct<string, typeof wxo_usrId>;

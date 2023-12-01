
// 后台任务
declare const background_taskId: unique symbol;
export type BackgroundTaskId = typeof background_taskId;

// 数据权限
declare const data_permitId: unique symbol;
export type DataPermitId = typeof data_permitId;

// 部门
declare const deptId: unique symbol;
export type DeptId = typeof deptId;

// 系统字典
declare const dictId: unique symbol;
export type DictId = typeof dictId;

// 系统字典明细
declare const dict_detailId: unique symbol;
export type DictDetailId = typeof dict_detailId;

// 业务字典
declare const dictbizId: unique symbol;
export type DictbizId = typeof dictbizId;

// 业务字典明细
declare const dictbiz_detailId: unique symbol;
export type DictbizDetailId = typeof dictbiz_detailId;

// 域名
declare const domainId: unique symbol;
export type DomainId = typeof domainId;

// 字段权限
declare const field_permitId: unique symbol;
export type FieldPermitId = typeof field_permitId;

// 国际化
declare const i18nId: unique symbol;
export type I18nId = typeof i18nId;

// 语言
declare const langId: unique symbol;
export type LangId = typeof langId;

// 菜单
declare const menuId: unique symbol;
export type MenuId = typeof menuId;

// 操作记录
declare const operation_recordId: unique symbol;
export type OperationRecordId = typeof operation_recordId;

// 业务选项
declare const optbizId: unique symbol;
export type OptbizId = typeof optbizId;

// 系统选项
declare const optionsId: unique symbol;
export type OptionsId = typeof optionsId;

// 组织
declare const orgId: unique symbol;
export type OrgId = typeof orgId;

// 按钮权限
declare const permitId: unique symbol;
export type PermitId = typeof permitId;

// 角色
declare const roleId: unique symbol;
export type RoleId = typeof roleId;

// 租户
declare const tenantId: unique symbol;
export type TenantId = typeof tenantId;

// 用户
declare const usrId: unique symbol;
export type UsrId = typeof usrId;

// 微信JSAPI下单
export const pay_transactions_jsapiId = Symbol.for("PayTransactionsJsapiId");
export type PayTransactionsJsapiId = typeof pay_transactions_jsapiId;

// 微信小程序
export const wx_appId = Symbol.for("WxAppId");
export type WxAppId = typeof wx_appId;

// 小程序接口凭据
export const wx_app_tokenId = Symbol.for("WxAppTokenId");
export type WxAppTokenId = typeof wx_app_tokenId;

// 微信支付
export const wx_payId = Symbol.for("WxPayId");
export type WxPayId = typeof wx_payId;

// 微信支付通知
export const wx_pay_noticeId = Symbol.for("WxPayNoticeId");
export type WxPayNoticeId = typeof wx_pay_noticeId;

// 微信用户
export const wx_usrId = Symbol.for("WxUsrId");
export type WxUsrId = typeof wx_usrId;

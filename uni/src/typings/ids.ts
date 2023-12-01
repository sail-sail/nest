
// 后台任务
export const background_taskId = Symbol.for("BackgroundTaskId");
export type BackgroundTaskId = typeof background_taskId;

// 数据权限
export const data_permitId = Symbol.for("DataPermitId");
export type DataPermitId = typeof data_permitId;

// 部门
export const deptId = Symbol.for("DeptId");
export type DeptId = typeof deptId;

// 系统字典
export const dictId = Symbol.for("DictId");
export type DictId = typeof dictId;

// 系统字典明细
export const dict_detailId = Symbol.for("DictDetailId");
export type DictDetailId = typeof dict_detailId;

// 业务字典
export const dictbizId = Symbol.for("DictbizId");
export type DictbizId = typeof dictbizId;

// 业务字典明细
export const dictbiz_detailId = Symbol.for("DictbizDetailId");
export type DictbizDetailId = typeof dictbiz_detailId;

// 域名
export const domainId = Symbol.for("DomainId");
export type DomainId = typeof domainId;

// 字段权限
export const field_permitId = Symbol.for("FieldPermitId");
export type FieldPermitId = typeof field_permitId;

// 国际化
export const i18nId = Symbol.for("I18nId");
export type I18nId = typeof i18nId;

// 语言
export const langId = Symbol.for("LangId");
export type LangId = typeof langId;

// 菜单
export const menuId = Symbol.for("MenuId");
export type MenuId = typeof menuId;

// 操作记录
export const operation_recordId = Symbol.for("OperationRecordId");
export type OperationRecordId = typeof operation_recordId;

// 业务选项
export const optbizId = Symbol.for("OptbizId");
export type OptbizId = typeof optbizId;

// 系统选项
export const optionsId = Symbol.for("OptionsId");
export type OptionsId = typeof optionsId;

// 组织
export const orgId = Symbol.for("OrgId");
export type OrgId = typeof orgId;

// 按钮权限
export const permitId = Symbol.for("PermitId");
export type PermitId = typeof permitId;

// 角色
export const roleId = Symbol.for("RoleId");
export type RoleId = typeof roleId;

// 租户
export const tenantId = Symbol.for("TenantId");
export type TenantId = typeof tenantId;

// 用户
export const usrId = Symbol.for("UsrId");
export type UsrId = typeof usrId;

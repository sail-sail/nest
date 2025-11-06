
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

declare const dyn_pageId: unique symbol;
/** 动态页面 */
type DynPageId = Distinct<string, typeof dyn_pageId>;

declare const dyn_page_fieldId: unique symbol;
/** 动态页面字段 */
type DynPageFieldId = Distinct<string, typeof dyn_page_fieldId>;

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

declare const cron_jobId: unique symbol;
/** 定时任务 */
type CronJobId = Distinct<string, typeof cron_jobId>;

declare const cron_job_logId: unique symbol;
/** 定时任务日志 */
type CronJobLogId = Distinct<string, typeof cron_job_logId>;

declare const cron_job_log_detailId: unique symbol;
/** 定时任务日志明细 */
type CronJobLogDetailId = Distinct<string, typeof cron_job_log_detailId>;

declare const jobId: unique symbol;
/** 任务 */
type JobId = Distinct<string, typeof jobId>;

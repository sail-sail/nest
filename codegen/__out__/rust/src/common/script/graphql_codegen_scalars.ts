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
    
    // 定时任务
    "CronJobId": {
      "input": `import("/gen/cron/cron_job/cron_job.model.ts").CronJobId`,
      "output": `import("/gen/cron/cron_job/cron_job.model.ts").CronJobId`,
    },
    
    // 定时任务日志
    "CronJobLogId": {
      "input": `import("/gen/cron/cron_job_log/cron_job_log.model.ts").CronJobLogId`,
      "output": `import("/gen/cron/cron_job_log/cron_job_log.model.ts").CronJobLogId`,
    },
    
    // 定时任务日志明细
    "CronJobLogDetailId": {
      "input": `import("/gen/cron/cron_job_log_detail/cron_job_log_detail.model.ts").CronJobLogDetailId`,
      "output": `import("/gen/cron/cron_job_log_detail/cron_job_log_detail.model.ts").CronJobLogDetailId`,
    },
    
    // 任务
    "JobId": {
      "input": `import("/gen/cron/job/job.model.ts").JobId`,
      "output": `import("/gen/cron/job/job.model.ts").JobId`,
    },
    
  };
  return scalars;
}

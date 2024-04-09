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
    
    // 定时任务
    "CronJobId": {
      "input": `import("/gen/cron/cron_job/cron_job.model.ts").CronJobId`,
      "output": `import("/gen/cron/cron_job/cron_job.model.ts").CronJobId`,
    },
    
    // 任务执行日志
    "CronJobLogId": {
      "input": `import("/gen/cron/cron_job_log/cron_job_log.model.ts").CronJobLogId`,
      "output": `import("/gen/cron/cron_job_log/cron_job_log.model.ts").CronJobLogId`,
    },
    
    // 任务执行日志明细
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

import {
  get_is_debug,
  log,
} from "/lib/context.ts";

/** 根据 usr_id 同步所有表中的创建人/更新人/删除人标签 */
export async function syncUsrLblByUsrId(
  usr_id: UsrId,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const method = "syncUsrLblByUsrId";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ method }:`;
    if (usr_id) {
      msg += ` usr_id:${ usr_id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (!usr_id) {
    return 0;
  }
  
  const syncOptions = {
    ...(options ?? { }),
    is_debug: false,
  };
  
  let affectedRows = 0;
  
  const {
    syncUsrLblByUsrIdRole,
  } = await import("/gen/base/role/role.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdRole(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdTenant,
  } = await import("/gen/base/tenant/tenant.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdTenant(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdDomain,
  } = await import("/gen/base/domain/domain.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdDomain(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdUsr,
  } = await import("/gen/base/usr/usr.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdUsr(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdLoginLog,
  } = await import("/gen/base/login_log/login_log.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdLoginLog(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdMenu,
  } = await import("/gen/base/menu/menu.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdMenu(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdLang,
  } = await import("/gen/base/lang/lang.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdLang(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdI18n,
  } = await import("/gen/base/i18n/i18n.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdI18n(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdDataPermit,
  } = await import("/gen/base/data_permit/data_permit.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdDataPermit(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdOptions,
  } = await import("/gen/base/options/options.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdOptions(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdOptbiz,
  } = await import("/gen/base/optbiz/optbiz.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdOptbiz(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdOperationRecord,
  } = await import("/gen/base/operation_record/operation_record.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdOperationRecord(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdOrg,
  } = await import("/gen/base/org/org.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdOrg(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdDept,
  } = await import("/gen/base/dept/dept.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdDept(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdDict,
  } = await import("/gen/base/dict/dict.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdDict(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdDictDetail,
  } = await import("/gen/base/dict_detail/dict_detail.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdDictDetail(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdDictbiz,
  } = await import("/gen/base/dictbiz/dictbiz.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdDictbiz(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdDictbizDetail,
  } = await import("/gen/base/dictbiz_detail/dictbiz_detail.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdDictbizDetail(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdIcon,
  } = await import("/gen/base/icon/icon.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdIcon(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdDynPage,
  } = await import("/gen/base/dyn_page/dyn_page.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdDynPage(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdDynPageField,
  } = await import("/gen/base/dyn_page_field/dyn_page_field.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdDynPageField(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdDynPageVal,
  } = await import("/gen/base/dyn_page_val/dyn_page_val.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdDynPageVal(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdDynPageData,
  } = await import("/gen/base/dyn_page_data/dyn_page_data.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdDynPageData(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdMessage,
  } = await import("/gen/base/message/message.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdMessage(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdMessageReceiver,
  } = await import("/gen/base/message_receiver/message_receiver.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdMessageReceiver(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdJob,
  } = await import("/gen/cron/job/job.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdJob(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdCronJob,
  } = await import("/gen/cron/cron_job/cron_job.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdCronJob(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdCronJobLog,
  } = await import("/gen/cron/cron_job_log/cron_job_log.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdCronJobLog(
    usr_id,
    syncOptions,
  );
  
  const {
    syncUsrLblByUsrIdCronJobLogDetail,
  } = await import("/gen/cron/cron_job_log_detail/cron_job_log_detail.dao.ts");
  
  affectedRows += await syncUsrLblByUsrIdCronJobLogDetail(
    usr_id,
    syncOptions,
  );
  
  return affectedRows;
}
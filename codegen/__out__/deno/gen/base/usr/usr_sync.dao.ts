import {
  get_is_debug,
  log,
} from "/lib/context.ts";

import type {
  UsrId,
} from "/gen/types.ts";

import {
  syncUsrLblByUsrIdRole,
} from "/gen/base/role/role.dao.ts";

import {
  syncUsrLblByUsrIdTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  syncUsrLblByUsrIdDomain,
} from "/gen/base/domain/domain.dao.ts";

import {
  syncUsrLblByUsrIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  syncUsrLblByUsrIdLoginLog,
} from "/gen/base/login_log/login_log.dao.ts";

import {
  syncUsrLblByUsrIdMenu,
} from "/gen/base/menu/menu.dao.ts";

import {
  syncUsrLblByUsrIdLang,
} from "/gen/base/lang/lang.dao.ts";

import {
  syncUsrLblByUsrIdI18n,
} from "/gen/base/i18n/i18n.dao.ts";

import {
  syncUsrLblByUsrIdDataPermit,
} from "/gen/base/data_permit/data_permit.dao.ts";

import {
  syncUsrLblByUsrIdOptions,
} from "/gen/base/options/options.dao.ts";

import {
  syncUsrLblByUsrIdOptbiz,
} from "/gen/base/optbiz/optbiz.dao.ts";

import {
  syncUsrLblByUsrIdOperationRecord,
} from "/gen/base/operation_record/operation_record.dao.ts";

import {
  syncUsrLblByUsrIdOrg,
} from "/gen/base/org/org.dao.ts";

import {
  syncUsrLblByUsrIdDept,
} from "/gen/base/dept/dept.dao.ts";

import {
  syncUsrLblByUsrIdDict,
} from "/gen/base/dict/dict.dao.ts";

import {
  syncUsrLblByUsrIdDictDetail,
} from "/gen/base/dict_detail/dict_detail.dao.ts";

import {
  syncUsrLblByUsrIdDictbiz,
} from "/gen/base/dictbiz/dictbiz.dao.ts";

import {
  syncUsrLblByUsrIdDictbizDetail,
} from "/gen/base/dictbiz_detail/dictbiz_detail.dao.ts";

import {
  syncUsrLblByUsrIdIcon,
} from "/gen/base/icon/icon.dao.ts";

import {
  syncUsrLblByUsrIdDynPage,
} from "/gen/base/dyn_page/dyn_page.dao.ts";

import {
  syncUsrLblByUsrIdDynPageField,
} from "/gen/base/dyn_page_field/dyn_page_field.dao.ts";

import {
  syncUsrLblByUsrIdDynPageVal,
} from "/gen/base/dyn_page_val/dyn_page_val.dao.ts";

import {
  syncUsrLblByUsrIdDynPageData,
} from "/gen/base/dyn_page_data/dyn_page_data.dao.ts";

import {
  syncUsrLblByUsrIdJob,
} from "/gen/cron/job/job.dao.ts";

import {
  syncUsrLblByUsrIdCronJob,
} from "/gen/cron/cron_job/cron_job.dao.ts";

import {
  syncUsrLblByUsrIdCronJobLog,
} from "/gen/cron/cron_job_log/cron_job_log.dao.ts";

import {
  syncUsrLblByUsrIdCronJobLogDetail,
} from "/gen/cron/cron_job_log_detail/cron_job_log_detail.dao.ts";

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
  
  affectedRows += await syncUsrLblByUsrIdRole(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdTenant(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdDomain(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdUsr(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdLoginLog(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdMenu(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdLang(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdI18n(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdDataPermit(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdOptions(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdOptbiz(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdOperationRecord(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdOrg(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdDept(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdDict(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdDictDetail(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdDictbiz(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdDictbizDetail(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdIcon(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdDynPage(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdDynPageField(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdDynPageVal(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdDynPageData(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdJob(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdCronJob(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdCronJobLog(
    usr_id,
    syncOptions,
  );
  
  affectedRows += await syncUsrLblByUsrIdCronJobLogDetail(
    usr_id,
    syncOptions,
  );
  
  return affectedRows;
}
<#
const syncTables = usrLblSyncTables;
#>import {
  get_is_debug,
  log,
} from "/lib/context.ts";

import type {
  UsrId,
} from "/gen/types.ts";<#
for (let i = 0; i < syncTables.length; i++) {
  const item = syncTables[i];
#>

import {
  syncUsrLblByUsrId<#=item.Table_Up#>,
} from "/gen/<#=item.mod#>/<#=item.table#>/<#=item.table#>.dao.ts";<#
}
#>

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
  
  let affectedRows = 0;<#
for (let i = 0; i < syncTables.length; i++) {
  const item = syncTables[i];
#>
  
  affectedRows += await syncUsrLblByUsrId<#=item.Table_Up#>(
    usr_id,
    syncOptions,
  );<#
}
#>
  
  return affectedRows;
}
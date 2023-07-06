import {
  query,
  QueryArgs,
} from "/lib/context.ts";

import * as usrDaoSrc from "/src/base/usr/usr.dao.ts";

type DictModel = {
  id: string;
  code: string;
  lbl: string;
  val: string;
};

/**
 * 获取 codes 对应的系统字典
 */
export async function getDictbiz(
  codes: string[] = [ ],
) {
  const table = "base_dictbiz_detail";
  
  if (codes.length === 0) {
    return [ ];
  }
  
  const tenant_id = await usrDaoSrc.getTenant_id();
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      t.id,
      base_dictbiz.code,
      base_dictbiz.type,
      t.lbl,
      t.val
    from
      base_dictbiz_detail t
    inner join base_dictbiz
      on t.dictbiz_id = base_dictbiz.id
      and base_dictbiz.is_deleted = 0
      and base_dictbiz.is_enabled = 1
    where
      t.is_deleted = 0
      and t.is_enabled = 1
      and t.tenant_id = ${ args.push(tenant_id) }
      and base_dictbiz.tenant_id = ${ args.push(tenant_id) }
      and base_dictbiz.code in ${ args.push(codes) }
    order by
      t.order_by asc
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  const rsArr = await query<DictModel>(sql, args, { cacheKey1, cacheKey2 });
  const data: DictModel[][] = [ ];
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const itemArr = rsArr.filter((itemTmp) => itemTmp.code === code);
    data.push(itemArr);
  }
  return data;
}

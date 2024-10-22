import {
  useContext,
  query,
  queryOne,
  QueryArgs,
} from "/lib/context.ts";

import {
  createToken,
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

// usr
import {
  findById as findUsrById,
  validateOption as validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

/** 根据 UsrId 获取 token, 用于内部登录 */
export async function getTokenByUsrId(
  usr_id: UsrId,
  tenant_id?: TenantId,
  lang = "zh-CN",
  org_id?: OrgId | null,
) {
  const usr_model = await validateOptionUsr(
    await findUsrById(usr_id),
  );
  const username = usr_model.username;
  
  if (!tenant_id) {
    tenant_id = usr_model.tenant_id;
  }
  
  org_id = org_id || usr_model.default_org_id;
  
  const {
    authorization,
  } = await createToken({
    id: usr_model.id,
    org_id,
    tenant_id,
    lang,
  });
  
  return {
    usr_id,
    username,
    tenant_id,
    authorization,
    org_id,
    lang,
  };
}

/**
 * 返回当前登录的用户
 * @param {string} username 用户名
 * @param {MutationLoginArgs["password"]} password 密码,传递进来的密码已经被前端md5加密过一次
 * @param {MutationLoginArgs["tenant_id"]} tenant_id 租户id
 */
export async function findLoginUsr(
  username: string,
  password: string,
  tenant_id: TenantId,
) {
  const args = new QueryArgs();
  const sql = /*sql*/`
    select
      t.id,
      t.default_org_id,
      t.is_hidden
    from base_usr t
    where
      t.is_deleted = 0
      and t.is_enabled = 1
      and t.username = ${ args.push(username) }
      and t.password = ${ args.push(password) }
      and t.tenant_id = ${ args.push(tenant_id) }
    limit 1
  `;
  const model = await queryOne<{
    id: UsrId,
    default_org_id: OrgId,
    is_hidden: 0|1,
  }>(sql, args);
  return model;
}

export async function getOrgIdsById(
  id: UsrId,
) {
  const args = new QueryArgs();
  const sql = `select t.org_id from base_usr_org t where t.is_deleted = 0 and t.usr_id = ${ args.push(id) }`;
  const result = await query<{
    org_id: OrgId,
  }>(sql, args);
  return (result || [ ]).map((item) => item.org_id);
}

export async function getTenant_idByWx_usr(): Promise<TenantId | undefined> {
  const context = useContext();
  const notVerifyToken = context.notVerifyToken;
  const authModel = await getAuthModel(notVerifyToken);
  if (!authModel) {
    return;
  }
  const wx_usr_id = authModel.wx_usr_id;
  if (!wx_usr_id) {
    return;
  }
  const args = new QueryArgs();
  const sql = /*sql*/`
    select
      t.id,
      t.tenant_id
    from wx_wx_usr t
    where
      t.id = ${ args.push(wx_usr_id) }
    limit 1
  `;
  interface Result {
    id: string;
    tenant_id: TenantId;
  }
  const model = await queryOne<Result>(
    sql,
    args,
    {
      debug: false,
      logResult: false,
    },
  );
  const tenant_id = model?.tenant_id;
  return tenant_id;
}

/**
 * 根据用户id获取租户id
 * @return {Promise<TenantId>} 
 */
export async function getTenant_id(
  usr_id?: UsrId | null,
): Promise<TenantId | undefined> {
  const authModel = await getAuthModel();
  let tenant_id = authModel?.tenant_id;
  if (!tenant_id && usr_id) {
    const args = new QueryArgs();
    const sql = `select t.tenant_id from base_usr t where t.id=${ args.push(usr_id) } limit 1`;
    interface Result {
      tenant_id?: TenantId;
    }
    const model = await queryOne<Result>(
      sql,
      args,
      {
        debug: false,
        logResult: false,
      },
    );
    tenant_id = model?.tenant_id;
  }
  if (!tenant_id) {
    tenant_id = await getTenant_idByWx_usr();
  }
  return tenant_id;
}

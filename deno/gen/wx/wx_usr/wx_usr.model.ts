import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxUsrInput as WxUsrInputType,
  WxUsrModel as WxUsrModelType,
  WxUsrSearch as WxUsrSearchType,
  WxUsrFieldComment as WxUsrFieldCommentType,
} from "/gen/types.ts";

export const wxUsrId = Symbol.for("WxUsrId");
export type WxUsrId = typeof wxUsrId;

export interface WxUsrSearch extends WxUsrSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxUsrModel extends WxUsrModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  org_id: string;
}

export interface WxUsrInput extends WxUsrInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export type { WxUsrFieldCommentType as WxUsrFieldComment };

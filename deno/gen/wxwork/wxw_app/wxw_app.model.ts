import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxwAppInput as WxwAppInputType,
  WxwAppModel as WxwAppModelType,
  WxwAppSearch as WxwAppSearchType,
  WxwAppFieldComment as WxwAppFieldCommentType,
} from "/gen/types.ts";

export const wxwAppId = Symbol.for("WxwAppId");
export type WxwAppId = typeof wxwAppId;

export interface WxwAppSearch extends WxwAppSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxwAppModel extends WxwAppModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface WxwAppInput extends WxwAppInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export type { WxwAppFieldCommentType as WxwAppFieldComment };

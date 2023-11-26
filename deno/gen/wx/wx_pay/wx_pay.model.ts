import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxPayInput as WxPayInputType,
  WxPayModel as WxPayModelType,
  WxPaySearch as WxPaySearchType,
  WxPayFieldComment as WxPayFieldCommentType,
} from "/gen/types.ts";

export const wxPayId = Symbol.for("WxPayId");
export type WxPayId = typeof wxPayId;

export interface WxPaySearch extends WxPaySearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxPayModel extends WxPayModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface WxPayInput extends WxPayInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export type { WxPayFieldCommentType as WxPayFieldComment };

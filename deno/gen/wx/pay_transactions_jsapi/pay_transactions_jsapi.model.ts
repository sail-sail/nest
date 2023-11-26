import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  PayTransactionsJsapiInput as PayTransactionsJsapiInputType,
  PayTransactionsJsapiModel as PayTransactionsJsapiModelType,
  PayTransactionsJsapiSearch as PayTransactionsJsapiSearchType,
  PayTransactionsJsapiFieldComment as PayTransactionsJsapiFieldCommentType,
} from "/gen/types.ts";

export const payTransactionsJsapiId = Symbol.for("PayTransactionsJsapiId");
export type PayTransactionsJsapiId = typeof payTransactionsJsapiId;

export interface PayTransactionsJsapiSearch extends PayTransactionsJsapiSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface PayTransactionsJsapiModel extends PayTransactionsJsapiModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  org_id: string;
}

export interface PayTransactionsJsapiInput extends PayTransactionsJsapiInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export type { PayTransactionsJsapiFieldCommentType as PayTransactionsJsapiFieldComment };

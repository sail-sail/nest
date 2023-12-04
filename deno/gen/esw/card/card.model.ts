import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  CardInput as CardInputType,
  CardModel as CardModelType,
  CardSearch as CardSearchType,
  CardFieldComment as CardFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const cardId: unique symbol;
export type CardId = Distinct<string, typeof cardId>;

export interface CardSearch extends CardSearchType {
  /** 卡号-序列号 */
  seq_lbl?: number[];
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface CardModel extends CardModelType {
  /** 卡号-序列号 */
  seq_lbl: number;
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
  org_id: OrgId;
}

export interface CardInput extends CardInputType {
  /** 卡号-序列号 */
  seq_lbl?: number;
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
  org_id?: OrgId | null;
}

export type { CardFieldCommentType as CardFieldComment };

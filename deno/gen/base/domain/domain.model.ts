import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DomainInput as DomainInputType,
  DomainModel as DomainModelType,
  DomainSearch as DomainSearchType,
  DomainFieldComment as DomainFieldCommentType,
} from "/gen/types.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const domainId: unique symbol;
export type DomainId = Distinct<string, typeof domainId>;

export interface DomainSearch extends DomainSearchType {
  $extra?: SearchExtra[];
}

export interface DomainModel extends DomainModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
}

export interface DomainInput extends DomainInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { DomainFieldCommentType as DomainFieldComment };

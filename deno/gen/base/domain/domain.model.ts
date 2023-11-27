import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DomainInput as DomainInputType,
  DomainModel as DomainModelType,
  DomainSearch as DomainSearchType,
  DomainFieldComment as DomainFieldCommentType,
} from "/gen/types.ts";

export const domainId = Symbol.for("DomainId");
export type DomainId = typeof domainId;

export interface DomainSearch extends DomainSearchType {
  $extra?: SearchExtra[];
}

export interface DomainModel extends DomainModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface DomainInput extends DomainInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { DomainFieldCommentType as DomainFieldComment };

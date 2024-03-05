

import type {
  LangInput as LangInputType,
  LangModel as LangModelType,
  LangSearch as LangSearchType,
  LangFieldComment as LangFieldCommentType,
} from "/gen/types.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const langId: unique symbol;
export type LangId = Distinct<string, typeof langId>;

export interface LangSearch extends LangSearchType {
}

export interface LangModel extends LangModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
}

export interface LangInput extends LangInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { LangFieldCommentType as LangFieldComment };

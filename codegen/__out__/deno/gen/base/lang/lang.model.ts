import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  LangInput as LangInputType,
  LangModel as LangModelType,
  LangSearch as LangSearchType,
} from "/gen/types.ts";

export interface LangSearch extends LangSearchType {
  $extra?: SearchExtra[];
}

export interface LangModel extends LangModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface LangInput extends LangInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
}

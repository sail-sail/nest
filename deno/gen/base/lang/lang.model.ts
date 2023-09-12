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

export interface LangFieldComment {
  id: string;
  code: string;
  lbl: string;
  is_enabled: string;
  is_enabled_lbl: string;
  order_by: string;
  rem: string;
  create_usr_id: string;
  create_usr_id_lbl: string;
  create_time: string;
  create_time_lbl: string;
  update_usr_id: string;
  update_usr_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
}

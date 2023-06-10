import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type DictInput as DictInputType,
  type DictModel as DictModelType,
  type DictSearch as DictSearchType,
} from "/gen/types.ts";

export interface DictSearch extends DictSearchType {
  $extra?: SearchExtra[];
}

export interface DictModel extends DictModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface DictInput extends DictInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
}

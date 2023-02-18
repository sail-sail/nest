import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type Background_TaskModel as Background_TaskModelType,
  type Background_TaskSearch as Background_TaskSearchType,
} from "/gen/types.ts";

export interface Background_TaskSearch extends Background_TaskSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface Background_TaskModel extends Background_TaskModelType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  tenant_id?: string | null;
}

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type Background_TaskModel as Background_TaskModelType,
  type Background_TaskSearch as Background_TaskSearchType,
} from "/gen/types.ts";

export interface Background_TaskSearch extends Background_TaskSearchType {
  $extra?: SearchExtra[],
  tenant_id?: string | null;
}

export interface Background_TaskModel extends Background_TaskModelType {
  tenant_id?: string | null;
}

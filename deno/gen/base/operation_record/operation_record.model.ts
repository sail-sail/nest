import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type Operation_RecordModel as Operation_RecordModelType,
  type Operation_RecordSearch as Operation_RecordSearchType,
} from "/gen/types.ts";

export interface Operation_RecordSearch extends Operation_RecordSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface Operation_RecordModel extends Operation_RecordModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type Operation_RecordModel as Operation_RecordModelType,
  type Operation_RecordSearch as Operation_RecordSearchType,
} from "/gen/types.ts";

export interface Operation_RecordSearch extends Operation_RecordSearchType {
  $extra?: SearchExtra[],
  tenant_id?: string | null;
}

export interface Operation_RecordModel extends Operation_RecordModelType {
  tenant_id?: string | null;
}

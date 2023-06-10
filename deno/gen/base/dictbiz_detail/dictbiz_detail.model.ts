import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type DictbizDetailInput as DictbizDetailInputType,
  type DictbizDetailModel as DictbizDetailModelType,
  type DictbizDetailSearch as DictbizDetailSearchType,
} from "/gen/types.ts";

export interface DictbizDetailSearch extends DictbizDetailSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface DictbizDetailModel extends DictbizDetailModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface DictbizDetailInput extends DictbizDetailInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

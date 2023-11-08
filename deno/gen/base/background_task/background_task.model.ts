import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  BackgroundTaskInput as BackgroundTaskInputType,
  BackgroundTaskModel as BackgroundTaskModelType,
  BackgroundTaskSearch as BackgroundTaskSearchType,
} from "/gen/types.ts";

export interface BackgroundTaskSearch extends BackgroundTaskSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface BackgroundTaskModel extends BackgroundTaskModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface BackgroundTaskInput extends BackgroundTaskInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export interface BackgroundTaskFieldComment {
  id: string;
  lbl: string;
  state: string;
  state_lbl: string;
  type: string;
  type_lbl: string;
  result: string;
  err_msg: string;
  begin_time: string;
  begin_time_lbl: string;
  end_time: string;
  end_time_lbl: string;
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

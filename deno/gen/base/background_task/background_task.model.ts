import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type BackgroundTaskInput as BackgroundTaskInputType,
  type BackgroundTaskModel as BackgroundTaskModelType,
  type BackgroundTaskSearch as BackgroundTaskSearchType,
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
  tenant_id?: string | null;
}

export interface BackgroundTaskInput extends BackgroundTaskInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

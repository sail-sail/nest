import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  BackgroundTaskInput as BackgroundTaskInputType,
  BackgroundTaskModel as BackgroundTaskModelType,
  BackgroundTaskSearch as BackgroundTaskSearchType,
  BackgroundTaskFieldComment as BackgroundTaskFieldCommentType,
} from "/gen/types.ts";

export const backgroundTaskId = Symbol.for("BackgroundTaskId");
export type BackgroundTaskId = typeof backgroundTaskId;

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

export type { BackgroundTaskFieldCommentType as BackgroundTaskFieldComment };

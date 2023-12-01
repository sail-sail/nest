import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  MenuInput as MenuInputType,
  MenuModel as MenuModelType,
  MenuSearch as MenuSearchType,
  MenuFieldComment as MenuFieldCommentType,
} from "/gen/types.ts";

declare const menuId: unique symbol;
export type MenuId = typeof menuId;

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface MenuSearch extends MenuSearchType {
  $extra?: SearchExtra[];
}

export interface MenuModel extends MenuModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
}

export interface MenuInput extends MenuInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { MenuFieldCommentType as MenuFieldComment };

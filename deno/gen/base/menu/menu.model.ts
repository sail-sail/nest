import type {
  MenuInput as MenuInputType,
  MenuModel as MenuModelType,
  MenuSearch as MenuSearchType,
  MenuFieldComment as MenuFieldCommentType,
} from "/gen/types.ts";

declare const menuId: unique symbol;

declare global {
  
  type MenuId = Distinct<string, typeof menuId>;

  interface MenuSearch extends MenuSearchType {
  }

  interface MenuModel extends MenuModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
  }

  interface MenuInput extends MenuInputType {
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    is_deleted?: number | null;
  }

  interface MenuFieldComment extends MenuFieldCommentType {
  }
  
}

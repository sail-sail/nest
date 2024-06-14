import type {
  DictInput as DictInputType,
  DictModel as DictModelType,
  DictSearch as DictSearchType,
  DictFieldComment as DictFieldCommentType,
  // 数据类型
  DictType,
  SortInput,
} from "/gen/types.ts";

declare const dictId: unique symbol;

declare global {
  
  type DictId = Distinct<string, typeof dictId>;

  interface DictSearch extends DictSearchType {
    /** 数据类型 */
    type?: DictType[];
    /** 锁定 */
    is_locked?: number[];
    /** 排序 */
    order_by?: number[];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: string[];
    /** 更新时间 */
    update_time?: string[];
  }

  interface DictModel extends DictModelType {
    /** 系统字段 */
    is_sys: number;
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
  }

  interface DictInput extends DictInputType {
    /** 系统字段 */
    is_sys?: number | null;
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    create_time_save_null?: boolean | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    update_time_save_null?: boolean | null;
    is_deleted?: number | null;
  }

  interface DictFieldComment extends DictFieldCommentType {
  }
  
}

/** 系统字典 前端允许排序的字段 */
export const canSortInApiDict = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 系统字典 检测字段是否允许前端排序 */
export function checkSortDict(sort?: SortInput[]) {
  if (!sort) return;
  for (const item of sort) {
    const order = item.order;
    if (
      order !== "asc" && order !== "desc" &&
      order !== "ascending" && order !== "descending"
    ) {
      throw new Error(`checkSortDict: ${ JSON.stringify(item) }`);
    }
    const prop = item.prop as keyof typeof canSortInApiDict;
    if (!canSortInApiDict[prop]) {
      throw new Error(`checkSortDict: ${ JSON.stringify(item) }`);
    }
  }
}

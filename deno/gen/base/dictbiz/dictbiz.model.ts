import type {
  DictbizInput as DictbizInputType,
  DictbizModel as DictbizModelType,
  DictbizSearch as DictbizSearchType,
  DictbizFieldComment as DictbizFieldCommentType,
  // 数据类型
  DictbizType,
} from "/gen/types.ts";

declare const dictbizId: unique symbol;

declare global {
  
  type DictbizId = Distinct<string, typeof dictbizId>;

  interface DictbizSearch extends DictbizSearchType {
    /** 数据类型 */
    type?: DictbizType[];
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
    tenant_id?: TenantId | null;
  }

  interface DictbizModel extends DictbizModelType {
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
    tenant_id: TenantId;
  }

  interface DictbizInput extends DictbizInputType {
    /** 系统字段 */
    is_sys?: number | null;
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    is_deleted?: number | null;
    tenant_id?: TenantId | null;
  }

  interface DictbizFieldComment extends DictbizFieldCommentType {
  }
  
}

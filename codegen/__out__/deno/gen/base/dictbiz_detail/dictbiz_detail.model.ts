import type {
  DictbizDetailInput as DictbizDetailInputType,
  DictbizDetailModel as DictbizDetailModelType,
  DictbizDetailSearch as DictbizDetailSearchType,
  DictbizDetailFieldComment as DictbizDetailFieldCommentType,
} from "/gen/types.ts";

declare const dictbizDetailId: unique symbol;

declare global {
  
  type DictbizDetailId = Distinct<string, typeof dictbizDetailId>;

  interface DictbizDetailSearch extends DictbizDetailSearchType {
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
    tenant_id?: string | null;
  }

  interface DictbizDetailModel extends DictbizDetailModelType {
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

  interface DictbizDetailInput extends DictbizDetailInputType {
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

  interface DictbizDetailFieldComment extends DictbizDetailFieldCommentType {
  }
  
}

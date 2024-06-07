import type {
  PtTypeInput as PtTypeInputType,
  PtTypeModel as PtTypeModelType,
  PtTypeSearch as PtTypeSearchType,
  PtTypeFieldComment as PtTypeFieldCommentType,
} from "/gen/types.ts";

declare const ptTypeId: unique symbol;

declare global {
  
  type PtTypeId = Distinct<string, typeof ptTypeId>;

  interface PtTypeSearch extends PtTypeSearchType {
    /** 图标 */
    img?: string;
    img_like?: string;
    /** 首页显示 */
    is_home?: number[];
    /** 推荐 */
    is_recommend?: number[];
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
    /** 组织 */
    org_id?: OrgId[];
    org_id_is_null?: boolean;
    /** 组织 */
    org_id_lbl?: string[];
    tenant_id?: TenantId | null;
  }

  interface PtTypeModel extends PtTypeModelType {
    /** 组织 */
    org_id: OrgId;
    /** 组织 */
    org_id_lbl: string;
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

  interface PtTypeInput extends PtTypeInputType {
    /** 组织 */
    org_id?: OrgId | null;
    /** 组织 */
    org_id_lbl?: string | null;
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
    tenant_id?: TenantId | null;
  }

  interface PtTypeFieldComment extends PtTypeFieldCommentType {
  }
  
}

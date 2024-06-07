import type {
  CardInput as CardInputType,
  CardModel as CardModelType,
  CardSearch as CardSearchType,
  CardFieldComment as CardFieldCommentType,
  // 会员等级
  CardGrade,
} from "/gen/types.ts";

declare const cardId: unique symbol;

declare global {
  
  type CardId = Distinct<string, typeof cardId>;

  interface CardSearch extends CardSearchType {
    /** 卡号-序列号 */
    lbl_seq?: number[];
    /** 会员等级 */
    grade?: CardGrade[];
    /** 充值余额 */
    balance?: string[];
    /** 赠送余额 */
    give_balance?: string[];
    /** 积分 */
    integral?: number[];
    /** 累计消费 */
    growth_amt?: string[];
    /** 默认 */
    is_default_card?: number[];
    /** 锁定 */
    is_locked?: number[];
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

  interface CardModel extends CardModelType {
    /** 卡号-序列号 */
    lbl_seq: number;
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

  interface CardInput extends CardInputType {
    /** 卡号-序列号 */
    lbl_seq?: number | null;
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

  interface CardFieldComment extends CardFieldCommentType {
  }
  
}

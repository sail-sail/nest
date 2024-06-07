import type {
  CardRechargeInput as CardRechargeInputType,
  CardRechargeModel as CardRechargeModelType,
  CardRechargeSearch as CardRechargeSearchType,
  CardRechargeFieldComment as CardRechargeFieldCommentType,
} from "/gen/types.ts";

declare const cardRechargeId: unique symbol;

declare global {
  
  type CardRechargeId = Distinct<string, typeof cardRechargeId>;

  interface CardRechargeSearch extends CardRechargeSearchType {
    /** 微信支付订单号 */
    transaction_id?: string;
    transaction_id_like?: string;
    /** 充值金额 */
    amt?: string[];
    /** 赠送金额 */
    give_amt?: string[];
    /** 充值后充值余额 */
    balance?: string[];
    /** 充值后赠送余额 */
    give_balance?: string[];
    /** 充值后积分 */
    integral?: number[];
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

  interface CardRechargeModel extends CardRechargeModelType {
    /** 微信支付订单号 */
    transaction_id: string;
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

  interface CardRechargeInput extends CardRechargeInputType {
    /** 微信支付订单号 */
    transaction_id?: string | null;
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

  interface CardRechargeFieldComment extends CardRechargeFieldCommentType {
  }
  
}

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
    tenant_id?: string | null;
    org_id?: string | null;
  }

  interface CardRechargeModel extends CardRechargeModelType {
    /** 微信支付订单号 */
    transaction_id: string;
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
    tenant_id: TenantId;
    org_id: OrgId;
  }

  interface CardRechargeInput extends CardRechargeInputType {
    /** 微信支付订单号 */
    transaction_id?: string;
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
    org_id?: OrgId | null;
  }

  interface CardRechargeFieldComment extends CardRechargeFieldCommentType {
  }
  
}

import type {
  WxPayInput as WxPayInputType,
  WxPayModel as WxPayModelType,
  WxPaySearch as WxPaySearchType,
  WxPayFieldComment as WxPayFieldCommentType,
} from "/gen/types.ts";

declare const wxPayId: unique symbol;

declare global {
  
  type WxPayId = Distinct<string, typeof wxPayId>;

  interface WxPaySearch extends WxPaySearchType {
    /** 商户号 */
    mchid?: string;
    mchid_like?: string;
    /** 公钥 */
    public_key?: string;
    public_key_like?: string;
    /** 私钥 */
    private_key?: string;
    private_key_like?: string;
    /** APIv3密钥 */
    v3_key?: string;
    v3_key_like?: string;
    /** 支付终端IP */
    payer_client_ip?: string;
    payer_client_ip_like?: string;
    /** 通知地址 */
    notify_url?: string;
    notify_url_like?: string;
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

  interface WxPayModel extends WxPayModelType {
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

  interface WxPayInput extends WxPayInputType {
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

  interface WxPayFieldComment extends WxPayFieldCommentType {
  }
  
}

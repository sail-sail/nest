import type {
  WxPayNoticeInput as WxPayNoticeInputType,
  WxPayNoticeModel as WxPayNoticeModelType,
  WxPayNoticeSearch as WxPayNoticeSearchType,
  WxPayNoticeFieldComment as WxPayNoticeFieldCommentType,
  // 交易类型
  WxPayNoticeTradeType,
  // 交易状态
  WxPayNoticeTradeState,
  // 货币类型
  WxPayNoticeCurrency,
  // 用户支付币种
  WxPayNoticePayerCurrency,
} from "/gen/types.ts";

declare const wxPayNoticeId: unique symbol;

declare global {
  
  type WxPayNoticeId = Distinct<string, typeof wxPayNoticeId>;

  interface WxPayNoticeSearch extends WxPayNoticeSearchType {
    /** 开发者ID */
    appid?: string;
    appid_like?: string;
    /** 商户号 */
    mchid?: string;
    mchid_like?: string;
    /** 商户订单号 */
    out_trade_no?: string;
    out_trade_no_like?: string;
    /** 交易类型 */
    trade_type?: WxPayNoticeTradeType[];
    /** 交易状态 */
    trade_state?: WxPayNoticeTradeState[];
    /** 交易状态描述 */
    trade_state_desc?: string;
    trade_state_desc_like?: string;
    /** 付款银行 */
    bank_type?: string;
    bank_type_like?: string;
    /** 附加数据 */
    attach?: string;
    attach_like?: string;
    /** 支付完成时间 */
    success_time?: string[];
    /** 总金额 */
    total?: number[];
    /** 用户支付金额 */
    payer_total?: number[];
    /** 货币类型 */
    currency?: WxPayNoticeCurrency[];
    /** 用户支付币种 */
    payer_currency?: WxPayNoticePayerCurrency[];
    /** 商户端设备号 */
    device_id?: string;
    device_id_like?: string;
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 原始数据 */
    raw?: string;
    raw_like?: string;
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

  interface WxPayNoticeModel extends WxPayNoticeModelType {
    /** 组织 */
    org_id: OrgId;
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

  interface WxPayNoticeInput extends WxPayNoticeInputType {
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

  interface WxPayNoticeFieldComment extends WxPayNoticeFieldCommentType {
  }
  
}

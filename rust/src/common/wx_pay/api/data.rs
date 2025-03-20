#![allow(dead_code)]

use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

// 通用参数
//

/// 【交易类型】 交易类型，枚举值：
#[derive(Serialize, Deserialize, Debug, Clone, Default, PartialEq, Eq)]
pub enum TradeType {
  #[default]
  /// 公众号支付
  JSAPI,
  /// 扫码支付
  NATIVE,
  /// App支付
  APP,
  /// 付款码支付
  MICROPAY,
  /// H5支付
  MWEB,
  /// 刷脸支付
  FACEPAY,
}

/// 【交易状态】 交易状态，枚举值：
#[derive(Serialize, Deserialize, Debug, Clone, Default, PartialEq, Eq)]
pub enum TradeState {
  #[default]
  /// 支付成功
  SUCCESS,
  /// 转入退款
  REFUND,
  /// 未支付
  NOTPAY,
  /// 已关闭
  CLOSED,
  /// 已撤销（仅付款码支付会返回）
  REVOKED,
  /// 用户支付中（仅付款码支付会返回）
  USERPAYING,
  /// 支付失败(其他原因，如银行返回失败)
  PAYERROR,
}

/// 金额，单位 分
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Amount {
  /// 【总金额】 订单总金额，单位为分。
  pub total: u64,
  /// 【货币类型】 CNY：人民币，境内商户号仅支持人民币。
  pub currency: Option<String>,
}
/// 付款用户
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Payer {
  /// 【用户标识】 用户在普通商户AppID下的唯一标识。 下单前需获取到用户的OpenID
  pub openid: String,
}

/// 客户端支付时的 参数信息
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxPayData {
  /// 发起支付的 公众号或小程序的appid
  pub app_id: Option<String>,
  pub sign_type: String,
  pub pay_sign: String,
  pub package: String,
  pub nonce_str: String,
  pub time_stamp: i64,
}

/// 商品详情
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GoodsDetail {
  /// 【商户侧商品编码】 由半角的大小写字母、数字、中划线、下划线中的一种或几种组成。
  pub merchant_goods_id: String,
  /// 【微信支付商品编码】 微信支付定义的统一商品编号（没有可不传）
  pub wechatpay_goods_id: Option<String>,
  /// 【商品名称】 商品的实际名称
  pub goods_name: Option<String>,
  /// 【商品数量】 用户购买的数量
  pub quantity: u64,
  /// 【商品单价】 单位为：分。如果商户有优惠，需传输商户优惠后的单价(例如：用户对一笔100元的订单使用了商场发的纸质优惠券100-50，则活动商品的单价应为原单价-50)
  pub unit_price: u64,
}
/// 订单详情
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OrderDetail {
  /// 【订单原价】 1、商户侧一张小票订单可能被分多次支付，订单原价用于记录整张小票的交易金额。
  /// 2、当订单原价与支付金额不相等，则不享受优惠。
  /// 3、该字段主要用于防止同一张小票分多次支付，以享受多次优惠的情况，正常支付订单不必上传此参数。
  pub cost_price: Option<u64>,
  /// 【商品小票ID】 商家小票ID
  pub invoice_id: Option<String>,
  /// 【单品列表】 单品列表信息 条目个数限制：【1，6000】
  pub goods_detail: Vec<GoodsDetail>,
}
/// 门店信息
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StoreInfo {
  /// 【门店编号】 商户侧门店编号
  pub id: String,
  /// 【门店名称】 商户侧门店名称
  pub name: Option<String>,
  /// 【地区编码】 地区编码，详细请见省市区编号对照表。
  pub area_code: Option<String>,
  /// 【详细地址】 详细的商户门店地址
  pub address: Option<String>,
}
/// 支付场景
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SceneInfo {
  /// 【用户终端IP】 用户的客户端IP，支持IPv4和IPv6两种格式的IP地址。
  pub payer_client_ip: Option<String>,
  /// 【商户端设备号】 商户端设备号（门店号或收银设备ID）。
  pub device_id: Option<String>,
  /// 【商户门店信息】 商户门店信息
  pub store_info: Option<StoreInfo>,
}
/// 结算信息
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SettleInfo {
  /// 【是否指定分账】 是否指定分账， true：是 false：否
  pub profit_sharing: Option<bool>,
}

/// jsapi 请求参数
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Jsapi {
  /// 【商品描述】 商品描述
  pub description: String,
  /// 【商户订单号】 商户系统内部订单号，只能是数字、大小写字母_-*且在同一个商户号下唯一。
  pub out_trade_no: String,
  /// 【交易结束时间】 订单失效时间，遵循rfc3339标准格式，格式为yyyy-MM-DDTHH:mm:ss+TIMEZONE，yyyy-MM-DD表示年月日，T出现在字符串中，表示time元素的开头，HH:mm:ss表示时分秒，TIMEZONE表示时区（+08:00表示东八区时间，领先UTC8小时，即北京时间）。例如：2015-05-20T13:29:35+08:00表示，北京时间2015年5月20日13点29分35秒。
  pub time_expire: Option<String>,
  /// 【附加数据】 附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用，实际情况下只有支付完成状态才会返回该字段。
  pub attach: Option<String>,
  /// 【订单优惠标记】 订单优惠标记
  pub goods_tag: Option<String>,
  /// 【电子发票入口开放标识】 传入true时，支付成功消息和支付详情页将出现开票入口。需要在微信支付商户平台或微信公众平台开通电子发票功能，传此字段才可生效。
  pub support_fapiao: Option<bool>,
  /// 【订单金额】 订单金额信息
  pub amount: Amount,
  /// 【支付者】 支付者信息。
  pub payer: Payer,
  /// 【优惠功能】 优惠功能
  pub detail: Option<OrderDetail>,
  /// 【场景信息】 支付场景描述
  pub scene_info: Option<SceneInfo>,
  /// 【结算信息】 结算信息
  pub settle_info: Option<SettleInfo>,
}
/// jsapi wx 支付 请求参数
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub(crate) struct JsapiParams {
  pub appid: String,
  pub mchid: String,
  pub notify_url: String,
  pub description: String,
  pub out_trade_no: String,
  pub time_expire: Option<String>,
  pub attach: Option<String>,
  pub goods_tag: Option<String>,
  pub support_fapiao: Option<bool>,
  pub amount: Amount,
  pub payer: Payer,
  pub detail: Option<OrderDetail>,
  pub scene_info: Option<SceneInfo>,
  pub settle_info: Option<SettleInfo>,
}

/// 订单号查询详情
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct TransactionDetail {
  /// 【公众号ID】 公众号ID
  pub appid: Option<String>,
  /// 【直连商户号】 直连商户号
  pub mchid: String,
  /// 【商户订单号】 商户系统内部订单号，只能是数字、大小写字母_-*且在同一个商户号下唯一，详见【商户订单号】。
  pub out_trade_no: String,
  /// 【微信支付订单号】 微信支付系统生成的订单号。
  pub transaction_id: Option<String>,
  /// 【交易类型】 交易类型，枚举值：
  pub trade_type: Option<TradeType>,
  /// 【交易状态】 交易状态，枚举值：
  pub trade_state: TradeState,
  /// 【交易状态描述】 交易状态描述
  pub trade_state_desc: String,
  /// 【银行类型】 银行类型，采用字符串类型的银行标识。 银行标识请参考《银行类型对照表》
  pub bank_type: Option<String>,
  /// 【附加数据】 附加数据
  pub attach: Option<String>,
  /// 【支付完成时间】 支付完成时间
  pub success_time: Option<String>,
  /// 【支付者】 支付者
  pub payer: Option<Payer>,
  /// 【订单金额】 订单金额
  pub amount: Option<Amount>,
  /// 【场景信息】 场景信息
  pub scene_info: Option<SceneInfo>,
}

/// 退款申请
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Refund {
  /// 【微信支付订单号】 原支付交易对应的微信订单号，与out_trade_no二选一
  pub transaction_id: Option<String>,
  /// 【商户订单号】 原支付交易对应的商户订单号，与transaction_id二选一
  pub out_trade_no: Option<String>,
  /// 【商户退款单号】 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
  pub out_refund_no: String,
  /// 【退款原因】 若商户传入，会在下发给用户的退款消息中体现退款原因
  pub reason: Option<String>,
  /// 【退款结果回调url】 异步接收微信支付退款结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。 如果参数中传了notify_url，则商户平台上配置的回调地址将不会生效，优先回调当前传的这个地址。
  pub notify_url: Option<String>,
  /// 【退款资金来源】 若传递此参数则使用对应的资金账户退款，否则默认使用未结算资金退款（仅对老资金流商户适用）
  /// 可选取值：AVAILABLE: 仅对老资金流商户适用，指定从可用余额账户出资
  pub funds_account: Option<String>,
  /// 【金额信息】 订单金额信息
  pub amount: RefundAmount,
  /// 【金额信息】 订单金额信息
  pub goods_detail: Option<Vec<RefundGoodsDetail>>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RefundAmount {
  /// 【退款金额】 退款金额，单位为分，只能为整数，不能超过原订单支付金额。
  pub refund: u64,
  /// 【退款出资账户及金额】 退款需要从指定账户出资时，传递此参数指定出资金额（币种的最小单位，只能为整数）。
  /// 同时指定多个账户出资退款的使用场景需要满足以下条件：1、未开通退款支出分离产品功能；2、订单属于分账订单，且分账处于待分账或分账中状态。
  /// 参数传递需要满足条件：1、基本账户可用余额出资金额与基本账户不可用余额出资金额之和等于退款金额；2、账户类型不能重复。
  /// 上述任一条件不满足将返回错误
  pub from: Option<Vec<RefundAmountFrom>>,
  /// 【原订单金额】 原支付交易的订单总金额，单位为分，只能为整数。
  pub total: u64,
  /// 【退款币种】 符合ISO 4217标准的三位字母代码，目前只支持人民币：CNY。
  pub currency: String,
  /// 【用户支付金额】 现金支付金额，单位为分，只能为整数
  pub payer_total: Option<u64>,
  /// 【用户退款金额】 退款给用户的金额，单位为分，不包含所有优惠券金额
  pub payer_refund: Option<u64>,
  /// 【应结退款金额】 去掉非充值代金券退款金额后的退款金额，单位为分，
  ///  退款金额=申请退款金额-非充值代金券退款金额，退款金额<=申请退款金额
  pub settlement_refund: Option<u64>,
  /// 【应结订单金额】 应结订单金额=订单金额-免充值代金券金额，应结订单金额<=订单金额，单位为分
  pub settlement_total: Option<u64>,
  /// 【优惠退款金额】 优惠退款金额<=退款金额，退款金额-代金券或立减优惠退款金额为现金，说明详见代金券或立减优惠，单位为分
  pub discount_refund: Option<u64>,
  /// 【手续费退款金额】 手续费退款金额，单位为分
  pub refund_fee: Option<u64>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RefundAmountFrom {
  /// 【出资账户类型】 出资账户类型 可选取值：
  ///
  ///  AVAILABLE: 可用余额
  ///
  ///  UNAVAILABLE: 不可用余额
  pub account: String,
  /// 【出资金额】 对应账户出资金额，单位为分
  pub amount: u64,
}

/// 退单商品详情
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RefundGoodsDetail {
  /// 【商户侧商品编码】 由半角的大小写字母、数字、中划线、下划线中的一种或几种组成。
  pub merchant_goods_id: String,
  /// 【微信支付商品编码】 微信支付定义的统一商品编号（没有可不传）
  pub wechatpay_goods_id: Option<String>,
  /// 【商品名称】 商品的实际名称
  pub goods_name: Option<String>,
  /// 【商品单价】 商品单价金额，单位为分
  pub unit_price: u64,
  /// 【商品退款金额】 商品退款金额，单位为分
  pub refund_amount: u64,
  /// 【商品退货数量】 对应商品的退货数量
  pub refund_quantity: u64,
}

/// 退款申请 应答参数
#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RefundDetail {
  /// 【微信支付退款号】 微信支付退款号
  pub refund_id: String,
  /// 【商户退款单号】 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
  pub out_refund_no: String,
  /// 【微信支付订单号】 微信支付交易订单号
  pub transaction_id: String,
  /// 【商户订单号】 原支付交易对应的商户订单号
  pub out_trade_no: String,
  /// 【退款渠道】退款渠道
  ///
  ///  ORIGINAL: 原路退款
  ///
  ///  BALANCE: 退回到余额
  ///
  ///  OTHER_BALANCE: 原账户异常退到其他余额账户
  ///
  ///  OTHER_BANKCARD: 原银行卡异常退到其他银行卡
  pub channel: String,
  /// 【退款入账账户】 取当前退款单的退款入账方，有以下几种情况：
  /// 1）退回银行卡：{银行名称}{卡类型}{卡尾号}
  /// 2）退回支付用户零钱:支付用户零钱
  /// 3）退还商户:商户基本账户商户结算银行账户
  /// 4）退回支付用户零钱通:支付用户零钱通
  /// 5）退回支付用户银行电子账户:支付用户银行电子账户
  /// 6）退回支付用户零花钱:支付用户零花钱
  /// 7）退回用户经营账户:用户经营账户
  /// 8）退回支付用户来华零钱包:支付用户来华零钱包
  /// 9）退回企业支付商户:企业支付商户
  pub user_received_account: String,
  /// 【退款成功时间】 退款成功时间，退款状态status为SUCCESS（退款成功）时，返回该字段。
  /// 遵循rfc3339标准格式，格式为YYYY-MM-DDTHH:mm:ss+TIMEZONE，YYYY-MM-DD表示年月日，
  /// T出现在字符串中，表示time元素的开头，HH:mm:ss表示时分秒，
  /// TIMEZONE表示时区（+08:00表示东八区时间，领先UTC 8小时，即北京时间）。
  /// 例如：2015-05-20T13:29:35+08:00表示，北京时间2015年5月20日13点29分35秒。
  pub success_time: Option<String>,
  /// 【退款创建时间】 退款受理时间，
  pub create_time: String,
  /// 【退款状态】 退款到银行发现用户的卡作废或者冻结了，导致原路退款银行卡失败，可前往商户平台
  ///  SUCCESS: 退款成功
  ///  CLOSED: 退款关闭
  ///  PROCESSING: 退款处理中
  ///  ABNORMAL: 退款异常
  pub status: RefundStatus,
  /// 【资金账户】 退款所使用资金对应的资金账户类型 可选取值：
  ///
  ///  UNSETTLED: 未结算资金
  ///
  ///  AVAILABLE: 可用余额
  ///
  ///  UNAVAILABLE: 不可用余额
  ///
  ///  OPERATION: 运营户
  ///
  ///  BASIC: 基本账户（含可用余额和不可用余额）
  ///
  ///  ECNY_BASIC: 数字人民币基本账户
  pub funds_account: Option<String>,
  /// 【金额信息】 金额详细信息
  pub amount: RefundAmount,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default, PartialEq, Eq)]
pub enum RefundStatus {
  /// 退款成功
  #[default]
  SUCCESS,
  /// 退款关闭
  CLOSED,
  /// 退款处理中
  PROCESSING,
  /// 退款异常
  ABNORMAL,
}

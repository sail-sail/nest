use serde::{Serialize, Deserialize};

use async_graphql::SimpleObject;

#[derive(Serialize, Deserialize)]
pub struct GetuserRes {
  pub errcode: i32,
  #[serde(default)]
  pub errmsg: String,
  #[serde(default)]
  pub userid: String,
  #[serde(default)]
  pub name: String,
  #[serde(default)]
  pub department: Vec<i32>,
  #[serde(default)]
  pub position: String,
  #[serde(default)]
  pub status: i32,
  #[serde(default)]
  pub isleader: i32,
  #[serde(default)]
  pub telephone: String,
  #[serde(default)]
  pub enable: i32,
  #[serde(default)]
  pub hide_mobile: i32,
  #[serde(default)]
  pub order: Vec<i32>,
  #[serde(default)]
  pub main_department: i32,
  #[serde(default)]
  pub alias: String,
  #[serde(default)]
  pub is_leader_in_dept: Vec<i32>,
}

#[derive(Serialize, Deserialize)]
pub struct GetuserinfoModel {
  #[serde(default)]
  pub userid: String,
  #[serde(default)]
  pub user_ticket: String,
}

/**
 * errcode 返回码
 * errmsg 对返回码的文本描述内容
 * userid 成员UserID
 * gender 性别。0表示未定义，1表示男性，2表示女性。仅在用户同意snsapi_privateinfo授权时返回真实值，否则返回0.
 * avatar 头像url。仅在用户同意snsapi_privateinfo授权时返回真实头像，否则返回默认头像
 * qr_code 员工个人二维码（扫描可添加为外部联系人），仅在用户同意snsapi_privateinfo授权时返回
 * mobile 手机，仅在用户同意snsapi_privateinfo授权时返回，第三方应用不可获取
 * email 邮箱，仅在用户同意snsapi_privateinfo授权时返回，第三方应用不可获取
 * biz_mail 企业邮箱，仅在用户同意snsapi_privateinfo授权时返回，第三方应用不可获取
 * address 仅在用户同意snsapi_privateinfo授权时返回，第三方应用不可获取
 */
#[derive(Serialize, Deserialize)]
pub struct GetuserDetailRes {
  pub errcode: i32,
  #[serde(default)]
  pub errmsg: String,
  #[serde(default)]
  pub userid: String,
  #[serde(default)]
  pub gender: i32,
  #[serde(default)]
  pub avatar: String,
  #[serde(default)]
  pub qr_code: String,
  #[serde(default)]
  pub mobile: String,
  #[serde(default)]
  pub email: String,
  #[serde(default)]
  pub biz_mail: String,
  #[serde(default)]
  pub address: String,
}

#[derive(Serialize, Deserialize)]
pub struct GetJsapiTicketRes {
  pub errcode: i32,
  #[serde(default)]
  pub errmsg: String,
  #[serde(default)]
  pub ticket: String,
  #[serde(default)]
  pub expires_in: u32,
}

/// 企业微信审批申请请求体。
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SubmitApprovalApplyReq {
  /// 申请人 userid。
  pub creator_userid: String,
  /// 审批模板 ID。
  pub template_id: String,
  /// 0=按接口指定流程；1=使用模板默认流程。
  #[serde(default)]
  pub use_template_approver: i32,
  /// 提单者提单部门 ID，默认使用主部门。
  #[serde(default)]
  pub choose_department: i32,
  /// 审批表单控件内容。
  pub apply_data: SubmitApprovalApplyData,
  /// 审批摘要列表，最多 3 行。
  pub summary_list: Vec<SubmitApprovalApplySummary>,
  /// 审批节点列表，use_template_approver=0 时必填。
  #[serde(skip_serializing_if = "Option::is_none")]
  pub process: Option<SubmitApprovalProcess>,
}

/// 审批表单内容集合。
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SubmitApprovalApplyData {
  /// 表单控件列表。
  pub contents: Vec<SubmitApprovalApplyContent>,
}

/// 单个审批表单控件。
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SubmitApprovalApplyContent {
  /// 控件类型，例如 Text、Number、Selector。
  pub control: String,
  /// 控件唯一 ID。
  pub id: String,
  /// 控件填写值，按控件类型不同而不同。
  pub value: serde_json::Value,
}

/// 审批摘要行。
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SubmitApprovalApplySummary {
  /// 摘要信息列表。
  pub summary_info: Vec<SubmitApprovalSummaryInfo>,
}

/// 摘要行详情。
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SubmitApprovalSummaryInfo {
  /// 摘要文本。
  pub text: String,
  /// 语言代码，常见值为 zh_CN / en。
  pub lang: String,
}

/// 审批流程节点列表。
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SubmitApprovalProcess {
  /// 流程节点。
  pub node_list: Vec<SubmitApprovalNode>,
}

/// 单个流程节点。
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SubmitApprovalNode {
  /// 节点类型：1 审批人，2 抄送人，3 办理人。
  pub r#type: i32,
  /// 会签/或签/依次审批方式。
  #[serde(skip_serializing_if = "Option::is_none")]
  pub apv_rel: Option<i32>,
  /// 节点用户 ID 列表。
  #[serde(default)]
  pub userid: Vec<String>,
}

/// 企业微信审批申请返回值。
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SubmitApprovalApplyRes {
  /// 错误码，0 为成功。
  pub errcode: i32,
  /// 错误消息。
  #[serde(default)]
  pub errmsg: String,
  /// 审批单号。
  #[serde(default)]
  pub sp_no: String,
}

#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwGetConfigSignature {
  pub timestamp: String,
  #[graphql(name = "nonceStr")]
  pub nonce_str: String,
  pub signature: String,
}

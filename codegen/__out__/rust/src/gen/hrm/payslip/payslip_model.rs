use serde::{
  Serialize,
  Deserialize,
};

use sqlx::{
  FromRow,
  mysql::MySqlRow,
  Row,
};

use async_graphql::{
  SimpleObject,
  InputObject,
};
use crate::common::util::dao::decrypt;

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct PayslipModel {
  /// 租户ID
  pub tenant_id: String,
  /// ID
  pub id: String,
  /// 发放月份
  pub pay_month: chrono::NaiveDate,
  /// 发放月份
  pub pay_month_lbl: String,
  /// 姓名
  pub lbl: String,
  /// 工号
  pub job_num: String,
  /// 公司
  pub company: String,
  /// 应发工资(元)
  pub gross_pay: String,
  /// 代缴社保(元)
  pub social_security: String,
  /// 代缴个税(元)
  pub individual_tax: String,
  /// 个人自付(元)
  pub self_pay: String,
  /// 实发工资(元)
  pub net_pay: String,
  /// 已发送
  pub is_send: u8,
  /// 已发送
  pub is_send_lbl: String,
  /// 已确认
  pub is_confirm: u8,
  /// 已确认
  pub is_confirm_lbl: String,
  /// 锁定
  pub is_locked: u8,
  /// 锁定
  pub is_locked_lbl: String,
  /// 备注
  pub rem: String,
  /// 创建人
  pub create_usr_id: String,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: String,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: String,
  /// 是否已删除
  pub is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for PayslipModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: String = row.try_get("id")?;
    // 发放月份
    let pay_month: chrono::NaiveDate = row.try_get("pay_month")?;
    let pay_month_lbl: String = pay_month.format("%Y-%m").to_string();
    // 姓名
    let lbl: String = row.try_get("lbl")?;
    // 工号
    let job_num: String = row.try_get("job_num")?;
    // 公司
    let company: String = row.try_get("company")?;
    // 应发工资(元)
    let gross_pay: String = row.try_get("gross_pay")?;
    let gross_pay: String = decrypt(gross_pay.as_str());
    // 代缴社保(元)
    let social_security: String = row.try_get("social_security")?;
    let social_security: String = decrypt(social_security.as_str());
    // 代缴个税(元)
    let individual_tax: String = row.try_get("individual_tax")?;
    let individual_tax: String = decrypt(individual_tax.as_str());
    // 个人自付(元)
    let self_pay: String = row.try_get("self_pay")?;
    let self_pay: String = decrypt(self_pay.as_str());
    // 实发工资(元)
    let net_pay: String = row.try_get("net_pay")?;
    let net_pay: String = decrypt(net_pay.as_str());
    // 已发送
    let is_send: u8 = row.try_get("is_send")?;
    let is_send_lbl: String = is_send.to_string();
    // 已确认
    let is_confirm: u8 = row.try_get("is_confirm")?;
    let is_confirm_lbl: String = is_confirm.to_string();
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 备注
    let rem: String = row.try_get("rem")?;
    // 创建人
    let create_usr_id: String = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<String> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = create_usr_id_lbl.unwrap_or_default();
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 更新人
    let update_usr_id: String = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<String> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = update_usr_id_lbl.unwrap_or_default();
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: String = match update_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      id,
      pay_month,
      pay_month_lbl,
      lbl,
      job_num,
      company,
      gross_pay,
      social_security,
      individual_tax,
      self_pay,
      net_pay,
      is_send,
      is_send_lbl,
      is_confirm,
      is_confirm_lbl,
      is_locked,
      is_locked_lbl,
      rem,
      create_usr_id,
      create_usr_id_lbl,
      create_time,
      create_time_lbl,
      update_usr_id,
      update_usr_id_lbl,
      update_time,
      update_time_lbl,
      is_deleted,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct PayslipFieldComment {
  /// ID
  pub id: String,
  /// 发放月份
  pub pay_month: String,
  /// 发放月份
  pub pay_month_lbl: String,
  /// 姓名
  pub lbl: String,
  /// 工号
  pub job_num: String,
  /// 公司
  pub company: String,
  /// 应发工资(元)
  pub gross_pay: String,
  /// 代缴社保(元)
  pub social_security: String,
  /// 代缴个税(元)
  pub individual_tax: String,
  /// 个人自付(元)
  pub self_pay: String,
  /// 实发工资(元)
  pub net_pay: String,
  /// 已发送
  pub is_send: String,
  /// 已发送
  pub is_send_lbl: String,
  /// 已确认
  pub is_confirm: String,
  /// 已确认
  pub is_confirm_lbl: String,
  /// 锁定
  pub is_locked: String,
  /// 锁定
  pub is_locked_lbl: String,
  /// 备注
  pub rem: String,
  /// 创建人
  pub create_usr_id: String,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: String,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: String,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: String,
  /// 更新时间
  pub update_time_lbl: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct PayslipSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 发放月份
  pub pay_month: Option<Vec<chrono::NaiveDate>>,
  /// 姓名
  pub lbl: Option<String>,
  /// 姓名
  pub lbl_like: Option<String>,
  /// 工号
  pub job_num: Option<String>,
  /// 工号
  pub job_num_like: Option<String>,
  /// 公司
  pub company: Option<String>,
  /// 公司
  pub company_like: Option<String>,
  /// 应发工资(元)
  pub gross_pay: Option<String>,
  /// 应发工资(元)
  pub gross_pay_like: Option<String>,
  /// 代缴社保(元)
  pub social_security: Option<String>,
  /// 代缴社保(元)
  pub social_security_like: Option<String>,
  /// 代缴个税(元)
  pub individual_tax: Option<String>,
  /// 代缴个税(元)
  pub individual_tax_like: Option<String>,
  /// 个人自付(元)
  pub self_pay: Option<String>,
  /// 个人自付(元)
  pub self_pay_like: Option<String>,
  /// 实发工资(元)
  pub net_pay: Option<String>,
  /// 实发工资(元)
  pub net_pay_like: Option<String>,
  /// 已发送
  pub is_send: Option<Vec<u8>>,
  /// 已确认
  pub is_confirm: Option<Vec<u8>>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
  /// 创建人
  pub create_usr_id: Option<Vec<String>>,
  /// 创建人
  pub create_usr_id_is_null: Option<bool>,
  /// 创建时间
  pub create_time: Option<Vec<chrono::NaiveDateTime>>,
  /// 更新人
  pub update_usr_id: Option<Vec<String>>,
  /// 更新人
  pub update_usr_id_is_null: Option<bool>,
  /// 更新时间
  pub update_time: Option<Vec<chrono::NaiveDateTime>>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct PayslipInput {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  /// ID
  pub id: Option<String>,
  /// 发放月份
  pub pay_month: Option<chrono::NaiveDate>,
  /// 发放月份
  pub pay_month_lbl: Option<String>,
  /// 姓名
  pub lbl: Option<String>,
  /// 工号
  pub job_num: Option<String>,
  /// 公司
  pub company: Option<String>,
  /// 应发工资(元)
  pub gross_pay: Option<String>,
  /// 代缴社保(元)
  pub social_security: Option<String>,
  /// 代缴个税(元)
  pub individual_tax: Option<String>,
  /// 个人自付(元)
  pub self_pay: Option<String>,
  /// 实发工资(元)
  pub net_pay: Option<String>,
  /// 已发送
  pub is_send: Option<u8>,
  /// 已发送
  pub is_send_lbl: Option<String>,
  /// 已确认
  pub is_confirm: Option<u8>,
  /// 已确认
  pub is_confirm_lbl: Option<String>,
  /// 锁定
  pub is_locked: Option<u8>,
  /// 锁定
  pub is_locked_lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 创建人
  pub create_usr_id: Option<String>,
  /// 创建人
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: Option<String>,
  /// 更新人
  pub update_usr_id: Option<String>,
  /// 更新人
  pub update_usr_id_lbl: Option<String>,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: Option<String>,
}

impl From<PayslipInput> for PayslipSearch {
  fn from(input: PayslipInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      // 住户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 发放月份
      pay_month: input.pay_month.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 姓名
      lbl: input.lbl,
      // 工号
      job_num: input.job_num,
      // 公司
      company: input.company,
      // 应发工资(元)
      gross_pay: input.gross_pay,
      // 代缴社保(元)
      social_security: input.social_security,
      // 代缴个税(元)
      individual_tax: input.individual_tax,
      // 个人自付(元)
      self_pay: input.self_pay,
      // 实发工资(元)
      net_pay: input.net_pay,
      // 已发送
      is_send: input.is_send.map(|x| vec![x.into()]),
      // 已确认
      is_confirm: input.is_confirm.map(|x| vec![x.into()]),
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x.into()]),
      // 备注
      rem: input.rem,
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x.into()]),
      // 创建时间
      create_time: input.create_time.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 更新人
      update_usr_id: input.update_usr_id.map(|x| vec![x.into()]),
      // 更新时间
      update_time: input.update_time.map(|x| vec![x.clone().into(), x.clone().into()]),
      ..Default::default()
    }
  }
}

use serde::{Serialize, Deserialize};
use async_graphql::SimpleObject;

#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct Login {
  
  pub authorization: String,
  pub dept_id: String,
  
}

#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginInfo {
  
  pub lbl: String,
  pub lang: String,
  pub dept_id: Option<String>,
  pub dept_id_models: Vec<GetLoginInfoDeptIdModel>,
  
}

#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginInfoDeptIdModel {
  
  pub id: String,
  pub lbl: String,
  
}

use serde::{Serialize, Deserialize};
use async_graphql::SimpleObject;

#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct Login {
  
  pub authorization: String,
  pub org_id: String,
  
}

#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginInfo {
  
  pub lbl: String,
  pub lang: String,
  pub org_id: Option<String>,
  pub org_id_models: Vec<GetLoginInfoorgIdModel>,
  
}

#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginInfoorgIdModel {
  
  pub id: String,
  pub lbl: String,
  
}

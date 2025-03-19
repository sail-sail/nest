use async_graphql::SimpleObject;
use serde::{Serialize, Deserialize};

#[derive(SimpleObject, Serialize, Deserialize, Debug, Default, Clone)]
pub struct GetStatsOss {
  pub id: String,
  pub lbl: String,
  pub content_type: String,
  pub size: i64,
}

use serde::{Serialize, Deserialize};
use async_graphql::SimpleObject;

#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct Login {
  
  authorization: String,
  dept_id: String,
  
}

use tracing::error;
use serde_json::json;

use poem::{http::StatusCode, Response};

use generated::common::context::get_req_id;

use super::wx_usr_model::Code2sessionInput;
use super::wx_usr_service::code2session as code2session_service;

pub async fn code2session(
  code2session_input: Code2sessionInput,
) -> Response {
  
  let login_model = code2session_service(
    code2session_input,
    None,
  ).await;
  
  if let Err(err) = login_model {
    error!(
      "{req_id} {err:?}",
      req_id = get_req_id(),
    );
    return Response::builder()
      .header("authorization", "")
      .status(StatusCode::UNAUTHORIZED)
      .body(err.to_string());
  }
  let login_model = login_model.unwrap();
  
  Response::builder()
    .header("Content-Type", "application/json")
    .header("authorization", &login_model.authorization)
    .body(json!({
      "code": 0,
      "data": &login_model,
    }).to_string())
}

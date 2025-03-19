use color_eyre::eyre::Result;

use poem::{
  Request, Response,
  handler, web::Json,
};

use crate::common::context::Ctx;

use super::wx_usr_model::Code2sessionInput;
use super::wx_usr_resful;

#[handler]
pub async fn code2session(
  req: &Request,
  Json(code2session_input): Json<Code2sessionInput>,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .build()
    .resful_scope({
      wx_usr_resful::code2session(code2session_input)
    }).await
}

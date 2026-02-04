use color_eyre::eyre::Result;

use poem::{
  Request, Response,
  handler, web::Json,
};

use generated::common::context::Ctx;

use smol_str::SmolStr;

use super::wx_usr_model::Code2sessionInput;
use super::wx_usr_resful;

#[handler]
pub async fn code2session(
  req: &Request,
  Json(code2session_input): Json<Code2sessionInput>,
) -> Result<Response> {
  
  // IP地址
  let ip = match req.header("x-real-ip") {
    Some(ip) => SmolStr::new(ip),
    None => SmolStr::new(""),
  };
  
  Ctx::resful_builder(Some(req))
    .build()
    .resful_scope({
      wx_usr_resful::code2session(
        code2session_input,
        ip,
        None,
      )
    }).await
}

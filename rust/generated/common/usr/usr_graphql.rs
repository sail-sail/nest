use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::usr_resolver;

use super::usr_model::{
  LoginInput,
  LoginModel,
  GetLoginInfo,
  ChangePasswordInput,
};

#[derive(Default)]
pub struct UsrMutation;

#[Object(rename_args = "snake_case")]
impl UsrMutation {
  
  /// 登录, 获得token
  async fn login(
    &self,
    ctx: &Context<'_>,
    input: LoginInput,
  ) -> Result<LoginModel> {
    Ctx::builder(ctx)
      .with_tran()
      .build()
      .scope({
        let ip: String = ctx.data_opt::<crate::common::gql::model::Ip>()
          .map(|item| item.clone().0)
          .unwrap_or_default();
        usr_resolver::login(ip, input)
      }).await
  }
  
  /// 选择语言
  async fn select_lang(
    &self,
    ctx: &Context<'_>,
    lang: String,
  ) -> Result<String> {
    let mut ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = usr_resolver::select_lang(
      &mut ctx,
      lang,
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 修改密码
  async fn change_password(
    &self,
    ctx: &Context<'_>,
    input: ChangePasswordInput,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        usr_resolver::change_password(
          input,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct UsrQuery;

#[Object]
impl UsrQuery {
  
  /// 获取当前登录用户信息
  async fn get_login_info(
    &self,
    ctx: &Context<'_>,
  ) -> Result<GetLoginInfo> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        usr_resolver::get_login_info()
      }).await
  }
  
}

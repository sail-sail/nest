#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};
use async_graphql::{Context, Object};

#[allow(unused_imports)]
use crate::common::context::{
  Ctx,
  Options,
  UniqueType,
};

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::pay_transactions_jsapi_model::*;
use super::pay_transactions_jsapi_resolver;

use crate::r#gen::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct PayTransactionsJsapiGenQuery;

#[Object(rename_args = "snake_case")]
impl PayTransactionsJsapiGenQuery {
  
  /// 根据搜索条件和分页查找微信JSAPI下单列表
  async fn find_all_pay_transactions_jsapi(
    &self,
    ctx: &Context<'_>,
    search: Option<PayTransactionsJsapiSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<PayTransactionsJsapiModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        pay_transactions_jsapi_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找微信JSAPI下单总数
  async fn find_count_pay_transactions_jsapi(
    &self,
    ctx: &Context<'_>,
    search: Option<PayTransactionsJsapiSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        pay_transactions_jsapi_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个微信JSAPI下单
  async fn find_one_pay_transactions_jsapi(
    &self,
    ctx: &Context<'_>,
    search: Option<PayTransactionsJsapiSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<PayTransactionsJsapiModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        pay_transactions_jsapi_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信JSAPI下单
  async fn find_by_id_pay_transactions_jsapi(
    &self,
    ctx: &Context<'_>,
    id: PayTransactionsJsapiId,
  ) -> Result<Option<PayTransactionsJsapiModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        pay_transactions_jsapi_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找微信JSAPI下单
  async fn find_by_ids_pay_transactions_jsapi(
    &self,
    ctx: &Context<'_>,
    ids: Vec<PayTransactionsJsapiId>,
  ) -> Result<Vec<PayTransactionsJsapiModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        pay_transactions_jsapi_resolver::find_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取微信JSAPI下单字段注释
  async fn get_field_comments_pay_transactions_jsapi(
    &self,
    ctx: &Context<'_>,
  ) -> Result<PayTransactionsJsapiFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        pay_transactions_jsapi_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct PayTransactionsJsapiGenMutation;

#[Object(rename_args = "snake_case")]
impl PayTransactionsJsapiGenMutation {
  
  /// 占位方法, 用于实现 PayTransactionsJsapiInput
  #[allow(unused_variables)]
  async fn no_add_no_edit_pay_transactions_jsapi(
    &self,
    ctx: &Context<'_>,
    input: PayTransactionsJsapiInput,
  ) -> Result<PayTransactionsJsapiId> {
    Err(eyre!(""))
  }
  
  /// 微信JSAPI下单根据id修改租户id
  async fn update_tenant_by_id_pay_transactions_jsapi(
    &self,
    ctx: &Context<'_>,
    id: PayTransactionsJsapiId,
    tenant_id: TenantId,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()?
      .build()
      .scope({
        pay_transactions_jsapi_resolver::update_tenant_by_id(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
}

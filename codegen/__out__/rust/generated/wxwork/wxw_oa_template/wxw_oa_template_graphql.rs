
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use color_eyre::eyre::{Result, eyre};
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

use super::wxw_oa_template_model::*;
use super::wxw_oa_template_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxwOaTemplateGenQuery;

#[Object(rename_args = "snake_case")]
impl WxwOaTemplateGenQuery {
  
  /// 根据搜索条件和分页查找审批模板列表
  #[graphql(name = "findAllWxwOaTemplate")]
  async fn find_all_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxwOaTemplateSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxwOaTemplateModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_template_resolver::find_all_wxw_oa_template(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找审批模板总数
  #[graphql(name = "findCountWxwOaTemplate")]
  async fn find_count_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxwOaTemplateSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_template_resolver::find_count_wxw_oa_template(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个审批模板
  #[graphql(name = "findOneWxwOaTemplate")]
  async fn find_one_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxwOaTemplateSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxwOaTemplateModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_template_resolver::find_one_wxw_oa_template(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个审批模板, 如果不存在则抛错
  #[graphql(name = "findOneOkWxwOaTemplate")]
  async fn find_one_ok_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxwOaTemplateSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<WxwOaTemplateModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_template_resolver::find_one_ok_wxw_oa_template(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批模板
  #[graphql(name = "findByIdWxwOaTemplate")]
  async fn find_by_id_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxwOaTemplateId,
  ) -> Result<Option<WxwOaTemplateModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_template_resolver::find_by_id_wxw_oa_template(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批模板, 如果不存在则抛错
  #[graphql(name = "findByIdOkWxwOaTemplate")]
  async fn find_by_id_ok_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxwOaTemplateId,
  ) -> Result<WxwOaTemplateModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_template_resolver::find_by_id_ok_wxw_oa_template(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批模板
  #[graphql(name = "findByIdsWxwOaTemplate")]
  async fn find_by_ids_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxwOaTemplateId>,
  ) -> Result<Vec<WxwOaTemplateModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_template_resolver::find_by_ids_wxw_oa_template(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据搜索条件判断审批模板是否存在
  #[graphql(name = "existsWxwOaTemplate")]
  async fn exists_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxwOaTemplateSearch>,
  ) -> Result<bool> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_template_resolver::exists_wxw_oa_template(
          search,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批模板
  #[graphql(name = "findByIdsOkWxwOaTemplate")]
  async fn find_by_ids_ok_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxwOaTemplateId>,
  ) -> Result<Vec<WxwOaTemplateModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_template_resolver::find_by_ids_ok_wxw_oa_template(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批模板是否已启用
  /// 记录不存在则返回 false
  #[graphql(name = "getIsEnabledByIdWxwOaTemplate")]
  async fn get_is_enabled_by_id_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxwOaTemplateId,
  ) -> Result<bool> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_template_resolver::get_is_enabled_by_id_wxw_oa_template(
          id,
          None,
        )
      }).await
  }
  
  /// 获取审批模板字段注释
  #[graphql(name = "getFieldCommentsWxwOaTemplate")]
  async fn get_field_comments_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxwOaTemplateFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        wxw_oa_template_resolver::get_field_comments_wxw_oa_template(
          None,
        )
      }).await
  }
  
  /// 查找 审批模板 order_by 字段的最大值
  #[graphql(name = "findLastOrderByWxwOaTemplate")]
  async fn find_last_order_by_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxwOaTemplateSearch>,
  ) -> Result<u32> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_template_resolver::find_last_order_by_wxw_oa_template(
          search,
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxwOaTemplateGenMutation;

#[Object(rename_args = "snake_case")]
impl WxwOaTemplateGenMutation {
  
  /// 创建审批模板
  #[graphql(name = "createsWxwOaTemplate")]
  async fn creates_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<WxwOaTemplateInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<WxwOaTemplateId>> {
    
    let mut options = Options::new();
    if let Some(unique_type) = unique_type {
      options = options.set_unique_type(unique_type);
    }
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .with_creating(Some(true))
      .build()
      .scope({
        wxw_oa_template_resolver::creates_wxw_oa_template(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// 审批模板根据id修改租户id
  #[graphql(name = "updateTenantByIdWxwOaTemplate")]
  async fn update_tenant_by_id_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxwOaTemplateId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_oa_template_resolver::update_tenant_by_id_wxw_oa_template(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改审批模板
  #[graphql(name = "updateByIdWxwOaTemplate")]
  async fn update_by_id_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxwOaTemplateId,
    #[graphql(name = "input")]
    input: WxwOaTemplateInput,
  ) -> Result<WxwOaTemplateId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_oa_template_resolver::update_by_id_wxw_oa_template(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除审批模板
  #[graphql(name = "deleteByIdsWxwOaTemplate")]
  async fn delete_by_ids_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxwOaTemplateId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_oa_template_resolver::delete_by_ids_wxw_oa_template(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用审批模板
  #[graphql(name = "enableByIdsWxwOaTemplate")]
  async fn enable_by_ids_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxwOaTemplateId>,
    #[graphql(name = "is_enabled")]
    is_enabled: u8,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_oa_template_resolver::enable_by_ids_wxw_oa_template(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原审批模板
  #[graphql(name = "revertByIdsWxwOaTemplate")]
  async fn revert_by_ids_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxwOaTemplateId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_oa_template_resolver::revert_by_ids_wxw_oa_template(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除审批模板
  #[graphql(name = "forceDeleteByIdsWxwOaTemplate")]
  async fn force_delete_by_ids_wxw_oa_template(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxwOaTemplateId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_oa_template_resolver::force_delete_by_ids_wxw_oa_template(
          ids,
          None,
        )
      }).await
  }
  
}

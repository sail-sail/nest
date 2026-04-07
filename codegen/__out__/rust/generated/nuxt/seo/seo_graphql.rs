
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

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::seo_model::*;
use super::seo_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct SeoGenQuery;

#[Object(rename_args = "snake_case")]
impl SeoGenQuery {
  
  /// 根据搜索条件和分页查找SEO优化列表
  #[graphql(name = "findAllSeo")]
  async fn find_all_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<SeoSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<SeoModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        seo_resolver::find_all_seo(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找SEO优化总数
  #[graphql(name = "findCountSeo")]
  async fn find_count_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<SeoSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        seo_resolver::find_count_seo(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个SEO优化
  #[graphql(name = "findOneSeo")]
  async fn find_one_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<SeoSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<SeoModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        seo_resolver::find_one_seo(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个SEO优化, 如果不存在则抛错
  #[graphql(name = "findOneOkSeo")]
  async fn find_one_ok_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<SeoSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<SeoModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        seo_resolver::find_one_ok_seo(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找SEO优化
  #[graphql(name = "findByIdSeo")]
  async fn find_by_id_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: SeoId,
  ) -> Result<Option<SeoModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        seo_resolver::find_by_id_seo(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找SEO优化, 如果不存在则抛错
  #[graphql(name = "findByIdOkSeo")]
  async fn find_by_id_ok_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: SeoId,
  ) -> Result<SeoModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        seo_resolver::find_by_id_ok_seo(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找SEO优化
  #[graphql(name = "findByIdsSeo")]
  async fn find_by_ids_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<SeoId>,
  ) -> Result<Vec<SeoModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        seo_resolver::find_by_ids_seo(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找SEO优化
  #[graphql(name = "findByIdsOkSeo")]
  async fn find_by_ids_ok_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<SeoId>,
  ) -> Result<Vec<SeoModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        seo_resolver::find_by_ids_ok_seo(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找SEO优化是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  #[graphql(name = "getIsLockedByIdSeo")]
  async fn get_is_locked_by_id_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: SeoId,
  ) -> Result<bool> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        seo_resolver::get_is_locked_by_id_seo(
          id,
          None,
        )
      }).await
  }
  
  /// 获取SEO优化字段注释
  #[graphql(name = "getFieldCommentsSeo")]
  async fn get_field_comments_seo(
    &self,
    ctx: &Context<'_>,
  ) -> Result<SeoFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        seo_resolver::get_field_comments_seo(
          None,
        )
      }).await
  }
  
  /// 查找 SEO优化 order_by 字段的最大值
  #[graphql(name = "findLastOrderBySeo")]
  async fn find_last_order_by_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<SeoSearch>,
  ) -> Result<u32> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        seo_resolver::find_last_order_by_seo(
          search,
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct SeoGenMutation;

#[Object(rename_args = "snake_case")]
impl SeoGenMutation {
  
  /// 创建SEO优化
  #[graphql(name = "createsSeo")]
  async fn creates_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "inputs")]
    inputs: Vec<SeoInput>,
    #[graphql(name = "unique_type")]
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<SeoId>> {
    
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
        seo_resolver::creates_seo(
          inputs,
          Some(options),
        )
      }).await
  }
  
  /// SEO优化根据id修改租户id
  #[graphql(name = "updateTenantByIdSeo")]
  async fn update_tenant_by_id_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: SeoId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        seo_resolver::update_tenant_by_id_seo(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 id 修改SEO优化
  #[graphql(name = "updateByIdSeo")]
  async fn update_by_id_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: SeoId,
    #[graphql(name = "input")]
    input: SeoInput,
  ) -> Result<SeoId> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        seo_resolver::update_by_id_seo(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除SEO优化
  #[graphql(name = "deleteByIdsSeo")]
  async fn delete_by_ids_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<SeoId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        seo_resolver::delete_by_ids_seo(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  #[graphql(name = "lockByIdsSeo")]
  async fn lock_by_ids_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<SeoId>,
    #[graphql(name = "is_locked")]
    is_locked: u8,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        seo_resolver::lock_by_ids_seo(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原SEO优化
  #[graphql(name = "revertByIdsSeo")]
  async fn revert_by_ids_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<SeoId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        seo_resolver::revert_by_ids_seo(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除SEO优化
  #[graphql(name = "forceDeleteByIdsSeo")]
  async fn force_delete_by_ids_seo(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<SeoId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        seo_resolver::force_delete_by_ids_seo(
          ids,
          None,
        )
      }).await
  }
  
}

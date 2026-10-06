
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

use super::wxw_oa_approval_detail_model::*;
use super::wxw_oa_approval_detail_resolver;

use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct WxwOaApprovalDetailGenQuery;

#[Object(rename_args = "snake_case")]
impl WxwOaApprovalDetailGenQuery {
  
  /// 根据搜索条件和分页查找审批申请详情列表
  #[graphql(name = "findAllWxwOaApprovalDetail")]
  async fn find_all_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxwOaApprovalDetailSearch>,
    #[graphql(name = "page")]
    page: Option<PageInput>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<WxwOaApprovalDetailModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_approval_detail_resolver::find_all_wxw_oa_approval_detail(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找审批申请详情总数
  #[graphql(name = "findCountWxwOaApprovalDetail")]
  async fn find_count_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxwOaApprovalDetailSearch>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_approval_detail_resolver::find_count_wxw_oa_approval_detail(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个审批申请详情
  #[graphql(name = "findOneWxwOaApprovalDetail")]
  async fn find_one_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxwOaApprovalDetailSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<WxwOaApprovalDetailModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_approval_detail_resolver::find_one_wxw_oa_approval_detail(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个审批申请详情, 如果不存在则抛错
  #[graphql(name = "findOneOkWxwOaApprovalDetail")]
  async fn find_one_ok_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxwOaApprovalDetailSearch>,
    #[graphql(name = "sort")]
    sort: Option<Vec<SortInput>>,
  ) -> Result<WxwOaApprovalDetailModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_approval_detail_resolver::find_one_ok_wxw_oa_approval_detail(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批申请详情
  #[graphql(name = "findByIdWxwOaApprovalDetail")]
  async fn find_by_id_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxwOaApprovalDetailId,
  ) -> Result<Option<WxwOaApprovalDetailModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_approval_detail_resolver::find_by_id_wxw_oa_approval_detail(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批申请详情, 如果不存在则抛错
  #[graphql(name = "findByIdOkWxwOaApprovalDetail")]
  async fn find_by_id_ok_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxwOaApprovalDetailId,
  ) -> Result<WxwOaApprovalDetailModel> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_approval_detail_resolver::find_by_id_ok_wxw_oa_approval_detail(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批申请详情
  #[graphql(name = "findByIdsWxwOaApprovalDetail")]
  async fn find_by_ids_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxwOaApprovalDetailId>,
  ) -> Result<Vec<WxwOaApprovalDetailModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_approval_detail_resolver::find_by_ids_wxw_oa_approval_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据搜索条件判断审批申请详情是否存在
  #[graphql(name = "existsWxwOaApprovalDetail")]
  async fn exists_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: Option<WxwOaApprovalDetailSearch>,
  ) -> Result<bool> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_approval_detail_resolver::exists_wxw_oa_approval_detail(
          search,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找审批申请详情
  #[graphql(name = "findByIdsOkWxwOaApprovalDetail")]
  async fn find_by_ids_ok_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxwOaApprovalDetailId>,
  ) -> Result<Vec<WxwOaApprovalDetailModel>> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        wxw_oa_approval_detail_resolver::find_by_ids_ok_wxw_oa_approval_detail(
          ids,
          None,
        )
      }).await
  }
  
  /// 获取审批申请详情字段注释
  #[graphql(name = "getFieldCommentsWxwOaApprovalDetail")]
  async fn get_field_comments_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
  ) -> Result<WxwOaApprovalDetailFieldComment> {
    
    Ctx::builder(ctx)
      .build()
      .scope({
        wxw_oa_approval_detail_resolver::get_field_comments_wxw_oa_approval_detail(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct WxwOaApprovalDetailGenMutation;

#[Object(rename_args = "snake_case")]
impl WxwOaApprovalDetailGenMutation {
  
  /// 占位方法, 用于实现 WxwOaApprovalDetailInput
  #[allow(unused_variables)]
  #[graphql(name = "noAddNoEditWxwOaApprovalDetail")]
  async fn no_add_no_edit_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "input")]
    input: WxwOaApprovalDetailInput,
  ) -> Result<WxwOaApprovalDetailId> {
    
    Err(eyre!(""))
  }
  
  /// 审批申请详情根据id修改租户id
  #[graphql(name = "updateTenantByIdWxwOaApprovalDetail")]
  async fn update_tenant_by_id_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "id")]
    id: WxwOaApprovalDetailId,
    #[graphql(name = "tenant_id")]
    tenant_id: TenantId,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_oa_approval_detail_resolver::update_tenant_by_id_wxw_oa_approval_detail(
          id,
          tenant_id,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除审批申请详情
  #[graphql(name = "deleteByIdsWxwOaApprovalDetail")]
  async fn delete_by_ids_wxw_oa_approval_detail(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "ids")]
    ids: Vec<WxwOaApprovalDetailId>,
  ) -> Result<u64> {
    
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        wxw_oa_approval_detail_resolver::delete_by_ids_wxw_oa_approval_detail(
          ids,
          None,
        )
      }).await
  }
  
}

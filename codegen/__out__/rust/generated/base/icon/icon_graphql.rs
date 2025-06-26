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

use super::icon_model::*;
use super::icon_resolver;

#[derive(Default)]
pub struct IconGenQuery;

#[Object(rename_args = "snake_case")]
impl IconGenQuery {
  
  /// 根据搜索条件和分页查找图标库列表
  async fn find_all_icon(
    &self,
    ctx: &Context<'_>,
    search: Option<IconSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<IconModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        icon_resolver::find_all_icon(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找图标库总数
  async fn find_count_icon(
    &self,
    ctx: &Context<'_>,
    search: Option<IconSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        icon_resolver::find_count_icon(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个图标库
  async fn find_one_icon(
    &self,
    ctx: &Context<'_>,
    search: Option<IconSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<IconModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        icon_resolver::find_one_icon(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个图标库, 如果不存在则抛错
  async fn find_one_ok_icon(
    &self,
    ctx: &Context<'_>,
    search: Option<IconSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<IconModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        icon_resolver::find_one_ok_icon(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找图标库
  async fn find_by_id_icon(
    &self,
    ctx: &Context<'_>,
    id: IconId,
  ) -> Result<Option<IconModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        icon_resolver::find_by_id_icon(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找图标库, 如果不存在则抛错
  async fn find_by_id_ok_icon(
    &self,
    ctx: &Context<'_>,
    id: IconId,
  ) -> Result<IconModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        icon_resolver::find_by_id_ok_icon(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找图标库
  async fn find_by_ids_icon(
    &self,
    ctx: &Context<'_>,
    ids: Vec<IconId>,
  ) -> Result<Vec<IconModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        icon_resolver::find_by_ids_icon(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找图标库
  async fn find_by_ids_ok_icon(
    &self,
    ctx: &Context<'_>,
    ids: Vec<IconId>,
  ) -> Result<Vec<IconModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        icon_resolver::find_by_ids_ok_icon(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找图标库是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_icon(
    &self,
    ctx: &Context<'_>,
    id: IconId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        icon_resolver::get_is_enabled_by_id_icon(
          id,
          None,
        )
      }).await
  }
  
  /// 获取图标库字段注释
  async fn get_field_comments_icon(
    &self,
    ctx: &Context<'_>,
  ) -> Result<IconFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        icon_resolver::get_field_comments_icon(
          None,
        )
      }).await
  }
  
  /// 查找 图标库 order_by 字段的最大值
  async fn find_last_order_by_icon(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        icon_resolver::find_last_order_by_icon(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct IconGenMutation;

#[Object(rename_args = "snake_case")]
impl IconGenMutation {
  
  /// 创建图标库
  async fn creates_icon(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<IconInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<IconId>> {
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
        icon_resolver::creates_icon(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 根据 id 修改图标库
  async fn update_by_id_icon(
    &self,
    ctx: &Context<'_>,
    id: IconId,
    input: IconInput,
  ) -> Result<IconId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        icon_resolver::update_by_id_icon(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除图标库
  async fn delete_by_ids_icon(
    &self,
    ctx: &Context<'_>,
    ids: Vec<IconId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        icon_resolver::delete_by_ids_icon(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用图标库
  async fn enable_by_ids_icon(
    &self,
    ctx: &Context<'_>,
    ids: Vec<IconId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        icon_resolver::enable_by_ids_icon(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原图标库
  async fn revert_by_ids_icon(
    &self,
    ctx: &Context<'_>,
    ids: Vec<IconId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        icon_resolver::revert_by_ids_icon(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除图标库
  async fn force_delete_by_ids_icon(
    &self,
    ctx: &Context<'_>,
    ids: Vec<IconId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        icon_resolver::force_delete_by_ids_icon(
          ids,
          None,
        )
      }).await
  }
  
}

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

use super::options_model::*;
use super::options_resolver;

#[derive(Default)]
pub struct OptionsGenQuery;

#[Object(rename_args = "snake_case")]
impl OptionsGenQuery {
  
  /// 根据搜索条件和分页查找系统选项列表
  async fn find_all_options(
    &self,
    ctx: &Context<'_>,
    search: Option<OptionsSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<OptionsModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        options_resolver::find_all_options(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找系统选项总数
  async fn find_count_options(
    &self,
    ctx: &Context<'_>,
    search: Option<OptionsSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        options_resolver::find_count_options(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个系统选项
  async fn find_one_options(
    &self,
    ctx: &Context<'_>,
    search: Option<OptionsSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<OptionsModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        options_resolver::find_one_options(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个系统选项, 如果不存在则抛错
  async fn find_one_ok_options(
    &self,
    ctx: &Context<'_>,
    search: Option<OptionsSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<OptionsModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        options_resolver::find_one_ok_options(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统选项
  async fn find_by_id_options(
    &self,
    ctx: &Context<'_>,
    id: OptionsId,
  ) -> Result<Option<OptionsModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        options_resolver::find_by_id_options(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统选项, 如果不存在则抛错
  async fn find_by_id_ok_options(
    &self,
    ctx: &Context<'_>,
    id: OptionsId,
  ) -> Result<OptionsModel> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        options_resolver::find_by_id_ok_options(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统选项
  async fn find_by_ids_options(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptionsId>,
  ) -> Result<Vec<OptionsModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        options_resolver::find_by_ids_options(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统选项
  async fn find_by_ids_ok_options(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptionsId>,
  ) -> Result<Vec<OptionsModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        options_resolver::find_by_ids_ok_options(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统选项是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_options(
    &self,
    ctx: &Context<'_>,
    id: OptionsId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        options_resolver::get_is_enabled_by_id_options(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统选项是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_options(
    &self,
    ctx: &Context<'_>,
    id: OptionsId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        options_resolver::get_is_locked_by_id_options(
          id,
          None,
        )
      }).await
  }
  
  /// 获取系统选项字段注释
  async fn get_field_comments_options(
    &self,
    ctx: &Context<'_>,
  ) -> Result<OptionsFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        options_resolver::get_field_comments_options(
          None,
        )
      }).await
  }
  
  /// 查找 系统选项 order_by 字段的最大值
  async fn find_last_order_by_options(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        options_resolver::find_last_order_by_options(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct OptionsGenMutation;

#[Object(rename_args = "snake_case")]
impl OptionsGenMutation {
  
  /// 创建系统选项
  async fn creates_options(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<OptionsInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<OptionsId>> {
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
        options_resolver::creates_options(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 根据 id 修改系统选项
  async fn update_by_id_options(
    &self,
    ctx: &Context<'_>,
    id: OptionsId,
    input: OptionsInput,
  ) -> Result<OptionsId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        options_resolver::update_by_id_options(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除系统选项
  async fn delete_by_ids_options(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptionsId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        options_resolver::delete_by_ids_options(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用系统选项
  async fn enable_by_ids_options(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptionsId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        options_resolver::enable_by_ids_options(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_options(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptionsId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        options_resolver::lock_by_ids_options(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原系统选项
  async fn revert_by_ids_options(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptionsId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        options_resolver::revert_by_ids_options(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除系统选项
  async fn force_delete_by_ids_options(
    &self,
    ctx: &Context<'_>,
    ids: Vec<OptionsId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        options_resolver::force_delete_by_ids_options(
          ids,
          None,
        )
      }).await
  }
  
}

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

use super::dict_model::*;
use super::dict_resolver;

#[derive(Default)]
pub struct DictGenQuery;

#[Object(rename_args = "snake_case")]
impl DictGenQuery {
  
  /// 根据搜索条件和分页查找系统字典列表
  async fn find_all_dict(
    &self,
    ctx: &Context<'_>,
    search: Option<DictSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<DictModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找系统字典总数
  async fn find_count_dict(
    &self,
    ctx: &Context<'_>,
    search: Option<DictSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个系统字典
  async fn find_one_dict(
    &self,
    ctx: &Context<'_>,
    search: Option<DictSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<DictModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统字典
  async fn find_by_id_dict(
    &self,
    ctx: &Context<'_>,
    id: DictId,
  ) -> Result<Option<DictModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统字典
  async fn find_by_ids_dict(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictId>,
  ) -> Result<Vec<DictModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_resolver::find_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找系统字典是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_dict(
    &self,
    ctx: &Context<'_>,
    id: DictId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_resolver::get_is_enabled_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取系统字典字段注释
  async fn get_field_comments_dict(
    &self,
    ctx: &Context<'_>,
  ) -> Result<DictFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        dict_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
  /// 查找 系统字典 order_by 字段的最大值
  async fn find_last_order_by_dict(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        dict_resolver::find_last_order_by(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct DictGenMutation;

#[Object(rename_args = "snake_case")]
impl DictGenMutation {
  
  /// 创建系统字典
  async fn creates_dict(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<DictInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<DictId>> {
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
        dict_resolver::creates(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 根据 id 修改系统字典
  async fn update_by_id_dict(
    &self,
    ctx: &Context<'_>,
    id: DictId,
    input: DictInput,
  ) -> Result<DictId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dict_resolver::update_by_id(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除系统字典
  async fn delete_by_ids_dict(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dict_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用系统字典
  async fn enable_by_ids_dict(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dict_resolver::enable_by_ids(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原系统字典
  async fn revert_by_ids_dict(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dict_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除系统字典
  async fn force_delete_by_ids_dict(
    &self,
    ctx: &Context<'_>,
    ids: Vec<DictId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        dict_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}

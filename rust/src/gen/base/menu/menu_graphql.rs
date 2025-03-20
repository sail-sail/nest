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

use super::menu_model::*;
use super::menu_resolver;

#[derive(Default)]
pub struct MenuGenQuery;

#[Object(rename_args = "snake_case")]
impl MenuGenQuery {
  
  /// 根据搜索条件和分页查找菜单列表
  async fn find_all_menu(
    &self,
    ctx: &Context<'_>,
    search: Option<MenuSearch>,
    page: Option<PageInput>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Vec<MenuModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        menu_resolver::find_all(
          search,
          page,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据条件查找菜单总数
  async fn find_count_menu(
    &self,
    ctx: &Context<'_>,
    search: Option<MenuSearch>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        menu_resolver::find_count(
          search,
          None,
        )
      }).await
  }
  
  /// 根据条件查找第一个菜单
  async fn find_one_menu(
    &self,
    ctx: &Context<'_>,
    search: Option<MenuSearch>,
    sort: Option<Vec<SortInput>>,
  ) -> Result<Option<MenuModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        menu_resolver::find_one(
          search,
          sort,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找菜单
  async fn find_by_id_menu(
    &self,
    ctx: &Context<'_>,
    id: MenuId,
  ) -> Result<Option<MenuModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        menu_resolver::find_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找菜单
  async fn find_by_ids_menu(
    &self,
    ctx: &Context<'_>,
    ids: Vec<MenuId>,
  ) -> Result<Vec<MenuModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        menu_resolver::find_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找菜单是否已启用
  /// 记录不存在则返回 false
  async fn get_is_enabled_by_id_menu(
    &self,
    ctx: &Context<'_>,
    id: MenuId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        menu_resolver::get_is_enabled_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 根据 id 查找菜单是否已锁定
  /// 已锁定的记录不能修改和删除
  /// 记录不存在则返回 false
  async fn get_is_locked_by_id_menu(
    &self,
    ctx: &Context<'_>,
    id: MenuId,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        menu_resolver::get_is_locked_by_id(
          id,
          None,
        )
      }).await
  }
  
  /// 获取菜单字段注释
  async fn get_field_comments_menu(
    &self,
    ctx: &Context<'_>,
  ) -> Result<MenuFieldComment> {
    Ctx::builder(ctx)
      .build()
      .scope({
        menu_resolver::get_field_comments(
          None,
        )
      }).await
  }
  
  /// 查找 菜单 order_by 字段的最大值
  async fn find_last_order_by_menu(
    &self,
    ctx: &Context<'_>,
  ) -> Result<u32> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        menu_resolver::find_last_order_by(
          None,
        )
      }).await
  }
  
}

#[derive(Default)]
pub struct MenuGenMutation;

#[Object(rename_args = "snake_case")]
impl MenuGenMutation {
  
  /// 创建菜单
  async fn creates_menu(
    &self,
    ctx: &Context<'_>,
    inputs: Vec<MenuInput>,
    unique_type: Option<UniqueType>,
  ) -> Result<Vec<MenuId>> {
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
        menu_resolver::creates(
          inputs,
          options.into(),
        )
      }).await
  }
  
  /// 根据 id 修改菜单
  async fn update_by_id_menu(
    &self,
    ctx: &Context<'_>,
    id: MenuId,
    input: MenuInput,
  ) -> Result<MenuId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        menu_resolver::update_by_id(
          id,
          input,
          None,
        )
      }).await
  }
  
  /// 根据 ids 删除菜单
  async fn delete_by_ids_menu(
    &self,
    ctx: &Context<'_>,
    ids: Vec<MenuId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        menu_resolver::delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 启用或者禁用菜单
  async fn enable_by_ids_menu(
    &self,
    ctx: &Context<'_>,
    ids: Vec<MenuId>,
    is_enabled: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        menu_resolver::enable_by_ids(
          ids,
          is_enabled,
          None,
        )
      }).await
  }
  
  /// 根据 ids 锁定或解锁数据
  async fn lock_by_ids_menu(
    &self,
    ctx: &Context<'_>,
    ids: Vec<MenuId>,
    is_locked: u8,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        menu_resolver::lock_by_ids(
          ids,
          is_locked,
          None,
        )
      }).await
  }
  
  /// 根据 ids 还原菜单
  async fn revert_by_ids_menu(
    &self,
    ctx: &Context<'_>,
    ids: Vec<MenuId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        menu_resolver::revert_by_ids(
          ids,
          None,
        )
      }).await
  }
  
  /// 根据 ids 彻底删除菜单
  async fn force_delete_by_ids_menu(
    &self,
    ctx: &Context<'_>,
    ids: Vec<MenuId>,
  ) -> Result<u64> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        menu_resolver::force_delete_by_ids(
          ids,
          None,
        )
      }).await
  }
  
}

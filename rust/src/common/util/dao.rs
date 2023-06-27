use anyhow::Result;
use serde::{Serialize, Deserialize};
use sqlx::FromRow;

use crate::common::context::{
  Ctx,
  QueryArgs,
  escape_id, get_short_uuid,
};

pub struct ManyOpts {
  pub r#mod: &'static str,
  pub table: &'static str,
  pub column1: &'static str,
  pub column2: &'static str,
}

#[derive(FromRow, Debug, Clone, Serialize, Deserialize)]
struct ManyModel {
  id: String,
  column1_id: String,
  column2_id: String,
  is_deleted: bool,
}

pub async fn many2many_update<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  foreign_ids: Vec<String>,
  many_opts: ManyOpts,
) -> Result<()> {
  let tenant_id = ctx.get_auth_tenant_id();
  let auth_model = ctx.get_auth_model();
  
  let column1 = escape_id(many_opts.column1);
  let column2 = escape_id(many_opts.column2);
  
  let mod_table = escape_id(format!("{}_{}", many_opts.r#mod, many_opts.table));
  
  let mut args = QueryArgs::new();
  
  let sql = format!(r#"
    select
      t.id,
      t.{column1} column1_id,
      t.{column2} column2_id,
      t.is_deleted
    from {mod_table} t
    where
      t.{column1} = ?
  "#);
  
  args.push(id.clone().into());
  
  let args = args.into();
  
  let models: Vec<ManyModel> = ctx.query(
    sql,
    args,
    None,
  ).await?;
  
  for model in &models {
    if foreign_ids.contains(&model.column2_id) && model.is_deleted {
      let mut args = QueryArgs::new();
      let sql = format!(r#"
        update {mod_table}
        set
          is_deleted = 0
        where
          id = ?
      "#);
      args.push(model.id.clone().into());
      let args = args.into();
      ctx.execute(sql, args, None).await?;
    } else if !foreign_ids.contains(&model.column2_id) && !model.is_deleted {
      let mut args = QueryArgs::new();
      let sql = format!(r#"
        update {mod_table}
        set
          is_deleted = 1
          ,delete_time = ?
        where
          id = ?
      "#);
      args.push(ctx.get_now().into());
      args.push(model.id.clone().into());
      let args = args.into();
      ctx.execute(sql, args, None).await?;
    }
  }
  
  let foreign_ids2 = foreign_ids.into_iter().filter(|column2_id| {
    models.iter().all(|model| model.column2_id != *column2_id)
  }).collect::<Vec<String>>();
  
  for foreign_id in foreign_ids2 {
    let mut args = QueryArgs::new();
    let mut sql_fields = "".to_owned();
    let mut sql_values = "".to_owned();
    
    sql_fields += "id";
    sql_values += "?";
    args.push(get_short_uuid().into());
    
    sql_fields += ",create_time";
    sql_values += ",?";
    args.push(ctx.get_now().into());
    
    if many_opts.column1 != "tenant_id" && many_opts.column2 != "tenant_id" {
      if let Some(tenant_id) = &tenant_id {
        if column1 != "tenant_id" && column2 != "tenant_id" {
          sql_fields += ",tenant_id";
          sql_values += ",?";
          args.push(tenant_id.clone().into());
        }
      }
    }
    
    if let Some(auth_model) = &auth_model {
      sql_fields += ",create_usr_id";
      sql_values += ",?";
      args.push(auth_model.id.clone().into());
    }
    
    sql_fields += &format!(",{column1}");
    sql_values += ",?";
    args.push(id.clone().into());
    
    sql_fields += &format!(",{column2}");
    sql_values += ",?";
    args.push(foreign_id.clone().into());
    
    let sql = format!("insert into {mod_table} ({sql_fields}) values ({sql_values})");
    let args = args.into();
    ctx.execute(sql, args, None).await?;
  }
  Ok(())
}

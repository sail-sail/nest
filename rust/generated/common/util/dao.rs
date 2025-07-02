use std::sync::OnceLock;

use tracing::error;
use color_eyre::eyre::{Result, eyre};
use serde::{Serialize, Deserialize};
use smol_str::SmolStr;
use sqlx::FromRow;

use aes::cipher::{
  block_padding::Pkcs7,
  BlockDecryptMut,
  BlockEncryptMut,
  KeyIvInit,
};

use base64::{
  engine::general_purpose,
  Engine,
};

type Aes128CbcEnc = cbc::Encryptor<aes::Aes128>;
type Aes128CbcDec = cbc::Decryptor<aes::Aes128>;

use crate::common::context::{
  get_req_id,
  get_auth_model,
  get_auth_tenant_id,
  get_now,
  execute,
  query,
  QueryArgs,
  escape_id,
  get_short_uuid,
};

static CRYPTO_KEY: OnceLock<Option<&'static [u8]>> = OnceLock::new();

fn crypto_key() -> Option<&'static [u8]> {
  *CRYPTO_KEY.get_or_init(init_crypto_key)
}

fn init_crypto_key() -> Option<&'static [u8]> {
  let crypto_key_path = std::env::var("database_crypto_key_path").ok();
  crypto_key_path.as_ref()?;
  let crypto_key_path = crypto_key_path.unwrap();
  let crypto_key = std::fs::read(crypto_key_path).ok();
  crypto_key.as_ref()?;
  let crypto_key = crypto_key.unwrap();
  if crypto_key.len() != 16 {
    return None;
  }
  Some(Box::leak(crypto_key.into_boxed_slice()))
}

/// 使用AES-128-CBC加密给定的字符串。
/// 
/// #### 参数
/// 
/// - `str`：要加密的字符串。
/// 
/// #### 返回值
/// 
/// 返回加密后的字符串。
/// 
/// #### 示例
/// 
/// ```
/// let encrypted_str = encrypt("hello world");
/// ```
#[allow(dead_code)]
#[must_use]
pub fn encrypt(
  str: &str,
) -> String {
  let crypto_key = crypto_key();
  if crypto_key.is_none() {
    return "".to_owned();
  }
  let crypto_key = crypto_key.unwrap();
  let salt = get_short_uuid();
  let iv_str = get_short_uuid();
  let salt = &salt.as_str()[..16];
  let iv_str = &iv_str.as_str()[..16];
  let iv = iv_str.as_bytes();
  let ct = Aes128CbcEnc::new(
    crypto_key.into(),
    iv.into(),
  )
    .encrypt_padded_vec_mut::<Pkcs7>(
      format!("{salt}{str}").as_bytes(),
    );
  let str2 = general_purpose::STANDARD.encode(ct);
  let str2 = format!("{iv_str}{str2}");
  str2
}

/// 解密字符串
/// 
/// #### 参数
/// 
/// * `str` - 要解密的字符串
/// 
/// #### 返回值
/// 
/// 返回解密后的字符串，如果解密失败则返回空字符串。
#[allow(dead_code)]
#[must_use]
pub fn decrypt(
  str: &str,
) -> String {
  let crypto_key = crypto_key();
  if crypto_key.is_none() {
    return "".to_owned();
  }
  let crypto_key = crypto_key.unwrap();
  let iv_str = &str[..16];
  let iv = iv_str.as_bytes();
  let ct = &str[16..];
  let ct = general_purpose::STANDARD.decode(ct).ok();
  if ct.is_none() {
    return "".to_owned();
  }
  let ct = ct.unwrap();
  let pt = Aes128CbcDec::new(
    crypto_key.into(),
    iv.into(),
  )
    .decrypt_padded_vec_mut::<Pkcs7>(
      ct.as_slice(),
    )
    .ok();
  if pt.is_none() {
    return "".to_owned();
  }
  let pt = pt.unwrap();
  let str2 = String::from_utf8(pt).ok();
  if str2.is_none() {
    return "".to_owned();
  }
  {
    let str2 = str2.unwrap();
    if str2.len() < 16 {
      return "".to_owned();
    }
    str2[16..].to_owned()
  }
}

pub struct ManyOpts {
  pub r#mod: &'static str,
  pub table: &'static str,
  pub column1: &'static str,
  pub column2: &'static str,
}

#[derive(FromRow, Clone, Serialize, Deserialize)]
struct ManyModel {
  id: String,
  column1_id: String,
  column2_id: String,
  is_deleted: bool,
  order_by: u32,
}

pub async fn many2many_update(
  id: SmolStr,
  foreign_ids: Vec<SmolStr>,
  many_opts: ManyOpts,
) -> Result<bool> {
  let tenant_id = get_auth_tenant_id();
  let auth_model = get_auth_model();
  
  let column1 = escape_id(many_opts.column1);
  let column2 = escape_id(many_opts.column2);
  
  let mod_table = escape_id(format!("{}_{}", many_opts.r#mod, many_opts.table));
  
  let mut args = QueryArgs::new();
  
  let sql = format!(r#"
    select
      t.id,
      t.{column1} column1_id,
      t.{column2} column2_id,
      t.is_deleted,
      t.order_by
    from {mod_table} t
    where
      t.{column1} = ?
  "#);
  
  args.push(id.clone().into());
  
  let args = args.into();
  
  let models: Vec<ManyModel> = query(
    sql,
    args,
    None,
  ).await?;
  
  let mut has_change = false;
  
  for model in models.iter() {
    let id = model.id.clone();
    let idx: Option<usize> = foreign_ids
      .iter()
      .position(|foreign_id| 
        foreign_id == &model.column2_id
      );
    if idx.is_none() {
      if !model.is_deleted {
        let mut args = QueryArgs::new();
        let sql = format!(r#"
          update {mod_table}
          set
            is_deleted = 1
            ,delete_time = ?
          where
            id = ?
        "#);
        args.push(get_now().into());
        args.push(id.clone().into());
        let args = args.into();
        has_change = true;
        execute(sql, args, None).await?;
      }
      continue;
    }
    let idx = idx.unwrap_or_default();
    let order_by = idx + 1;
    if order_by > u32::MAX as usize {
      error!(
        "{req_id} many2many_update: idx > u32::MAX as usize",
        req_id = get_req_id(),
      );
      return Err(eyre!("many2many_update: idx > u32::MAX as usize"));
    }
    let order_by = order_by as u32;
    if model.is_deleted || model.order_by != order_by {
      let mut args = QueryArgs::new();
      let sql = format!(r#"
        update {mod_table}
        set
          is_deleted = 0
          ,order_by = ?
        where
          id = ?
      "#);
      args.push(order_by.into());
      args.push(id.into());
      let args = args.into();
      has_change = true;
      execute(
        sql,
        args,
        None,
      ).await?;
    }
  }
  
  let foreign_ids2 = foreign_ids.clone().into_iter()
    .filter(|column2_id| {
      models.iter().all(|model| model.column2_id != *column2_id)
    }).collect::<Vec<SmolStr>>();
  
  for foreign_id in foreign_ids2 {
    let mut args = QueryArgs::new();
    let mut sql_fields = "".to_owned();
    let mut sql_values = "".to_owned();
    
    sql_fields += "id";
    sql_values += "?";
    args.push(get_short_uuid().into());
    
    sql_fields += ",create_time";
    sql_values += ",?";
    args.push(get_now().into());
    
    let idx: usize = foreign_ids.iter()
      .position(|x| 
        x == &foreign_id
      )
      .map(|idx| idx + 1)
      .unwrap();
    if idx > u32::MAX as usize {
      error!(
        "{req_id} many2many_update: idx > u32::MAX as usize",
        req_id = get_req_id(),
      );
      return Err(eyre!("many2many_update: idx > u32::MAX as usize"));
    }
    let idx = idx as u32;
    sql_fields += ",order_by";
    sql_values += ",?";
    args.push(idx.into());
    
    if many_opts.column1 != "tenant_id" && many_opts.column2 != "tenant_id" {
      if let Some(tenant_id) = &tenant_id {
        if column1 != "tenant_id" && column2 != "tenant_id" {
          sql_fields += ",tenant_id";
          sql_values += ",?";
          args.push(tenant_id.clone().as_str().into());
        }
      }
    }
    
    if let Some(auth_model) = &auth_model {
      sql_fields += ",create_usr_id";
      sql_values += ",?";
      args.push(auth_model.id.clone().as_str().into());
    }
    
    sql_fields += &format!(",{column1}");
    sql_values += ",?";
    args.push(id.clone().into());
    
    sql_fields += &format!(",{column2}");
    sql_values += ",?";
    args.push(foreign_id.clone().into());
    
    let sql = format!("insert into {mod_table} ({sql_fields}) values ({sql_values})");
    let args = args.into();
    execute(
      sql,
      args,
      None,
    ).await?;
  }
  Ok(has_change)
}

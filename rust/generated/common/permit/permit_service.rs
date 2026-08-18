use std::collections::{HashMap, HashSet};

use color_eyre::eyre::{Result, eyre};

use crate::common::context::{
  get_auth_model,
  Options,
};

use smol_str::SmolStr;

use crate::common::i18n::i18n_dao::ns;

use crate::base::menu::menu_dao::{
  find_all_menu,
  find_one_menu,
};
use crate::base::menu::menu_model::{MenuSearch, MenuId};

use super::permit_model::GetUsrPermits;

use crate::base::message::message_dao2::send_message;
use crate::base::message::message_model::MessageInput;
use crate::base::usr::usr_dao::find_by_id_usr;
use crate::base::usr::usr_model::{UsrId, UsrSearch};
use crate::base::usr::usr_service::find_all_usr;
use crate::wxwork::wxw_msg::wxw_msg_dao2::send_message_wxwork;

use crate::base::role::role_dao::find_all_role;
use crate::base::role::role_model::{RoleId, RoleSearch};

use crate::base::permit::permit_dao::{
  find_all_permit,
  find_one_permit,
  exists_permit,
};
use crate::base::permit::permit_model::PermitSearch;
use crate::base::permit::permit_model::PermitModel;
use crate::base::permit::permit_model::PermitId;

/// 根据当前用户获取权限列表
pub async fn get_usr_permits(route_path: Option<SmolStr>) -> Result<Vec<GetUsrPermits>> {
  let auth_model = get_auth_model();
  if auth_model.is_none() {
    return Ok(Vec::new());
  }
  let auth_model = auth_model.unwrap();
  
  let options = Options::new();
  let options = options.set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_model = find_by_id_usr(
    auth_model.id,
    options,
  ).await?;
  if usr_model.is_none() {
    return Ok(Vec::new());
  }
  let usr_model = usr_model.unwrap();
  
  let role_ids = usr_model.role_ids;
  if role_ids.is_empty() {
    return Ok(Vec::new());
  }
  
  let role_models = find_all_role(
    RoleSearch {
      ids: role_ids.into(),
      is_enabled: vec![1].into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options,
  ).await?;
  
  let mut permit_ids = Vec::<PermitId>::new();
  for role_model in role_models {
    for permit_id in role_model.permit_ids {
      if permit_ids.contains(&permit_id) {
        continue;
      }
      permit_ids.push(permit_id);
    }
  }
  let permit_len = permit_ids.len();
  
  // 切分成多个批次查询
  let batch_size = 100;
  let mut batch_count = permit_len / batch_size;
  if !permit_len.is_multiple_of(batch_size) {
    batch_count += 1;
  }
  let batch_count = batch_count;
  let mut permit_ids_arr = Vec::<Vec<PermitId>>::with_capacity(batch_count);
  for i in 0..batch_count {
    let start = i * batch_size;
    let mut end = (i + 1) * batch_size;
    if end > permit_len {
      end = permit_len;
    }
    let end = end;
    let permit_ids = permit_ids[start..end].to_vec();
    permit_ids_arr.push(permit_ids);
  }
  let permit_ids_arr = permit_ids_arr;
  
  let mut permit_models: Vec<PermitModel> = Vec::with_capacity(permit_len);
  for permit_ids in permit_ids_arr {
    let mut permit_models_tmp = find_all_permit(
      PermitSearch {
        ids: permit_ids.into(),
        ..Default::default()
      }.into(),
      None,
      None,
      options,
    ).await?;
    permit_models.append(&mut permit_models_tmp);
  }
  let permit_models = permit_models;
  
  let mut menu_ids = Vec::<MenuId>::new();
  for permit_model in permit_models.iter() {
    let menu_id = permit_model.menu_id;
    if menu_id.is_empty() || menu_ids.contains(&menu_id) {
      continue;
    }
    menu_ids.push(menu_id);
  }
  
  let mut menu_id_map = HashMap::<MenuId, SmolStr>::with_capacity(menu_ids.len());
  if !menu_ids.is_empty() {
    let menu_models = find_all_menu(
      Some(MenuSearch {
        ids: Some(menu_ids),
        ..Default::default()
      }),
      None,
      None,
      options,
    ).await?;
    for menu_model in menu_models {
      menu_id_map.insert(menu_model.id, menu_model.route_path);
    }
  }
  
  let permits: Vec<GetUsrPermits> = permit_models.into_iter()
    .map(|item| {
      let menu_id = item.menu_id;
      let route_path: Option<&SmolStr> = menu_id_map.get(&menu_id);
      let route_path: SmolStr = route_path
        .map_or_else(
          || SmolStr::new(""),
          |item| item.clone()
        );
      GetUsrPermits {
        id: item.id,
        menu_id,
        route_path,
        code: item.code,
        lbl: item.lbl,
      }
    })
    .filter(|permit| match &route_path {
      Some(route_path) => permit.route_path == *route_path,
      None => true,
    })
    .collect();
  
  Ok(permits)
}

pub fn filter_audit_receiver_usr_ids(
  receiver_usr_ids: Vec<UsrId>,
  exclude_usr_ids: Vec<UsrId>,
) -> Vec<UsrId> {
  let exclude_usr_ids: HashSet<UsrId> = exclude_usr_ids.into_iter().collect();
  let mut filtered = Vec::with_capacity(receiver_usr_ids.len());
  let mut seen = HashSet::with_capacity(receiver_usr_ids.len());

  for usr_id in receiver_usr_ids {
    if exclude_usr_ids.contains(&usr_id) {
      continue;
    }
    if seen.insert(usr_id) {
      filtered.push(usr_id);
    }
  }

  filtered
}

pub async fn get_audit_receiver_usr_ids(
  route_path: SmolStr,
  code: SmolStr,
  options: Option<Options>,
) -> Result<Vec<UsrId>> {
  let menu_model = match find_one_menu(
    MenuSearch {
      route_path: Some(route_path.clone()),
      is_enabled: Some(vec![1]),
      ..Default::default()
    }.into(),
    None,
    options,
  ).await? {
    Some(menu_model) => menu_model,
    None => return Ok(Vec::new()),
  };

  let permit_model = match find_one_permit(
    PermitSearch {
      menu_id: vec![menu_model.id].into(),
      code: Some(code.clone()),
      ..Default::default()
    }.into(),
    None,
    options,
  ).await? {
    Some(permit_model) => permit_model,
    None => return Ok(Vec::new()),
  };

  let role_models = find_all_role(
    Some(RoleSearch {
      permit_ids: Some(vec![permit_model.id]),
      is_audit_msg: Some(vec![1]),
      is_enabled: Some(vec![1]),
      ..Default::default()
    }),
    None,
    None,
    options,
  ).await?;

  if role_models.is_empty() {
    return Ok(Vec::new());
  }

  let role_ids: Vec<RoleId> = role_models
    .iter()
    .map(|item| item.id)
    .collect();

  let mut usr_models = find_all_usr(
    Some(UsrSearch {
      role_ids: Some(role_ids),
      is_reject_msg: Some(vec![0]),
      is_enabled: Some(vec![1]),
      is_deleted: Some(0),
      ..Default::default()
    }),
    None,
    None,
    options,
  ).await?;

  usr_models.sort_by(|left, right| {
    left
      .order_by
      .cmp(&right.order_by)
      .then_with(|| left.lbl.cmp(&right.lbl))
      .then_with(|| left.id.to_string().cmp(&right.id.to_string()))
  });

  Ok(usr_models
    .into_iter()
    .map(|item| item.id)
    .collect())
}

pub fn find_next_audit_receiver_usr_id_in_list(
  receiver_usr_ids: Vec<UsrId>,
  current_usr_id: UsrId,
) -> Option<UsrId> {
  if receiver_usr_ids.is_empty() {
    return None;
  }

  if receiver_usr_ids.len() == 1 {
    if receiver_usr_ids[0] == current_usr_id {
      return None;
    }
    return Some(receiver_usr_ids[0]);
  }

  let Some(current_index) = receiver_usr_ids.iter().position(|item| *item == current_usr_id) else {
    return receiver_usr_ids.first().copied();
  };

  let next_index = if current_index + 1 < receiver_usr_ids.len() {
    current_index + 1
  } else {
    0
  };

  Some(receiver_usr_ids[next_index])
}

pub async fn find_next_audit_receiver_usr_id(
  route_path: SmolStr,
  code: SmolStr,
  current_usr_id: UsrId,
  options: Option<Options>,
) -> Result<Option<UsrId>> {
  let receiver_usr_ids = get_audit_receiver_usr_ids(route_path, code, options).await?;
  Ok(find_next_audit_receiver_usr_id_in_list(receiver_usr_ids, current_usr_id))
}

/// 按角色权限筛选出全部可接收审核消息的用户，并广播通知
pub async fn notify_next_audit_usr_by_permit(
  route_path: SmolStr,
  code: SmolStr,
  current_usr_id: UsrId,
  message_input: MessageInput,
  options: Option<Options>,
) -> Result<()> {
  let receiver_usr_ids = get_audit_receiver_usr_ids(route_path, code, options).await?;
  let receiver_usr_ids = filter_audit_receiver_usr_ids(receiver_usr_ids, vec![current_usr_id]);
  if receiver_usr_ids.is_empty() {
    return Ok(());
  }

  let mut notify_input = message_input;
  notify_input.is_sys_msg = notify_input.is_sys_msg.or(Some(1));

  send_message(notify_input.clone(), receiver_usr_ids.clone(), options).await?;
  send_message_wxwork(notify_input, receiver_usr_ids, options).await?;

  Ok(())
}

/// 后端按钮权限校验
pub async fn use_permit(
  route_path: SmolStr,
  code: SmolStr,
) -> Result<()> {
  
  let options = Options::new()
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let menu_model = match find_one_menu(
    MenuSearch {
      route_path: Some(route_path.clone()),
      is_enabled: Some(vec![1]),
      ..Default::default()
    }.into(),
    None,
    options,
  ).await? {
    Some(menu_model) => menu_model,
    None => return Ok(()),
  };
  
  let auth_model = match get_auth_model() {
    Some(auth_model) => auth_model,
    None => {
      let err_msg = ns(
        SmolStr::new("无权限"),
        None,
      ).await?;
      return Err(eyre!(err_msg));
    }
  };
  
  let usr_id = auth_model.id;
  
  let usr_model = match find_by_id_usr(
    usr_id,
    options,
  ).await? {
    Some(usr_model) => usr_model,
    None => {
      let err_msg = ns(
        SmolStr::new("无权限"),
        None,
      ).await?;
      return Err(eyre!(err_msg));
    }
  };
  
  if usr_model.username == "admin" {
    return Ok(());
  }
  
  let role_ids = usr_model.role_ids;
  
  if role_ids.is_empty() {
    let err_msg = ns(
      SmolStr::new("无权限"),
      None,
    ).await?;
    return Err(eyre!(err_msg));
  }
  
  let role_models = find_all_role(
    Some(RoleSearch {
      ids: Some(role_ids),
      is_enabled: Some(vec![1]),
      ..Default::default()
    }),
    None,
    None,
    options,
  ).await?;
  
  // 过滤掉重复的 permit_ids
  let mut permit_ids = Vec::<PermitId>::new();
  for role_model in role_models.into_iter() {
    for permit_id in role_model.permit_ids.into_iter() {
      if permit_ids.contains(&permit_id) {
        continue;
      }
      permit_ids.push(permit_id);
    }
  }
  let permit_ids = permit_ids;
  
  // 切分成多个批次查询
  let mut permit_ids_arr = Vec::<Vec<PermitId>>::new();
  let batch_size = 100;
  let batch_count = (permit_ids.len() / batch_size) + 1;
  
  for i in 0..batch_count {
    let start = i * batch_size;
    let mut end = (i + 1) * batch_size;
    if end > permit_ids.len() {
      end = permit_ids.len();
    }
    let permit_ids = permit_ids[start..end].to_vec();
    permit_ids_arr.push(permit_ids);
  }
  let menu_id = menu_model.id;
  for permit_ids in permit_ids_arr.into_iter() {
  
    let permit_exists = exists_permit(
      PermitSearch {
        ids: permit_ids.into(),
        menu_id: vec![menu_id].into(),
        code: code.clone().into(),
        ..Default::default()
      }.into(),
      options,
    ).await?;
    
    if permit_exists {
      return Ok(());
    }
  }
  
  let permit_model = find_one_permit(
    PermitSearch {
      menu_id: vec![menu_id].into(),
      code: code.clone().into(),
      ..Default::default()
    }.into(),
    None,
    options,
  ).await?;
  
  let permit_lbl = permit_model
    .map(|item| item.lbl)
    .unwrap_or(code);
  
  let mut map: HashMap<SmolStr, SmolStr> = HashMap::with_capacity(2);
  map.insert(SmolStr::new("0"), menu_model.lbl);
  map.insert(SmolStr::new("1"), permit_lbl);
  
  let err_msg = ns(
    SmolStr::new("{0} {1} 无权限"),
    Some(map),
  ).await?;
  
  Err(eyre!(err_msg))
}

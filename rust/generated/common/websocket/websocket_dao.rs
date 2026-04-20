use std::collections::HashMap;
use std::sync::Arc;

use tracing::error;
use serde_json::json;

use futures_util::stream::SplitSink;
use futures_util::SinkExt;

use poem::web::websocket::{
  Message,
  WebSocketStream,
};
use tokio::sync::Mutex;

use crate::common::context::get_req_id;

use super::websocket_constants::{
  ClientSocketSinksType,
  client_id_topics_map,
  socket_sink_map,
  topic_client_ids_map,
};

/// 发布消息
#[allow(dead_code)]
pub async fn publish(
  topic: String,
  payload: Option<serde_json::Value>,
) {
  if topic.is_empty() {
    error!("websocket.dao.publish {} topic is empty", get_req_id());
    return;
  }
  
  let client_ids = {
    let topic_client_ids_map = topic_client_ids_map().read().await;
    topic_client_ids_map
      .get(topic.as_str())
      .cloned()
      .unwrap_or_default()
  };
  if client_ids.is_empty() {
    return;
  }
  
  let socket_sink_map = {
    let socket_sink_map = socket_sink_map().lock().await;
    socket_sink_map.clone()
  };
  
  for client_id in client_ids {
    let sockets = match socket_sink_map.get(&client_id).cloned() {
      Some(sockets) => sockets,
      None => continue,
    };
    let mut sockets = sockets.lock().await;
    for socket in sockets.values_mut() {
      let res = socket.send(Message::Text(
        json!({
          "topic": topic,
          "payload": payload,
        }).to_string(),
      )).await;
      if let Err(e) = res {
        error!("websocket.dao.publish {} send message error: {:?}", get_req_id(), e);
      }
    }
  }
}

/// 注册客户端连接
#[allow(dead_code)]
pub async fn add_socket_connection(
  client_id: &str,
  connection_id: &str,
  sink: SplitSink<WebSocketStream, Message>,
) {
  if client_id.is_empty() || connection_id.is_empty() {
    return;
  }
  let client_sockets = {
    let mut socket_sink_map = socket_sink_map().lock().await;
    socket_sink_map
      .entry(client_id.to_owned())
      .or_insert_with(|| Arc::new(Mutex::new(HashMap::new())))
      .clone()
  };
  let mut client_sockets = client_sockets.lock().await;
  client_sockets.insert(
    connection_id.to_owned(),
    sink,
  );
}

/// 获取客户端连接集合
#[allow(dead_code)]
pub async fn get_socket_connections(
  client_id: &str,
) -> Option<ClientSocketSinksType> {
  if client_id.is_empty() {
    return None;
  }
  let socket_sink_map = socket_sink_map().lock().await;
  socket_sink_map.get(client_id).cloned()
}

/// 移除客户端的单个连接，返回剩余连接数
#[allow(dead_code)]
pub async fn remove_socket_connection(
  client_id: &str,
  connection_id: &str,
) -> usize {
  if client_id.is_empty() || connection_id.is_empty() {
    return 0;
  }
  let client_sockets = match get_socket_connections(client_id).await {
    Some(client_sockets) => client_sockets,
    None => return 0,
  };
  let (removed_socket, left_len) = {
    let mut client_sockets = client_sockets.lock().await;
    let removed_socket = client_sockets.remove(connection_id);
    let left_len = client_sockets.len();
    (
      removed_socket,
      left_len,
    )
  };
  if left_len == 0 {
    let mut socket_sink_map = socket_sink_map().lock().await;
    let current_sockets = socket_sink_map.get(client_id).cloned();
    if let Some(current_sockets) = current_sockets
      && Arc::ptr_eq(&current_sockets, &client_sockets) {
        socket_sink_map.remove(client_id);
      }
  }
  if let Some(mut removed_socket) = removed_socket {
    let err = removed_socket.close().await;
    if let Err(e) = err {
      error!(
        "websocket.dao.remove_socket_connection {} close socket error: {:?}",
        get_req_id(),
        e,
      );
    }
  }
  left_len
}

/// 为客户端建立主题订阅索引
#[allow(dead_code)]
pub async fn subscribe_client_topics(
  client_id: &str,
  topics: &[String],
) {
  if client_id.is_empty() || topics.is_empty() {
    return;
  }
  let client_id = client_id.to_owned();
  let new_topics = {
    let mut client_id_topics_map = client_id_topics_map().write().await;
    let client_topics = client_id_topics_map
      .entry(client_id.clone())
      .or_insert_with(Vec::new);
    let mut new_topics = vec![];
    for topic in topics {
      if topic.is_empty() || client_topics.contains(topic) {
        continue;
      }
      client_topics.push(topic.clone());
      new_topics.push(topic.clone());
    }
    new_topics
  };
  if new_topics.is_empty() {
    return;
  }
  let mut topic_client_ids_map = topic_client_ids_map().write().await;
  for topic in new_topics {
    let client_ids = topic_client_ids_map
      .entry(topic)
      .or_insert_with(Vec::new);
    if client_ids.contains(&client_id) {
      continue;
    }
    client_ids.push(client_id.clone());
  }
}

/// 解除客户端的部分主题订阅索引
#[allow(dead_code)]
pub async fn un_subscribe_client_topics(
  client_id: &str,
  topics: &[String],
) {
  if client_id.is_empty() || topics.is_empty() {
    return;
  }
  let topics_to_remove = {
    let mut client_id_topics_map = client_id_topics_map().write().await;
    let mut topics_to_remove = vec![];
    let should_remove_client = {
      let client_topics = match client_id_topics_map.get_mut(client_id) {
        Some(client_topics) => client_topics,
        None => return,
      };
      for topic in topics {
        if topic.is_empty() || !client_topics.contains(topic) {
          continue;
        }
        client_topics.retain(|item| item != topic);
        topics_to_remove.push(topic.clone());
      }
      client_topics.is_empty()
    };
    if should_remove_client {
      client_id_topics_map.remove(client_id);
    }
    topics_to_remove
  };
  if topics_to_remove.is_empty() {
    return;
  }
  let mut topic_client_ids_map = topic_client_ids_map().write().await;
  for topic in topics_to_remove {
    let should_remove_topic = {
      let client_ids = match topic_client_ids_map.get_mut(&topic) {
        Some(client_ids) => client_ids,
        None => continue,
      };
      client_ids.retain(|item| item.as_str() != client_id);
      client_ids.is_empty()
    };
    if should_remove_topic {
      topic_client_ids_map.remove(&topic);
    }
  }
}

/// 清理客户端的全部主题订阅索引
#[allow(dead_code)]
pub async fn remove_client_topics(
  client_id: &str,
) {
  if client_id.is_empty() {
    return;
  }
  let topics = {
    let mut client_id_topics_map = client_id_topics_map().write().await;
    client_id_topics_map.remove(client_id).unwrap_or_default()
  };
  if topics.is_empty() {
    return;
  }
  let mut topic_client_ids_map = topic_client_ids_map().write().await;
  for topic in topics {
    let should_remove_topic = {
      let client_ids = match topic_client_ids_map.get_mut(&topic) {
        Some(client_ids) => client_ids,
        None => continue,
      };
      client_ids.retain(|item| item.as_str() != client_id);
      client_ids.is_empty()
    };
    if should_remove_topic {
      topic_client_ids_map.remove(&topic);
    }
  }
}

use tracing::error;
use serde_json::json;

use futures_util::SinkExt;

use poem::web::websocket::Message;

use crate::common::context::get_req_id;

use super::websocket_constants::{
  Callback,
  callbacks_map,
  socket_sink_map,
  client_id_topics_map,
};

/// 订阅主题topic
#[allow(dead_code)]
pub async fn subscribe(
  topic: String,
  callback: Callback,
) {
  if topic.is_empty() {
    error!("websocket.dao.subscribe {} topic is empty", get_req_id());
    return;
  }
  let mut callbacks_map = callbacks_map().write().await;
  let callbacks =  callbacks_map.get_mut(topic.as_str());
  if callbacks.is_none() {
    callbacks_map.insert(topic, vec![callback]);
  } else {
    let callbacks = callbacks.unwrap();
    callbacks.push(callback);
  }
}

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
  
  let callbacks_map = callbacks_map().read().await;
  let callbacks =  callbacks_map.get(topic.as_str());
  if let Some(callbacks) = callbacks {
    for callback in callbacks {
      callback(payload.clone());
    }
  }
  
  let client_id_topics_map = client_id_topics_map().read().await;
  
  let mut client_ids = vec![];
  for (client_id2, topics) in client_id_topics_map.iter() {
    if topics.contains(&topic) {
      client_ids.push(client_id2.clone());
    }
  }
  drop(client_id_topics_map);
  
  let socket_sink_map = {
    let socket_sink_map = socket_sink_map().lock().await;
    socket_sink_map.clone()
  };
  
  for client_id in client_ids {
    let sockets = socket_sink_map.get(&client_id).cloned();
    if sockets.is_none() {
      continue;
    }
    let sockets = sockets.unwrap();
    let mut sockets = sockets.lock().await;
    for socket in sockets.iter_mut() {
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

/// 同时取消订阅多个主题
#[allow(dead_code)]
pub async fn un_subscribes(
  topics: Vec<String>,
) {
  if topics.is_empty() {
    return;
  }
  let mut callbacks_map = callbacks_map().write().await;
  for topic in topics {
    callbacks_map.remove(topic.as_str());
  }
}

/// 取消订阅主题topic
#[allow(dead_code, unused_must_use)]
pub async fn un_subscribe(
  topic: &str,
  callback: Option<&Callback>,
) {
  if topic.is_empty() {
    error!("websocket.dao.unsubscribe {} topic is empty", get_req_id());
    return;
  }
  if callback.is_none() {
    let mut callbacks_map = callbacks_map().write().await;
    callbacks_map.remove(topic);
    return;
  }
  let callback = callback.unwrap();
  let mut callbacks_map = callbacks_map().write().await;
  let callbacks =  callbacks_map.get_mut(topic);
  if callbacks.is_none() {
    return;
  }
  let callbacks = callbacks.unwrap();
  let index = callbacks.iter().position(|x| std::ptr::eq(x.as_ref(), callback));
  if let Some(index) = index {
    callbacks.remove(index);
  }
}

/// 关闭客户端
#[allow(dead_code)]
pub async fn close_client() {
  let mut callbacks_map = callbacks_map().write().await;
  callbacks_map.clear();
}

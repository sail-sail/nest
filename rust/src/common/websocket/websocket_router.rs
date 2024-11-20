use std::sync::Arc;

use futures_util::{SinkExt, StreamExt};
use poem::{
  handler, IntoResponse, Response
};
use poem::web::websocket::{Message, WebSocket};
use poem::web::Query;
use poem::http::StatusCode;
use serde::Deserialize;
use serde_json::json;
use tracing::error;
use tokio::sync::Mutex;

use super::websocket_constants::SOCKET_SINK_MAP;
use super::websocket_constants::CLIENT_ID_TOPICS_MAP;
// use super::websocket_constants::CALLBACKS_MAP;

const PWD: &str = "0YSCBr1QQSOpOfi6GgH34A";

#[derive(Deserialize)]
pub struct UpgradeQuery {
  #[serde(rename = "clientId")]
  pub client_id: String,
  pub pwd: String,
}

#[handler]
pub async fn ws_upgrade(
  ws: WebSocket,
  Query(UpgradeQuery {
    client_id,
    pwd,
  }): Query<UpgradeQuery>,
) -> impl IntoResponse {
  if pwd != PWD {
    let mut response = Response::builder();
    return response.status(StatusCode::UNAUTHORIZED).body(
      json!({
        "code": 401,
        "data": "Unauthorized",
      })
      .to_string(),
    );
  }
  if client_id.is_empty() {
    let mut response = Response::builder();
    return response.status(StatusCode::BAD_REQUEST).body(
      json!({
        "code": 400,
        "data": "clientId is required!",
      })
      .to_string(),
    );
  }
  let web_socket_upgraded = ws.on_upgrade(
    |mut socket| async move {
      
      let (
        mut sink,
        mut stream,
      ) = socket.split();
      
      {
        let mut socket_sink_map = SOCKET_SINK_MAP.lock().await;
        let mut socket_olds = socket_sink_map.get(&client_id).cloned();
        if socket_olds.is_none() {
          socket_olds = Some(Arc::new(Mutex::new(vec![])));
          socket_sink_map.insert(
            client_id.clone(),
            socket_olds.clone().unwrap(),
          );
        }
        let mut socket_olds = socket_olds.unwrap();
        let mut socket_olds = socket_olds.lock().await;
        socket_olds.push(sink);
      }
      
      while let Some(result) = stream.next().await {
        match result {
          Ok(Message::Text(text)) => {
            if text.is_empty() {
              continue;
            }
            if text == "ping" {
              let mut socket_sink_map = SOCKET_SINK_MAP.lock().await;
              let sockets = socket_sink_map.get(&client_id).cloned();
              if let Some(sockets) = sockets {
                let mut sockets = sockets.lock().await;
                for socket in sockets.iter_mut() {
                  let _ = socket.send(
                    Message::Text("pong".to_owned()),
                  ).await;
                }
              }
              continue;
            }
            let obj = serde_json::from_str::<serde_json::Value>(&text);
            if let Err(e) = obj {
              error!("serde_json::from_str error: {}", e);
              continue;
            }
            let obj = obj.unwrap();
            let action = obj.get("action")
              .map(|action|
                serde_json::from_value::<String>(action.clone())
                  .unwrap_or("".to_owned())
              )
              .unwrap_or("".to_owned());
            let data = obj.get("data");
            if data.is_none() {
              continue;
            }
            let data = data.unwrap();
            if action == "subscribe" {
              let topics = data.get("topics");
              if topics.is_none() {
                continue;
              }
              let topics = topics.unwrap();
              let topics = serde_json::from_value::<Vec<String>>(topics.clone());
              if let Err(e) = topics {
                error!("serde_json::from_value error: {}", e);
                continue;
              }
              let topics = topics.unwrap();
              if topics.is_empty() {
                continue;
              }
              let mut client_id_topics_map = CLIENT_ID_TOPICS_MAP.lock().await;
              let old_topics = client_id_topics_map.get(&client_id).cloned();
              if old_topics.is_none() {
                client_id_topics_map.insert(client_id.clone(), vec![]);
              }
              let mut old_topics = old_topics.unwrap_or(vec![]);
              for topic in topics {
                if old_topics.contains(&topic) {
                  continue;
                }
                old_topics.push(topic.clone());
              }
              client_id_topics_map.insert(client_id.clone(), old_topics);
            } else if action == "publish" {
              let data = serde_json::from_value::<serde_json::Value>(data.clone());
              if let Err(e) = data {
                error!("serde_json::from_value error: {}", e);
                continue;
              }
              let data = data.unwrap();
              let topic = data.get("topic");
              if topic.is_none() {
                continue;
              }
              let topic = topic.unwrap();
              let topic = serde_json::from_value::<String>(topic.clone())
                .unwrap_or("".to_owned());
              if topic.is_empty() {
                continue;
              }
              // let payload = data.get("payload");
              // let payload = payload
              //   .map(|payload|
              //     serde_json::from_value::<String>(payload.clone())
              //       .unwrap_or("".to_owned())
              //   )
              //   .unwrap_or("".to_owned());
              // {
              //   let callbacks_map = CALLBACKS_MAP.lock().await;
              //   let callbacks = callbacks_map.get(&topic);
              //   if let Some(callbacks) = callbacks {
              //     for callback in callbacks {
              //       callback(payload.clone());
              //     }
              //   }
              // }
              
              let mut client_id_topics_map = CLIENT_ID_TOPICS_MAP.lock().await;
              let mut client_ids = vec![];
              for (client_id2, topics) in client_id_topics_map.iter() {
                // if client_id2 == &client_id {
                //   continue;
                // }
                if topics.contains(&topic) {
                  client_ids.push(client_id2.clone());
                }
              }
              if client_ids.is_empty() {
                continue;
              }
              drop(client_id_topics_map);
              let data_str = serde_json::to_string(&data);
              if let Err(e) = data_str {
                error!("serde_json::to_string error: {}", e);
                continue;
              }
              let data_str = data_str.unwrap();
              
              let socket_sink_map = {
                let socket_sink_map = SOCKET_SINK_MAP.lock().await;
                socket_sink_map.clone()
              };
              for client_id in client_ids {
                let sockets = socket_sink_map.get(&client_id).cloned();
                if let Some(sockets) = sockets {
                  let mut sockets = sockets.lock().await;
                  for socket in sockets.iter_mut() {
                    let err = socket.send(Message::Text(data_str.clone())).await;
                    if let Err(e) = err {
                      error!("socket.send error: {}", e);
                    }
                  }
                }
              }
            } else if action == "unSubscribe" {
              let topics = data.get("topics");
              if topics.is_none() {
                continue;
              }
              let topics = topics.unwrap();
              let topics = serde_json::from_value::<Vec<String>>(topics.clone());
              if let Err(e) = topics {
                error!("serde_json::from_value error: {}", e);
                continue;
              }
              let topics = topics.unwrap();
              if topics.is_empty() {
                continue;
              }
              let mut client_id_topics_map = CLIENT_ID_TOPICS_MAP.lock().await;
              let old_topics = client_id_topics_map.get(&client_id).cloned();
              if old_topics.is_none() {
                continue;
              }
              let mut old_topics = old_topics.unwrap_or(vec![]);
              for topic in topics {
                if !old_topics.contains(&topic) {
                  continue;
                }
                old_topics.retain(|x| x != &topic);
              }
              client_id_topics_map.insert(client_id.clone(), old_topics);
            }
          }
          Ok(Message::Binary(_)) => { }
          Ok(Message::Ping(_)) => {
            let sockets = {
              let socket_sink_map = SOCKET_SINK_MAP.lock().await;
              socket_sink_map.get(&client_id).cloned()
            };
            if let Some(sockets) = sockets {
              let mut sockets = sockets.lock().await;
              for socket in sockets.iter_mut() {
                let _ = socket.send(
                  Message::Pong("pong".as_bytes().to_vec()),
                ).await;
              }
            }
          }
          Ok(Message::Pong(_)) => { }
          Ok(Message::Close(_)) => {
            let mut socket_sink_map = SOCKET_SINK_MAP.lock().await;
            let socket_ref = socket_sink_map.remove(&client_id);
            if let Some(socket_ref) = socket_ref {
              let mut socket_ref = socket_ref.lock().await;
              let err = socket_ref.close().await;
              if let Err(e) = err {
                error!("socket_ref.close error: {}", e);
              }
            }
            let mut client_id_topics_map = CLIENT_ID_TOPICS_MAP.lock().await;
            client_id_topics_map.remove(&client_id);
          }
          Err(e) => {
            error!("websocket error: {}", e);
            let mut socket_sink_map = SOCKET_SINK_MAP.lock().await;
            let socket_ref = socket_sink_map.remove(&client_id);
            if let Some(socket_ref) = socket_ref {
              let mut socket_ref = socket_ref.lock().await;
              let err = socket_ref.close().await;
              if let Err(e) = err {
                error!("socket_ref.close error: {}", e);
              }
            }
            let mut client_id_topics_map = CLIENT_ID_TOPICS_MAP.lock().await;
            client_id_topics_map.remove(&client_id);
          }
        }
      }
    }
  );
  web_socket_upgraded.into_response()
}

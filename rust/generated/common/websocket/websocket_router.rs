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
use uuid::Uuid;

use super::websocket_dao::{
  add_socket_connection,
  get_socket_connections,
  remove_client_topics,
  remove_socket_connection,
  subscribe_client_topics,
  un_subscribe_client_topics,
};

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
      let connection_id = Uuid::new_v4().to_string();
      
      let (
        sink,
        mut stream,
      ) = socket.split();
      
      add_socket_connection(
        &client_id,
        &connection_id,
        sink,
      ).await;
      
      while let Some(result) = stream.next().await {
        match result {
          Ok(Message::Text(text)) => {
            if text.is_empty() {
              continue;
            }
            if text == "ping" {
              let sockets = get_socket_connections(
                &client_id,
              ).await;
              if let Some(sockets) = sockets {
                let mut sockets = sockets.lock().await;
                if let Some(socket) = sockets.get_mut(&connection_id) {
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
                  .unwrap_or_default()
              )
              .unwrap_or_default();
            let data = obj.get("data");
            if data.is_none() {
              continue;
            }
            let data = data.unwrap();
            if action == "subscribe" {
              let topics = data.get("topics");
              let topics = match topics {
                Some(topics) => topics,
                None => {
                  continue;
                }
              };
              let topics = serde_json::from_value::<Vec<String>>(topics.clone());
              let topics = match topics {
                Ok(topics) => topics,
                Err(e) => {
                  error!("serde_json::from_value error: {}", e);
                  continue;
                }
              };
              subscribe_client_topics(
                &client_id,
                &topics,
              ).await;
            }
            
            // else if action == "publish" {
            //   let data = serde_json::from_value::<serde_json::Value>(data.clone());
            //   let data = match data {
            //     Ok(data) => data,
            //     Err(e) => {
            //       error!("serde_json::from_value error: {}", e);
            //       continue;
            //     }
            //   };
            //   let topic = data.get("topic");
            //   let topic = match topic {
            //     Some(topic) => topic,
            //     None => {
            //       continue;
            //     }
            //   };
            //   let topic = serde_json::from_value::<String>(topic.to_owned())
            //     .unwrap_or_default();
            //   if topic.is_empty() {
            //     continue;
            //   }
            //   let payload = data.get("payload");
            //   {
            //     let callbacks_map = callbacks_map().read().await;
            //     let callbacks = callbacks_map.get(&topic);
            //     if let Some(callbacks) = callbacks {
            //       for callback in callbacks {
            //         callback(payload.cloned());
            //       }
            //     }
            //   }
              
            //   let mut client_id_topics_map = client_id_topics_map().write().await;
            //   let mut client_ids = vec![];
            //   for (client_id2, topics) in client_id_topics_map.iter() {
            //     // if client_id2 == &client_id {
            //     //   continue;
            //     // }
            //     if topics.contains(&topic) {
            //       client_ids.push(client_id2.clone());
            //     }
            //   }
            //   if client_ids.is_empty() {
            //     continue;
            //   }
            //   drop(client_id_topics_map);
            //   let data_str = serde_json::to_string(&data);
            //   if let Err(e) = data_str {
            //     error!("serde_json::to_string error: {}", e);
            //     continue;
            //   }
            //   let data_str = data_str.unwrap();
              
            //   let socket_sink_map = {
            //     let socket_sink_map = socket_sink_map().lock().await;
            //     socket_sink_map.clone()
            //   };
            //   for client_id in client_ids {
            //     let sockets = socket_sink_map.get(&client_id).cloned();
            //     if let Some(sockets) = sockets {
            //       let mut sockets = sockets.lock().await;
            //       for socket in sockets.iter_mut() {
            //         let err = socket.send(Message::Text(data_str.clone())).await;
            //         if let Err(e) = err {
            //           error!("socket.send error: {}", e);
            //         }
            //       }
            //     }
            //   }
            // }
            
            else if action == "unSubscribe" {
              let topics = data.get("topics");
              let topics = match topics {
                Some(topics) => topics,
                None => {
                  continue;
                }
              };
              let topics = serde_json::from_value::<Vec<String>>(topics.clone());
              let topics = match topics {
                Ok(topics) => topics,
                Err(e) => {
                  error!("serde_json::from_value error: {}", e);
                  continue;
                }
              };
              if topics.is_empty() {
                continue;
              }
              un_subscribe_client_topics(
                &client_id,
                &topics,
              ).await;
            } else {
              tracing::info!("websocket_router message unknown action: {action}");
              continue;
            }
          }
          Ok(Message::Binary(_)) => { }
          Ok(Message::Ping(_)) => {
            let sockets = get_socket_connections(
              &client_id,
            ).await;
            if let Some(sockets) = sockets {
              let mut sockets = sockets.lock().await;
              if let Some(socket) = sockets.get_mut(&connection_id) {
                let _ = socket.send(
                  Message::Pong("pong".as_bytes().to_vec()),
                ).await;
              }
            }
          }
          Ok(Message::Pong(_)) => { }
          Ok(Message::Close(_)) => {
            break;
          }
          Err(_e) => {
            break;
          }
        }
      }
      let left_len = remove_socket_connection(
        &client_id,
        &connection_id,
      ).await;
      if left_len == 0 {
        remove_client_topics(
          &client_id,
        ).await;
      }
    }
  );
  web_socket_upgraded.into_response()
}

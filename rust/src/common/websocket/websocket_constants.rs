use std::collections::HashMap;
use futures_util::stream::SplitSink;
use tokio::sync::Mutex;
use lazy_static::lazy_static;
use std::sync::Arc;

use poem::web::websocket::{Message, WebSocketStream};

type Callback = Box<dyn Fn(String) + Send + Sync>;

type SocketSinkMapType = Mutex<HashMap<String, Arc<Mutex<Vec<SplitSink<WebSocketStream, Message>>>>>>;

lazy_static! {
  pub static ref CALLBACKS_MAP: Mutex<HashMap<String, Vec<Callback>>> = Mutex::new(HashMap::new());
  pub static ref SOCKET_SINK_MAP: SocketSinkMapType = Mutex::new(HashMap::new());
  pub static ref CLIENT_ID_TOPICS_MAP: Mutex<HashMap<String, Vec<String>>> = Mutex::new(HashMap::new());
}

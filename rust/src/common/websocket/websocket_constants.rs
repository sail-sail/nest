use std::collections::HashMap;
use futures_util::stream::SplitSink;
use tokio::sync::Mutex;
use tokio::sync::RwLock;
use lazy_static::lazy_static;
use std::sync::Arc;

use poem::web::websocket::{Message, WebSocketStream};

pub type Callback = Box<dyn Fn(Option<serde_json::Value>) + Send + Sync>;

pub type SocketSinkMapType = Mutex<HashMap<String, Arc<Mutex<Vec<SplitSink<WebSocketStream, Message>>>>>>;

lazy_static! {
  pub static ref CALLBACKS_MAP: RwLock<HashMap<String, Vec<Callback>>> = RwLock::new(HashMap::new());
  pub static ref SOCKET_SINK_MAP: SocketSinkMapType = Mutex::new(HashMap::new());
  pub static ref CLIENT_ID_TOPICS_MAP: RwLock<HashMap<String, Vec<String>>> = RwLock::new(HashMap::new());
}

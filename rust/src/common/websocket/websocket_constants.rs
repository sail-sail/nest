use std::collections::HashMap;

use std::sync::OnceLock;
use std::sync::Arc;

use futures_util::stream::SplitSink;
use tokio::sync::Mutex;
use tokio::sync::RwLock;

use poem::web::websocket::{Message, WebSocketStream};

pub type Callback = Box<dyn Fn(Option<serde_json::Value>) + Send + Sync>;

pub type SocketSinkMapType = Mutex<HashMap<String, Arc<Mutex<Vec<SplitSink<WebSocketStream, Message>>>>>>;

static CALLBACKS_MAP: OnceLock<RwLock<HashMap<String, Vec<Callback>>>> = OnceLock::new();
static SOCKET_SINK_MAP: OnceLock<SocketSinkMapType> = OnceLock::new();
static CLIENT_ID_TOPICS_MAP: OnceLock<RwLock<HashMap<String, Vec<String>>>> = OnceLock::new();

pub fn callbacks_map() -> &'static RwLock<HashMap<String, Vec<Callback>>> {
  CALLBACKS_MAP.get_or_init(|| RwLock::new(HashMap::new()))
}
pub fn socket_sink_map() -> &'static SocketSinkMapType {
  SOCKET_SINK_MAP.get_or_init(|| Mutex::new(HashMap::new()))
}
pub fn client_id_topics_map() -> &'static RwLock<HashMap<String, Vec<String>>> {
  CLIENT_ID_TOPICS_MAP.get_or_init(|| RwLock::new(HashMap::new()))
}


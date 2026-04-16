use std::collections::HashMap;

use std::sync::OnceLock;
use std::sync::Arc;

use futures_util::stream::SplitSink;
use tokio::sync::Mutex;
use tokio::sync::RwLock;

use poem::web::websocket::{Message, WebSocketStream};

pub type SocketSinkType = SplitSink<WebSocketStream, Message>;
pub type ClientSocketSinksType = Arc<Mutex<HashMap<String, SocketSinkType>>>;
pub type SocketSinkMapType = Mutex<HashMap<String, ClientSocketSinksType>>;
pub type ClientIdTopicsMapType = RwLock<HashMap<String, Vec<String>>>;
pub type TopicClientIdsMapType = RwLock<HashMap<String, Vec<String>>>;

static SOCKET_SINK_MAP: OnceLock<SocketSinkMapType> = OnceLock::new();
static CLIENT_ID_TOPICS_MAP: OnceLock<ClientIdTopicsMapType> = OnceLock::new();
static TOPIC_CLIENT_IDS_MAP: OnceLock<TopicClientIdsMapType> = OnceLock::new();

pub fn socket_sink_map() -> &'static SocketSinkMapType {
  SOCKET_SINK_MAP.get_or_init(|| Mutex::new(HashMap::new()))
}
pub fn client_id_topics_map() -> &'static ClientIdTopicsMapType {
  CLIENT_ID_TOPICS_MAP.get_or_init(|| RwLock::new(HashMap::new()))
}
pub fn topic_client_ids_map() -> &'static TopicClientIdsMapType {
  TOPIC_CLIENT_IDS_MAP.get_or_init(|| RwLock::new(HashMap::new()))
}


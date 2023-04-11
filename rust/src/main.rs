#![forbid(unsafe_code)]

#[macro_use]
extern crate derive_new;

#[macro_use]
extern crate dotenv_codegen;

#[macro_use]
extern crate lazy_static;

mod common;
mod gen;
mod src;

use async_graphql::{
  EmptyMutation, EmptySubscription, Schema,
};
use poem::{
  get, post,
  listener::TcpListener,
  EndpointExt, Route, Server,
};

use dotenv::dotenv;
use tracing::info;

// use crate::common::oss::oss_dao;
use crate::common::gql::query_root::Query;

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
  dotenv().ok();
  if std::env::var_os("RUST_LOG").is_none() {
    std::env::set_var("RUST_LOG", "rust=info");
  }
  tracing_subscriber::fmt::init();
  
  // oss
  // match oss_dao::create_bucket(&oss_dao::new_bucket().unwrap()).await {
  //   Ok(_) => {
  //   },
  //   Err(_e) => {
  //   }
  // }
  
  let schema = Schema::build(
    Query::default(),
    EmptyMutation,
    EmptySubscription
  )
    .finish();
  
  if cfg!(debug_assertions) {
    // println!("{}", &schema.sdl());
    println!("{}", "---------------------------");
  }
  
  let app = {
    let mut app = Route::new();
    if cfg!(debug_assertions) {
      app = app.at("/graphiql", get(common::gql::gql_router::graphql_playground));
    }
    app = app.at("/graphql", post(common::gql::gql_router::graphql_handler));
    app = app.at("/api/oss/upload", post(common::oss::oss_router::upload));
    app = app.at("/api/oss/download/:filename", get(common::oss::oss_router::download));
    app
  };
  let app = app
    .data(schema)
    ;
  
  let server_port = dotenv!("server_port");
  let server_host = dotenv!("server_host");
  
  info!("app started: {}", server_port);
  
  Server::new(TcpListener::bind(format!("{server_host}:{server_port}")))
    .run(app)
    .await
}

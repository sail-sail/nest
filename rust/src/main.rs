#![forbid(unsafe_code)]

// Use Jemalloc only for musl-64 bits platforms
#[cfg(all(target_env = "musl", target_pointer_width = "64"))]
#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;

#[macro_use]
extern crate derive_new;

#[macro_use]
extern crate lazy_static;

#[macro_use]
extern crate app_macro;

mod common;
mod gen;
mod src;

use std::env;
use async_graphql::{
  EmptySubscription, Schema,
};
use poem::{
  get, post,
  listener::TcpListener,
  EndpointExt, Route, Server,
};

use dotenv::dotenv;
use tracing::info;

use crate::common::oss::oss_dao;
use crate::common::gql::query_root::{Query, QuerySchema, Mutation};

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
  dotenv().ok();
  if std::env::var_os("RUST_LOG").is_none() {
    std::env::set_var("RUST_LOG", "server=info");
  }
  tracing_subscriber::fmt::init();
  
  // oss
  tokio::spawn(async move {
    match oss_dao::init().await {
      Ok(_) => {},
      Err(_) => {},
    };
  });
  
  let schema: QuerySchema = Schema::build(
    Query::default(),
    Mutation::default(),
    EmptySubscription
  )
    .finish();
  
  #[cfg(debug_assertions)]
  {
    let file = "src/common/gql/schema.graphql";
    let schema = schema.sdl();
    let old_schema = {
      if std::path::Path::new(file).exists() {
        std::fs::read_to_string(file).unwrap()
      } else {
        "".to_string()
      }
    };
    if old_schema != schema {
      info!("write graphql schema");
      match std::fs::write(file, &schema) {
        Ok(_) => {},
        Err(e) => {
          info!("write graphql schema error: {}", e);
        },
      }
    }
  }
  
  let app = {
    let mut app = Route::new();
    #[cfg(debug_assertions)]
    {
      app = app.at("/graphiql", get(common::gql::gql_router::graphql_playground));
    }
    app = app.at("/graphql",
      post(common::gql::gql_router::graphql_handler)
      .get(common::gql::gql_router::graphql_handler_get)
    );
    app = app.at("/api/oss/upload", post(common::oss::oss_router::upload));
    app = app.at("/api/oss/delete", post(common::oss::oss_router::delete));
    app = app.at("/api/oss/download/:filename", get(common::oss::oss_router::download_filename));
    app = app.at("/api/oss/download/", get(common::oss::oss_router::download));
    app
  };
  let app = app
    .data(schema)
    ;
  
  let server_port = env::var("server_port").unwrap_or("4001".to_owned());
  let server_host = env::var("server_host").unwrap_or("127.0.0.1".to_owned());
  
  info!("app started: {}", server_port);
  
  Server::new(TcpListener::bind(format!("{server_host}:{server_port}")))
    .run(app)
    .await
}

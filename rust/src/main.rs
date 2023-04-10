#![forbid(unsafe_code)]

#[macro_use]
extern crate derive_new;

#[macro_use]
extern crate dotenv_codegen;

mod common;
mod gen;
mod src;

use std::num::ParseIntError;

use sqlx::mysql::{MySqlPoolOptions, MySqlConnectOptions};
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

use crate::common::oss::oss_dao;
use crate::common::{gql::query_root::Query, auth::auth_model::ServerTokentimeout};

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
  dotenv().ok();
  if std::env::var_os("RUST_LOG").is_none() {
    std::env::set_var("RUST_LOG", "rust=info");
  }
  tracing_subscriber::fmt::init();
  
  let database_hostname = dotenv!("database_hostname");
  let database_port = dotenv!("database_port");
  let database_port: Result<u16, ParseIntError> = database_port.parse();
  let database_port = database_port.or_else(|_| Ok::<u16, ParseIntError>(3306)).unwrap();
  let database_username = dotenv!("database_username");
  let database_password = dotenv!("database_password");
  let database_database = dotenv!("database_database");
  let database_pool_size = dotenv!("database_pool_size");
  let default_pool_size: u32 = 10;
  let database_pool_size: Result<u32, ParseIntError> = database_pool_size.parse();
  let database_pool_size = database_pool_size.or_else(|_| Ok::<u32, ParseIntError>(default_pool_size)).unwrap();
  let mysql_url = format!("mysql://{database_username}:xxxxx@{database_hostname}:{database_port}/{database_database}");
  
  info!("mysql_url: {}", &mysql_url);
  
  let pool = MySqlPoolOptions::new()
    .max_connections(database_pool_size)
    // .after_connect(|conn, _meta| Box::pin(async move {
    //   sqlx::query("SET NAMES utf8mb4;").execute(conn).await?;
    //   Ok(())
    // }))
    .connect_lazy_with(
      MySqlConnectOptions::new()
        .host(&database_hostname)
        .port(database_port)
        .username(&database_username)
        .password(&database_password)
        .database(&database_database)
    );
    
  // redis cache
  let cache_hostname = dotenv!("cache_hostname");
  let cache_port = dotenv!("cache_port");
  let cache_db = dotenv!("cache_db");
  let manager = redis::Client::open(
    format!("redis://{}:{}/{}", cache_hostname, cache_port, cache_db)
  ).unwrap();
  let cache_pool: r2d2::Pool<redis::Client>  = r2d2::Pool::builder()
    .build(manager)
    .unwrap();
  
  // oss
  match oss_dao::create_bucket(&oss_dao::new_bucket().unwrap()).await {
    Ok(_) => {
    },
    Err(_e) => {
    }
  }
  
  let schema = Schema::build(
    Query::default(),
    EmptyMutation,
    EmptySubscription
  ).data(pool)
    .data(cache_pool.clone())
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
  let app = app.data(cache_pool)
    .data(schema);
  
  let server_port = dotenv!("server_port");
  let server_host = dotenv!("server_host");
  
  info!("app started: {}", server_port);
  
  Server::new(TcpListener::bind(format!("{server_host}:{server_port}")))
    .run(app)
    .await
}

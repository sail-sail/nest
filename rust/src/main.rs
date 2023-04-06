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
  http::{playground_source, GraphQLPlaygroundConfig},
  EmptyMutation, EmptySubscription, Request, Response, Schema,
};
use poem::{
  get, post, handler,
  listener::TcpListener,
  web::{Data, Html, Json},
  EndpointExt, IntoResponse, Route, Server,
};

use dotenv::dotenv;

use crate::common::gql::query_root::{QuerySchema, Query};

#[handler]
async fn graphql_handler(
  schema: Data<&QuerySchema>,
  data: Json<Request>,
  req: &poem::Request,
) -> Json<Response> {
  let mut gql_req = data.0;
  if let Some(authorization) = req.header("authorization") {
    gql_req = gql_req.data(common::auth::auth_model::AuthInfo {
      token: Some(authorization.to_owned()),
    });
  }
  Json(schema.execute(gql_req).await)
}

#[handler]
fn graphql_playground(
) -> impl IntoResponse {
  Html(playground_source(GraphQLPlaygroundConfig::new("/graphql").with_header("a", "bbb")))
}

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
  // let mysql_url = format!("mysql://{database_username}:{database_password}@{database_hostname}:{database_port}/{database_database}");
  
  // info!("mysql_url: {}", &mysql_url);
  
  let server_tokentimeout = dotenv!("server_tokentimeout").parse::<i64>().unwrap();
  
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

  let schema = Schema::build(
    Query::default(),
    EmptyMutation,
    EmptySubscription
  ).data(pool)
    .data(common::auth::auth_model::ServerTokentimeout(server_tokentimeout))
    .finish();
  
  if cfg!(debug_assertions) {
    // println!("{}", &schema.sdl());
    println!("{}", "---------------------------");
  }
  
  let app = Route::new()
    .at("/graphiql", get(graphql_playground))
    .at("/graphql", post(graphql_handler))
    .data(schema);

  println!("Playground: http://localhost:3000");

  Server::new(TcpListener::bind("127.0.0.1:3000"))
    .run(app)
    .await
}
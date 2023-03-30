mod common;

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

use crate::common::gql::query_root::{QuerySchema, Query};

#[handler]
async fn graphql_handler(schema: Data<&QuerySchema>, req: Json<Request>) -> Json<Response> {
  Json(schema.execute(req.0).await)
}

#[handler]
fn graphql_playground() -> impl IntoResponse {
  Html(playground_source(GraphQLPlaygroundConfig::new("/graphql").with_header("a", "bbb")))
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
  if std::env::var_os("RUST_LOG").is_none() {
    std::env::set_var("RUST_LOG", "poem=debug");
  }
  tracing_subscriber::fmt::init();

  let schema = Schema::build(Query, EmptyMutation, EmptySubscription)
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
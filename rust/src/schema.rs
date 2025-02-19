#![forbid(unsafe_code)]
#![recursion_limit="512"]

mod common;
mod gen;
mod src;

use async_graphql::{
  EmptySubscription, Schema,
};

use crate::common::gql::query_root::{Query, QuerySchema, Mutation};

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
  let schema: QuerySchema = Schema::build(
    Query::default(),
    Mutation::default(),
    EmptySubscription
  ).finish();
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
    println!("write graphql schema");
    match std::fs::write(file, &schema) {
      Ok(_) => {},
      Err(e) => {
        println!("write graphql schema error: {}", e);
      },
    }
  }
  Ok(())
}

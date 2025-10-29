#![forbid(unsafe_code)]
#![recursion_limit="512"]

use async_graphql::{
  EmptySubscription, Schema,
};

use app::{Query, QuerySchema, Mutation};

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
  let schema: QuerySchema = Schema::build(
    Query::default(),
    Mutation::default(),
    EmptySubscription
  ).finish();
  let file = "generated/common/gql/schema.graphql";
  let schema = schema.sdl();
  let old_schema = {
    if std::path::Path::new(file).exists() {
      std::fs::read_to_string(file).unwrap()
    } else {
      String::new()
    }
  };
  if old_schema != schema {
    println!("write graphql schema");
    match std::fs::write(file, &schema) {
      Ok(()) => {},
      Err(e) => {
        println!("write graphql schema error: {e:#?}");
      },
    }
  }
  Ok(())
}

use poem::{
  handler, IntoResponse,
  web::{Data, Html, Json},
};

use async_graphql::{
  http::{playground_source, GraphQLPlaygroundConfig},
  Request, Response,
};

use crate::common::gql::query_root::QuerySchema;

#[handler]
pub async fn graphql_handler(
  schema: Data<&QuerySchema>,
  data: Json<Request>,
  req: &poem::Request,
) -> Json<Response> {
  let mut gql_req = data.0;
  if let Some(authorization) = req.header("authorization") {
    gql_req = gql_req.data(
      crate::common::auth::auth_model::AuthInfo {
        token: Some(authorization.to_owned()),
      },
    );
  }
  Json(schema.execute(gql_req).await)
}

#[cfg(debug_assertions)]
#[handler]
pub fn graphql_playground(
) -> impl IntoResponse {
  Html(
    playground_source(
      GraphQLPlaygroundConfig::new("/graphql")
    )
  )
}

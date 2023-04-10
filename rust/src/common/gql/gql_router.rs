use poem::{
  handler, IntoResponse, Response,
  web::{Data, Html, Json},
};

use poem::http::{StatusCode, header};

use async_graphql::{
  Request,
  http::{playground_source, GraphQLPlaygroundConfig},
};

use crate::common::auth::auth_model::{AUTHORIZATION, AuthToken};

use crate::common::gql::query_root::QuerySchema;

#[handler]
pub async fn graphql_handler(
  schema: Data<&QuerySchema>,
  data: Json<Request>,
  req: &poem::Request,
) -> Response {
  let mut gql_req = data.0;
  match req.header(AUTHORIZATION).map(ToString::to_string) {
    None => { },
    Some(auth_token) => {
      gql_req = gql_req.data::<AuthToken>(auth_token);
    },
  }
  let gql_res = schema.execute(gql_req).await;
  let data = match serde_json::to_vec(&gql_res) {
    Ok(data) => data,
    Err(err) => {
      return Response::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body(err.to_string())
    }
  };
  let mut response = Response::builder()
    .header(header::CONTENT_TYPE, "application/json; charset=utf-8")
    .body(data);
  let headers = response.headers_mut();
  for (key, value) in gql_res.http_headers.iter() {
    headers.insert(key, value.to_owned());
  }
  response
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

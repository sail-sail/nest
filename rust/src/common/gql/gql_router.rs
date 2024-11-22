use std::time::Instant;

use tracing::error;

use poem::{
  handler, Response,
  web::{Data, Json, Query},
};

use poem::http::{StatusCode, header};

use async_graphql::{
  Request, Variables,
};

use crate::common::auth::auth_model::{AUTHORIZATION, AuthToken};

use crate::common::gql::query_root::QuerySchema;

use super::request_id::handle_request_id;

#[derive(serde::Deserialize)]
#[allow(non_snake_case)]
pub struct AuthTokenParam {
  pub Authorization: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
#[allow(non_snake_case)]
pub struct GglParams {
  pub query: String,
  pub variables: Option<String>,
  pub Authorization: Option<String>,
}

#[handler]
pub async fn graphql_handler_get(
  schema: Data<&QuerySchema>,
  Query(gql_params): Query<GglParams>,
  req: &poem::Request,
) -> Response {
  // x-request-id
  let request_id = req.header("x-request-id")
    .map(ToString::to_string);
  if let Some(res) = handle_request_id(request_id).await {
    return res;
  }
  // IP地址
  let ip = match req.header("x-real-ip") {
    Some(ip) => ip.to_string(),
    None => "127.0.0.1".to_string(),
  };
  let ip = crate::common::gql::model::Ip(ip);
  
  let query = gql_params.query.replace("\\n", " ");
  let mut gql_req = Request::new(query);
  match req.header(AUTHORIZATION).map(ToString::to_string) {
    None => {
      if let Some(auth_token) = gql_params.Authorization {
        gql_req = gql_req.data::<AuthToken>(auth_token);
      }
    },
    Some(auth_token) => {
      gql_req = gql_req.data::<AuthToken>(auth_token);
    },
  }
  gql_req = gql_req.data::<crate::common::gql::model::Ip>(ip);
  if let Some(variables) = gql_params.variables {
    let variables = match serde_json::from_str::<Variables>(&variables) {
      Ok(variables) => variables,
      Err(err) => {
        error!("{}", err);
        return Response::builder()
          .status(StatusCode::INTERNAL_SERVER_ERROR)
          .body(err.to_string())
      }
    };
    gql_req = gql_req.variables(variables);
  }
  let gql_res = schema.execute(gql_req).await;
  let data = match serde_json::to_vec(&gql_res) {
    Ok(data) => data,
    Err(err) => {
      error!("{}", err);
      return Response::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body(err.to_string())
    }
  };
  let mut response = Response::builder()
    .header(header::CONTENT_TYPE, "application/json; charset=utf-8")
    .body(data);
  response
}

#[handler]
pub async fn graphql_handler(
  schema: Data<&QuerySchema>,
  Query(token_param): Query<AuthTokenParam>,
  data: Json<Request>,
  req: &poem::Request,
) -> Response {
  // x-request-id
  let request_id = req.header("x-request-id")
    .map(ToString::to_string);
  if let Some(res) = handle_request_id(request_id).await {
    return res;
  }
  // IP地址
  let ip = match req.header("x-real-ip") {
    Some(ip) => ip.to_string(),
    None => "127.0.0.1".to_string(),
  };
  let ip = crate::common::gql::model::Ip(ip);
  
  let now0 = Instant::now();
  let mut gql_req = data.0;
  match req.header(AUTHORIZATION).map(ToString::to_string) {
    None => {
      if let Some(auth_token) = token_param.Authorization {
        gql_req = gql_req.data::<AuthToken>(auth_token);
      }
    },
    Some(auth_token) => {
      gql_req = gql_req.data::<AuthToken>(auth_token);
    },
  }
  gql_req = gql_req.data::<crate::common::gql::model::Ip>(ip);
  // info!(
  //   "{query}",
  //   query = gql_req.query,
  // );
  // let query = gql_req.query.clone();
  let gql_res = schema.execute(gql_req).await;
  // if gql_res.is_err() {
  //   for err in &gql_res.errors {
  //     error!("{}: {}", query, err);
  //   }
  // }
  let data = match serde_json::to_vec(&gql_res) {
    Ok(data) => data,
    Err(err) => {
      error!("{}", err);
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
  let now1 = Instant::now();
  let response_time = format!("app;dur={}", now1.saturating_duration_since(now0).as_millis());
  let response_time = poem::http::header::HeaderValue::from_str(&response_time);
  let response_time = match response_time {
    Ok(response_time) => response_time,
    Err(err) => {
      error!("{}", err);
      return Response::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body(err.to_string())
    }
  };
  headers.insert("Server-Timing", response_time);
  response
}

#[cfg(debug_assertions)]
#[handler]
pub fn graphql_playground(
) -> impl poem::IntoResponse {
  poem::web::Html(
    async_graphql::http::playground_source(
      async_graphql::http::GraphQLPlaygroundConfig::new("/graphql")
    )
  )
}

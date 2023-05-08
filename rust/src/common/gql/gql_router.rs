use tracing::error;

use poem::{
  handler, IntoResponse, Response,
  web::{Data, Html, Json, Query},
};

use poem::http::{StatusCode, header};

use async_graphql::{
  Request, Variables,
  http::{playground_source, GraphQLPlaygroundConfig},
};

use crate::common::auth::auth_model::{AUTHORIZATION, AuthToken};

use crate::common::gql::query_root::QuerySchema;

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
  let query = gql_params.query.replace("\\n", " ");
  let mut gql_req = Request::new(query);
  match req.header(AUTHORIZATION).map(ToString::to_string) {
    None => {
      match gql_params.Authorization {
        Some(auth_token) => {
          gql_req = gql_req.data::<AuthToken>(auth_token);
        },
        None => { },
      }
    },
    Some(auth_token) => {
      gql_req = gql_req.data::<AuthToken>(auth_token);
    },
  }
  match gql_params.variables {
    Some(variables) => {
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
    },
    None => { },
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
  let headers = response.headers_mut();
  for (key, value) in gql_res.http_headers.iter() {
    headers.insert(key, value.to_owned());
  }
  response
}

#[handler]
pub async fn graphql_handler(
  schema: Data<&QuerySchema>,
  Query(token_param): Query<AuthTokenParam>,
  data: Json<Request>,
  req: &poem::Request,
) -> Response {
  let mut gql_req = data.0;
  match req.header(AUTHORIZATION).map(ToString::to_string) {
    None => {
      match token_param.Authorization {
        Some(auth_token) => {
          gql_req = gql_req.data::<AuthToken>(auth_token);
        },
        None => { },
      }
    },
    Some(auth_token) => {
      gql_req = gql_req.data::<AuthToken>(auth_token);
    },
  }
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

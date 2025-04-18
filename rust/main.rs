#![forbid(unsafe_code)]
#![recursion_limit="512"]

#[cfg(not(target_env = "msvc"))]
#[global_allocator]
static GLOBAL: tikv_jemallocator::Jemalloc = tikv_jemallocator::Jemalloc;

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

use generated::common::auth::auth_model::{AUTHORIZATION, AuthToken};
use generated::common::gql::request_id::handle_request_id;

use std::env;
use async_graphql::{
  EmptySubscription, Schema,
};
use poem::{
  get, post,
  listener::TcpListener,
  middleware::{CatchPanic, TokioMetrics, Tracing},
  EndpointExt, Route, Server,
};
use generated::common::gql::server_timing::ServerTiming;

use dotenv::dotenv;
use tracing::info;

use generated::common::oss::oss_dao;
use generated::common::tmpfile::tmpfile_dao;

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
  schema: Data<&app::QuerySchema>,
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
  let ip = generated::common::gql::model::Ip(ip);
  
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
  gql_req = gql_req.data::<generated::common::gql::model::Ip>(ip);
  
  // client_tenant_id
  let client_tenant_id = req.header("TenantId")
    .map(generated::common::auth::auth_model::ClientTenantId::from);
  if let Some(client_tenant_id) = client_tenant_id {
    gql_req = gql_req.data::<generated::common::auth::auth_model::ClientTenantId>(client_tenant_id);
  }
  
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
  Response::builder()
    .header(header::CONTENT_TYPE, "application/json; charset=utf-8")
    .body(data)
}

#[handler]
pub async fn graphql_handler(
  schema: Data<&app::QuerySchema>,
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
  let ip = generated::common::gql::model::Ip(ip);
  
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
  gql_req = gql_req.data::<generated::common::gql::model::Ip>(ip);
  
  // client_tenant_id
  let client_tenant_id = req.header("TenantId")
    .map(generated::common::auth::auth_model::ClientTenantId::from);
  if let Some(client_tenant_id) = client_tenant_id {
    gql_req = gql_req.data::<generated::common::auth::auth_model::ClientTenantId>(client_tenant_id);
  }
  
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

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
  dotenv().unwrap();
  let server_title = std::env::var_os("server_title").expect("server_title not found in .env");
  let server_title = server_title.to_str().unwrap();
  let package_name = env!("CARGO_PKG_NAME");
  // if std::env::var_os("RUST_LOG").is_none() {
  //   std::env::set_var("RUST_LOG", format!("{}=info", package_name));
  // }
  // if std::env::var_os("RUST_BACKTRACE").is_none() {
  //   std::env::set_var("RUST_BACKTRACE", "1");
  // }
  let git_hash = std::env::var_os("GIT_HASH");
  if let Some(git_hash) = git_hash {
    let git_hash = git_hash.to_str().unwrap();
    info!("git_hash: {git_hash}");
  }
  let package_name2: &'static str = Box::leak(format!("{}::", package_name).into_boxed_str());
  let common_name2: &'static str = Box::leak(format!("{}::common::", package_name).into_boxed_str());
  
  #[cfg(debug_assertions)]
  let _guard = {
    color_eyre::config::HookBuilder::default()
      .add_frame_filter(Box::new(move |frames| {
        frames.retain(|frame| {
          let name = if let Some(name) = frame.name.as_ref() {
            name.as_str()
          } else {
            return true;
          };
          name.starts_with(package_name2) && !name.starts_with(common_name2)
        });
      }))
      .install()
      .unwrap();
    let log_path = std::env::var_os("log_path");
    if log_path.is_none() {
      tracing_subscriber::fmt::init();
      None
    } else {
      let log_path = log_path.unwrap();
      let file_appender = tracing_appender::rolling::daily(
        log_path,
        format!("{}.log", server_title).as_str(),
      );
      let (non_blocking, guard) = tracing_appender::non_blocking(file_appender);
      tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .with_writer(non_blocking)
        .with_ansi(false)
        .init();
      Some(guard)
    }
  };
  
  #[cfg(not(debug_assertions))]
  let _guard = {
    color_eyre::config::HookBuilder::default()
      .add_frame_filter(Box::new(move |frames| {
        frames.retain(|frame| {
          let name = if let Some(name) = frame.name.as_ref() {
            name.as_str()
          } else {
            return true;
          };
          name.starts_with(package_name2) && !name.starts_with(common_name2)
        });
      }))
      .install()
      .unwrap();
    let log_path = std::env::var_os("log_path");
    if log_path.is_none() {
      tracing_subscriber::fmt()
        .with_ansi(false)
        .init();
      None
    } else {
      let log_path = log_path.unwrap();
      let file_appender = tracing_appender::rolling::daily(
        log_path,
        format!("{}.log", server_title).as_str(),
      );
      let (non_blocking, guard) = tracing_appender::non_blocking(file_appender);
      tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .with_writer(non_blocking)
        .with_ansi(false)
        .init();
      Some(guard)
    }
  };
  
  // oss, tmpfile
  tokio::spawn(async move {
    if let Err(_err) = oss_dao::init().await {
      // println!("oss_dao::init() error: {}", err);
    }
    if let Err(_err) = tmpfile_dao::init().await {
      // println!("tmpfile_dao::init() error: {}", err);
    }
  });
  
  let schema: app::QuerySchema = Schema::build(
    app::Query::default(),
    app::Mutation::default(),
    EmptySubscription
  )
    .finish();
  
  #[cfg(debug_assertions)]
  {
    let file_path = "generated/common/gql/schema.graphql";
    let schema = schema.sdl();
    let mut is_equal = true;
    let file = std::fs::File::open(file_path).ok();
    let size = {
      if file.is_none() {
        0
      } else {
        let file = file.unwrap();
        let metadata = file.metadata().ok();
        if metadata.is_none() {
          0
        } else {
          metadata.unwrap().len()
        }
      }
    };
    if size != schema.len() as u64 {
      is_equal = false;
    } else {
      let old_schema = {
        if std::path::Path::new(file_path).exists() {
          std::fs::read_to_string(file_path).unwrap()
        } else {
          "".to_string()
        }
      };
      if old_schema != schema {
        is_equal = false;
      }
    }
    if !is_equal {
      use std::io::Write;
      let mut writer = std::io::BufWriter::new(std::fs::File::create(file_path).unwrap());
      writer.write_all(schema.as_bytes()).unwrap();
    }
    let status = std::process::Command::new("node")
      .arg("node_modules/@graphql-codegen/cli/cjs/bin.js")
      .arg("--config")
      .arg("generated/common/script/graphql_codegen_config.ts")
      .arg("--watch")
      .spawn();

    match status {
      Ok(_) => (),
      Err(err) => eprintln!("Failed to run process: {}", err),
    }
  }
  
  let metrics_graphql = TokioMetrics::new();
  
  let app = {
    let mut app = Route::new();
    #[cfg(debug_assertions)]
    {
      app = app.at("/graphiql", get(graphql_playground));
    }
    
    app = app.at("/metrics/graphql", metrics_graphql.exporter());
    
    app = app.at(
      "/graphql",
      post(graphql_handler)
      .get(graphql_handler_get)
      .with(metrics_graphql)
    );
    
    // 上传附件
    app = app.at(
      "/api/oss/upload",
      post(generated::common::oss::oss_router::upload),
    );
    
    app = app.at(
      "/api/oss/uploadPublic",
      post(generated::common::oss::oss_router::upload_public),
    );
    
    // 删除附件
    app = app.at(
      "/api/oss/delete",
      post(generated::common::oss::oss_router::delete),
    );
    
    // 下载附件带文件名
    app = app.at(
      "/api/oss/download/:filename",
      get(generated::common::oss::oss_router::download_filename),
    );
    
    // 下载附件
    app = app.at(
      "/api/oss/download/", 
      get(generated::common::oss::oss_router::download),
    );
    
    // 下载图片
    app = app.at(
      "/api/oss/img",
      get(generated::common::oss::oss_router::img),
    );
    
    // 上传临时文件
    app = app.at(
      "/api/tmpfile/upload", 
      post(generated::common::tmpfile::tmpfile_router::upload),
    );
    
    // 删除临时文件
    app = app.at(
      "/api/tmpfile/delete",
      post(generated::common::tmpfile::tmpfile_router::delete),
    );
    
    // 下载临时文件带文件名
    app = app.at(
      "/api/tmpfile/download/:filename",
      get(generated::common::tmpfile::tmpfile_router::download_filename),
    );
    
    // 下载临时文件
    app = app.at(
      "/api/tmpfile/download/",
      get(generated::common::tmpfile::tmpfile_router::download),
    );
    
    // websocket
    app = app.at(
      "/api/websocket/upgrade",
      get(generated::common::websocket::websocket_router::ws_upgrade),
    );
    
    // 心跳检测
    app = app.at(
      "/api/health",
      get(generated::common::health::health_router::health),
    );
    
    // 微信小程序登录
    app = app.at(
      "/api/wx_usr/code2Session",
      post(src::wx::wx_usr::wx_usr_router::code2session),
    );
    
    // 微信支付回调
    app = app.at(
      "/api/wx_pay/wx_pay_notify",
      post(src::wx::wx_pay_notice::wx_pay_notice_router::wx_pay_notify),
    );
    
    app
  };
  let app = app
    .with(Tracing)
    .with(ServerTiming)
    .with(CatchPanic::new())
    .data(schema);
  
  let server_port = env::var("server_port").unwrap_or("4001".to_owned());
  let server_host = env::var("server_host").unwrap_or("localhost".to_owned());
  
  info!("app started: {}", server_port);
  
  Server::new(TcpListener::bind(format!("{server_host}:{server_port}")))
    .run_with_graceful_shutdown(
      app,
      async {
        let _ = tokio::signal::ctrl_c().await;
      },
      None,
    ).await
}

#![forbid(unsafe_code)]

// Use Jemalloc only for musl-64 bits platforms
#[cfg(all(target_env = "musl", target_pointer_width = "64"))]
#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;

#[macro_use]
extern crate derive_new;

#[macro_use]
extern crate lazy_static;

#[macro_use]
extern crate app_macro;

mod common;
mod gen;
mod src;

use std::env;
use async_graphql::{
  EmptySubscription, Schema,
};
use poem::{
  get, post,
  listener::TcpListener,
  middleware::{TokioMetrics, Tracing},
  EndpointExt, Route, Server,
};

use dotenv::dotenv;
use tracing::info;

use crate::common::oss::oss_dao;
use crate::common::tmpfile::tmpfile_dao;
use crate::common::gql::query_root::{Query, QuerySchema, Mutation};

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
  dotenv().ok();
  if std::env::var_os("RUST_LOG").is_none() {
    std::env::set_var("RUST_LOG", "server=info");
  }
  
  #[cfg(debug_assertions)]
  let _guard = {
    let log_path = std::env::var_os("log_path");
    if log_path.is_none() {
      tracing_subscriber::fmt::init();
      None
    } else {
      let log_path = log_path.unwrap();
      let file_appender = tracing_appender::rolling::daily(log_path, "server.log");
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
    let log_path = std::env::var_os("log_path");
    if log_path.is_none() {
      tracing_subscriber::fmt()
        .with_ansi(false)
        .init();
      None
    } else {
      let log_path = log_path.unwrap();
      let file_appender = tracing_appender::rolling::daily(log_path, "server.log");
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
    match oss_dao::init().await {
      Ok(_) => {},
      Err(_) => {},
    };
    match tmpfile_dao::init().await {
      Ok(_) => {},
      Err(_) => {},
    };
  });
  
  let schema: QuerySchema = Schema::build(
    Query::default(),
    Mutation::default(),
    EmptySubscription
  )
    .finish();
  
  #[cfg(debug_assertions)]
  {
    let file_path = "src/common/gql/schema.graphql";
    let schema = schema.sdl();
    let mut is_equal = true;
    let file = std::fs::File::open(file_path).unwrap();
    let metadata = file.metadata().unwrap();
    let size = metadata.len();
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
      writer.write(schema.as_bytes()).unwrap();
    }
    std::process::Command::new("node")
      .arg("node_modules/@graphql-codegen/cli/cjs/bin.js")
      .arg("--config")
      .arg("src/common/script/graphql_codegen_config.yml",)
      .arg("--watch")
      .spawn()
      .unwrap();
  }
  
  let metrics_graphql = TokioMetrics::new();
  
  let app = {
    let mut app = Route::new();
    #[cfg(debug_assertions)]
    {
      app = app.at("/graphiql", get(common::gql::gql_router::graphql_playground));
    }
    
    app = app.at("/metrics/graphql", metrics_graphql.exporter());
    
    app = app.at(
      "/graphql",
      post(common::gql::gql_router::graphql_handler)
      .get(common::gql::gql_router::graphql_handler_get)
      .with(metrics_graphql)
    );
    
    // 上传附件
    app = app.at(
      "/api/oss/upload",
      post(common::oss::oss_router::upload),
    );
    
    // 删除附件
    app = app.at(
      "/api/oss/delete",
      post(common::oss::oss_router::delete),
    );
    
    // 下载附件带文件名
    app = app.at(
      "/api/oss/download/:filename",
      get(common::oss::oss_router::download_filename),
    );
    
    // 下载附件
    app = app.at(
      "/api/oss/download/", 
      get(common::oss::oss_router::download),
    );
    
    // 下载图片
    app = app.at(
      "/api/oss/img",
      get(common::oss::oss_router::img),
    );
    
    // 上传临时文件
    app = app.at(
      "/api/tmpfile/upload", 
      post(common::tmpfile::tmpfile_router::upload),
    );
    
    // 删除临时文件
    app = app.at(
      "/api/tmpfile/delete",
      post(common::tmpfile::tmpfile_router::delete),
    );
    
    // 下载临时文件带文件名
    app = app.at(
      "/api/tmpfile/download/:filename",
      get(common::tmpfile::tmpfile_router::download_filename),
    );
    
    // 下载临时文件
    app = app.at(
      "/api/tmpfile/download/",
      get(common::tmpfile::tmpfile_router::download),
    );
    
    app
  };
  let app = app
    .with(Tracing)
    .data(schema);
  
  let server_port = env::var("server_port").unwrap_or("4001".to_owned());
  let server_host = env::var("server_host").unwrap_or("127.0.0.1".to_owned());
  
  info!("app started: {}", server_port);
  
  Server::new(TcpListener::bind(format!("{server_host}:{server_port}")))
    .run(app)
    .await
}

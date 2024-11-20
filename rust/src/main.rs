#![forbid(unsafe_code)]
#![recursion_limit="512"]

#[cfg(not(target_env = "msvc"))]
#[global_allocator]
static GLOBAL: tikv_jemallocator::Jemalloc = tikv_jemallocator::Jemalloc;

#[macro_use]
extern crate derive_new;

#[macro_use]
extern crate lazy_static;

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
  let server_title = std::env::var_os("server_title").expect("server_title not found in .env");
  let server_title = server_title.to_str().unwrap();
  if std::env::var_os("RUST_LOG").is_none() {
    std::env::set_var("RUST_LOG", format!("{}=info", server_title));
  }
  let git_hash = std::env::var_os("GIT_HASH");
  if let Some(git_hash) = git_hash {
    let git_hash = git_hash.to_str().unwrap();
    info!("git_hash: {git_hash}");
  }
  
  #[cfg(debug_assertions)]
  let _guard = {
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
    if let Err(err) = oss_dao::init().await {
      println!("oss_dao::init() error: {}", err);
    }
    if let Err(err) = tmpfile_dao::init().await {
      println!("tmpfile_dao::init() error: {}", err);
    }
  });
  
  color_backtrace::install();
  
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
    std::process::Command::new("node")
      .arg("node_modules/@graphql-codegen/cli/cjs/bin.js")
      .arg("--config")
      .arg("src/common/script/graphql_codegen_config.ts",)
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
    
    app = app.at(
      "/api/oss/uploadPublic",
      post(common::oss::oss_router::upload_public),
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
    
    // websocket
    app = app.at(
      "/api/websocket/upgrade",
      get(common::websocket::websocket_router::ws_upgrade),
    );
    
    // 心跳检测
    app = app.at(
      "/api/health",
      get(common::health::health_router::health),
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

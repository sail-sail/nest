use poem_openapi::OpenApi;
use poem_openapi::Object;
use poem_openapi::OpenApiService;
use poem_openapi::param::Header;
use poem_openapi::payload::{Json, Response as OaiResponse};

use super::types::{OaiAuth, R, scope_auth};

/// 系统级 openapi 接口
///
/// 提供连通性检查和鉴权链路自检
pub struct SystemApi;

/// 连通性检查的返回数据
#[derive(Object)]
struct PingData {
  /// 固定返回 pong
  message: String,
}

/// 鉴权自检的返回数据
#[derive(Object, Debug)]
struct AuthCheckData {
  /// 能执行到这里说明鉴权已通过
  authorized: bool,
  /// 请求头里的 TenantId 原样返回
  tenant_header: String,
}

/// 路径参数回显的返回数据
#[derive(Object, Debug)]
struct EchoData {
  /// 路径参数原样返回
  word: String,
}

#[OpenApi]
impl SystemApi {
  /// 连通性检查
  #[oai(path = "/ping", method = "get")]
  async fn ping(&self) -> Json<R<PingData>> {
    Json(R::ok(PingData {
      message: "pong".to_owned(),
    }))
  }

  /// 鉴权链路自检
  #[oai(path = "/auth-check", method = "get")]
  async fn auth_check(
    &self,
    #[oai(name = "Authorization")] auth: Header<Option<String>>,
    #[oai(name = "TenantId")] tenant: Header<Option<String>>,
  ) -> OaiResponse<Json<R<Option<AuthCheckData>>>> {
    let tenant_header = tenant.0.clone().unwrap_or_default();

    scope_auth(
      OaiAuth::new(auth.0, tenant.0),
      async move {
        Ok(AuthCheckData {
          authorized: true,
          tenant_header,
        })
      },
    ).await.into_json()
  }

  /// 路径参数回显
  #[oai(path = "/echo/:word", method = "get")]
  async fn echo(
    &self,
    word: poem_openapi::param::Path<String>,
  ) -> Json<R<EchoData>> {
    Json(R::ok(EchoData {
      word: word.0,
    }))
  }
}

/// 构造该模块的 openapi service
pub fn service() -> OpenApiService<SystemApi, ()> {
  OpenApiService::new(SystemApi, "pms-system", "1.0")
}

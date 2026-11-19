use std::fmt::Debug;
use std::future::Future;

use color_eyre::eyre::Result;
use generated::base::tenant::tenant_model::TenantId;
use generated::common::auth::auth_model::AUTHORIZATION;
use generated::common::context::Ctx;
use generated::common::exceptions::service_exception::ServiceException;
use poem::http::header::HeaderValue;
use poem_openapi::Object;
use poem_openapi::payload::{Json, Response as OaiResponse};
use poem_openapi::types::{ParseFromJSON, ToJSON, Type};

/// 统一响应信封
///
/// openapi 接口统一返回该结构, 与前端约定的 code/message/data 保持一致
#[derive(Object)]
pub struct R<T: Type + ParseFromJSON + ToJSON> {
  /// 业务状态码, 0 表示成功
  pub code: i32,
  
  /// 错误提示, 成功时为空串
  pub message: String,
  
  /// 业务数据
  pub data: T,
}

impl<T: Type + ParseFromJSON + ToJSON> R<T> {
  /// 成功响应
  pub fn ok(data: T) -> Self {
    Self {
      code: 0,
      message: String::new(),
      data,
    }
  }
  
  /// 失败响应
  pub fn err(
    code: i32,
    message: impl Into<String>,
    data: T,
  ) -> Self {
    Self {
      code,
      message: message.into(),
      data,
    }
  }
}

/// openapi 接口的鉴权入参
///
/// 从请求头取出来, 交给 `scope_auth` 构建 Ctx
pub struct OaiAuth {
  pub token: Option<String>,
  pub tenant_id: Option<TenantId>,
}

impl OaiAuth {
  pub fn new(
    token: Option<String>,
    tenant_id: Option<String>,
  ) -> Self {
    Self {
      token,
      tenant_id: tenant_id.as_deref().map(TenantId::from),
    }
  }
}

/// 鉴权接口的执行结果
///
/// `body` 是统一响应体, `auth_token` 是上下文里最终生效的 token;
/// 后者需要在响应头回写, 前端据此续期
pub struct OaiResult<T: Type + ParseFromJSON + ToJSON> {
  body: R<Option<T>>,
  auth_token: Option<String>,
}

impl<T: Type + ParseFromJSON + ToJSON> OaiResult<T> {
  /// 转成 openapi 响应, 需要时回写 `Authorization`
  pub fn into_json(self) -> OaiResponse<Json<R<Option<T>>>> {
    let mut response = OaiResponse::new(Json(self.body));

    if let Some(token) = self.auth_token
      && let Ok(value) = HeaderValue::from_str(&token)
    {
      response = response.header(AUTHORIZATION, value);
    }

    response
  }
}

/// 在已登录上下文中执行 openapi 只读逻辑
///
/// 返回 `R<Option<T>>`: 鉴权或业务出错时 `data` 为 None, 错误信息走 `message`,
/// 这样响应始终是 200 + 固定结构, 便于生成稳定的响应 schema
pub async fn scope_auth<T, F>(
  auth: OaiAuth,
  f: F,
) -> OaiResult<T>
where
  T: Type + ParseFromJSON + ToJSON + Send + Debug,
  F: Future<Output = Result<T>>,
{
  run_scope(auth, false, f).await
}

/// 在已登录上下文中开启事务执行 openapi 业务逻辑
///
/// 是否需要事务看业务, 不是所有写操作都要:
/// 涉及多表、多条记录或需要整体成功/失败的场景用它, 单表单条非核心记录可以用 `scope_auth`。
/// 失败时由 `Ctx::ok` 整体回滚, 与 GraphQL mutation 一致
pub async fn scope_auth_tran<T, F>(
  auth: OaiAuth,
  f: F,
) -> OaiResult<T>
where
  T: Type + ParseFromJSON + ToJSON + Send + Debug,
  F: Future<Output = Result<T>>,
{
  run_scope(auth, true, f).await
}

async fn run_scope<T, F>(
  auth: OaiAuth,
  is_tran: bool,
  f: F,
) -> OaiResult<T>
where
  T: Type + ParseFromJSON + ToJSON + Send + Debug,
  F: Future<Output = Result<T>>,
{
  let mut builder = Ctx::resful_builder(None)
    .with_resful_token(auth.token, auth.tenant_id);

  if is_tran {
    builder = builder.with_tran();
  }

  let builder = match builder.with_auth() {
    Ok(builder) => builder,
    Err(err) => {
      return OaiResult {
        body: R::err(401, err.to_string(), None::<T>),
        auth_token: None,
      };
    },
  };

  match builder.build().oai_scope(f).await {
    Ok((data, auth_token)) => OaiResult {
      body: R::ok(Some(data)),
      auth_token,
    },
    Err(err) => {
      // 业务错误带 ServiceException.code(如 400), 其余才算 500,
      // 否则前端和 AI 会把「参数不对」当成服务端故障
      let code = err
        .downcast_ref::<ServiceException>()
        .and_then(|exception| exception.code.parse::<i32>().ok())
        .unwrap_or(500);
      OaiResult {
        body: R::err(code, err.to_string(), None::<T>),
        auth_token: None,
      }
    },
  }
}

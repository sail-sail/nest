use generated::base::tenant::tenant_model::TenantId;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct McpGraphqlInput {
  pub query: String,
  #[serde(default)]
  pub variables: Option<Value>,
  #[serde(default)]
  pub operation_name: Option<String>,
  #[serde(default)]
  pub client_tenant_id: Option<TenantId>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct McpSchemaSearchInput {
  pub keyword: String,
  #[serde(default)]
  pub kind: Option<String>,
  #[serde(default)]
  pub scope: Option<String>,
  #[serde(default)]
  pub limit: Option<usize>,
  #[serde(default)]
  pub include_sdl: Option<bool>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct McpSchemaGetInput {
  pub name: String,
  #[serde(default)]
  pub kind: Option<String>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct McpOssUploadInput {
  #[serde(default)]
  pub id: Option<String>,
  pub filename: String,
  pub content_base64: String,
  #[serde(default)]
  pub content_type: Option<String>,
  #[serde(default)]
  pub is_public: Option<bool>,
  #[serde(default)]
  pub db: Option<String>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct McpOssDownloadUrlInput {
  pub id: String,
  #[serde(default)]
  pub filename: Option<String>,
  #[serde(default)]
  pub inline: Option<String>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct McpOssImageUrlInput {
  pub id: String,
  #[serde(default)]
  pub filename: Option<String>,
  #[serde(default)]
  pub inline: Option<String>,
  #[serde(default)]
  pub format: Option<String>,
  #[serde(default)]
  pub width: Option<u32>,
  #[serde(default)]
  pub height: Option<u32>,
  #[serde(default)]
  pub quality: Option<u8>,
}

#[derive(Debug, Clone, Default, Deserialize)]
pub struct OAuthAuthorizeQuery {
  #[serde(default)]
  pub response_type: String,
  #[serde(default)]
  pub client_id: String,
  #[serde(default)]
  pub redirect_uri: String,
  #[serde(default)]
  pub state: Option<String>,
  #[serde(default)]
  pub scope: Option<String>,
  #[serde(default)]
  pub code_challenge: Option<String>,
  #[serde(default)]
  pub code_challenge_method: Option<String>,
  #[serde(default)]
  pub resource: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize)]
pub struct OAuthAuthorizeForm {
  #[serde(default)]
  pub decision: String,
  #[serde(default)]
  pub tenant_id: Option<String>,
  #[serde(default)]
  pub username: String,
  #[serde(default)]
  pub password: String,
}

#[derive(Debug, Clone, Default, Deserialize)]
pub struct OAuthTokenForm {
  #[serde(default)]
  pub grant_type: String,
  #[serde(default)]
  pub code: Option<String>,
  #[serde(default)]
  pub redirect_uri: Option<String>,
  #[serde(default)]
  pub client_id: Option<String>,
  #[serde(default)]
  pub code_verifier: Option<String>,
  #[serde(default)]
  pub refresh_token: Option<String>,
  #[serde(default)]
  pub scope: Option<String>,
  #[serde(default)]
  pub resource: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize)]
pub struct OAuthRevokeForm {
  #[serde(default)]
  pub token: String,
  #[serde(default)]
  pub client_id: Option<String>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct OAuthRegisterInput {
  #[serde(default)]
  pub client_name: Option<String>,
  #[serde(default)]
  pub redirect_uris: Vec<String>,
  #[serde(default)]
  pub grant_types: Option<Vec<String>>,
  #[serde(default)]
  pub response_types: Option<Vec<String>>,
  #[serde(default)]
  pub token_endpoint_auth_method: Option<String>,
  #[serde(default)]
  pub scope: Option<String>,
  #[serde(default)]
  pub client_uri: Option<String>,
}
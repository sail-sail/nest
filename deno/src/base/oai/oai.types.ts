import type {
  ZodType,
} from "zod";

/** openapi 业务接口支持的请求方法 */
export type OaiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** 统一响应信封, 与 rust 版 R<T> 保持一致 */
export interface R<T = unknown> {

  /** 业务状态码, 0 表示成功 */
  code: number;

  /** 错误提示, 成功时为空串 */
  message: string;

  /** 业务数据, 出错时为 null */
  data: T | null;

}

/** 路由处理函数拿到的请求参数 */
export interface OaiRouteCtx {

  /** 路径参数 */
  params: Record<string, string>;

  /** query 参数 */
  query: Record<string, unknown>;

  /** JSON 请求体 */
  body: unknown;

  /** 请求头 */
  headers: Headers;

}

/** 一条 openapi 业务接口的路由声明 */
export interface OaiRoute {

  /** 模块名, 对应 /api/oai/{module} 前缀 */
  module: string;

  /** 请求方法 */
  method: OaiMethod;

  /** 完整路径, 路径参数用 :name, 如 /api/oai/system/echo/:word */
  path: string;

  /** 接口摘要, 会进 openapi summary 和 MCP 搜索结果 */
  summary: string;

  /** 接口详细说明 */
  description?: string;

  /** 是否需要登录, 默认 true */
  auth?: boolean;

  /** 是否开启事务, 默认非 GET 开启 */
  transaction?: boolean;

  /** 路径参数 schema, 仅用于校验和文档 */
  params?: ZodType;

  /** query 参数 schema, 必须是 object */
  query?: ZodType;

  /** JSON 请求体 schema */
  body?: ZodType;

  /** 成功响应的 data schema */
  output?: ZodType;

  /** 业务处理函数 */
  handler: (ctx: OaiRouteCtx) => Promise<unknown>;

}

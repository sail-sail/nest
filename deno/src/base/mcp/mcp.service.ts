import type {
  Context as OakContext,
} from "@oak/oak";

import {
  Kind,
  parse,
  print,
  visit,
  type FieldNode,
  type ObjectFieldNode,
  type ValueNode,
} from "graphql";

import {
  McpServer,
// deno-lint-ignore ban-ts-comment
// @ts-ignore
} from "@modelcontextprotocol/sdk/server/mcp.js";

import {
  z,
} from "zod";

import {
  createToken,
} from "/lib/auth/auth.service.ts";

import type {
  AuthModel,
} from "/lib/auth/auth.constants.ts";

import {
  executeGraphql,
} from "/lib/oak/gql.ts";

import * as ossService from "/lib/oss/oss.service.ts";

import type {
  Mutation,
  MutationLoginArgs,
  Query,
} from "/gen/types.ts";

import {
  getSchemaDefinition,
  type SchemaSearchKind,
  searchSchema,
} from "./schema_search.ts";

import {
  getRestEndpoint,
  isRestEndpointName,
  matchRestEndpoint,
  searchRestSchema,
} from "./rest_index.ts";

import {
  failFromError,
  invokeOaiRoute,
} from "/src/base/oai/oai.run.ts";

const jsonRecordSchema = z.record(z.string(), z.unknown());
const MAX_MCP_PAGE_SIZE = 2000;
const INSTRUCTIONS = "这是内嵌在 deno 后端里的 MCP 调试入口。先调用 session_me 确认当前登录态；GraphQL 相关不清楚类型时先用 schema_search(source=graphql) 搜索，再用 schema_get 查看完整定义，最后用 graphql_execute 执行。非 GraphQL 的 HTTP 接口由 openapi 规范描述，先用 schema_search(source=rest) 找到 method 和 path，再用 rest_call 调用；附件上传下载继续用 oss_* 工具。对任何 findAll* 查询，都要显式传 page；缺 page 会被直接拒绝，pgSize 缺省按 20，超过 2000 自动降到 2000。";

const loginMutation = /* GraphQL */ `
  mutation($input: LoginInput!) {
    login(input: $input) {
      usr_id
      lbl
      username
      role_codes
      tenant_id
      org_id
      org_id_models {
        id
        lbl
      }
      authorization
      lang
    }
  }
`;

const getLoginInfoQuery = /* GraphQL */ `
  query {
    getLoginInfo {
      lbl
      username
      role_codes
      lang
      tenant_id
      org_id
      org_id_models {
        id
        lbl
      }
    }
  }
`;

export interface McpExecutionAuthContext {
  authMode: "direct" | "oauth";
  authModel: AuthModel;
  authorization: string;
  scopes: string[];
  resource: string;
  publicBaseUrl: string;
}

export async function createExecutionAuthorization(
  authModel: AuthModel,
) {
  const tokenInfo = await createToken({
    ...authModel,
  });
  return tokenInfo.authorization;
}

export async function executeLoginMutation(
  oakCtx: OakContext,
  input: MutationLoginArgs["input"],
): Promise<Mutation["login"]> {
  const result = await executeGraphql(
    {
      query: loginMutation,
      variables: {
        input,
      },
    },
    {
      oakCtx,
      notVerifyToken: true,
    },
  );
  return unwrapGraphqlField<Mutation["login"]>(result, "login");
}

export function createNestMcpServer(
  options: {
    auth: McpExecutionAuthContext;
  },
) {
  const server = new McpServer({
    name: "nest-deno-mcp",
    version: "1.0.0",
    instructions: INSTRUCTIONS,
  });

  server.registerTool(
    "session_me",
    {
      title: "当前登录会话",
      description: "返回当前 MCP Bearer token 对应的系统登录信息和基础认证上下文。",
      inputSchema: {},
    },
    async () => {
      const loginInfo = await getCurrentLoginInfo(options.auth.authorization);
      return toToolResult({
        authMode: options.auth.authMode,
        scopes: options.auth.scopes,
        resource: options.auth.resource,
        authModel: options.auth.authModel,
        loginInfo,
      });
    },
  );

  server.registerTool(
    "schema_search",
    {
      title: "搜索接口定义",
      description: "按类型名、字段名、中文描述、路径和 SDL 片段搜索 GraphQL schema 或 openapi 接口。",
      inputSchema: {
        keyword: z.string().min(1).optional().describe("关键词，等价于 query；兼容 agent 的调用参数"),
        query: z.string().min(1).optional().describe("关键词，可输入类型名、字段名、接口路径或中文描述"),
        source: z.enum([ "graphql", "rest", "all" ]).optional().describe("接口来源：graphql / rest / all，默认 all"),
        kind: z.enum([ "type", "input", "enum", "scalar", "interface", "union", "field", "endpoint" ]).optional().describe("可选：限定搜索范围，endpoint 表示 HTTP 接口"),
        scope: z.enum([ "definition", "member", "all" ]).optional().describe("可选：definition / member / all，默认 all"),
        includeSdl: z.boolean().optional().describe("可选：REST 结果是否附带完整 operation"),
        limit: z.number().int().positive().max(30).optional().describe("最多返回多少条，默认 10"),
      },
    },
    async ({ keyword, query, source, kind, scope, includeSdl, limit }: {
      keyword?: string;
      query?: string;
      source?: "graphql" | "rest" | "all";
      kind?: SchemaSearchKind | "endpoint";
      scope?: "definition" | "member" | "all";
      includeSdl?: boolean;
      limit?: number;
    }) => {
      const text = (query || keyword || "").trim();
      if (!text) {
        throw new Error("query 或 keyword 不能为空");
      }
      return toToolResult(searchSchemaBySource(text, source, kind, limit, scope, includeSdl));
    },
  );

  server.registerTool(
    "schema_get",
    {
      title: "获取完整定义",
      description: "按名字精确返回完整定义。GraphQL 类型返回完整 SDL；HTTP 接口传 `GET /path` 或 path 本身，返回参数与响应 schema。大型聚合类型会被拒绝，请先用 schema_search 缩小范围。",
      inputSchema: {
        name: z.string().min(1).describe("类型名（如 UsrModel）或接口标识（如 GET /api/oai/system/ping）"),
        kind: z.enum([ "type", "input", "enum", "scalar", "interface", "union", "endpoint" ]).optional().describe("可选：当同名存在多个 kind 时用于精确限定，endpoint 表示 HTTP 接口"),
      },
    },
    async ({ name, kind }: {
      name: string;
      kind?: Exclude<SchemaSearchKind, "field"> | "endpoint";
    }) => {
      if (isRestEndpointName(name, kind)) {
        return toToolResult(getRestEndpoint(name));
      }
      return toToolResult(getSchemaDefinition(name, kind as Exclude<SchemaSearchKind, "field"> | undefined));
    },
  );

  server.registerTool(
    "graphql_execute",
    {
      title: "执行 GraphQL",
      description: "以当前登录身份在进程内执行 GraphQL query 或 mutation。执行 findAll* 时必须提供 page，page.pgSize 默认 20，最大 2000。",
      inputSchema: {
        query: z.string().min(1).describe("完整 GraphQL query 或 mutation"),
        variables: jsonRecordSchema.optional().describe("GraphQL variables，对象结构"),
      },
    },
    async ({ query, variables }: {
      query: string;
      variables?: Record<string, unknown>;
    }) => {
      const prepared = prepareGraphqlExecute(query, variables as Record<string, unknown> | undefined);
      const result = await executeGraphql(
        prepared,
        {
          authorization: options.auth.authorization,
        },
      );
      return toToolResult(result);
    },
  );

  server.registerTool(
    "rest_call",
    {
      title: "调用 openapi 接口",
      description: "调用 openapi 规范里的 HTTP 接口（非 GraphQL）。path 必须来自 schema_search(source=rest) 的结果，返回统一响应信封。附件上传下载请继续用 oss_* 工具。",
      inputSchema: {
        path: z.string().min(1).describe("完整路径，例如 /api/oai/system/ping"),
        method: z.string().optional().describe("请求方法，默认 GET，支持大小写"),
        query: jsonRecordSchema.optional().describe("query 参数，值会被转成字符串"),
        body: z.unknown().optional().describe("JSON 请求体，可以是对象、数组或基础类型"),
      },
    },
    async ({ path, method, query, body }: {
      path: string;
      method?: string;
      query?: Record<string, unknown>;
      body?: unknown;
    }) => {
      const nextMethod = (method || "GET").trim().toUpperCase();
      const nextPath = path.trim();
      if (![ "GET", "POST", "PUT", "PATCH", "DELETE" ].includes(nextMethod)) {
        return toToolResult({
          error: `不支持的 method: ${ nextMethod }`,
        });
      }
      if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
        return toToolResult({
          error: "path 必须以 / 开头，例如 /api/oai/system/ping",
        });
      }

      const matched = matchRestEndpoint(nextMethod, nextPath);
      if (!matched) {
        return toToolResult({
          error: `${ nextMethod } ${ nextPath } 不在 openapi 规范里`,
          action: "先用 schema_search 且 source=rest 搜到准确 path 再调用",
        });
      }

      try {
        const result = await invokeOaiRoute(matched.route, {
          authorization: options.auth.authorization,
          params: matched.params,
          query: toQueryStrings(query),
          body,
          headers: new Headers({
            Authorization: `Bearer ${ options.auth.authorization }`,
            TenantId: String(options.auth.authModel.tenant_id || ""),
          }),
        });
        return toToolResult({
          status: 200,
          body: result,
        });
      } catch (err) {
        return toToolResult({
          status: 200,
          body: failFromError(err),
        });
      }
    },
  );

  server.registerTool(
    "oss_upload",
    {
      title: "上传附件到 OSS",
      description: "把 base64 文件内容上传到当前系统 OSS，并返回文件 id 与可访问 URL。文件内容参数推荐使用 contentBase64，兼容旧的 base64。",
      inputSchema: {
        id: z.string().optional().describe("可选：指定附件 id"),
        filename: z.string().min(1).describe("文件名，例如 contract.pdf"),
        contentBase64: z.string().optional().describe("文件的 base64 内容，推荐使用，可包含 data: 前缀；与 base64 二选一"),
        base64: z.string().optional().describe("兼容旧参数，与 contentBase64 二选一"),
        contentType: z.string().optional().describe("可选 MIME type"),
        isPublic: z.boolean().optional().describe("是否公开文件，默认 false"),
        is_public: z.boolean().optional().describe("兼容旧参数，含义同 isPublic"),
        once: z.number().int().positive().optional().describe("可选 once 标记"),
        db: z.string().optional().describe("可选 db 参数"),
      },
    },
    async ({ id: fileId, filename, contentBase64, base64, contentType, isPublic, is_public, once, db }: {
      id?: string;
      filename: string;
      contentBase64?: string;
      base64?: string;
      contentType?: string;
      isPublic?: boolean;
      is_public?: boolean;
      once?: number;
      db?: string;
    }) => {
      const payload = contentBase64 || base64;
      if (!payload) {
        throw new Error("contentBase64 不能为空");
      }
      const is_public_value = isPublic ?? is_public ?? false;
      const bytes = decodeBase64Payload(payload);
      const file = new File([ bytes ], filename, {
        type: contentType || guessContentType(filename),
      });
      const id = await ossService.upload(
        file,
        {
          id: fileId,
          once,
          is_public: is_public_value,
          tenant_id: is_public_value ? undefined : options.auth.authModel.tenant_id,
          db,
        },
      );
      return toToolResult({
        id,
        downloadUrl: await buildOssUrl(options.auth, "download", {
          id,
          filename,
          inline: false,
        }),
        imageUrl: file.type.startsWith("image/")
          ? await buildOssUrl(options.auth, "img", {
            id,
            filename,
            inline: true,
          })
          : undefined,
      });
    },
  );

  server.registerTool(
    "oss_download_url",
    {
      title: "生成附件下载 URL",
      description: "根据附件 id 生成可下载 URL。私有文件会自动拼接当前会话 authorization。",
      inputSchema: {
        id: z.string().min(1).describe("附件 id"),
        filename: z.string().optional().describe("可选文件名覆盖"),
        inline: z.union([ z.boolean(), z.string() ]).optional().describe("是否内联展示，支持 true/false/1/0，默认 false"),
      },
    },
    async ({ id, filename, inline }: {
      id: string;
      filename?: string;
      inline?: boolean | string;
    }) => {
      return toToolResult({
        url: await buildOssUrl(options.auth, "download", {
          id,
          filename,
          inline: parseInlineFlag(inline),
        }),
      });
    },
  );

  server.registerTool(
    "oss_image_url",
    {
      title: "生成图片访问 URL",
      description: "根据附件 id 生成图片访问 URL，可附带裁剪尺寸参数。私有文件会自动拼接当前会话 authorization。",
      inputSchema: {
        id: z.string().min(1).describe("附件 id"),
        filename: z.string().optional().describe("可选文件名覆盖"),
        inline: z.union([ z.boolean(), z.string() ]).optional().describe("是否内联展示，支持 true/false/1/0，默认 true"),
        format: z.string().optional().describe("可选图片格式参数"),
        width: z.number().int().positive().optional().describe("可选宽度"),
        height: z.number().int().positive().optional().describe("可选高度"),
        quality: z.number().int().positive().max(100).optional().describe("可选质量，1-100"),
        f: z.string().optional().describe("兼容旧参数，含义同 format"),
        w: z.number().int().positive().optional().describe("兼容旧参数，含义同 width"),
        h: z.number().int().positive().optional().describe("兼容旧参数，含义同 height"),
        q: z.number().int().positive().max(100).optional().describe("兼容旧参数，含义同 quality"),
      },
    },
    async ({ id, filename, inline, format, width, height, quality, f, w, h, q }: {
      id: string;
      filename?: string;
      inline?: boolean | string;
      format?: string;
      width?: number;
      height?: number;
      quality?: number;
      f?: string;
      w?: number;
      h?: number;
      q?: number;
    }) => {
      return toToolResult({
        url: await buildOssUrl(options.auth, "img", {
          id,
          filename,
          inline: parseInlineFlag(inline),
          f: format ?? f,
          w: width ?? w,
          h: height ?? h,
          q: quality ?? q,
        }),
      });
    },
  );

  return server;
}

async function getCurrentLoginInfo(
  authorization: string,
): Promise<Query["getLoginInfo"]> {
  const result = await executeGraphql(
    {
      query: getLoginInfoQuery,
    },
    {
      authorization,
    },
  );
  return unwrapGraphqlField<Query["getLoginInfo"]>(result, "getLoginInfo");
}

async function buildOssUrl(
  auth: McpExecutionAuthContext,
  action: "download" | "img",
  input: {
    id: string;
    filename?: string;
    inline?: boolean;
    f?: string;
    w?: number;
    h?: number;
    q?: number;
  },
) {
  const url = new URL(`/api/oss/${ action }`, auth.publicBaseUrl);
  url.searchParams.set("id", input.id);

  const stats = await ossService.statObject(input.id);
  const meta = stats?.meta || { };
  const isPublic = meta.is_public === "1";
  const filename = input.filename || decodeFilename(meta.filename);
  if (filename) {
    url.pathname = `/api/oss/${ action }/${ encodeURIComponent(filename) }`;
  }
  if (input.inline != null) {
    url.searchParams.set("inline", input.inline ? "1" : "0");
  } else if (action === "img") {
    url.searchParams.set("inline", "1");
  }
  if (input.f) {
    url.searchParams.set("f", input.f);
  }
  if (input.w != null) {
    url.searchParams.set("w", input.w.toString());
  }
  if (input.h != null) {
    url.searchParams.set("h", input.h.toString());
  }
  if (input.q != null) {
    url.searchParams.set("q", input.q.toString());
  }
  if (!isPublic) {
    url.searchParams.set("authorization", auth.authorization);
  }
  return url.href;
}

export function prepareGraphqlExecute(
  query: string,
  variables?: Record<string, unknown>,
) {
  const document = parse(query);
  const nextVariables = variables ? structuredClone(variables) : { };
  const errors: string[] = [ ];

  const nextDocument = visit(document, {
    Field(node) {
      if (!node.name.value.startsWith("findAll")) {
        return undefined;
      }
      const pageArg = node.arguments?.find((item) => item.name.value === "page");
      if (!pageArg) {
        errors.push(`${ node.name.value } 必须传入 page 参数`);
        return undefined;
      }
      if (pageArg.value.kind === Kind.VARIABLE) {
        ensureVariablePageLimit(
          nextVariables,
          pageArg.value.name.value,
          errors,
        );
        return undefined;
      }
      if (pageArg.value.kind === Kind.OBJECT) {
        return patchInlinePageLimit(node, pageArg.value.fields, errors);
      }
      errors.push(`${ node.name.value }.page 必须是对象或变量`);
      return undefined;
    },
  });

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return {
    query: print(nextDocument),
    variables: Object.keys(nextVariables).length > 0 ? nextVariables : undefined,
  };
}

function ensureVariablePageLimit(
  variables: Record<string, unknown>,
  variableName: string,
  errors: string[],
) {
  const rawPage = variables[variableName];
  if (rawPage == null) {
    variables[variableName] = {
      pgSize: 20,
    };
    return;
  }
  if (!rawPage || typeof rawPage !== "object" || Array.isArray(rawPage)) {
    errors.push(`变量 ${ variableName } 必须是对象`);
    return;
  }
  const page = rawPage as Record<string, unknown>;
  if (page.pgSize == null) {
    page.pgSize = 20;
    return;
  }
  const pgSize = Number(page.pgSize);
  if (!Number.isFinite(pgSize) || pgSize <= 0) {
    errors.push(`变量 ${ variableName }.pgSize 必须是正整数`);
    return;
  }
  if (pgSize > MAX_MCP_PAGE_SIZE) {
    page.pgSize = MAX_MCP_PAGE_SIZE;
  }
}

function patchInlinePageLimit(
  node: FieldNode,
  pageFields: readonly ObjectFieldNode[],
  errors: string[],
) {
  let hasPgSize = false;
  const nextPageFields = [ ...pageFields ];

  for (const [ index, field ] of pageFields.entries()) {
    if (field.name.value !== "pgSize") {
      continue;
    }
    hasPgSize = true;
    const pgSize = readIntValue(field.value);
    if (pgSize == null || pgSize <= 0) {
      errors.push(`${ node.name.value }.page.pgSize 必须是正整数`);
      return undefined;
    }
    if (pgSize > MAX_MCP_PAGE_SIZE) {
      nextPageFields[index] = {
        ...field,
        value: {
          kind: Kind.INT,
          value: String(MAX_MCP_PAGE_SIZE),
        },
      };
    }
  }

  if (!hasPgSize) {
    nextPageFields.push({
      kind: Kind.OBJECT_FIELD,
      name: {
        kind: Kind.NAME,
        value: "pgSize",
      },
      value: {
        kind: Kind.INT,
        value: "20",
      },
    });
  }

  return {
    ...node,
    arguments: node.arguments?.map((item) => {
      if (item.name.value !== "page") {
        return item;
      }
      return {
        ...item,
        value: {
          kind: Kind.OBJECT,
          fields: nextPageFields,
        },
      };
    }),
  };
}

function readIntValue(
  value: ValueNode,
) {
  if (value.kind !== Kind.INT) {
    return undefined;
  }
  return Number(value.value);
}

function unwrapGraphqlField<T>(
  result: unknown,
  fieldName: string,
) {
  const payload = result as {
    data?: Record<string, unknown>;
    errors?: Array<{
      message?: string;
    }>;
  } | undefined;

  if (!payload) {
    throw new Error("GraphQL 未返回结果");
  }
  if (payload.errors && payload.errors.length > 0) {
    const message = payload.errors
      .map((item) => item.message || "GraphQL 执行失败")
      .join("\n");
    throw new Error(message);
  }
  if (!payload.data || !(fieldName in payload.data)) {
    throw new Error(`GraphQL 响应缺少字段 ${ fieldName }`);
  }
  return payload.data[fieldName] as T;
}

function searchSchemaBySource(
  query: string,
  source: "graphql" | "rest" | "all" = "all",
  kind?: SchemaSearchKind | "endpoint",
  limit?: number,
  scope?: "definition" | "member" | "all",
  includeSdl?: boolean,
) {
  if (source === "rest") {
    return searchRestSchema(query, limit, kind, scope, includeSdl);
  }

  const graphqlItems = kind === "endpoint"
    ? [ ]
    : filterByScope(
      withSource(searchSchema(query, kind, limit), "graphql").items,
      scope,
    );

  if (source === "graphql") {
    return {
      total: graphqlItems.length,
      source: "graphql",
      items: graphqlItems,
    };
  }

  const restResult = searchRestSchema(query, limit, kind, scope, includeSdl);
  const restItems = restResult.items;
  const nextLimit = Math.min(Math.max(limit ?? 10, 1), 30);
  const items: unknown[] = [ ];
  for (let i = 0; i < Math.max(graphqlItems.length, restItems.length); i++) {
    if (graphqlItems[i]) {
      items.push(graphqlItems[i]);
    }
    if (restItems[i]) {
      items.push(restItems[i]);
    }
    if (items.length >= nextLimit) {
      break;
    }
  }

  return {
    total: items.length,
    source: "all",
    items,
  };
}

function filterByScope(
  items: unknown[],
  scope?: "definition" | "member" | "all",
) {
  if (!scope || scope === "all") {
    return items;
  }
  return items.filter(function(item) {
    const matchType = (item as { matchType?: string }).matchType;
    return scope === "member"
      ? matchType === "field"
      : matchType === "definition";
  });
}

function parseInlineFlag(
  value?: boolean | string,
) {
  if (value == null) {
    return undefined;
  }
  if (typeof value === "boolean") {
    return value;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "1" || normalized === "true") {
    return true;
  }
  if (normalized === "0" || normalized === "false") {
    return false;
  }
  return undefined;
}

function toQueryStrings(
  query?: Record<string, unknown>,
) {
  const next: Record<string, unknown> = { };
  for (const [ key, value ] of Object.entries(query || { })) {
    if (Array.isArray(value)) {
      next[key] = value.map(String);
    } else if (value != null) {
      next[key] = String(value);
    }
  }
  return next;
}

function withSource<T extends { items: unknown[] }>(
  result: T,
  source: string,
) {
  return {
    ...result,
    items: result.items.map(function(item) {
      return {
        source,
        ...(item as Record<string, unknown>),
      };
    }),
  };
}

function toToolResult(
  payload: unknown,
) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(payload, null, 2),
      },
    ],
  };
}

function decodeBase64Payload(
  payload: string,
) {
  const normalizedPayload = payload.includes(",")
    ? payload.slice(payload.indexOf(",") + 1)
    : payload;
  const binary = atob(normalizedPayload);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function decodeFilename(
  filename?: string,
) {
  if (!filename) {
    return undefined;
  }
  try {
    return decodeURIComponent(filename);
  } catch {
    return filename;
  }
}

function guessContentType(
  filename: string,
) {
  const normalized = filename.toLowerCase();
  if (normalized.endsWith(".png")) {
    return "image/png";
  }
  if (normalized.endsWith(".jpg") || normalized.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (normalized.endsWith(".gif")) {
    return "image/gif";
  }
  if (normalized.endsWith(".webp")) {
    return "image/webp";
  }
  if (normalized.endsWith(".pdf")) {
    return "application/pdf";
  }
  if (normalized.endsWith(".txt")) {
    return "text/plain";
  }
  return "application/octet-stream";
}
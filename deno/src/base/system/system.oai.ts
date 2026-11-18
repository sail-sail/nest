import {
  z,
} from "zod";

import {
  defineOaiRoute,
  oaiBoolean,
} from "/src/base/oai/oai.registry.ts";

const PingData = z.object({
  message: z.string(),
}).meta({
  id: "PingData",
  description: "连通性检查的返回数据",
});

const AuthCheckData = z.object({
  authorized: z.boolean(),
  tenant_header: z.string(),
}).meta({
  id: "AuthCheckData",
  description: "鉴权自检的返回数据",
});

const EchoData = z.object({
  word: z.string(),
}).meta({
  id: "EchoData",
  description: "路径参数回显的返回数据",
});

const GreetData = z.object({
  message: z.string(),
}).meta({
  id: "GreetData",
  description: "query 参数示例的返回数据",
});

export const systemRoutes = [
  defineOaiRoute({
    module: "system",
    method: "GET",
    path: "/api/oai/system/ping",
    summary: "连通性检查",
    description: "不需要登录, 固定返回 pong",
    auth: false,
    output: PingData,
    handler: async () => {
      return {
        message: "pong",
      };
    },
  }),

  defineOaiRoute({
    module: "system",
    method: "GET",
    path: "/api/oai/system/auth-check",
    summary: "鉴权链路自检",
    description: "需要登录, 能正常返回说明 token 校验通过",
    output: AuthCheckData,
    handler: async ({ headers }) => {
      return {
        authorized: true,
        tenant_header: headers.get("TenantId") || "",
      };
    },
  }),

  defineOaiRoute({
    module: "system",
    method: "GET",
    path: "/api/oai/system/echo/:word",
    summary: "路径参数回显",
    description: "不需要登录, 原样返回路径参数",
    auth: false,
    output: EchoData,
    handler: async ({ params }) => {
      return {
        word: params.word,
      };
    },
  }),

  defineOaiRoute({
    module: "system",
    method: "GET",
    path: "/api/oai/system/greet",
    summary: "query 参数示例",
    description: "不需要登录, 按 query 参数拼一段问候语",
    auth: false,
    query: z.object({
      name: z.string().min(1).describe("名字"),
      times: z.coerce.number().int().positive().optional().describe("重复次数, 默认 1"),
      loud: oaiBoolean.optional().describe("是否大写, 支持 true/false/1/0"),
    }),
    output: GreetData,
    handler: async ({ query }) => {
      const times = query.times ?? 1;
      const message = Array.from({ length: times }, function() {
        return `hello ${ query.name }`;
      }).join(" ");
      return {
        message: query.loud ? message.toUpperCase() : message,
      };
    },
  }),

  defineOaiRoute({
    module: "system",
    method: "POST",
    path: "/api/oai/system/echo",
    summary: "请求体回显",
    description: "不需要登录, 原样返回请求体里的 word",
    auth: false,
    transaction: false,
    body: z.object({
      word: z.string().describe("需要回显的字符串"),
      count: z.coerce.number().int().positive().optional().describe("可选数字, 用于验证 query/body 数字转换"),
    }),
    output: EchoData,
    handler: async ({ body }) => {
      return {
        word: body.word,
      };
    },
  }),
];

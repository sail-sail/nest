import {
  z,
} from "zod";

import type {
  ZodType,
} from "zod";

import {
  oaiRoutes,
} from "./oai.routes.ts";

import type {
  OaiRoute,
} from "./oai.types.ts";

type JsonSchema = Record<string, unknown> & {
  $ref?: string;
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[] | boolean;
  definitions?: Record<string, JsonSchema>;
};

const REF_PREFIX = "#/definitions/";
const COMPONENT_REF_PREFIX = "#/components/schemas/";

/** 把 oak 风格的 :name 路径参数转成 openapi 的 {name} */
export function toOpenApiPath(
  path: string,
) {
  return path.replace(/:([A-Za-z0-9_]+)/g, "{$1}");
}

/** 提取路径里的参数名 */
export function getPathParameterNames(
  path: string,
) {
  const names: string[] = [];
  for (const item of path.matchAll(/:([A-Za-z0-9_]+)/g)) {
    names.push(item[1]);
  }
  return names;
}

/**
 * 生成合并后的 openapi 规范
 *
 * 路由声明是唯一数据源, 这里只做 paths / components 的投影
 */
export function buildOaiSpec(
  routes: OaiRoute[],
) {
  const paths: Record<string, JsonSchema> = {};
  const schemas: Record<string, JsonSchema> = {};
  const tags = new Map<string, JsonSchema>();

  for (const route of routes) {
    const path = toOpenApiPath(route.path);
    const operation = buildOperation(route, schemas);
    const pathItem = paths[path] ?? {};
    const method = route.method.toLowerCase();
    if (pathItem[method]) {
      throw new Error(`OpenAPI 路径重复: ${ route.method } ${ route.path }`);
    }
    pathItem[method] = operation;
    paths[path] = pathItem;
    tags.set(route.module, { name: route.module });
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "nest-deno",
      version: "1.0.0",
      description: "Deno 后端业务 HTTP 接口",
    },
    paths,
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "登录返回的 authorization, 直接放在 Authorization 请求头",
        },
      },
    },
    tags: Array.from(tags.values()),
  };
}

/** 生成单条路由的 operation 和它引用到的 schema */
export function buildOaiOperationDetail(
  route: OaiRoute,
) {
  const schemas: Record<string, JsonSchema> = {};
  return {
    operation: buildOperation(route, schemas),
    schemas,
  };
}

function buildOperation(
  route: OaiRoute,
  schemas: Record<string, JsonSchema>,
): JsonSchema {
  const operation: JsonSchema = {
    summary: route.summary,
    description: route.description,
    tags: [ route.module ],
    parameters: buildParameters(route, schemas),
    responses: {
      "200": {
        description: "统一响应",
        content: {
          "application/json": {
            schema: buildResponseSchema(route, schemas),
          },
        },
      },
    },
  };

  if (route.body) {
    operation.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: extractJsonSchema(route.body, schemas, "input"),
        },
      },
    };
  }

  if (route.auth !== false) {
    operation.security = [ { bearerAuth: [] } ];
  }

  return operation;
}

function buildParameters(
  route: OaiRoute,
  schemas: Record<string, JsonSchema>,
) {
  const parameters: JsonSchema[] = [];

  const paramsJson = route.params
    ? resolveRefs(extractJsonSchema(route.params, schemas, "input"), schemas) as JsonSchema
    : undefined;
  const paramProperties = paramsJson?.properties ?? {};

  for (const name of getPathParameterNames(route.path)) {
    parameters.push({
      name,
      in: "path",
      required: true,
      schema: paramProperties[name] ?? { type: "string" },
    });
  }

  if (route.query) {
    const queryJson = resolveRefs(
      extractJsonSchema(route.query, schemas, "input"),
      schemas,
    ) as JsonSchema;
    if (queryJson.type !== "object") {
      throw new Error(`${ route.method } ${ route.path } 的 query schema 必须是 object`);
    }
    const properties = queryJson.properties ?? {};
    const required = Array.isArray(queryJson.required) ? queryJson.required : [];
    for (const [ name, schema ] of Object.entries(properties)) {
      parameters.push({
        name,
        in: "query",
        required: required.includes(name),
        schema,
      });
    }
  }

  if (route.auth !== false) {
    parameters.push({
      name: "TenantId",
      in: "header",
      required: false,
      description: "租户 id, 不传时取 token 里的租户",
      schema: { type: "string" },
    });
  }

  return parameters;
}

function buildResponseSchema(
  route: OaiRoute,
  schemas: Record<string, JsonSchema>,
): JsonSchema {
  const dataSchema = route.output
    ? toNullable(extractJsonSchema(route.output, schemas, "output"))
    : { nullable: true };

  return {
    type: "object",
    properties: {
      code: {
        type: "integer",
        description: "业务状态码, 0 表示成功",
      },
      message: {
        type: "string",
        description: "错误提示, 成功时为空串",
      },
      data: dataSchema,
    },
    required: [ "code", "message", "data" ],
  };
}

function extractJsonSchema(
  schema: ZodType,
  schemas: Record<string, JsonSchema>,
  io: "input" | "output",
): JsonSchema {
  const json = z.toJSONSchema(schema, {
    target: "openapi-3.0",
    io,
  }) as JsonSchema;

  const definitions = json.definitions;
  if (definitions) {
    for (const [ name, definition ] of Object.entries(definitions)) {
      const nextDefinition = rewriteRefs(definition) as JsonSchema;
      const existing = schemas[name];
      if (existing && JSON.stringify(existing) !== JSON.stringify(nextDefinition)) {
        throw new Error(`OpenAPI schema 名冲突: ${ name }`);
      }
      schemas[name] = nextDefinition;
    }
  }

  const { definitions: _definitions, ...rest } = json;
  return rewriteRefs(rest) as JsonSchema;
}

function toNullable(
  schema: JsonSchema,
): JsonSchema {
  if (typeof schema.$ref === "string") {
    return {
      allOf: [ schema ],
      nullable: true,
    };
  }
  return {
    ...schema,
    nullable: true,
  };
}

function rewriteRefs(
  value: unknown,
): unknown {
  if (typeof value === "string") {
    return value.startsWith(REF_PREFIX)
      ? COMPONENT_REF_PREFIX + value.slice(REF_PREFIX.length)
      : value;
  }
  if (Array.isArray(value)) {
    return value.map(rewriteRefs);
  }
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [ key, item ] of Object.entries(value)) {
      next[key] = rewriteRefs(item);
    }
    return next;
  }
  return value;
}

function resolveRefs(
  value: unknown,
  schemas: Record<string, JsonSchema>,
  seen: Set<string> = new Set(),
): unknown {
  if (Array.isArray(value)) {
    return value.map(function(item) {
      return resolveRefs(item, schemas, seen);
    });
  }
  if (value && typeof value === "object") {
    const obj = value as JsonSchema;
    if (typeof obj.$ref === "string" && obj.$ref.startsWith(COMPONENT_REF_PREFIX)) {
      const name = obj.$ref.slice(COMPONENT_REF_PREFIX.length);
      if (!seen.has(name) && schemas[name]) {
        const nextSeen = new Set(seen);
        nextSeen.add(name);
        return resolveRefs(schemas[name], schemas, nextSeen);
      }
    }
    const next: JsonSchema = {};
    for (const [ key, item ] of Object.entries(obj)) {
      next[key] = resolveRefs(item, schemas, seen);
    }
    return next;
  }
  return value;
}

let cachedSpec: ReturnType<typeof buildOaiSpec> | undefined;

/** 获取合并后的 openapi 规范, 进程内只生成一次 */
export function getOaiSpec() {
  if (!cachedSpec) {
    cachedSpec = buildOaiSpec(oaiRoutes);
  }
  return cachedSpec;
}

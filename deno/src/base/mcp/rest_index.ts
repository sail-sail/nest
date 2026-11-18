import {
  z,
} from "zod";

import type {
  ZodType,
} from "zod";

import {
  matchOaiRoute,
} from "/src/base/oai/oai.match.ts";

import {
  oaiRoutes,
} from "/src/base/oai/oai.routes.ts";

import {
  buildOaiOperationDetail,
  getPathParameterNames,
} from "/src/base/oai/oai.spec.ts";

import type {
  OaiRoute,
} from "/src/base/oai/oai.types.ts";

interface RestEndpoint {
  route: OaiRoute;
  name: string;
  relatedTypes: string[];
  pathParameters: string[];
}

let cachedEndpoints: RestEndpoint[] | undefined;

/**
 * 按 method + path 调用 openapi 接口
 *
 * MCP 只允许调用注册表里的接口, 不做任意 URL 请求
 */
export function matchRestEndpoint(
  method: string,
  path: string,
) {
  return matchOaiRoute(method, path);
}

/** 名字或路径里带 / 就按 rest 接口处理 */
export function isRestEndpointName(
  name: string,
  kind?: string,
) {
  return kind === "endpoint" || kind === "rest" || name.includes("/");
}

/** 搜索 openapi 接口 */
export function searchRestSchema(
  query: string,
  limit = 10,
  kind?: string,
  scope?: string,
  includeSdl?: boolean,
) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) {
    throw new Error("query 不能为空");
  }
  if (kind && kind !== "endpoint" && kind !== "rest") {
    return {
      total: 0,
      source: "rest",
      items: [ ],
    };
  }
  if (scope && scope !== "all") {
    return {
      total: 0,
      source: "rest",
      items: [ ],
    };
  }

  const tokens = keyword.split(/\s+/).filter(Boolean);
  const items = getEndpoints()
    .map(function(endpoint) {
      return {
        endpoint,
        score: scoreEndpoint(endpoint, keyword, tokens),
      };
    })
    .filter(function(item) {
      return item.score > 0;
    })
    .sort(function(left, right) {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return left.endpoint.name.localeCompare(right.endpoint.name);
    })
    .slice(0, Math.min(Math.max(limit, 1), 20))
    .map(function({ endpoint }) {
      const item: Record<string, unknown> = {
        source: "rest",
        kind: "endpoint",
        name: endpoint.name,
        method: endpoint.route.method,
        path: endpoint.route.path,
        description: endpoint.route.summary,
        signature: endpoint.name,
        relatedTypes: endpoint.relatedTypes,
        pathParameters: endpoint.pathParameters,
      };
      if (includeSdl) {
        item.operation = buildOaiOperationDetail(endpoint.route).operation;
      }
      return item;
    });

  return {
    total: items.length,
    source: "rest",
    items,
  };
}

/** 按名字或路径返回单个 openapi 接口的完整定义 */
export function getRestEndpoint(
  name: string,
) {
  const target = name.trim();
  if (!target) {
    throw new Error("name 不能为空");
  }
  const normalized = target.toLowerCase();
  const matches = getEndpoints().filter(function(item) {
    return item.name.toLowerCase() === normalized
      || item.route.path.toLowerCase() === normalized;
  });
  if (matches.length === 0) {
    throw new Error(`未找到接口 ${ name }`);
  }
  if (matches.length > 1) {
    throw new Error(`接口 ${ target } 存在多个 method, 请使用 "GET ${ target }" 形式`);
  }

  const endpoint = matches[0];
  const detail = buildOaiOperationDetail(endpoint.route);
  return {
    source: "rest",
    kind: "endpoint",
    name: endpoint.name,
    method: endpoint.route.method,
    path: endpoint.route.path,
    description: endpoint.route.summary,
    signature: endpoint.name,
    relatedTypes: endpoint.relatedTypes,
    pathParameters: endpoint.pathParameters,
    operation: detail.operation,
    schemas: detail.schemas,
    queryTips: [
      "GET/DELETE 走 query 参数, POST/PUT/PATCH 走 JSON body。",
      "路径参数按 pathParameters 里的名字替换 {name}。",
    ],
  };
}

function getEndpoints() {
  if (!cachedEndpoints) {
    cachedEndpoints = oaiRoutes.map(function(route) {
      return {
        route,
        name: `${ route.method } ${ route.path }`,
        relatedTypes: collectRelatedTypes(route),
        pathParameters: getPathParameterNames(route.path),
      };
    });
  }
  return cachedEndpoints;
}

function collectRelatedTypes(
  route: OaiRoute,
) {
  const names = new Set<string>();
  const items: Array<[ZodType | undefined, "input" | "output"]> = [
    [ route.params, "input" ],
    [ route.query, "input" ],
    [ route.body, "input" ],
    [ route.output, "output" ],
  ];

  for (const [ schema, io ] of items) {
    if (!schema) {
      continue;
    }
    const json = z.toJSONSchema(schema, {
      target: "openapi-3.0",
      io,
    }) as {
      definitions?: Record<string, unknown>;
    };
    for (const name of Object.keys(json.definitions ?? {})) {
      names.add(name);
    }
  }

  return Array.from(names);
}

function scoreEndpoint(
  endpoint: RestEndpoint,
  keyword: string,
  tokens: string[],
) {
  const route = endpoint.route;
  const path = route.path.toLowerCase();
  const summary = route.summary.toLowerCase();
  const description = (route.description || "").toLowerCase();
  const relatedTypes = endpoint.relatedTypes.join(" ").toLowerCase();
  let score = 0;

  if (path === keyword || endpoint.name.toLowerCase() === keyword) {
    score += 100;
  }
  if (path.includes(keyword)) {
    score += 40;
  }
  if (summary.includes(keyword)) {
    score += 30;
  }
  if (relatedTypes.includes(keyword)) {
    score += 25;
  }
  if (description.includes(keyword)) {
    score += 10;
  }
  for (const token of tokens) {
    if (path.includes(token)) {
      score += 5;
    }
    if (summary.includes(token)) {
      score += 5;
    }
    if (relatedTypes.includes(token)) {
      score += 3;
    }
    if (description.includes(token)) {
      score += 2;
    }
    if (route.module.toLowerCase().includes(token)) {
      score += 3;
    }
  }

  return score;
}

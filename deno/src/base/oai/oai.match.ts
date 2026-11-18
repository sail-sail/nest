import {
  match,
  type MatchFunction,
} from "path-to-regexp";

import {
  oaiRoutes,
} from "./oai.routes.ts";

import type {
  OaiRoute,
} from "./oai.types.ts";

interface OaiMatcher {
  route: OaiRoute;
  match: MatchFunction;
}

let matchers: OaiMatcher[] | undefined;

function getMatchers() {
  if (!matchers) {
    matchers = oaiRoutes.map(function(route) {
      return {
        route,
        match: match(route.path, {
          decode: safeDecode,
        }),
      };
    });
  }
  return matchers;
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** 按 method + 实际路径匹配注册表里的接口, 返回路径参数 */
export function matchOaiRoute(
  method: string,
  path: string,
) {
  const nextMethod = method.toUpperCase();
  for (const item of getMatchers()) {
    if (item.route.method !== nextMethod) {
      continue;
    }
    const result = item.match(path);
    if (result) {
      return {
        route: item.route,
        params: result.params as Record<string, string>,
      };
    }
  }
  return undefined;
}

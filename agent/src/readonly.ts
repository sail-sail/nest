import { Kind, parse } from "graphql";

export class ReadonlyViolation extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReadonlyViolation";
  }
}

/**
 * 只读闸门：只拦 mutation / subscription，语法错误交给 Rust 返回。
 * 匿名 query、片段、变量都放行。
 */
export function assertReadonlyQuery(query: string): void {
  let document;
  try {
    document = parse(query);
  } catch {
    return;
  }
  for (const definition of document.definitions) {
    if (definition.kind !== Kind.OPERATION_DEFINITION) continue;
    if (definition.operation === "mutation") {
      throw new ReadonlyViolation("当前智能体为只读模式，不允许执行 mutation");
    }
    if (definition.operation === "subscription") {
      throw new ReadonlyViolation("当前智能体不支持 subscription");
    }
  }
}

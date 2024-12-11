import {
  Router,
  Context as OakContext,
} from "@oak/oak";

import {
  commit,
  log,
  error,
  rollback,
  newContext,
  runInAsyncHooks,
} from "/lib/context.ts";

import {
  buildASTSchema,
  parse,
  execute,
  validateSchema,
  validate,
  // GraphQLScalarType,
  // Kind,
  type GraphQLSchema,
  type GraphQLError,
  type DocumentNode,
} from "graphql";

import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  handleRequestId,
} from "/lib/oak/request_id.ts";

const gqlRouter = new Router();

const _gqlSchemaStr = /* GraphQL */`
scalar JSON
scalar NaiveDateTime
scalar NaiveDate
scalar NaiveTime
scalar DateTime
scalar Date
scalar Decimal
scalar BigDecimal
scalar Uuid
"分页输入"
input PageInput {
  pgOffset: Int
  pgSize: Int
}
"排序输入"
input SortInput {
  prop: String
  order: SortOrderEnum
}
enum SortOrderEnum {
  asc
  ascending
  desc
  descending
}
enum UniqueType {
  throw
  update
  ignore
}
type Query {
  _version: String
}
`;

let gqlSchemaStr = _gqlSchemaStr;

let gqlSchema: GraphQLSchema | undefined;

const _gqlRootValue = {
  _version: function() {
    return "1.0.0";
  },
};

// deno-lint-ignore ban-types
let gqlRootValue: { [key: string]: Function | undefined; } = { ..._gqlRootValue };

/**
 * 重置GraphQL所有API
 */
export function clearSchema() {
  gqlSchema = undefined;
  gqlSchemaStr = _gqlSchemaStr;
  gqlRootValue = { ..._gqlRootValue };
  queryCacheMap.clear();
}

// function getTypeResolver() {
//   return {
//     Decimal: new GraphQLScalarType({
//       name: "Decimal",
//       description: "Decimal custom scalar type",
//       serialize(value) {
//         return (value as Decimal).toString();
//       },
//       parseValue(value) {
//         if (typeof value === "string" || Number.isFinite(value)) {
//           return new Decimal(value as string);
//         }
//         throw new Error("参数类型错误");
//       },
//       parseLiteral(ast) {
//         if (ast.kind === Kind.STRING) {
//           return new Decimal(ast.value);
//         }
//         throw new Error("参数类型错误");
//       },
//     }),
//   };
// }

function mergeSchema(gqlSchemaStr: string): string {
  let gqlSchemaStr2 = "";
  let queryStr = "";
  let queryBegin = false;
  let mutationStr = "";
  let mutationBegin = false;
  const arr = gqlSchemaStr.split("\n");
  for (let i = 0; i < arr.length; i++) {
    const line = arr[i];
    if (!queryBegin && line.trim().startsWith("type Query")) {
      queryBegin = true;
      continue;
    }
    if (queryBegin && line.trim().startsWith("}")) {
      queryBegin = false;
      continue;
    }
    if (queryBegin) {
      queryStr += line + "\n";
      continue;
    }
    if (!mutationBegin && line.trim().startsWith("type Mutation")) {
      mutationBegin = true;
      continue;
    }
    if (mutationBegin && line.trim().startsWith("}")) {
      mutationBegin = false;
      continue;
    }
    if (mutationBegin) {
      mutationStr += line + "\n";
      continue;
    }
    gqlSchemaStr2 += line + "\n";
  }
  if (queryStr) {
    gqlSchemaStr2 += `type Query {
${ queryStr }
}
`;
  }
  if (mutationStr) {
    gqlSchemaStr2 += `type Mutation {
${ mutationStr }
}
`;
  }
  return gqlSchemaStr2;
}

const queryCacheMap = new Map<string, {
  document: DocumentNode,
  validationErrors: readonly GraphQLError[],
}>();

async function handleGraphql(
  oakCtx: OakContext,
  gqlObj: {
    query: string,
    variables?: { [key: string]: unknown; },
  },
) {
  if (gqlSchema === undefined) {
    const document = parse(mergeSchema(gqlSchemaStr), {
      noLocation: true,
    });
    gqlSchema = buildASTSchema(
      document,
      {
        assumeValidSDL: true,
        assumeValid: true,
      },
    );
    const schemaValidationErrors = validateSchema(gqlSchema);
    if (schemaValidationErrors.length > 0) {
      throw schemaValidationErrors[0];
    }
  }
  const query: string = gqlObj.query;
  const variables = gqlObj.variables;
  // deno-lint-ignore no-explicit-any
  let result: any;
  let isValidationError = false;
  try {
    let documentInfo = queryCacheMap.get(query);
    if (!documentInfo) {
      try {
        const document = parse(query);
        const validationErrors = validate(gqlSchema!, document);
        documentInfo = {
          document,
          validationErrors,
        };
        queryCacheMap.set(query, documentInfo);
      } catch (syntaxError) {
        result = {
          errors: [ syntaxError ],
        };
        documentInfo = undefined;
        queryCacheMap.delete(query);
      }
    }
    const validationErrors = documentInfo?.validationErrors;
    if (validationErrors && validationErrors.length > 0) {
      result = {
        errors: validationErrors,
      };
      isValidationError = true;
      documentInfo = undefined;
      queryCacheMap.delete(query);
    }
    const document = documentInfo?.document;
    if (document && !result) {
      result = await execute({
        schema: gqlSchema!,
        document,
        rootValue: new Proxy(
          gqlRootValue,
          {
            get(target: typeof gqlRootValue, prop: string) {
              // deno-lint-ignore no-explicit-any
              return function(...args: any[]) {
                const callback = target[prop];
                if (!callback || typeof callback !== "function") {
                  throw new Error(`方法 ${ prop } 不存在!`);
                }
                const args2 = args[2].fieldNodes[0].arguments;
                // deno-lint-ignore no-explicit-any
                const cbArgs = args2?.map((item: any) => args[0][item.name.value]);
                const context = newContext(oakCtx);
                return runInAsyncHooks(context, async function() {
                  // deno-lint-ignore no-explicit-any
                  let res: any;
                  let isRollback = false;
                  try {
                    res = await callback.apply(null, cbArgs);
                  } catch (err) {
                    if (err instanceof ServiceException) {
                      if (err._rollback !== false) {
                        isRollback = true;
                      }
                    } else {
                      isRollback = true;
                    }
                    throw err;
                  } finally {
                    if (isRollback) {
                      await rollback();
                    } else {
                      await commit();
                    }
                  }
                  return res;
                });
              };
            },
          },
        ),
        variableValues: variables,
        // operationName: undefined,
        // fieldResolver: undefined,
        // typeResolver: undefined,
      });
    }
    const errors = result.errors as GraphQLError[];
    if (errors && errors.length > 0) {
      result.errors = [ ];
      const msgArr: string[] = [ ];
      for (let i = 0; i < errors.length; i++) {
        const err: GraphQLError = errors[i];
        if (err.originalError instanceof ServiceException) {
          result.errors.push({
            code: err.originalError.code,
            message: err.originalError.message,
          });
          if (err.originalError.message) {
            log(err.originalError.message);
          }
        } else if (isValidationError) {
          const message = errors[0].message;
          result.errors.push({
            message,
          });
          log(`GraphQL Query Error: ${ message }`);
        } else if (err.originalError?.name === "NonErrorThrown") {
          // deno-lint-ignore no-explicit-any
          const message = (err.originalError as any).thrownValue;
          result.errors.push({
            message,
          });
          log(message);
        } else {
          error(err);
          const errLen = errors.length;
          for (let i = 0; i < errLen; i++) {
            const error: GraphQLError = errors[i];
            const msg = error.message || error.toString();
            if (msgArr.includes(msg)) {
              continue;
            }
            msgArr.push(msg);
          }
        }
      }
      if (msgArr.length > 0) {
        result.errors.push({
          message: msgArr.join("\n"),
        });
      }
    }
  } catch (err) {
    error(err);
  }
  return result;
}

gqlRouter.post("/graphql", async function(ctx) {
  const request = ctx.request;
  const response = ctx.response;
  if (await handleRequestId(
    response,
    request.headers.get("x-request-id"),
  )) {
    return;
  }
  if (!request.hasBody || request.body.type() !== "json") {
    response.body = {
      code: 1,
      errMsg: "Invalid request body",
    };
    return;
  }
  const body = request.body;
  const gqlObj = await body.json();
  try {
    response.body = await handleGraphql(ctx, gqlObj);
  } catch (err0) {
    const err = err0 as Error;
    error(err);
    response.body = {
      errors: [
        {
          message: err.message || err.toString(),
        },
      ],
    };
  }
});

gqlRouter.get("/graphql", async function(ctx) {
  const request = ctx.request;
  const response = ctx.response;
  await handleRequestId(
    response,
    request.headers.get("x-request-id"),
  );
  const query = request.url.searchParams.get("query");
  if (!query) {
    throw new ServiceException("graphql query can not be empty", "invalid_request_query");
  }
  const variablesStr = request.url.searchParams.get("variables");
  // deno-lint-ignore no-explicit-any
  let variables: any = undefined;
  if (variablesStr) {
    variables = JSON.parse(variablesStr);
  }
  try {
    response.body = await handleGraphql(
      ctx,
      {
        query,
        variables,
      },
    );
  } catch (err0) {
    const err = err0 as Error;
    error(err);
    response.body = {
      errors: [
        {
          message: err.message || err.toString(),
        },
      ],
    };
  }
});

function defineGraphql(
  // deno-lint-ignore ban-types
  callback?: { [key: string]: Function; },
  str?: string,
) {
  if (str) {
    gqlSchemaStr += str + "\n";
    if (gqlSchema) {
      gqlSchema = undefined;
    }
  }
  if (callback) {
    const keys = Object.keys(callback);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (gqlRootValue[key]) {
        throw new ServiceException(`方法 ${ key } 重复: ${ gqlRootValue[key] }, ${ callback[key] }`);
      }
      gqlRootValue[key] = callback[key];
    }
  }
}

export {
  gqlRouter,
  defineGraphql,
};

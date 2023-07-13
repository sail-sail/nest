import {
  Router,
} from "oak";

import {
  commit,
  log,
  error,
  rollback,
} from "/lib/context.ts";

import {
  buildASTSchema,
  parse,
  execute,
  validateSchema,
  validate,
  GraphQLScalarType,
  Kind,
  type GraphQLSchema,
  type GraphQLError,
  type DocumentNode,
} from "graphql";

import { ServiceException } from "/lib/exceptions/service.exception.ts";

// import {
//   Decimal,
// } from "decimal.js";

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

const gqlRootValueProxy = new Proxy(
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
        const cbArgs = args2.map((item: any) => args[0][item.name.value]);
        return callback.apply(null, cbArgs);
      };
    },
  },
);

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

const requestIdMap = new Map<string, number>();

async function handleGraphql(
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
        rootValue: gqlRootValueProxy,
        variableValues: variables,
        // operationName: undefined,
        // fieldResolver: undefined,
        // typeResolver: undefined,
      });
    }
    const errors = result.errors as GraphQLError[];
    if (errors && errors.length > 0) {
      if (errors.length === 1) {
        const err = errors[0];
        if (err.originalError instanceof ServiceException) {
          result.errors = [
            {
              code: err.originalError.code,
              message: err.originalError.message,
            }
          ];
          if (err.originalError.message) {
            log(err.originalError.message);
          }
          if (err.originalError._rollback !== false) {
            await rollback();
          } else {
            await commit();
          }
        } else if (isValidationError) {
          const message = errors[0].message;
          result.errors = [
            {
              message,
            }
          ];
          log(`GraphQL Query Error: ${ message }`);
        } else if (err.originalError?.name === "NonErrorThrown") {
          // deno-lint-ignore no-explicit-any
          const message = (err.originalError as any).thrownValue;
          result.errors = [
            {
              message,
            }
          ];
          await rollback();
          log(message);
        } else {
          error(err);
          await rollback();
          let msg = "";
          const errLen = errors.length;
          for (let i = 0; i < errLen; i++) {
            const error: GraphQLError = errors[i];
            msg += error.message || error.toString();
            if (i < errLen - 1) {
              msg += "\n";
            }
          }
          result.errors = [
            {
              message: msg,
            },
          ];
        }
      } else {
        await rollback();
        let msg = "";
        for (let i = 0; i < errors.length; i++) {
          const error: GraphQLError = errors[i];
          msg += error.toString() + "\n";
        }
        error(msg);
      }
    } else {
      await commit();
    }
  } catch (err) {
    error(err);
    await rollback();
  }
  return result;
}

function handleRequestId(requestId?: string | null) {
  if (!requestId) {
    return;
  }
  if (requestIdMap.has(requestId)) {
    if (requestIdMap.get(requestId)) {
      clearTimeout(requestIdMap.get(requestId));
    }
    requestIdMap.set(requestId, setTimeout(() => {
      requestIdMap.delete(requestId);
    }, 1000 * 60 * 2));
    throw new ServiceException(`Request ID is duplicated: ${ requestId }`, "request_id_duplicated");
  }
  requestIdMap.set(requestId, setTimeout(() => {
    requestIdMap.delete(requestId);
  }, 1000 * 60 * 2));
}

gqlRouter.post("/graphql", async function(ctx) {
  const request = ctx.request;
  handleRequestId(request.headers.get("Request-ID"));
  const response = ctx.response;
  const body = request.body();
  if (body.type !== "json") {
    response.body = {
      code: 1,
      errMsg: "Invalid request body",
    };
    return;
  }
  const gqlObj = await body.value;
  try {
    response.body = await handleGraphql(gqlObj);
  } catch (err) {
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
  handleRequestId(request.headers.get("Request-ID"));
  const response = ctx.response;
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
    response.body = await handleGraphql({
      query,
      variables,
    });
  } catch (err) {
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

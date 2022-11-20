import {
  Router,
} from "oak";

import {
  commit,
  log,
  error,
  rollback,
  useContext,
} from "/lib/context.ts";

import {
  buildSchema,
  parse,
  execute,
  validateSchema,
  validate,
  type GraphQLSchema,
  type GraphQLError,
  type DocumentNode,
} from "graphql";

import { ServiceException } from "/lib/exceptions/service.exception.ts";

const gqlRouter = new Router();

const _gqlSchemaStr = /* GraphQL */`
scalar JSON
"分页输入"
input PageInput {
  pgOffset: Int
  pgSize: Int
  orderBy: String
  orderDec: Boolean
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
        if (!callback) {
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

gqlRouter.post("/graphql", async function(ctx) {
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.response.body = {
      code: 1,
      errMsg: "Unsupported Media Type",
    };
    return;
  }
  const context = useContext();
  try {
    const gqlObj = await body.value;
    if (gqlSchema === undefined) {
      gqlSchema = buildSchema(mergeSchema(gqlSchemaStr));
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
          contextValue: context,
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
            log(err.originalError.message);
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
    ctx.response.body = result;
  } catch (err) {
    error(err);
    ctx.response.body = {
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

import { Router } from "oak";
import {
  type Context,
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
input PageInput {
  pgOffset: Int
  pgSize: Int
  orderBy: String
  orderDec: Boolean
}
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

let gqlSchema: GraphQLSchema|undefined;

const _gqlRootValue = {
  _version: function() {
    return "1.0.0";
  },
};

// deno-lint-ignore ban-types
const gqlRootValue: { [key: string]: Function | undefined; } = Object.assign({ }, _gqlRootValue);

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
        const args0 = args[2].fieldNodes[0].arguments;
        const len: number = args0.length;
        // deno-lint-ignore no-explicit-any
        const cbArgs: any[] = new Array(len + 1);
        cbArgs[0] = args[1];
        for (let i = 0; i < args0.length; i++) {
          const ele = args0[i];
          cbArgs[i+1] = args[0][ele.name.value];
        }
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

export function resetGqlSchema() {
  if (gqlSchema) {
    console.log("resetGqlSchema")
  }
  gqlSchema = buildSchema(mergeSchema(gqlSchemaStr));
  const schemaValidationErrors = validateSchema(gqlSchema);
  if (schemaValidationErrors.length > 0) {
    throw schemaValidationErrors[0];
  }
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
  // deno-lint-ignore no-explicit-any
  const context: Context = (ctx as any)._context;
  try {
    const gqlObj = await body.value;
    if (gqlSchema === undefined) {
      resetGqlSchema();
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
          const error = errors[0];
          if (error.originalError instanceof ServiceException) {
            result.errors = [
              {
                code: error.originalError.code,
                message: error.originalError.message,
              }
            ];
            context.log(error.originalError.message);
            if (error.originalError._rollback !== false) {
              await context.rollback();
            } else {
              await context.commit();
            }
          } else if (isValidationError) {
            const message = errors[0].message;
            result.errors = [
              {
                message,
              }
            ];
            context.log(`GraphQL Query Error: ${ message }`);
          } else if (error.originalError?.name === "NonErrorThrown") {
            // deno-lint-ignore no-explicit-any
            const message = (error.originalError as any).thrownValue;
            result.errors = [
              {
                message,
              }
            ];
            await context.rollback();
            context.log(message);
          } else {
            context.error(error);
            await context.rollback();
            let msg = "";
            for (let i = 0; i < errors.length; i++) {
              const error: GraphQLError = errors[i];
              msg += error.toString() + "\n";
            }
            result.errors = [
              {
                message: msg,
              }
            ];
          }
        } else {
          await context.rollback();
          let msg = "";
          for (let i = 0; i < errors.length; i++) {
            const error: GraphQLError = errors[i];
            msg += error.toString() + "\n";
          }
          context.error(msg);
        }
      } else {
        await context.commit();
      }
    } catch (err) {
      context.error(err);
      await context.rollback();
    }
    ctx.response.body = result;
  } catch (err) {
    context.error(err);
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

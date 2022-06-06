import { Router } from "oak";
import { graphql, buildSchema, GraphQLSchema, GraphQLError } from "graphql";
import { Context } from "/lib/context.ts";
import { ServiceException } from "/lib/exceptions/service.exception.ts";

const gqlRouter = new Router();

let gqlSchemaStr = /* GraphQL */`
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

let gqlSchema: GraphQLSchema|undefined;

export function resetGqlSchema() {
  if (gqlSchema) {
    console.log("resetGqlSchema")
  }
  gqlSchema = buildSchema(mergeSchema(gqlSchemaStr));
}

// deno-lint-ignore ban-types
const gqlRootValue: { [key: string]: Function; } = {
  _version: function() {
    return "1.0.0";
  },
};

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
    // deno-lint-ignore no-explicit-any
    let result: any;
    try {
      result = await graphql({
        schema: gqlSchema,
        source: gqlObj.query,
        variableValues: gqlObj.variables,
        rootValue: gqlRootValue,
        contextValue: context,
      });
      // NonErrorThrown
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
          } else if (error.originalError?.name === "NonErrorThrown") {
            result.errors = [
              {
                message: error.originalError.thrownValue,
              }
            ];
            context.log(error.originalError.thrownValue);
            await context.rollback();
          } else {
            context.error(error);
            await context.rollback();
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
      code: 1,
      errMsg: err?.message || err?.toString() || "",
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
  }
  if (callback) {
    const keys = Object.keys(callback);
    keys.forEach((key) => {
      // deno-lint-ignore no-explicit-any
      gqlRootValue[key] = function(...args: any[]) {
        // deno-lint-ignore no-explicit-any
        const cbArgs: any[] = [ args[1] ];
        for (let i = 0; i < args[2].fieldNodes[0].arguments.length; i++) {
          const ele = args[2].fieldNodes[0].arguments[i];
          cbArgs.push(args[0][ele.name.value]);
        }
        return callback[key].apply(this, cbArgs);
      };
    });
  }
}

export {
  gqlRouter,
  defineGraphql,
};
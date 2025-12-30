import { CodegenConfig } from "@graphql-codegen/cli";
import { getScalars } from "./graphql_codegen_scalars.ts";
import { getScalars as getScalarsPC } from "./graphql_pc_ids.ts";
 
const config: CodegenConfig = {
  "schema": [
    "./gen/**/*.graphql.ts",
    "./src/**/*.graphql.ts",
    "./lib/oak/gql.ts",
    "./lib/**/*.graphql.ts"
  ],
  "generates": {
    "./gen/types.ts": {
      "plugins": [
        "typescript",
        "typescript-operations"
      ],
      "config": {
        "declarationKind": "interface",
        "useTypeImports": true,
        "scalars": {
          "Decimal": {
            "input": "InstanceType<typeof import(\"decimal.js\").default>",
            "output": "InstanceType<typeof import(\"decimal.js\").default>"
          },
          "BigDecimal": {
            "input": "InstanceType<typeof import(\"decimal.js\").default>",
            "output": "InstanceType<typeof import(\"decimal.js\").default>"
          },
          "NaiveDate": {
            "input": "string",
            "output": "string"
          },
          "Date": {
            "input": "string",
            "output": "string"
          },
          "DateTime": {
            "input": "string",
            "output": "string"
          },
          "JSON": {
            "input": "string",
            "output": "string"
          },
          "Uuid": {
            "input": "string",
            "output": "string"
          },
          "NaiveTime": {
            "input": "string",
            "output": "string"
          },
          "NaiveDateTime": {
            "input": "string",
            "output": "string"
          },
          "JSONObject": {
            "input": "Record<string, any>",
            "output": "Record<string, any>"
          },
          "JSONArray": {
            "input": "any[]",
            "output": "any[]"
          },
          ...getScalars(),
        }
      }
    },
    "../pc/src/typings/types.ts": {
      "plugins": [
        "typescript",
        "typescript-operations"
      ],
      "config": {
        "declarationKind": "interface",
        "useTypeImports": true,
        "scalars": {
          "Decimal": {
            "input": "InstanceType<typeof import(\"decimal.js\").default>",
            "output": "InstanceType<typeof import(\"decimal.js\").default>"
          },
          "BigDecimal": {
            "input": "InstanceType<typeof import(\"decimal.js\").default>",
            "output": "InstanceType<typeof import(\"decimal.js\").default>"
          },
          "NaiveDate": {
            "input": "string",
            "output": "string"
          },
          "Date": {
            "input": "string",
            "output": "string"
          },
          "DateTime": {
            "input": "string",
            "output": "string"
          },
          "JSON": {
            "input": "string",
            "output": "string"
          },
          "Uuid": {
            "input": "string",
            "output": "string"
          },
          "NaiveTime": {
            "input": "string",
            "output": "string"
          },
          "NaiveDateTime": {
            "input": "string",
            "output": "string"
          },
          "JSONObject": {
            "input": "Record<string, any>",
            "output": "Record<string, any>"
          },
          "JSONArray": {
            "input": "any[]",
            "output": "any[]"
          },
          ...getScalarsPC(),
        }
      }
    },
    "../nuxt/typings/types.ts": {
      "plugins": [
        "typescript",
        "typescript-operations"
      ],
      "config": {
        "declarationKind": "interface",
        "useTypeImports": true,
        "scalars": {
          "Decimal": {
            "input": "InstanceType<typeof import(\"decimal.js-light\").default>",
            "output": "InstanceType<typeof import(\"decimal.js-light\").default>"
          },
          "BigDecimal": {
            "input": "InstanceType<typeof import(\"decimal.js-light\").default>",
            "output": "InstanceType<typeof import(\"decimal.js-light\").default>"
          },
          "NaiveDate": {
            "input": "string",
            "output": "string"
          },
          "Date": {
            "input": "string",
            "output": "string"
          },
          "DateTime": {
            "input": "string",
            "output": "string"
          },
          "JSON": {
            "input": "string",
            "output": "string"
          },
          "Uuid": {
            "input": "string",
            "output": "string"
          },
          "NaiveTime": {
            "input": "string",
            "output": "string"
          },
          "NaiveDateTime": {
            "input": "string",
            "output": "string"
          },
          ...getScalarsPC(),
        }
      }
    },
    "../uni/src/typings/types.ts": {
      "plugins": [
        "typescript",
        "typescript-operations"
      ],
      "config": {
        "declarationKind": "interface",
        "useTypeImports": true,
        "scalars": {
          "Decimal": {
            "input": "InstanceType<typeof import(\"decimal.js\").default>",
            "output": "InstanceType<typeof import(\"decimal.js\").default>"
          },
          "BigDecimal": {
            "input": "InstanceType<typeof import(\"decimal.js\").default>",
            "output": "InstanceType<typeof import(\"decimal.js\").default>"
          },
          "NaiveDate": {
            "input": "string",
            "output": "string"
          },
          "Date": {
            "input": "string",
            "output": "string"
          },
          "DateTime": {
            "input": "string",
            "output": "string"
          },
          "JSON": {
            "input": "string",
            "output": "string"
          },
          "Uuid": {
            "input": "string",
            "output": "string"
          },
          "NaiveTime": {
            "input": "string",
            "output": "string"
          },
          "NaiveDateTime": {
            "input": "string",
            "output": "string"
          },
          "JSONObject": {
            "input": "Record<string, any>",
            "output": "Record<string, any>"
          },
          "JSONArray": {
            "input": "any[]",
            "output": "any[]"
          },
          ...getScalarsPC(),
        }
      }
    }
  }
};

export default config;

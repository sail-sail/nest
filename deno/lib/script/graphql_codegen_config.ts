import { CodegenConfig } from "@graphql-codegen/cli";
import { scalars } from "./graphql_codegen_scalars.ts";
 
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
          "JSON": {
            "input": "string",
            "output": "string"
          },
          "Uuid": {
            "input": "string",
            "output": "string"
          },
          "NaiveDateTime": {
            "input": "string",
            "output": "string"
          },
          ...scalars,
        }
      }
    },
    "../pc/src/typings/types.ts": {
      "plugins": [
        "typescript",
        "typescript-operations"
      ],
      "config": {
        "useTypeImports": true,
        "scalars": {
          "Decimal": {
            "input": "string",
            "output": "string"
          },
          "BigDecimal": {
            "input": "string",
            "output": "string"
          },
          "NaiveDate": {
            "input": "string",
            "output": "string"
          },
          "Date": {
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
          "NaiveDateTime": {
            "input": "string",
            "output": "string"
          }
        }
      }
    },
    "../uni/src/typings/types.ts": {
      "plugins": [
        "typescript",
        "typescript-operations"
      ],
      "config": {
        "useTypeImports": true,
        "scalars": {
          "Decimal": {
            "input": "string",
            "output": "string"
          },
          "BigDecimal": {
            "input": "string",
            "output": "string"
          },
          "NaiveDate": {
            "input": "string",
            "output": "string"
          },
          "Date": {
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
          "NaiveDateTime": {
            "input": "string",
            "output": "string"
          }
        }
      }
    }
  }
};

export default config;

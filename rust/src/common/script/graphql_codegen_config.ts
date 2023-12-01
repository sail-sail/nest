import { CodegenConfig } from "@graphql-codegen/cli";
import { getScalars } from "./graphql_codegen_scalars.ts";
import { getScalars as getScalarsPC } from "./graphql_pc_ids.ts";
 
const config: CodegenConfig = {
  "schema": [
    "./src/common/gql/base.graphql",
    "./src/common/gql/schema.graphql",
  ],
  "generates": {
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
          },
          ...getScalarsPC(),
        }
      }
    }
  }
};

export default config;

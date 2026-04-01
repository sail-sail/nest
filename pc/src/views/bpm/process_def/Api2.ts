import type {
  Mutation,
} from "#/types.ts";

import {
  intoInputProcessDef,
} from "./Api.ts";

/** 保存并发布流程 */
export async function saveAndPublishsProcessDef(
  inputs: ProcessDefInput[],
  opt?: GqlOpt,
) {
  inputs = inputs.map(intoInputProcessDef);

  const data: {
    saveAndPublishsProcessDef: Mutation["saveAndPublishsProcessDef"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [ProcessDefInput!]!) {
        saveAndPublishsProcessDef(inputs: $inputs)
      }
    `,
    variables: {
      inputs,
    },
  }, opt);

  return data.saveAndPublishsProcessDef;
}
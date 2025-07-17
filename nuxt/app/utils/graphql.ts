/* eslint-disable @typescript-eslint/no-explicit-any */
import { uniqueID, uuid } from "./StringUtil";

import {
  type FieldNode,
  type OperationDefinitionNode,
  type FragmentDefinitionNode,
  Kind,
  parse,
  print,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
} from "graphql/index.mjs";

import combinedQuery from "graphql-combine-query";

import { useAuthorization } from "@/store/usr";

declare global {
  
  interface GqlArg {
    operationName?: string,
    query: string,
    variables?: { [key: string]: any },
  }
  
  interface GqlOpt {
    showErrMsg?: boolean;
    duration?: number;
    timeout?: number;
    notLoading?: boolean;
    isMutation?: boolean;
    "Request-ID"?: string;
    authorization?: string;
  }
  
}

let queryInfos: QueryInfo[] = [ ];
let queryInfosRepeat: QueryInfo[][] = [ ];
let tasks: QueryInfo[][] = [ ];
let tasksRepeat: QueryInfo[][][] = [ ];

class QueryInfo {
  gqlArg?: GqlArg = undefined;
  hash?: string = undefined;
  result?: Promise<any> = undefined;
  resolve?: ((value: unknown) => void) = undefined;
  reject?: ((reason?: any) => void) = undefined;
}

function findQueryInfosIdx(queryInfos: QueryInfo[], queryInfo: QueryInfo) {
  const idx = queryInfos.findIndex((item) => {
    if (item.gqlArg!.query !== queryInfo.gqlArg!.query) {
      return false;
    }
    if (item.gqlArg!.variables != null && queryInfo.gqlArg!.variables == null) {
      return false;
    }
    if (item.gqlArg!.variables == null && queryInfo.gqlArg!.variables != null) {
      return false;
    }
    if (item.gqlArg!.variables == null && queryInfo.gqlArg!.variables == null) {
      return true;
    }
    const keys1 = Object.keys(item.gqlArg!.variables!);
    const keys2 = Object.keys(queryInfo.gqlArg!.variables!);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let i = 0; i < keys1.length; i++) {
      const key = keys1[i] as string;
      if (item.gqlArg!.variables![key] !== queryInfo.gqlArg!.variables![key]) {
        return false;
      }
    }
    return true;
  });
  return idx;
}

/**
 * 发送 GraphQL 查询请求
 */
export async function query(gqlArg: GqlArg, opt?: GqlOpt): Promise<any> {
  const queryInfo = new QueryInfo();
  queryInfo.gqlArg = gqlArg;
  queryInfo.result = new Promise(function(resolve, reject) {
    queryInfo.resolve = resolve;
    queryInfo.reject = reject;
  });
  const idx = findQueryInfosIdx(queryInfos, queryInfo);
  if (idx !== -1) {
    queryInfosRepeat[idx] = queryInfosRepeat[idx] || [ ];
    queryInfosRepeat[idx].push(queryInfo);
  } else {
    queryInfos.push(queryInfo);
  }
  await Promise.resolve();
  const queryInfos2 = queryInfos;
  const queryInfosRepeat2 = queryInfosRepeat;
  queryInfos = [ ];
  queryInfosRepeat = [ ];
  if (queryInfos2.length === 1 && queryInfosRepeat2.length === 0) {
    return await gqlQuery(gqlArg, opt);
  }
  if (queryInfos2.length >= 1) {
    for (let i = 0; i < queryInfos2.length; i++) {
      const queryInfo = queryInfos2[i];
      const hash = `l${ uniqueID() }`;
      queryInfo!.hash = hash;
    }
    tasks.push(queryInfos2);
    tasksRepeat.push(queryInfosRepeat2);
    (async function() {
      const queryBuilder = combinedQuery("");
      let queryBuilderAdd: ReturnType<typeof queryBuilder.add> | undefined;
      for (let i = 0; i < queryInfos2.length; i++) {
        const queryInfo = queryInfos2[i];
        const queryTmp = queryInfo!.gqlArg!.query!;
        const variablesTmp = queryInfo!.gqlArg?.variables;
        const queryDoc = parse(queryTmp);
        let operationDefinitionNode: OperationDefinitionNode | FragmentDefinitionNode | undefined = undefined;
        for (const definition of queryDoc.definitions) {
          if (definition.kind !== Kind.OPERATION_DEFINITION) {
            continue;
          }
          operationDefinitionNode = definition;
          break;
        }
        if (!operationDefinitionNode) {
          throw new Error("operationDefinitionNode is undefined");
        }
        const selections = operationDefinitionNode.selectionSet.selections as FieldNode[];
        const variableDefinitions = operationDefinitionNode.variableDefinitions;
        if (variableDefinitions) {
          for (const variableDefinition of variableDefinitions) {
            (variableDefinition.variable.name as any).value = `${ variableDefinition.variable.name.value }${ i }`;
          }
        }
        for (let kk = 0; kk < selections.length; kk++) {
          const selection = selections[kk];
          let alias = selection.alias;
          if (!alias) {
            alias = {
              kind: Kind.NAME,
              value: "",
            };
            (selection as any).alias = alias;
          }
          (alias as any).value = `${ queryInfo!.hash! }_${ alias.value || selection.name.value }`;
          if (selection.arguments) {
            for (const arg of selection.arguments) {
              (arg.value as any).name.value = `${ (arg.value as any).name.value }${ i }`;
            }
          }
        }
        let newVariables: any;
        if (variablesTmp) {
          newVariables = { };
          for (const key of Object.keys(variablesTmp)) {
            newVariables[`${ key }${ i }`] = variablesTmp[key];
          }
        }
        if (queryBuilderAdd) {
          queryBuilderAdd = queryBuilderAdd.add(queryDoc, newVariables)
        } else {
          queryBuilderAdd = queryBuilder.add(queryDoc, newVariables);
        }
      }
      const newQuery = print(queryBuilderAdd!.document!);
      const newVariables = queryBuilderAdd?.variables as any;
      const newResult = await gqlQuery(
        {
          query: newQuery,
          variables: newVariables,
        },
        opt,
      );
      const results: { [key: string]: any } = { };
      const hashs: string[] = [ ];
      const keys = Object.keys(newResult || { });
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as string;
        const val = newResult[key];
        const idx = key.indexOf("_");
        const hash = key.substring(0, idx);
        const name = key.substring(idx + 1);
        results[hash] = results[hash] || { };
        results[hash][name] = val;
        if (!hashs.includes(hash)) {
          hashs.push(hash);
        }
      }
      
      // 从 tasks 中查找 hash 对应的 QueryInfo
      const willRemoves: number[] = [ ];
      for (let l = 0; l < hashs.length; l++) {
        const hash = hashs[l]!;
        for (let i = 0; i < tasks.length; i++) {
          const task = tasks[i]!;
          let isTaskEq = false;
          for (let k = 0; k < task.length; k++) {
            const item = task[k]!;
            if (item.hash === hash) {
              item.resolve!(results[hash]);
              const itemRepeat = queryInfosRepeat2[queryInfos2.indexOf(item)];
              if (itemRepeat && itemRepeat.length > 0) {
                for (let m = 0; m < itemRepeat.length; m++) {
                  const itemRepeatTmp = itemRepeat[m]!;
                  itemRepeatTmp.resolve!(results[hash]);
                }
              }
              isTaskEq = true;
              break;
            }
          }
          if (isTaskEq) {
            if (!willRemoves.includes(i)) {
              willRemoves.push(i);
            }
          }
        }
      }
      tasks = tasks.filter((_, i) => !willRemoves.includes(i));
      tasksRepeat = tasksRepeat.filter((_, i) => !willRemoves.includes(i));
    })();
  }
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]!;
    for (let k = 0; k < task.length; k++) {
      const item = task[k]!;
      if (item.gqlArg === gqlArg) {
        return await item.result;
      }
    }
  }
  for (let i = 0; i < tasksRepeat.length; i++) {
    const task = tasksRepeat[i]!;
    for (let k = 0; k < task.length; k++) {
      const items = task[k]!;
      if (!items) {
        continue;
      }
      for (let m = 0; m < items.length; m++) {
        const item = items[m]!;
        if (item.gqlArg === gqlArg) {
          return await item.result;
        }
      }
    }
  }
}

/**
 * 发送 GraphQL 修改请求 
 */
export async function mutation(gqlArg: GqlArg, opt?: GqlOpt): Promise<any> {
  opt = opt || { };
  opt.isMutation = true;
  return await gqlQuery(gqlArg, opt);
}

export function getQueryUrl(gqlArg: GqlArg, opt?: GqlOpt, authorization0?: string): string {
  const authorization = $(useAuthorization());
  if (authorization0 == null) {
    authorization0 = authorization;
  }
  let request_id: string | undefined;
  if (opt && opt.isMutation) {
    request_id = opt["Request-ID"] || uuid();
  }
  let url = `/api/graphql?query=${ encodeURIComponent(gqlArg.query) }&variables=${ encodeURIComponent(JSON.stringify(gqlArg.variables)) }`;
  if (request_id) {
    url += `&request_id=${ request_id }`;
  }
  if (authorization0) {
    url += `&Authorization=${ authorization0 }`;
  }
  return url;
}

async function gqlQuery(gqlArg: GqlArg, opt?: GqlOpt): Promise<any> {
  let authorization = $(useAuthorization());
  if (opt?.authorization != null) {
    authorization = opt?.authorization;
  }
  // let duration = 3000;
  // if (opt && opt.duration != null) {
  //   duration = opt.duration;
  // }
  // gqlArg.query = gqlArg.query.trim().replace(/\s+/gm, " ");
  const headers: {
    "Request-ID"?: string;
  } = { };
  if (opt && opt.isMutation) {
    let requestId = opt["Request-ID"];
    if (!requestId) {
      requestId = uuid();
    }
    headers["Request-ID"] = requestId;
  }
  let rvData: any = undefined;
  try {
    rvData = await request({
      method: "post",
      url: `/api/graphql`,
      data: gqlArg,
      timeout: opt?.timeout,
      reqType: "graphql",
      notLoading: opt?.notLoading,
      headers,
      // showErrMsg: opt?.showErrMsg,
      // duration: opt?.duration,
      isMutation: opt?.isMutation,
      authorization,
    } as any);
  } catch (err0) {
    const err = err0 as any;
    if (err.response && err.response.data) {
      rvData = err.response;
    } else {
      if (!opt || opt.showErrMsg !== false) {
        console.error(err);
      }
      throw err;
    }
  }
  const { data: { data, errors } } = rvData;
  if (errors && errors.length > 0) {
    const is_token_expired = errors.some((item: any) => {
      if (
        item.code === "token_empty" || item.code === "refresh_token_expired" ||
        item.message === "token_empty" || item.message === "refresh_token_expired"
      ) {
        return true;
      }
      return false;
    });
    if (is_token_expired) {
      // TODO 退出登录
      // usrStore.logout();
      console.error("退出登录");
      return data;
    }
  }
  let errMsg = "";
  if (errors && errors.length > 0) {
    for (let i = 0; i < errors.length; i++) {
      const item = errors[i];
      errMsg += item.message;
      if (i !== errors.length - 1) {
        errMsg += "\n";
      }
    }
  }
  if (errMsg) {
    // eslint-disable-next-line no-empty
    if (!opt || opt.showErrMsg !== false) {
    }
    if (errMsg.startsWith("Error: ")) {
      throw new Error(errMsg, { cause: errors });
    } else {
      throw errMsg;
    }
  }
  return data;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { uniqueID, uuid } from "./StringUtil";
import { request, uniLogin } from "./request";
import cfg from "./config"

import {
  type FieldNode,
  type OperationDefinitionNode,
  type FragmentDefinitionNode,
  Kind,
  parse,
  print,
} from "graphql";

import combinedQuery from "graphql-combine-query";

import useUsrStore from "@/store/usr";

declare global {
  
  interface GqlArg {
    operationName?: string,
    query: string,
    variables?: { [key: string]: any },
  }
  
  interface GqlOpt {
    showErrMsg?: boolean;
    url?: string;
    notLoading?: boolean;
    method?: string;
    data?: any;
    reqType?: string;
    notLogin?: boolean;
    duration?: number;
    isMutation?: boolean;
    "Request-ID"?: string;
    header?: { [key: string]: any };
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
      const key = keys1[i];
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
  await nextTick();
  await nextTick();
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
      queryInfo.hash = hash;
    }
    tasks.push(queryInfos2);
    tasksRepeat.push(queryInfosRepeat2);
    (async function() {
      const queryBuilder = combinedQuery("");
      let queryBuilderAdd: ReturnType<typeof queryBuilder.add> | undefined;
      for (let i = 0; i < queryInfos2.length; i++) {
        const queryInfo = queryInfos2[i];
        const queryTmp = queryInfo.gqlArg!.query!;
        const variablesTmp = queryInfo.gqlArg?.variables;
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
          (alias as any).value = `${ queryInfo.hash! }_${ alias.value || selection.name.value }`;
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
        const key = keys[i];
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
        const hash = hashs[l];
        for (let i = 0; i < tasks.length; i++) {
          const task = tasks[i];
          let isTaskEq = false;
          for (let k = 0; k < task.length; k++) {
            const item = task[k];
            if (item.hash === hash) {
              item.resolve!(results[hash]);
              const itemRepeat = queryInfosRepeat2[queryInfos2.indexOf(item)];
              if (itemRepeat && itemRepeat.length > 0) {
                for (let m = 0; m < itemRepeat.length; m++) {
                  const itemRepeatTmp = itemRepeat[m];
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
    const task = tasks[i];
    for (let k = 0; k < task.length; k++) {
      const item = task[k];
      if (item.gqlArg === gqlArg) {
        return await item.result;
      }
    }
  }
  for (let i = 0; i < tasksRepeat.length; i++) {
    const task = tasksRepeat[i];
    for (let k = 0; k < task.length; k++) {
      const items = task[k];
      if (!items) {
        continue;
      }
      for (let m = 0; m < items.length; m++) {
        const item = items[m];
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
  return await gqlQuery(gqlArg, opt);
}

export async function gqlQuery(
  gqlArg: GqlArg,
  config?: GqlOpt,
): Promise<any> {
  // gqlArg.query = gqlArg.query.trim().replace(/\s+/gm, " ");
  const header: {
    "Request-ID"?: string;
  } = { };
  if (config && config.isMutation) {
    let requestId = config["Request-ID"];
    if (!requestId) {
      requestId = uuid();
    }
    header["Request-ID"] = requestId;
  }
  let rvData: any = undefined;
  try {
    config = config || { };
    config.url = "";
    if (cfg.urlBase) {
      config.url += cfg.urlBase;
    }
    config.url += `/graphql`;
    config.method = "POST";
    config.data = gqlArg;
    config.reqType = "graphql";
    config.header = header;
    rvData = await request(config);
  } catch (err) {
    if (err && (!config || config.showErrMsg !== false)) {
      const errMsg = (err as any).errMsg || err.toString() || "";
      if (errMsg) {
        uni.showToast({
          title: errMsg,
          icon: "none",
          duration: 3000,
          mask: true,
          position: "center",
        });
      }
    }
    throw err;
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
      const usrStore = useUsrStore();
      usrStore.setAuthorization("");
      if (!config.notLogin) {
        if (await uniLogin()) {
          config = config || { };
          config.notLogin = true;
          return await gqlQuery(gqlArg, config);
        } else {
          throw "refresh_token_expired";
        }
      }
    }
  }
  let errMsg = "";
  if (errors && errors.length > 0) {
    for (let i = 0; i < errors.length; i++) {
      const item = errors[i];
      errMsg += item.message + "\n";
    }
  }
  errMsg = errMsg.trim();
  if (errMsg) {
    if (!config || config.showErrMsg !== false) {
      uni.showToast({
        title: errMsg,
        icon: "none",
        duration: config?.duration || 3000,
        mask: true,
        position: "center",
      });
    }
    if (errMsg.startsWith("Error: ")) {
      throw new Error(errMsg, { cause: errors });
    } else {
      throw errMsg;
    }
  }
  return data;
}

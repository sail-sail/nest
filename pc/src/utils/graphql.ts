/* eslint-disable @typescript-eslint/no-explicit-any */
import cfg from "@/utils/config.ts";
import { uniqueID, uuid } from "./StringUtil.ts";
import { ElMessage } from "element-plus";

import {
  type FieldNode,
  type OperationDefinitionNode,
  type FragmentDefinitionNode,
  Kind,
  parse,
  print,
} from "graphql";

import combinedQuery from "graphql-combine-query";

import useUsrStore from "../store/usr";
import useBackground_taskStore from "../store/background_task.ts";

import { request } from "./request.ts";

export {
  request,
  baseURL,
} from "./request.ts";

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
    "x-request-id"?: string;
    client_tenant_id?: TenantId | null;
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
  gqlArg.query = gqlArg.query.trim();
  if (!gqlArg.query.startsWith("query") && !gqlArg.query.startsWith("fragment ")) {
    throw new Error("query must start with 'query'");
  }
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
              if (!(arg.value as any).name) {
                continue;
              }
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
  const indexStore = useIndexStore(cfg.pinia);
  if (!opt?.notLoading && indexStore.loading > 0 && opt?.isMutation) {
    ElMessage.warning("繁忙中，请稍后再重试");
    throw "mutation loading";
  }
  opt = opt || { };
  opt.isMutation = true;
  gqlArg.query = gqlArg.query.trim();
  if (!gqlArg.query.startsWith("mutation") && !gqlArg.query.startsWith("fragment ")) {
    throw new Error("mutation must start with 'mutation'");
  }
  return await gqlQuery(gqlArg, opt);
}

export function getQueryUrl(gqlArg: GqlArg, opt?: GqlOpt, authorization?: string): string {
  if (!authorization) {
    const usrStore = useUsrStore();
    authorization = usrStore.authorization;
  }
  let request_id: string | undefined;
  if (opt && opt.isMutation) {
    request_id = opt["x-request-id"] || uuid();
  }
  let client_tenant_id = opt?.client_tenant_id;
  if (!client_tenant_id) {
    client_tenant_id = sessionStorage.getItem("client_tenant_id") as TenantId;
  }
  let url = `/graphql?query=${ encodeURIComponent(gqlArg.query) }&variables=${ encodeURIComponent(JSON.stringify(gqlArg.variables)) }`;
  if (request_id) {
    url += `&request_id=${ request_id }`;
  }
  if (client_tenant_id) {
    url += `&client_tenant_id=${ client_tenant_id }`;
  }
  if (authorization) {
    url += `&Authorization=${ authorization }`;
  }
  return url;
}

async function gqlQuery(gqlArg: GqlArg, opt?: GqlOpt): Promise<any> {
  let duration = 3000;
  if (opt && opt.duration != null) {
    duration = opt.duration;
  }
  const headers = new Headers();
  if (opt && opt.isMutation) {
    let requestId = opt["x-request-id"];
    if (!requestId) {
      requestId = uuid();
    }
    headers.set("x-request-id", requestId);
  }
  let rvData: any = undefined;
  try {
    rvData = await request({
      method: "post",
      url: `/graphql`,
      data: gqlArg,
      timeout: opt?.timeout,
      reqType: "graphql",
      notLoading: opt?.notLoading,
      headers,
      // showErrMsg: opt?.showErrMsg,
      // duration: opt?.duration,
      isMutation: opt?.isMutation,
      client_tenant_id: opt?.client_tenant_id,
    } as any);
  } catch (err0) {
    const err = err0 as any;
    if (err.response && err.response.data) {
      rvData = err.response;
    } else {
      if (!opt || opt.showErrMsg !== false) {
        const errMsg = err.message || err.toString();
        if (errMsg) {
          ElMessage({
            offset: 0,
            type: "error",
            showClose: true,
            message: errMsg,
            duration,
          });
        }
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
      const usrStore = useUsrStore(cfg.pinia);
      usrStore.logout();
      return data;
    }
    if (errors[0].code === "background_task" || errors[0].message === "background_task") {
      ElMessage.success(errors[0].message);
      const background_taskStore = useBackground_taskStore();
      background_taskStore.listDialogVisible = true;
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
    if (!opt || opt.showErrMsg !== false) {
      ElMessage({
        offset: 0,
        type: "error",
        showClose: true,
        message: errMsg,
        duration,
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

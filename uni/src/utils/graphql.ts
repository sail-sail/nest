import { request, uniLogin } from "./request";
import cfg from "./config"

import {
  type FieldNode,
  type OperationDefinitionNode,
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
  }
  
}

let queryInfos: QueryInfo[] = [ ];
let tasks: QueryInfo[][] = [ ];

class QueryInfo {
  gqlArg?: GqlArg = undefined;
  hash?: string = undefined;
  result?: Promise<any> = undefined;
  resolve?: ((value: unknown) => void) = undefined;
  reject?: ((reason?: any) => void) = undefined;
}

/**
 * @description: 发送 GraphQL 请求
 * @export
 * @param {GqlArg} gqlArg
 * @param {GqlOpt} opt?
 * @return {Promise<any>} 
 */
 export async function gqlQuery(gqlArg: GqlArg, opt?: GqlOpt): Promise<any> {
  const queryInfo = new QueryInfo();
  queryInfo.gqlArg = gqlArg;
  queryInfo.result = new Promise(function(resolve, reject) {
    queryInfo.resolve = resolve;
    queryInfo.reject = reject;
  });
  queryInfos.push(queryInfo);
  await Promise.resolve();
  const queryInfos2 = queryInfos;
  queryInfos = [ ];
  if (queryInfos2.length === 1) {
    return await _gqlQuery(gqlArg, opt);
  } else if (queryInfos2.length > 1) {
    for (let i = 0; i < queryInfos2.length; i++) {
      const queryInfo = queryInfos2[i];
      const hash = `l${ i }`;
      queryInfo.hash = hash;
    }
    tasks.push(queryInfos2);
    (async function() {
      let queryBuilder = combinedQuery("");
      let queryBuilderAdd: ReturnType<typeof queryBuilder.add> | undefined;
      for (let i = 0; i < queryInfos2.length; i++) {
        const queryInfo = queryInfos2[i];
        let queryTmp = queryInfo.gqlArg!.query!;
        const variablesTmp = queryInfo.gqlArg?.variables;
        const queryDoc = parse(queryTmp);
        const operationDefinitionNode = queryDoc.definitions[0] as OperationDefinitionNode;
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
      const newResult = await _gqlQuery(
        {
          query: newQuery,
          variables: newVariables,
        },
        opt,
      );
      const resluts: any[] = [ ];
      const hashs: string[] = [ ];
      const keys = Object.keys(newResult || { });
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const val = newResult[key];
        const idx = key.indexOf("_");
        const hash = key.substring(0, idx);
        const name = key.substring(idx + 1);
        const groupNum = Number(hash.substring(1));
        resluts[groupNum] = resluts[groupNum] || { };
        resluts[groupNum][name] = val;
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
              item.resolve!(resluts[l]);
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
}

/**
 *
 * @export
 * @param {GqlArg} gqlArg
 * @param {GqlOpt} config
 *   showErrMsg: boolean 是否显示错误信息, 默认为true
 * @return {Promise<any>} 
 */
export async function _gqlQuery(
  gqlArg: GqlArg,
  config?: GqlOpt,
): Promise<any> {
  gqlArg.query = gqlArg.query.trim().replace(/\s+/gm, " ");
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
    rvData = await request(config);
  } catch (err) {
    if (err && (!config || config.showErrMsg !== false)) {
      let errMsg = (err as any).errMsg || err.toString();
      uni.showToast({
        title: errMsg,
        icon: "none",
        duration: 3000,
        mask: true,
        position: "center",
      });
    }
    throw err;
  }
  const { data: { data, errors } } = rvData;
  let exception = errors && errors[0] && errors[0].extensions && errors[0].extensions.exception;
  if (!exception) {
    exception = errors?.[0];
  }
  if (exception) {
    if (exception.code === "token_empty" || exception.code === "refresh_token_expired") {
      const usrStore = useUsrStore();
      await usrStore.setAccessToken("");
      if (!config.notLogin) {
        if (await uniLogin()) {
          config = config || { };
          config.notLogin = true;
          return await gqlQuery(gqlArg, config);
        }
      }
    }
  }
  if (errors && (!config || config.showErrMsg !== false)) {
    let errMsg = "";
    for (let i = 0; i < errors.length; i++) {
      const item = errors[i];
      errMsg += item.message;
      if (i !== errors.length - 1) {
        errMsg += "\n";
      }
    }
    uni.showToast({
      title: errMsg,
      icon: "none",
      duration: config?.duration || 3000,
      mask: true,
      position: "center",
    });
  }
  return data;
}

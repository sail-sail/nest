import { ElMessage } from "element-plus";
import { axios } from "./axios";

import {
  type FieldNode,
  type OperationDefinitionNode,
  Kind,
  parse,
  print,
} from "graphql";

import combinedQuery from "graphql-combine-query";

import useUsrStore from "../store/usr";
import useBackground_taskStore from "../store/background_task";

export {
  axios,
  baseURL,
} from "./axios";

export interface GqlArg {
  operationName?: string,
  query: string,
  variables?: { [key: string]: any },
}

export interface GqlOpt {
  showErrMsg?: boolean,
  duration?: number,
  timeout?: number,
  notLoading?: boolean,
}

let queryInfos: QueryInfo[] = [ ];
let tasks: QueryInfo[][] = [ ];

class QueryInfo {
  gqlArg: GqlArg | undefined = undefined;
  hash: string | undefined = undefined;
  result: Promise<any> | undefined = undefined;
  resolve: ((value: unknown) => void) | undefined = undefined;
  reject: ((reason?: any) => void) | undefined = undefined;
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
      const queryBuilder = combinedQuery("");
      let queryBuilderAdd: ReturnType<typeof queryBuilder.add> | undefined;
      for (let i = 0; i < queryInfos2.length; i++) {
        const queryInfo = queryInfos2[i];
        const queryTmp = queryInfo.gqlArg!.query!;
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
 * @description: 发送 GraphQL 请求
 * @export
 * @param {GqlArg} gqlArg
 * @param {GqlOpt} opt?
 * @return {Promise<any>} 
 */
export async function _gqlQuery(gqlArg: GqlArg, opt?: GqlOpt): Promise<any> {
  let duration = 3000;
  if (opt && opt.duration != null) {
    duration = opt.duration;
  }
  // gqlArg.query = gqlArg.query.trim().replace(/\s+/gm, " ");
  let rvData: any = undefined;
  try {
    rvData = await axios.request(<any> {
      method: "post",
      url: `/graphql`,
      data: gqlArg,
      timeout: opt?.timeout,
      reqType: "graphql",
      notLoading: opt?.notLoading,
      // showErrMsg: opt?.showErrMsg,
      // duration: opt?.duration,
    });
  } catch (err) {
    if ((<any>err).response && (<any>err).response.data) {
      rvData = (<any>err).response;
    } else {
      if (!opt || opt.showErrMsg !== false) {
        ElMessage({
          offset: 0,
          type: "error",
          showClose: true,
          message: (<any>err).toString(),
          duration,
        });
      }
      throw err;
    }
  }
  const { data: { data, errors } } = rvData;
  let exception = errors && errors[0] && errors[0].extensions && errors[0].extensions.exception;
  if (!exception) {
    exception = errors?.[0];
  }
  if (exception) {
    const code = exception.code;
    const usrStore = useUsrStore();
    if (code === "refresh_token_expired") {
      usrStore.logout();
      return data;
    }
    if (code === "token_empty") {
      usrStore.logout();
      return data;
    }
    if (code === "background_task") {
      ElMessage.success(exception.message);
      const background_taskStore = useBackground_taskStore();
      background_taskStore.listDialogVisible = true;
      return data;
    }
  }
  if (!opt || opt.showErrMsg !== false) {
    if (errors && errors.length > 0) {
      let errMsg = "";
      for (let i = 0; i < errors.length; i++) {
        const item = errors[i];
        errMsg += item.message;
        if (i !== errors.length - 1) {
          errMsg += "\n";
        }
      }
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
  }
  return data;
}

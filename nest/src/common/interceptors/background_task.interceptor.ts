import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { firstValueFrom, of } from "rxjs";
import { Background_taskDao } from "../../background_task/background_task.dao";
import { Context } from "../context";
import { ServiceException } from "../exceptions/service.exception";
import { contextSym } from "../interceptors/context.interceptor";
import { shortUuidV4 } from "../util/uuid";

let GqlExecutionContext = undefined;

export const BACKGROUND_TASK_RESULT = Symbol("BACKGROUND_TASK_RESULT");

@Injectable()
export class BackgroundTaskInterceptor implements NestInterceptor {
  
  constructor(
    private readonly reflector: Reflector,
    private readonly background_taskDao: Background_taskDao,
  ) { }
  
  private async handelResult(data: any, id: string) {
    const t = this;
    if (typeof data === "object" && !(data instanceof String)) {
      data = JSON.stringify(data);
    }
    await t.background_taskDao.updateById(id, {
      state: "success",
      end_time: new Date(),
      result: data,
    });
  }
  
  private async handelErr(err: Error, id: string) {
    const t = this;
    const errMsg = err.message || err.toString();
    await t.background_taskDao.updateById(id, {
      state: "fail",
      end_time: new Date(),
      err_msg: errMsg,
    });
  }
  
  async intercept(
    exeCtx: ExecutionContext,
    next: CallHandler<any>,
  ) {
    const t = this;
    const type: string = exeCtx.getType();
    let context: Context;
    if (type === "http") {
      const httpContext = exeCtx.switchToHttp();
      const request = httpContext && httpContext.getRequest();
      context = request[contextSym];
      if (!context) {
        context = new Context();
        context.req = request;
        request[contextSym] = context;
      }
    } else if (type === "graphql") {
      if (!GqlExecutionContext) {
        GqlExecutionContext = require("@nestjs/graphql").GqlExecutionContext;
      }
      const gqlCtx = GqlExecutionContext.create(exeCtx);
      context = gqlCtx.getContext();
    }
    const begin_time = new Date();
    const observable = next.handle();
    const result = firstValueFrom(observable);
    const timeoutObj = Symbol("timeoutObj");
    const timeoutPrm = new Promise((resolve) => setTimeout(() => resolve(timeoutObj), 30000));
    const result2 = await Promise.race([ result, timeoutPrm ]);
    if (result2 === timeoutObj) {
      let taskResult: { lbl?: string, type?: string } = t.reflector.get(BACKGROUND_TASK_RESULT, exeCtx.getHandler());
      if (!taskResult) {
        taskResult = t.reflector.get(BACKGROUND_TASK_RESULT, exeCtx.getClass());
      }
      taskResult = taskResult || { };
      taskResult.type = taskResult.type || "text";
      const id = shortUuidV4();
      await t.background_taskDao.create({
        id,
        lbl: taskResult.lbl || "",
        type: taskResult.type,
        state: "running",
        begin_time,
        end_time: null,
      });
      (async function() {
        try {
          const data = await Promise.resolve(result);
          await t.handelResult(data, id);
        } catch (err) {
          await t.handelErr(err, id);
        }
      })();
      throw new ServiceException("任务转入后台执行!", "background_task");
    }
    return of(result2);
  }
}

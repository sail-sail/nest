import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { GqlExecutionContext, ResolveField, Resolver } from "@nestjs/graphql";
import { IncomingMessage } from "http";
import { Observable, tap, catchError } from "rxjs";
import { Context } from "./context";
import { contextSym } from "./interceptors/context.interceptor";

@Injectable()
export class TranInterceptor implements NestInterceptor {
  intercept(exeCtx: ExecutionContext, next: CallHandler): Observable<any> {
    const type: string = exeCtx.getType();
    if (type === "http") {
      const httpContext = exeCtx.switchToHttp();
      const request = httpContext && httpContext.getRequest<IncomingMessage>();
      const context: Context = request[contextSym];
      context.setIs_tran(true);
      return next.handle();
    } else if (type === "graphql") {
      const gqlCtx = GqlExecutionContext.create(exeCtx);
      const context: Context = gqlCtx.getContext();
      context.setIs_tran(true);
      return next.handle();
    }
  }
}

@Injectable()
export class TranGlobalInterceptor implements NestInterceptor {
  intercept(exeCtx: ExecutionContext, next: CallHandler): Observable<any> {
    const type: "http"|"graphql" = exeCtx.getType();
    if (type === "http") {
      const httpContext = exeCtx.switchToHttp();
      const request = httpContext && httpContext.getRequest<IncomingMessage>();
      const context: Context = request[contextSym];
      return next.handle().pipe(
        tap(async() => {
          if (context.getIs_tran()) {
            await context.commit();
          }
        }),
        catchError(async(err: any, caught: Observable<any>) => {
          if (context.getIs_tran()) {
            if (err._rollback !== false) {
              await context.rollback();
            } else {
              await context.commit();
            }
          }
          throw err;
        }),
      );
    } else if (type === "graphql") {
      const gqlCtx = GqlExecutionContext.create(exeCtx);
      const context = gqlCtx.getContext();
      return next.handle().pipe(
        tap(async() => {
          if (context.getIs_tran()) {
            await context.commit();
          }
        }),
        catchError(async(err: any, caught: Observable<any>) => {
          if (context.getIs_tran()) {
            if (err._rollback !== false) {
              await context.rollback();
            } else {
              await context.commit();
            }
          }
          throw err;
        }),
      );
    }
  }
}

export { ResolveField, Resolver };

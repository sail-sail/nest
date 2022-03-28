import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { GqlExecutionContext, ResolveField, Resolver } from "@nestjs/graphql";
import { IncomingMessage } from "http";
import { Observable, tap, catchError } from "rxjs";
import { contextSym } from "./interceptors/context.interceptor";

@Injectable()
export class Tran implements NestInterceptor {
  intercept(exeCtx: ExecutionContext, next: CallHandler): Observable<any> {
    const type: string = exeCtx.getType();
    if (type === "http") {
      const httpContext = exeCtx.switchToHttp();
      const request = httpContext && httpContext.getRequest<IncomingMessage>();
      const context = request[contextSym];
      context.setIs_tran(true);
      return next.handle().pipe(
        tap(async() => {
          await context.commit();
        }),
        catchError(async(err: any, caught: Observable<any>) => {
          if (err._rollback !== false) {
            await context.rollback();
          } else {
            await context.commit();
          }
          throw err;
        }),
      );
    } else if (type === "graphql") {
      const gqlCtx = GqlExecutionContext.create(exeCtx);
      const context = gqlCtx.getContext();
      context.setIs_tran(true);
      return next.handle().pipe(
        tap(async() => {
          await context.commit();
        }),
        catchError(async(err: any, caught: Observable<any>) => {
          if (err._rollback !== false) {
            await context.rollback();
          } else {
            await context.commit();
          }
          throw err;
        }),
      );
    }
  }
}

export { ResolveField, Resolver };

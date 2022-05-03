import { AsyncLocalStorage } from "async_hooks";
import { Injectable, NestInterceptor, CallHandler, createParamDecorator } from "@nestjs/common";
import { firstValueFrom, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Context } from "../context";
import { ServiceException } from "../exceptions/service.exception";

let GqlExecutionContext = undefined;

export const contextSym = Symbol("context");

const asyncLocalStorage = new AsyncLocalStorage();

// export const ContextDc = createParamDecorator(
//   (data: unknown, exeCtx) => {
//     const type: any = exeCtx.getType();
//     if (type === "http") {
//       const request = exeCtx.switchToHttp().getRequest();
//       return request[contextSym];
//     } else if (type === "graphql") {
//       if (!GqlExecutionContext) {
//         GqlExecutionContext = require("@nestjs/graphql").GqlExecutionContext;
//       }
//       const gqlCtx = GqlExecutionContext.create(exeCtx);
//       const context = gqlCtx.getContext();
//       return context;
//     }
//   },
// );

export function useContext() {
  const context = asyncLocalStorage.getStore();
  return <Context>context;
}

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  
  intercept(
    exeCtx: any,
    next: CallHandler<any>,
  ) {
    const type: string = exeCtx.getType();
    let context: any;
    if (type === "http") {
      const httpContext = exeCtx.switchToHttp();
      const request = httpContext && httpContext.getRequest();
      context = request[contextSym];
      if (!context) {
        context = new Context();
        context.req = request;
        request[contextSym] = context;
      }
      return asyncLocalStorage.run(context, async function() {
        return await firstValueFrom(next.handle().pipe(
          map((data: any) => {
            return context.resSuc(data);
          }),
          catchError((err: Error, caught: any) => {
            const type = Object.prototype.toString.call(err);
            if (err instanceof ServiceException) {
              context.log(err.message || err.toString());
              return of(context.resErr(err.message || err.toString()));
            } else if (type === "[object String]") {
              context.log(<any>err);
              return of(context.resErr(<any>err));
            }
            context.error(err.stack || err.message || err.toString());
            return of(context.resErr(err.message || err.toString()));
          }),
        ));
      });
    } else if (type === "graphql") {
      if (!GqlExecutionContext) {
        GqlExecutionContext = require("@nestjs/graphql").GqlExecutionContext;
      }
      const gqlCtx = GqlExecutionContext.create(exeCtx);
      const context = gqlCtx.getContext();
      return asyncLocalStorage.run(context, async function() {
        return await firstValueFrom(next.handle());
      });
    }
  }
  
}

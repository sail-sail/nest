import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { finalize } from "rxjs/operators";
import { Plugin } from "@nestjs/apollo";
import { contextSym } from "./context.interceptor";
import { RollbackReturn, ServiceException } from "../exceptions/service.exception";
import { GraphQLError } from "graphql";

@Plugin()
export class LogerGqlPlugin {
  async requestDidStart(requestContext: any): Promise<any> {
    const context = requestContext.context;
    console.log("");
    context.log(requestContext.request.query, requestContext.request.variables);
    const time = Date.now();
    return {
      async didEncounterErrors(errors: any) {
        const errors2 = errors.errors.filter((error: GraphQLError) => {
          const originalError = error.originalError;
          if (
            originalError instanceof ServiceException
            || originalError instanceof RollbackReturn
            || originalError instanceof String
            || typeof(originalError) === "string"
          ) {
            return false;
          }
          return true;
        });
        if (errors2.length > 0) {
          for (let i = 0; i < errors2.length; i++) {
            const err = errors2[i];
            context.error(err);
          }
        }
      },
      async willSendResponse(requestContext: any) {
        const data = requestContext.response.data;
        if (data != null) {
          context.log(data);
        }
        context.log(`gql_end: ${ Date.now() - time }ms`);
      },
    };
  }
}

@Injectable()
export class LogerInterceptor implements NestInterceptor {
  intercept(
    exeCtx: ExecutionContext,
    next: CallHandler<any>,
  ) {
    const type: string = exeCtx.getType();
    if (type === "http") {
      const httpContext = exeCtx.switchToHttp();
      const request = httpContext && httpContext.getRequest();
      const url = request && request.url || "";
      const context = request[contextSym];
      console.log("");
      context.log(`action: ${ url }`);
      const time = Date.now();
      return next.handle().pipe(
        finalize(() => {
          context.log(`req_end: ${ Date.now() - time }`);
        }),
      );
    }
    return next.handle();
  }
}

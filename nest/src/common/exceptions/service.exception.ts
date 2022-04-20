import { Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { GraphQLError } from "graphql";
// import { GqlExceptionFilter, GqlExecutionContext } from "@nestjs/graphql";
// import { BaseWsExceptionFilter } from "@nestjs/websockets";
import { contextSym } from "../interceptors/context.interceptor";

let GqlExecutionContext = undefined;

export class ServiceException extends Error {
  
  message: string;
  code: string;
  _rollback: boolean; // 默认回滚事务, 可设置为不回滚事务而是提交事务
  
  constructor(message?: string, code?: string, _rollback?: boolean) {
    super();
    const t = this;
    t.code = code;
    t.message = message;
    t._rollback = _rollback;
  }
  
}

export class RollbackReturn extends Error {
  
  value: any;
  
  constructor(value: any) {
    super();
    const t = this;
    t.value = value;
  }
  
}

@Catch()
// export class AllExceptionFilter implements ExceptionFilter<any>, GqlExceptionFilter {
export class AllExceptionFilter {
  
  catch(message: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    if ((<any>ctx).contextType === "graphql") {
      if (!GqlExecutionContext) {
        GqlExecutionContext = require("@nestjs/graphql").GqlExecutionContext;
      }
      const gqlCtx = GqlExecutionContext.create(<any>ctx);
      const context = gqlCtx.getContext();
      if (message instanceof ServiceException) {
        context.log(message.message || message.code);
        throw new GraphQLError(
          message.message || message.code,
          undefined,
          undefined,
          undefined,
          undefined,
          message,
          {
            exception: message,
          },
        );
      } else if (message instanceof String || typeof message === "string") {
        context.log(message);
        const errTmp = new ServiceException(message as string);
        throw new GraphQLError(
          message as string,
          undefined,
          undefined,
          undefined,
          undefined,
          errTmp,
          {
            exception: errTmp,
          },
        );
      }
      if (message instanceof Error) {
        throw message;
      } else {
        throw new Error((message.message && message.message.toString()) || message.toString());
      }
    }
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<any>();
    const context = request[contextSym] || console;
    const data: any = { code: 1, msg: "" };
    if (message) {
      if (message instanceof HttpException) {
        data.msg = message.message;
        context.error(message.message);
      } else if (message instanceof RollbackReturn) {
        response.status(200).send(message.value);
        return;
      } else if (message instanceof ServiceException) {
        if (message.code) {
          data.key = message.code;
        }
        context.log(message.message || message.code);
      } else if (message instanceof Error) {
        data.msg = (<Error>message).message;
        if (message.stack) {
          context.error(message.stack);
        } else if (message.message) {
          context.error(message.message);
        } else {
          context.error(message.toString());
        }
      } else if (typeof(message) === "string") {
        data.msg = message;
      } else {
        data.msg = String(message);
        context.error(data);
      }
    }
    // { code: 1, msg }
    response.status(200).send(JSON.stringify(data));
  }
  
}

@Catch()
// export class WsExceptionsFilter extends BaseWsExceptionFilter {
export class WsExceptionsFilter {
  catch(message: any, host: ArgumentsHost) {
    const type = host.getType();
    const wsArg = host.switchToWs();
    if (type === "ws") {
      const data: any = { };
      if (message instanceof Error) {
        data.message = (<Error>message).message;
        if (message.message) console.error(message.message);
        if (message.stack) console.error(message.stack);
      } else if (typeof(message) === "string") {
        data.message = message;
      } else {
        data.message = String(message);
        console.error(JSON.stringify(data));
      }
      const ws = wsArg.getClient();
      ws.send(JSON.stringify({ error: data }));
    }
  }
}

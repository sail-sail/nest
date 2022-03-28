import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { Context } from "../context";
import { ACCESS_TOKEN, AuthModel, TENANT_ID, NOT_VERIFY_TOKEN } from "./auth.constants";
import { AuthService } from "./auth.service";
import { ServiceException } from "../exceptions/service.exception";
import { contextSym } from "../interceptors/context.interceptor";

let GqlExecutionContext = undefined;

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) { }
  
  async canActivate(exeCtx: ExecutionContext): Promise<boolean> {
    const t = this;
    let context: Context;
    let request: any;
    let response: any;
    const type: string = exeCtx.getType();
    if (type === "graphql") {
      if (!GqlExecutionContext) {
        GqlExecutionContext = require("@nestjs/graphql").GqlExecutionContext;
      }
      const gqlCtx = GqlExecutionContext.create(exeCtx);
      context = gqlCtx.getContext();
      request = context.req;
      response = context.res;
    } else if (type === "http") {
      const httpContext = exeCtx.switchToHttp();
      request = httpContext.getRequest();
      response = httpContext.getResponse().raw;
      context = request[contextSym];
      if (!context) {
        context = new Context();
        context.req = request;
        request[contextSym] = context;
      }
    }
    const headers = request.headers;
    let access_token = <string>headers[ACCESS_TOKEN];
    if (!access_token) {
      access_token = <string>request.query[ACCESS_TOKEN];
    }
    let notVerifyToken = t.reflector.get<boolean>(NOT_VERIFY_TOKEN, exeCtx.getHandler());
    if (notVerifyToken == null) {
      notVerifyToken = t.reflector.get<boolean>(NOT_VERIFY_TOKEN, exeCtx.getClass());
    }
    let tenantId = t.reflector.get<boolean>(TENANT_ID, exeCtx.getHandler());
    if (tenantId == null) {
      tenantId = t.reflector.get<boolean>(TENANT_ID, exeCtx.getClass());
    }
    if (notVerifyToken) {
      if (!access_token) {
        context.authModel = undefined;
        return true;
      }
      context.authModel = t.authService.decodeToken<AuthModel>(access_token);
      if (tenantId) {
        await context.setTenant_id();
      }
      return true;
    }
    if (!access_token) {
      throw new ServiceException("令牌不能为空!", "token_empty");
    }
    try {
      context.authModel = await t.authService.verifyToken<AuthModel>(access_token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        context.authModel = undefined;
      } else {
        throw new ServiceException("令牌超时!", "refresh_token_expired");
      }
    }
    if (!context.authModel) {
      const tokenInfo = await t.authService.refreshToken(access_token);
      if (tokenInfo && tokenInfo.access_token) {
        response.setHeader(ACCESS_TOKEN, tokenInfo.access_token);
        context.authModel = await t.authService.verifyToken<AuthModel>(tokenInfo.access_token);
      }
    } else {
      response.setHeader(ACCESS_TOKEN, "");
    }
    if (tenantId) {
      await context.setTenant_id();
    }
    return true;
  }
  
}

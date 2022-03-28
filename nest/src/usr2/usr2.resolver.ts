import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Context } from "../common/context";
import { Tran } from "../common/graphql";
import { ContextDc } from "../common/interceptors/context.interceptor";

import { Usr2Service } from "./usr2.service";

@Resolver("usr")
export class Usr2Resolver {
  
  constructor(
    private readonly usr2Service: Usr2Service,
  ) { }
  
  @Mutation(() => String, { name: "login", description: "登录" })
  @UseInterceptors(Tran)
  async login(
    @Args("username") username: string,
    @Args("password") password: string,
    @Args("tenant_id") tenant_id: string,
  ) {
    const t = this;
    const data = await t.usr2Service.login(username, password, tenant_id);
    return data;
  }
  
}

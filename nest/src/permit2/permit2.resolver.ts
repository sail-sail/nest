import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Context } from "../common/context";
import { Tran } from "../common/graphql";
import { ContextDc } from "../common/interceptors/context.interceptor";

import { Permit2Service } from "./permit2.service";

@Resolver("permit")
export class Permit2Resolver {
  
  constructor(
    private readonly permit2Service: Permit2Service,
  ) { }
  
}

import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TranInterceptor } from "../common/graphql";

import { Tenant2Service } from "./tenant2.service";

@Resolver("tenant")
export class Tenant2Resolver {
  
  constructor(
    private readonly tenant2Service: Tenant2Service,
  ) { }
  
}

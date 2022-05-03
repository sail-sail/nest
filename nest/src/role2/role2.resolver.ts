import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Context } from "../common/context";
import { TranInterceptor } from "../common/graphql";

import { Role2Service } from "./role2.service";

@Resolver("role")
export class Role2Resolver {
  
  constructor(
    private readonly role2Service: Role2Service,
  ) { }
  
}

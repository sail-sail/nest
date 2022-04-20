import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TranInterceptor } from "../common/graphql";

import { Usr2Service } from "./usr2.service";

@Resolver("usr")
export class Usr2Resolver {
  
  constructor(
    private readonly usr2Service: Usr2Service,
  ) { }
  
}

import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TranInterceptor } from "../common/graphql";

import { Menu2Service } from "./menu2.service";

@Resolver("menu")
export class Menu2Resolver {
  
  constructor(
    private readonly menu2Service: Menu2Service,
  ) { }
  
}

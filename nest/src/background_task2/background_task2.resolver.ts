import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TranInterceptor } from "../common/graphql";

import { Background_task2Service } from "./background_task2.service";

@Resolver("background_task")
export class Background_task2Resolver {
  
  constructor(
    private readonly background_task2Service: Background_task2Service,
  ) { }
  
}

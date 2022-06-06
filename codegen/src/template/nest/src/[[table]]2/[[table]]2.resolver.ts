import { UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TranInterceptor } from "../common/graphql";

import { <#=tableUp#>2Service } from "./<#=table#>2.service";

@Resolver("<#=table#>")
export class <#=tableUp#>2Resolver {
  
  constructor(
    private readonly <#=table#>2Service: <#=tableUp#>2Service,
  ) { }
  
}

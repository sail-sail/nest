import { Module, Global } from '@nestjs/common';

import { <#=tableUp#>2Resolver } from './<#=table#>2.resolver';
import { <#=tableUp#>2Service } from './<#=table#>2.service';
import { <#=tableUp#>2Dao } from './<#=table#>2.dao';

@Global()
@Module({
  providers: [
    <#=tableUp#>2Resolver,
    <#=tableUp#>2Service,
    <#=tableUp#>2Dao,
  ],
  exports: [
    <#=tableUp#>2Resolver,
    <#=tableUp#>2Service,
    <#=tableUp#>2Dao,
  ],
})
export class <#=tableUp#>2Module { }

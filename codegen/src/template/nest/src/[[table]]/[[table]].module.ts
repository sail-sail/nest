import { Module, Global } from '@nestjs/common';

import { <#=tableUp#>Resolver } from './<#=table#>.resolver';
import { <#=tableUp#>Service } from './<#=table#>.service';
import { <#=tableUp#>Dao } from './<#=table#>.dao';

@Global()
@Module({
  providers: [
    <#=tableUp#>Resolver,
    <#=tableUp#>Service,
    <#=tableUp#>Dao,
  ],
  exports: [
    <#=tableUp#>Resolver,
    <#=tableUp#>Service,
    <#=tableUp#>Dao,
  ],
})
export class <#=tableUp#>Module { }

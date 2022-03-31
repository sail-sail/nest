import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthDao } from './auth.dao';

@Global()
@Module({
  providers: [
    AuthDao,
    AuthService,
    AuthGuard,
  ],
  exports: [
    AuthDao,
    AuthService,
    AuthGuard,
  ],
})
export class AuthModule { }

import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  providers: [
    AuthService,
    AuthGuard,
  ],
  exports: [
    AuthService,
    AuthGuard,
  ],
})
export class AuthModule { }

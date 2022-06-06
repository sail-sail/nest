import { Module, Global } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import * as GraphQLJSON from "graphql-type-json";
import { AuthModule } from "../auth/auth.module";
import { Context } from "../context";

import modulesGen from "../../modules.gen";

import { AppResolver } from "./app.resolver";
import { AppService } from "./app.service";
import { AppDao } from "./app.dao";
import { WxappModule } from "../wxapp/wxapp.module";
import { OssModule } from "../oss/oss.module";
import { LogerGqlPlugin } from "../interceptors/loger.interceptor";
import { TmpfileModule } from "../tmpfile/tmpfile.module";

@Global()
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: [
        process.env.NODE_ENV !== 'production' ? "./**/*.graphql" : "./index.graphql",
      ],
      resolvers: [
        { "JSON": GraphQLJSON },
      ],
      include: [ ],
      installSubscriptionHandlers: false,
      fieldResolverEnhancers: [ "filters", "guards", "interceptors" ],
      // useGlobalPrefix: true,
      context: function(ctx) {
        const context = new Context();
        context.req = ctx.request;
        context.res = ctx.reply.raw;
        return context;
      },
    }),
    EventEmitterModule.forRoot({ global: true, wildcard: true }),
    AuthModule,
    WxappModule,
    OssModule,
    TmpfileModule,
    
    ...modulesGen,
  ],
  providers: [
    AppResolver,
    AppService,
    AppDao,
    LogerGqlPlugin,
  ],
  exports: [
    AppResolver,
    AppService,
    AppDao,
  ],
})
export class AppModule { }

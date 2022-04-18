let date1 = new Date();
import { EventEmitter } from "events";
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import FastifyMultipart from "fastify-multipart";
// import { WsAdapter } from '@nestjs/platform-ws';
// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as later from "@breejs/later";
import "./common/util/DateUtil";
import * as logFn from "log-ng";
import { LogerInterceptor } from './common/interceptors/loger.interceptor';
import { AllExceptionFilter } from './common/exceptions/service.exception';
import config from './common/config';
import { ContextInterceptor } from './common/interceptors/context.interceptor';
import { AppModule } from "./common/app/app.module";
import { hmr } from "./common/hmr";
import { TranGlobalInterceptor } from "./common/graphql";

later.date.localTime();

EventEmitter.defaultMaxListeners = 0;
logFn.init(config.log);

const validationPipe = new ValidationPipe();
const contextInterceptor = new ContextInterceptor();
const logerInterceptor = new LogerInterceptor();
const tranGlobalInterceptor = new TranGlobalInterceptor();
const allExceptionFilter = new AllExceptionFilter();

// const configSwagger = new DocumentBuilder()
//   .setTitle('Cats example')
//   .setDescription('The cats API description')
//   .setVersion('1.0')
//   .addTag('cats')
//   .build();

async function bootstrap() {
  const nestApplication = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  nestApplication.register(<any>FastifyMultipart, {
    limits: { fileSize: 50 * 1024 * 1024 },
    attachFieldsToBody: true,
    addToBody: true,
  });
  nestApplication.useGlobalPipes(validationPipe);
  // nestApplication.useWebSocketAdapter(new WsAdapter(nestApplication));
  nestApplication.useGlobalInterceptors(contextInterceptor);
  nestApplication.useGlobalInterceptors(logerInterceptor);
  nestApplication.useGlobalInterceptors(tranGlobalInterceptor);
  nestApplication.useGlobalFilters(allExceptionFilter);
  nestApplication.setGlobalPrefix("api");
  
  // const document = SwaggerModule.createDocument(nestApplication, configSwagger);
  // SwaggerModule.setup("doc.html", nestApplication, document);
  
  global.__nestApplication = nestApplication;
  await nestApplication.init();
  await nestApplication.listen(config.server.port);
  console.log(`${ await nestApplication.getUrl() }`);
  // if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "hmr") {
  // }
  const date2 = new Date();
  console.log(date2.getTime() - date1.getTime()+"ms");
  if (process.env.NODE_ENV === "hmr") {
    hmr();
  }
}
bootstrap();

process.on("exit", function(code) {
  console.error("exit: "+code);
});
process.on("beforeExit", function(code) {
  console.error("beforeExit: "+code);
});
process.on("rejectionHandled", function(err) {
  console.error("rejectionHandled: ");
  console.error(err);
});
process.on("uncaughtException", function(err) {
  console.error(err);
  console.error(err.stack);
});
process.on('unhandledRejection', function(reason: any) {
  console.error("unhandledRejection");
  if (reason.stack) {
    console.error(reason.stack);
  } else {
    console.error(reason.message);
  }
});

import {
  newContext,
  runInAsyncHooks,
  close,
} from "/lib/context.ts";

const authorization = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjlMbW5xaExJVHpLc2tGTy9sY1hScUEiLCJkZXB0X2lkIjoiUi9WSFcwa3pSeEs5dEc4bUlITWRiUSIsImV4cCI6MTk4MjYzMTE2M30.unudogI0epH0lsPs2EOYFQAGnPHP0OPeOJG6eyauA2M";

Deno.test("getAccessToken", async () => {
  const context = newContext();
  context.cacheEnabled = false;
  context.authorization = authorization;
  
  const {
    getAccessToken,
  } = await import("./app_token.dao.ts");
  
  await runInAsyncHooks(context, async () => {
    const baidu_app_id = "ZWZkYjQyYjVhZWNmNGY4Ym" as BaiduAppId;
    const access_token = await getAccessToken(baidu_app_id);
    console.log("access_token", access_token);
  });
  await close(context);
});

Deno.test("百度车牌识别", async () => {
  const context = newContext();
  context.cacheEnabled = false;
  context.authorization = authorization;
  
  const {
    ocrLicensePlate,
    closeImageDll,
  } = await import("./app_token.dao.ts");
  
  await runInAsyncHooks(context, async () => {
    const image = await Deno.readFile(`${ import.meta.dirname }/2.jpg`);
    const res = await ocrLicensePlate({
      image,
    });
    console.log(res);
  });
  closeImageDll();
  await close(context);
});


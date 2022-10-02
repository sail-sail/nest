import {
  FormDataFile,
  Router,
  RouterContext,
} from "oak";

import {
  getContext,
  TMP_PATH,
} from "/lib/context.ts";

import * as tmpfileServie from "./tmpfile.service.ts";

const router = new Router({
  prefix: "/api/tmpfile/",
});

router.post("upload", async function(ctx) {
  const body = await ctx.request.body();
  if (body.type !== "form-data") {
    ctx.response.status = 415;
    return;
  }
  let file: FormDataFile|undefined = undefined;
  for await (const [ name, value ] of body.value.stream({
    outPath: TMP_PATH,
    prefix: "tmpfile_upload_",
  })) {
    if (name === "file") {
      if (value instanceof String) {
        throw new Error("file must a form-data file!");
      }
      file = value as FormDataFile;
    }
  }
  if (!file) {
    throw new Error("file must a form-data file!");
  }
  const id = await tmpfileServie.upload(file);
  ctx.response.body = {
    code: 0,
    data: id,
  };
});

// deno-lint-ignore no-explicit-any
async function download(ctx: RouterContext<any>) {
  const request = ctx.request;
  const response = ctx.response;
  try {
    let filename: string|undefined = ctx.params?.filename;
    const searchParams = request.url.searchParams;
    let remove = searchParams.get("remove");
    let inline = searchParams.get("inline");
    const id = searchParams.get("id")!;
    if (!inline) {
      inline = "1";
    }
    let attachment = "inline";
    if (inline != "1") {
      attachment = "attachment";
    }
    if (!remove) {
      remove = "1";
    }
    if (filename) {
      filename = encodeURIComponent(filename);
    }
    const stats = await tmpfileServie.statObject(id);
    if (stats) {
      if (stats.contentType) {
        response.headers.set("Content-Type", stats.contentType);
      }
      if (!filename && stats?.meta?.filename) {
        filename = stats?.meta?.filename;
      }
      if (stats.contentLength) {
        response.headers.set("Content-Length", stats.contentLength.toString());
      }
      if (stats.etag) {
        response.headers.set("ETag", stats.etag);
      }
      if (request.headers.get("if-none-match") === stats.etag) {
        response.headers.set("Content-Disposition", `${ attachment }; filename=${ filename || encodeURIComponent(id) }`);
        response.status = 304;
        return;
      }
    }
    response.headers.set("Content-Disposition", `${ attachment }; filename=${ filename || encodeURIComponent(id) }`);
    const objInfo = await tmpfileServie.getObject(id);
    if (!objInfo || !objInfo.body) {
      const err = new Error("NotFound");
      // deno-lint-ignore no-explicit-any
      (err as any).code = "NotFound";
      throw err;
    }
    if (stats?.meta?.once === "1") {
      if (remove === "1") {
        await tmpfileServie.deleteObject(id);
      }
    }
    const res = new Response(objInfo.body);
    response.body = await res.arrayBuffer();
  } catch (err) {
    if (err.code === "NotFound") {
      const errMsg = "文件不存在!";
      response.status = 404;
      response.body = errMsg;
      return;
    }
    const context = getContext(ctx);
    context.error(err);
    const errMsg = err?.message || err?.toString() || err || "";
    response.status = 500;
    response.body = errMsg;
    return;
  }
}

// deno-lint-ignore no-explicit-any
router.get("download/:filename", <any>download);
// deno-lint-ignore no-explicit-any
router.get("download", <any>download);

export default router;

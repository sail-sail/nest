import {
  Router,
  type FormDataFile,
  type RouterContext,
} from "oak";

import {
  error,
  TMP_PATH,
} from "/lib/context.ts";

import * as ossServie from "./oss.service.ts";

import * as tmpfileService from "/lib/tmpfile/tmpfile.service.ts";

import {
  resize,
} from "/lib/image/mod.ts";

const router = new Router({
  prefix: "/api/oss/",
});

router.post("upload", async function(ctx) {
  const body = ctx.request.body();
  if (body.type !== "form-data") {
    ctx.response.status = 415;
    return;
  }
  let file: FormDataFile | undefined = undefined;
  for await (const [ name, value ] of body.value.stream({
    outPath: TMP_PATH,
    prefix: "oss_upload_",
    maxFileSize: 50 * 1024 * 1024, // 50Mb
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
  const id = await ossServie.upload(file);
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
    let filename: string | undefined = ctx.params?.filename;
    const searchParams = request.url.searchParams;
    let inline = searchParams.get("inline");
    const id = searchParams.get("id")!;
    if (!inline) {
      inline = "1";
    }
    let attachment = "inline";
    if (inline != "1") {
      attachment = "attachment";
    }
    if (filename) {
      filename = encodeURIComponent(filename);
    }
    const stats = await ossServie.statObject(id);
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
    const objInfo = await ossServie.getObject(id);
    if (!objInfo || !objInfo.body) {
      const err = new Error("NotFound");
      // deno-lint-ignore no-explicit-any
      (err as any).code = "NotFound";
      throw err;
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
    error(err);
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

router.get("img", async function(ctx) {
  const request = ctx.request;
  const response = ctx.response;
  try {
    let filename: string | undefined = ctx.params?.filename;
    const searchParams = request.url.searchParams;
    let inline = searchParams.get("inline");
    const id = searchParams.get("id")!;
    const f = searchParams.get("f");
    const w = searchParams.get("w");
    const h = searchParams.get("h");
    const q = searchParams.get("q");
    if (!inline) {
      inline = "1";
    }
    let attachment = "inline";
    if (inline != "1") {
      attachment = "attachment";
    }
    if (filename) {
      filename = encodeURIComponent(filename);
    }
    const stats = await ossServie.statObject(id);
    if (!stats) {
      const err = new Error("NotFound");
      // deno-lint-ignore no-explicit-any
      (err as any).code = "NotFound";
      throw err;
    }
    if (stats.contentType) {
      response.headers.set("Content-Type", stats.contentType);
    }
    if (!filename && stats?.meta?.filename) {
      filename = stats?.meta?.filename;
    }
    if (stats.contentLength > 0) {
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
    if (!f) {
      const objInfo = await ossServie.getObject(id);
      if (!objInfo || !objInfo.body) {
        const err = new Error("NotFound");
        // deno-lint-ignore no-explicit-any
        (err as any).code = "NotFound";
        throw err;
      }
    }
    let is_img = false;
    if (stats.contentType) {
      const contentType = stats.contentType.toLowerCase();
      if (contentType.startsWith("image/")) {
        is_img = true;
      }
    }
    if (!is_img) {
      const err = new Error("NotFound");
      // deno-lint-ignore no-explicit-any
      (err as any).code = "NotFound";
      throw err;
    }
    // 如果缩略图已经存在, 则直接返回
    let cache_id = id;
    if (f) {
      cache_id += `-f${ f }`;
    }
    if (w) {
      cache_id += `-w${ w }`;
    }
    if (h) {
      cache_id += `-h${ h }`;
    }
    if (q) {
      cache_id += `-q${ q }`;
    }
    const img_stats = await tmpfileService.statObject(cache_id);
    if (img_stats) {
      if (img_stats.contentType) {
        response.headers.set("Content-Type", img_stats.contentType);
      }
      if (!filename && img_stats?.meta?.filename) {
        filename = img_stats?.meta?.filename;
      }
      if (img_stats.contentLength) {
        response.headers.set("Content-Length", img_stats.contentLength.toString());
      }
      if (img_stats.etag) {
        response.headers.set("ETag", img_stats.etag);
      }
      if (request.headers.get("if-none-match") === img_stats.etag) {
        response.headers.set("Content-Disposition", `${ attachment }; filename=${ filename || encodeURIComponent(id) }`);
        response.status = 304;
        return;
      }
      response.headers.set("Content-Disposition", `${ attachment }; filename=${ filename || encodeURIComponent(id) }`);
      const objInfo = await tmpfileService.getObject(cache_id);
      if (!objInfo || !objInfo.body) {
        const err = new Error("NotFound");
        // deno-lint-ignore no-explicit-any
        (err as any).code = "NotFound";
        throw err;
      }
      const res = new Response(objInfo.body);
      const content = await res.arrayBuffer();
      response.headers.set("Content-Length", content.byteLength.toString());
      response.body = content;
      return;
    }
    const objInfo = await ossServie.getObject(id);
    if (!objInfo || !objInfo.body) {
      const err = new Error("NotFound");
      // deno-lint-ignore no-explicit-any
      (err as any).code = "NotFound";
      throw err;
    }
    const res = new Response(objInfo.body);
    const content = new Uint8Array(await res.arrayBuffer());
    const format = f || "webp"; 
    const height = h == null ? undefined : parseInt(h);
    const width = w == null ? undefined : parseInt(w);
    const quality = q == null ? undefined : parseInt(q);
    const content2 = await resize(
      content,
      format,
      width,
      height,
      quality,
    );
    
    const len = content2.byteLength;
    response.headers.set("Content-Length", len.toString());
    
    let content_type = "image/webp";
    if (format === "jpeg") {
      content_type = "image/jpeg";
    } else if (format === "png") {
      content_type = "image/png";
    } else if (format === "webp") {
      content_type = "image/webp";
    }
    response.headers.set("Content-Type", content_type);
    
    // 修改filename后缀名
    if (filename) {
      const arr = filename.split(".");
      if (arr.length > 1) {
        arr.pop();
      }
      filename = arr.join(".");
      filename += `.${ format }`;
    }
    response.headers.set("Content-Disposition", `${ attachment }; filename=${ filename || encodeURIComponent(id) }`);
    
    response.headers.set("Content-Type", content_type);
    
    // 缓存图片到tmpfile
    await tmpfileService.putObject(
      cache_id,
      content2,
      content_type,
    );
    
    const img_stats2 = await tmpfileService.statObject(cache_id);
    if (img_stats2) {
      if (img_stats2.etag) {
        response.headers.set("ETag", img_stats2.etag);
      }
      if (request.headers.get("if-none-match") === img_stats2.etag) {
        response.status = 304;
        return;
      }
    }
    
    response.body = content2;
    return;
  } catch (err) {
    if (err.code === "NotFound") {
      const errMsg = "文件不存在!";
      response.status = 404;
      response.body = errMsg;
      return;
    }
    error(err);
    const errMsg = err?.message || err?.toString() || err || "";
    response.status = 500;
    response.body = errMsg;
    return;
  }
});

export default router;

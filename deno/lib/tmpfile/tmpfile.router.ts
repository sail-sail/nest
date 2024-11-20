import {
  Router,
  type RouterContext,
} from "@oak/oak";

import {
  error,
} from "/lib/context.ts";

import {
  handleRequestId,
} from "/lib/oak/request_id.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

const router = new Router({
  prefix: "/api/tmpfile/",
});

router.post("upload", async function(ctx) {
  const request = ctx.request;
  const response = ctx.response;
  if (await handleRequestId(
    response,
    request.headers.get("x-request-id"),
  )) {
    return;
  }
  const searchParams = request.url.searchParams;
  const db = searchParams.get("db") ?? undefined;
  const body = request.body;
  const contentType = body.type().toLocaleLowerCase();
  if (!request.hasBody || contentType !== "form-data") {
    response.status = 415;
    return;
  }
  const formData = await body.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    throw new Error("file must a form-data file!");
  }
  const {
    upload
  } = await import("./tmpfile.service.ts");
  const auth_model = await getAuthModel();
  const tenant_id = auth_model?.tenant_id;
  const id = await upload(file, {
    is_public: false,
    tenant_id,
    db,
  });
  response.body = {
    code: 0,
    data: id,
  };
});

router.post("uploadPublic", async function(ctx) {
  const request = ctx.request;
  const response = ctx.response;
  if (await handleRequestId(
    response,
    request.headers.get("x-request-id"),
  )) {
    return;
  }
  const body = request.body;
  const contentType = body.type().toLocaleLowerCase();
  if (!request.hasBody || contentType !== "form-data") {
    response.status = 415;
    return;
  }
  const formData = await body.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    throw new Error("file must a form-data file!");
  }
  const {
    upload
  } = await import("./tmpfile.service.ts");
  const id = await upload(file, {
    is_public: true,
  });
  response.body = {
    code: 0,
    data: id,
  };
});

// deno-lint-ignore no-explicit-any
async function download(ctx: RouterContext<any>) {
  const request = ctx.request;
  const response = ctx.response;
  const {
    statObject,
    getObject,
    deleteObject,
  } = await import("./tmpfile.service.ts");
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
    const stats = await statObject(id);
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
    const objInfo = await getObject(id);
    if (stats?.meta?.once === "1") {
      if (remove === "1") {
        await deleteObject(id);
      }
    }
    const res = new Response(objInfo.body);
    response.body = await res.arrayBuffer();
  } catch (err0) {
    const err = err0 as Error;
    // deno-lint-ignore no-explicit-any
    if ((err as any).code === "NotFound") {
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

export default router;

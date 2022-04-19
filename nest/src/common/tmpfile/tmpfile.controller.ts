import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { FileModel } from "../file.model";
import { TmpfileService } from "./tmpfile.service";

@Controller("tmpfile")
export class TmpfileController {
  
  constructor(
    private readonly tmpfileServie: TmpfileService,
  ) { }
  
  @Post("upload")
  @UseGuards(AuthGuard)
  async upload(
    @Body("file") files: FileModel[],
  ): Promise<string> {
    const t = this;
    if (!files || !files.length) return;
    const result = await t.tmpfileServie.upload(files[0]);
    return result;
  }
  
  @Get("download/:filename")
  async download(
    @Res() res: any,
    @Req() req: any,
    @Query("id") id: string,
    @Param("filename") filename?: string,
    @Query("remove") remove?: "0"|"1",
    @Query("inline") inline?: "0"|"1",
  ): Promise<void> {
    const t = this;
    try {
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
      const stats = await t.tmpfileServie.statObject(id);
      if (stats) {
        if (stats.metaData["content-type"]) {
          res.raw.setHeader('Content-Type', stats.metaData["content-type"]);
        }
        if (!filename && stats.metaData.filename) {
          filename = stats.metaData.filename;
        }
        if (stats.size) {
          res.raw.setHeader("Content-Length", stats.size);
        }
        if (stats.etag) {
          res.raw.setHeader("ETag", stats.etag);
        }
        if (req.raw.headers["if-none-match"] === stats.etag) {
          res.raw.setHeader("Content-Disposition", `${ attachment }; filename=${ filename || encodeURIComponent(id) }`);
          res.status(304).send();
          return;
        }
      }
      res.raw.setHeader("Content-Disposition", `${ attachment }; filename=${ filename || encodeURIComponent(id) }`);
      const stream = await t.tmpfileServie.getObject(id);
      if (stream) {
        if (stats.metaData["once"] === "1") {
          stream.on("close", async() => {
            if (remove == "1") {
              await t.tmpfileServie.deleteObject(id);
            }
          });
        }
        stream.pipe(res.raw);
      } else {
        const errMsg = Buffer.from("文件不存在!");
        res.raw.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.raw.setHeader("Content-Length", errMsg.length);
        res.raw.statusCode = 404;
        res.raw.end(errMsg);
        return;
      }
    } catch (err) {
      if (err.code === "NotFound") {
        const errMsg = Buffer.from("文件不存在!");
        res.raw.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.raw.setHeader("Content-Length", errMsg.length);
        res.raw.statusCode = 404;
        res.raw.end(errMsg);
        return;
      }
      res.raw.statusCode = 500;
      const errMsg = Buffer.from(err?.message || err?.toString() || err || "");
      res.raw.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.raw.setHeader("Content-Length", errMsg.length);
      res.raw.end(errMsg);
      throw err;
    }
  }
  
}

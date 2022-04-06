import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { FileModel } from "../file.model";
import { TmpfileService } from "./tmpfile.service";

@Controller("tmpfile")
export class TmpfileController {
  
  constructor(
    private readonly tmpfileServie: TmpfileService,
  ) { }
  
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
        stream.on("close", async() => {
          if (remove == "1") {
            await t.tmpfileServie.deleteObject(id);
          }
        });
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

import { SetMetadata, UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { TENANT_ID } from "../auth/auth.constants";
import { AuthGuard } from "../auth/auth.guard";
import { OssService } from "./oss.service";

@Resolver()
@SetMetadata(TENANT_ID, true)
@UseGuards(AuthGuard)
export class OssResolver {
  
  constructor(
    private readonly ossService: OssService,
  ) { }
  
  @Query(undefined, { name: "getStatsOss", description: "获取附件信息列表, 包括文件名" })
  async getStatsOss(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const statInfos = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      let lbl = "";
      if (!id) {
        statInfos.push({ id, lbl });
        continue;
      }
      let stats = undefined;
      try {
        stats = await t.ossService.statObject(id);
      } catch (err) {
        if (err.code === "NotFound") {
          lbl = "";
        }
        throw err;
      }
      if (stats?.metaData?.filename) {
        lbl = decodeURIComponent(stats.metaData.filename || "");
      }
      statInfos.push({ id, lbl });
    }
    return statInfos;
  }
  
}

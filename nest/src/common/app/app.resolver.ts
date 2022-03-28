import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query } from "@nestjs/graphql";
import { readFile } from "fs/promises";
import { AuthGuard } from "../auth/auth.guard";
import { _PROJECT_PATH } from "../config";
import { Resolver } from "../graphql";
import { AppService } from "./app.service";

@Resolver()
export class AppResolver {
  
  constructor(
    private readonly appService: AppService,
  ) { }
  
  @Query(undefined, { name: "generateId", description: "生成ID主键" })
  async generateId() {
    const t = this;
    return await t.appService.generateId();
  }
  
  @Mutation(undefined, { name: "clearCache", description: "清空缓存" })
  async clearCache() {
    const t = this;
    return await t.appService.clearCache();
  }
  
  @Query(undefined, { name: "checkLogin", description: "检查是否已经登录" })
  @UseGuards(AuthGuard)
  async checkLogin() {
    return true;
  }
  
  @Query(undefined, { name: "getVueScriptLine", description: "开发时获取vue模板script标签的开始行数" })
  async getVueScriptLine(
    @Args("ph") ph: string,
    @Args("method") method: string,
  ): Promise<number> {
    let lineNum = 0;
    if (process.env.NODE_ENV !== "production") {
      let pjPath = _PROJECT_PATH;
      const str = await readFile(`${ pjPath }/../${ ph }`, "utf8");
      const arr = str.split("\n");
      for (let i = 0; i < arr.length; i++) {
        const line = arr[i].trim();
        let isCommentBegin = false;
        let isCommentEnd = false;
        if (line.startsWith("/*") && !isCommentEnd) {
          isCommentBegin = true;
          isCommentEnd = false;
        }
        if (line.startsWith("*/") && isCommentBegin) {
          isCommentBegin = false;
          isCommentEnd = true;
        }
        if (line.startsWith("//") || !line || isCommentBegin) {
          continue;
        }
        if (line.includes("function " + method)) {
          lineNum = i + 1;
          break;
        }
      }
    }
    return lineNum;
  }
  
}

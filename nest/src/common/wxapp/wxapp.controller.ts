import { Body, Controller, Post, Res, UseInterceptors } from "@nestjs/common";
import { WxappService } from "./wxapp.service";
import { TranInterceptor } from "../graphql";
import { ServerResponse } from "http";

@Controller("wxapp")
export class WxappController {
  
  constructor(
    private readonly wxappService: WxappService,
  ) { }
  
  /**
   * 登录凭证校验
   * @param {{ raw: ServerResponse }} res
   * @param {{ code: string }} model
   * @return {Promise<void>}
   * @memberof WxappController
   */
  @Post("code2Session")
  @UseInterceptors(TranInterceptor)
  async code2Session(
    @Res() res: { raw: ServerResponse },
    @Body() model: { code: string },
  ): Promise<void> {
    const t = this;
    let access_token = undefined;
    try {
      access_token = await t.wxappService.code2Session(model.code);
      res.raw.setHeader("access_token", access_token);
    } catch (err) {
      res.raw.setHeader("access_token", "");
      res.raw.statusCode = 401;
      throw err;
    } finally {
      res.raw.end();
    }
  }
  
}

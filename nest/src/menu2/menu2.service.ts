import { Injectable } from "@nestjs/common";
import { Context } from "../common/context";
import { MenuModel } from "../menu/menu.model";
import { Menu2Dao } from "./menu2.dao";

@Injectable()
export class Menu2Service {
  
  constructor(
    private readonly menu2Dao: Menu2Dao,
  ) { }
  
  async getMenus(
    type: string,
  ): Promise<any[]> {
    const t = this;
    let allModels = await t.menu2Dao.getMenus(type);
    let menus = [ ];
    async function tmpFn(parent?: MenuModel) {
      // let models = await t.menu2Dao.getMenus(parent && parent.id || "", type);
      let models = allModels.filter((item) => item.menu_id === (parent && parent.id || ""));
      if (!parent) {
        menus = models;
      } else {
        models = models.filter((item) => !menus.some((item2) => item.id === item2.id));
        parent.children = models;
      }
      for (let i = 0; i < models.length; i++) {
        const item = models[i];
        await tmpFn(item);
      }
    }
    await tmpFn();
    return menus;
  }
  
}

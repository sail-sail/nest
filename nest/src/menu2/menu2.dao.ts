import { Global, Injectable } from "@nestjs/common";
import { useContext } from "../common/interceptors/context.interceptor";

@Global()
@Injectable()
export class Menu2Dao {
  
  async getMenus(
    type?: string,
    menu_id?: string,
  ) {
    const context = useContext();
    const args = [ ];
    let sql = `
      select
        t.id,
        t.type,
        t.menu_id,
        t.lbl,
        t.route_path
      from menu t
      inner join tenant_menu
        on t.id = tenant_menu.menu_id
        and tenant_menu.is_deleted = 0
      inner join tenant
        on tenant_menu.tenant_id = tenant.id
        and tenant.is_deleted = 0
        and tenant.is_enabled = 1
      inner join role_menu
        on t.id = role_menu.menu_id
        and role_menu.is_deleted = 0
      inner join usr_role
        on role_menu.role_id = usr_role.role_id
        and usr_role.is_deleted = 0
      where
        t.is_deleted = 0
        and t.is_enabled = 1
    `;
    if (type) {
      sql += ` and t.type = ?`;
      args.push(type);
    }
    if (context.tenant_id) {
      sql += ` and tenant_menu.tenant_id = ?`;
      args.push(context.tenant_id);
    }
    if (menu_id) {
      sql += ` and t.menu_id = ?`;
      args.push(menu_id);
    }
    
    sql += ` and usr_role.usr_id = ?`;
    args.push(context.getUsr_id());
    
    sql += ` order by t.order_by asc`;
    
    const table = "menu";
    const method = "getMenus";
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });
    
    let result = await context.query<{
      id: string,
      type: string,
      menu_id: string,
      lbl: string,
      route_path: string,
    }>(sql, args, { cacheKey1, cacheKey2 });
    
    return result;
  }
  
}

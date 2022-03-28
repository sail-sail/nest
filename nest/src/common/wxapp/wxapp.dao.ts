import { Global, Injectable } from "@nestjs/common";
import { Context } from "../context";
import { useContext } from "../interceptors/context.interceptor";

@Global()
@Injectable()
export class WxappDao {
  
  constructor(
    
  ) { }
  
  async findByOpenid(
    openid: string,
  ) {
    const context = useContext();
    let sql = `
      select
        t.id,
        t.session_key,
        t.unionid
      from wx_usr t
      where
        t.openid = ?
    `;
    const args = [ openid ];
    const model = await context.queryOne<{
      id: string;
      session_key: string;
      unionid: string;
    }>(sql, args);
    return model;
  }
  
  async create(
    model: {
      id: string;
      lbl?: string,
      openid: string;
      session_key: string;
      unionid: string;
    },
  ) {
    const context = useContext();
    let sql = `
      insert into wx_usr(
    `;
    let valuesSql = ``;
    const args = [ ];
    
    sql += `id,`;
    valuesSql += `?,`;
    args.push(model.id);
    
    if (model.lbl) {
      sql += `lbl,`;
      valuesSql += `?,`;
      args.push(model.lbl);
    }
    
    sql += `openid,`;
    valuesSql += `?,`;
    args.push(model.openid);
    
    sql += `session_key,`;
    valuesSql += `?,`;
    args.push(model.session_key);
    
    if (model.unionid) {
      sql += `unionid,`;
      valuesSql += `?,`;
      args.push(model.unionid);
    }
    
    if (sql.endsWith(`,`)) {
      sql = sql.slice(0, sql.length - 1);
    }
    if (valuesSql.endsWith(`,`)) {
      valuesSql = valuesSql.slice(0, valuesSql.length - 1);
    }
    sql += `) values(`;
    sql += valuesSql;
    sql += `)`;
    const result = await context.execute(sql, args);
    return result;
  }
  
  async updateSession_key(
    model: {
      id: string;
      session_key: string;
      unionid: string;
    },
  ) {
    const context = useContext();
    let sql = `
      update wx_usr t
      set
        t.session_key = ?
    `;
    const args = [ ];
    args.push(model.session_key);
    if (model.unionid) {
      sql += `,t.unionid = ?`;
      args.push(model.unionid);
    }
    sql += `
      where
        t.id = ?
    `;
    args.push(model.id);
    const result = await context.execute(sql, args);
    return result;
  }
  
}

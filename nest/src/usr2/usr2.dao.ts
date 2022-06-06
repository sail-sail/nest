import { Injectable } from "@nestjs/common";
import { useContext } from "../common/interceptors/context.interceptor";

@Injectable()
export class Usr2Dao {
  
  constructor(
  ) { }
  
  /**
   * 返回当前登录的用户
   * @param {string} username 用户名
   * @param {string} password 密码,传递进来的密码已经被前端md5加密过一次
   * @param {string} tenant_id 租户id
   * @return {Promise<{ id: string }>} 当前登录的用户
   * @memberof Usr2Dao
   */
  async findLoginUsr(
    username: string,
    password: string,
    tenant_id: string,
  ): Promise<{ id: string }> {
    const context = useContext();
    let sql = `
      select
        t.id
      from usr t
      where
        t.username = ?
        and t.password = ?
        and t.tenant_id = ?
    `;
    const args = [ username, password, tenant_id ];
    const result = await context.queryOne<{
      id: string,
    }>(sql, args);
    return result;
  }
  
}

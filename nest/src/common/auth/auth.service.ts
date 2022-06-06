import { Injectable } from "@nestjs/common";
import { AuthDao } from "./auth.dao";

@Injectable()
export class AuthService {
  
  constructor(
    private readonly authDao: AuthDao,
  ) { }
  
  /**
   * 创建access_token
   * @param  {T} obj 对象
   * @returns Promise<{ expires_in: number, access_token: string }> expires_in: 过期时间
   */
  async createToken<T>(obj :T) :Promise<{ expires_in: number, access_token: string }> {
    const t = this;
    return await t.authDao.createToken(obj);
  }
  
  /**
   * 验证access_token
   * @param  {string} access_token
   * @returns Promise<T> 验证成功后的对象
   */
  async verifyToken<T>(access_token :string) :Promise<T> {
    const t = this;
    return await t.authDao.verifyToken(access_token);
  }
  
  /**
   * 验证access_token
   * @param  {string} access_token
   * @returns T 验证成功后的对象
   */
  decodeToken<T>(access_token :string) :T {
    const t = this;
    return t.authDao.decodeToken(access_token);
  }
  
  /**
   * 通过旧token创建新token
   * @param  {string} access_token 旧token
   * @returns Promise<{ expires_in: number, access_token: string }> 新tokenInfo
   */
  async refreshToken(access_token: string) :Promise<{ expires_in: number, access_token: string }> {
    const t = this;
    return await t.authDao.refreshToken(access_token);
  }
  
  /**
   * 给密码2次sha256加密
   * @param {string} str
   * @return {*}  {string}
   * @memberof AuthService
   */
  getPassword(str: string): string {
    const t = this;
    return t.authDao.getPassword(str);
  }
  
  // /**
  //  * 比较密码是否正确
  //  * @param {string} str
  //  * @param {string} str2
  //  * @return {*}  {boolean}
  //  * @memberof AuthService
  //  */
  // checkPassword(str: string, str2: string): boolean {
  //   const t = this;
  //   if(!str) return false;
  //   return t.getPassword(str) === str2;
  // }
  
}

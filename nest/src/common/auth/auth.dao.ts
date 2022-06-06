import { promisify } from "util";
import { Injectable } from "@nestjs/common";
import { getPassword, SECRET_KEY } from "./auth.constants";
import config from "../config";
import { ServiceException } from "../exceptions/service.exception";

let jwtSignAsync = undefined;
let jwtVerifyAsync = undefined;
let decode = undefined;

const token_timeout = config.server.token_timeout;

@Injectable()
export class AuthDao {
  
  /**
   * 创建access_token
   * @param  {T} obj 对象
   * @returns Promise<{expires_in: number, access_token: string}> expires_in: 过期时间
   */
  async createToken<T>(obj :T) :Promise<{
    expires_in: number;
    access_token: string;
  }> {
    if (!(token_timeout > 10)) {
      throw new Error("config.token_timeout must larger then 10!");
    }
    if (!jwtSignAsync) {
      const sign = require("jsonwebtoken").sign;
      jwtSignAsync = <any> promisify(sign);
    }
    const token = <string> await jwtSignAsync(obj, SECRET_KEY, { expiresIn: token_timeout });
    return {
      expires_in: token_timeout,
      access_token: token,
    };
  }
  
  /**
   * 验证access_token
   * @param  {string} access_token
   * @returns Promise<T> 验证成功后的对象
   */
  async verifyToken<T>(access_token :string) :Promise<T> {
    if (!jwtVerifyAsync) {
      const verify = require("jsonwebtoken").verify;
      jwtVerifyAsync = <any> promisify(verify);
    }
    const obj = <T> await jwtVerifyAsync(access_token, SECRET_KEY);
    return obj;
  }
  
  /**
   * 验证access_token
   * @param  {string} access_token
   * @returns T 验证成功后的对象
   */
  decodeToken<T>(access_token :string) :T {
    if (!decode) {
      decode = require("jsonwebtoken").decode;
    }
    const obj = <T>decode(access_token);
    return obj;
  }
  
  /**
   * 通过旧token创建新token
   * @param  {string} access_token 旧token
   * @returns Promise<{expires_in: number, access_token: string}> 新tokenInfo
   */
  async refreshToken(access_token: string) :Promise<{expires_in: number, access_token: string}> {
    const t = this;
    if (!decode) {
      decode = require("jsonwebtoken").decode;
    }
    const obj = <{[key: string]: any}>decode(access_token);
    if (!obj || !obj.exp) {
      throw new ServiceException("令牌超时!", "refresh_token_expired");
    }
    const date = new Date();
    if (date.getTime()/1000 - token_timeout > obj.exp) {
      throw new ServiceException("令牌超时!", "refresh_token_expired");
    }
    const obj2 = {};
    Object.keys(obj)
      .filter((key) => key !== "iat" && key !== "exp")
      .forEach(function(key) {
        obj2[key] = obj[key];
      });
    const tokenInfo = await t.createToken(obj2);
    return tokenInfo;
  }
  
  /**
   * 给密码2次sha256加密
   * @param {string} str
   * @return {*}  {string}
   * @memberof AuthService
   */
  getPassword(str: string): string {
    return getPassword(str);
  }
  
}

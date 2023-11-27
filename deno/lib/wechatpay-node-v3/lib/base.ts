// deno-lint-ignore-file no-explicit-any
import type { Output } from './interface-v2.ts';

export class Base {
  protected userAgent = '127.0.0.1'; // User-Agent
  constructor() {}

  /**
   * get 请求参数处理
   * @param object query 请求参数
   * @param exclude 需要排除的字段
   * @returns
   */
  protected objectToQueryString(object: Record<string, any>, exclude: string[] = []): string {
    let str = Object.keys(object)
      .filter(key => !exclude.includes(key))
      .map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
      })
      .join('&');
    if (str) str = '?' + str;
    return str || '';
  }
  /**
   * post 请求
   * @param url  请求接口
   * @param params 请求参数
   */
  protected async postRequest(url: string, params: Record<string, any>, authorization: string): Promise<Record<string, any>> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': this.userAgent,
          'Authorization': authorization,
          'Accept-Encoding': 'gzip',
        },
      });

      const result = await response.json();

      return {
        status: response.status,
        ...result,
      };
    } catch (error) {
      return {
        status: error.status,
        errRaw: error,
        ...(error?.response?.text && JSON.parse(error?.response?.text)),
      };
    }
  }
  /**
   * post 请求 V2
   * @param url  请求接口
   * @param params 请求参数
   */
  protected async postRequestV2(url: string, params: Record<string, any>, authorization: string, headers = {}): Promise<Output> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          ...headers,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': this.userAgent,
          'Authorization': authorization,
          'Accept-Encoding': 'gzip',
        },
      });
      const result = await response.json();
      return {
        status: result.status,
        data: result.body,
      };
    } catch (error) {
      const err = JSON.parse(JSON.stringify(error));
      return {
        status: err.status as number,
        errRaw: err,
        error: err?.response?.text,
      };
    }
  }
  /**
   * get 请求
   * @param url  请求接口
   * @param query 请求参数
   */
  protected async getRequest(url: string, authorization: string, query: Record<string, any> = {}): Promise<Record<string, any>> {
    try {
      const params = new URLSearchParams();
      const keys = Object.keys(query);
      for (const key of keys) {
        const val = query[key];
        params.append(key, val);
      }
      if (url.includes("?")) {
        url += "&";
      } else {
        url += "?";
      }
      url += params.toString();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: 'application/json',
          'User-Agent': this.userAgent,
          Authorization: authorization,
          'Accept-Encoding': 'gzip',
        },
      });
      
      const result = await response.json();

      let data = {};
      switch (result.type) {
        case 'application/json':
          data = {
            status: result.status,
            ...result.body,
          };
          break;
        case 'text/plain':
          data = {
            status: result.status,
            data: result.text,
          };
          break;
        case 'application/x-gzip':
          data = {
            status: result.status,
            data: result.body,
          };
          break;
        default:
          data = {
            status: result.status,
            ...result.body,
          };
      }
      return data;
    } catch (error) {
      const err = JSON.parse(JSON.stringify(error));
      return {
        status: err.status,
        errRaw: err,
        ...(err?.response?.text && JSON.parse(err?.response?.text)),
      };
    }
  }
  /**
   * get 请求 v2
   * @param url  请求接口
   * @param query 请求参数
   */
  protected async getRequestV2(url: string, authorization: string, query: Record<string, any> = {}): Promise<Output> {
    try {
      const params = new URLSearchParams();
      const keys = Object.keys(query);
      for (const key of keys) {
        const val = query[key];
        params.append(key, val);
      }
      if (url.includes("?")) {
        url += "&";
      } else {
        url += "?";
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: 'application/json',
          'User-Agent': this.userAgent,
          Authorization: authorization,
          'Accept-Encoding': 'gzip',
        },
      });
      const result = await response.json();

      let data: any = {};
      switch (result.type) {
        case 'application/json':
          data = {
            status: result.status,
            data: result.body,
          };
          break;
        case 'text/plain':
          data = {
            status: result.status,
            data: result.text,
          };
          break;
        case 'application/x-gzip':
          data = {
            status: result.status,
            data: result.body,
          };
          break;
        default:
          data = {
            status: result.status,
            data: result.body,
          };
      }
      return data;
    } catch (error) {
      const err = JSON.parse(JSON.stringify(error));
      return {
        status: err.status,
        errRaw: err,
        error: err?.response?.text,
      };
    }
  }
}

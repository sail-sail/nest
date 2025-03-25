import {
  error,
  log,
} from "/lib/context.ts";

import {
  encodeBase64,
} from "@std/encoding/base64";
 
import {
  isEmpty,
} from "/lib/util/string_util.ts";
 
import dayjs from "dayjs";
 
import {
  findOneBaiduAppToken,
  createBaiduAppToken,
  updateByIdBaiduAppToken,
} from "/gen/baidu/baidu_app_token/baidu_app_token.dao.ts";

import {
  findOneBaiduApp,
  findByIdBaiduApp,
  validateOptionBaiduApp,
  validateIsEnabledBaiduApp,
} from "/gen/baidu/baidu_app/baidu_app.dao.ts";

import type {
  OcrLicensePlateInput,
} from "./app_token.model.ts";

import {
  resize as resizeImage,
  close as closeImage,
} from "/lib/image/mod.ts";

export const closeImageDll = closeImage;

async function fetchBaiduAppToken(
  baidu_app_model: BaiduAppModel,
) {
  
  const api_key = baidu_app_model.api_key;
  const secret_key = baidu_app_model.secret_key;
  
  const url = `https://aip.baidubce.com/oauth/2.0/token?client_id=${
    api_key
  }&client_secret=${
    secret_key
  }&grant_type=client_credentials`;
  const res = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    },
  );
  
  const data: {
    error?: string;
    error_description?: string;
    expires_in: number;
    access_token: string;
    session_key: string;
    refresh_token: string;
  } = await res.json();
  
  if (data.error) {
    const err = data.error;
    let err_msg = data.error_description;
    if (err === "invalid_client" && err_msg === "unknown client id") {
      err_msg = `百度应用 ${ baidu_app_model.lbl } 配置的 AppID 不正确`;
    } else if (err === "invalid_client" && err_msg === "Client authentication failed") {
      err_msg = `百度应用 ${ baidu_app_model.lbl } 配置的 Secret Key 不正确`;
    }
    throw new Error(err_msg);
  }
  
  const access_token = data.access_token;
  if (isEmpty(access_token)) {
    throw new Error(JSON.stringify(data));
  }
  
  return data;
}

export async function getAccessToken(
  baidu_app_id: BaiduAppId,
  force = false,
) {
  
  const baidu_app_model = await validateOptionBaiduApp(
    await findByIdBaiduApp(baidu_app_id),
  );
  await validateIsEnabledBaiduApp(baidu_app_model);
  
  const tenant_id = baidu_app_model.tenant_id;
  const appid = baidu_app_model.appid;
  const secret_key = baidu_app_model.secret_key;
  
  if (isEmpty(appid) || isEmpty(secret_key)) {
    throw `百度应用 ${ baidu_app_model.lbl } 未配置 AppID 或 Secret Key`;
  }
  
  const dateNow = dayjs();
  
  const baidu_app_token_model = await findOneBaiduAppToken({
    baidu_app_id: [ baidu_app_id ],
  });
  
  if (!baidu_app_token_model) {
    const {
      access_token,
      expires_in,
    } = await fetchBaiduAppToken(baidu_app_model);
    await createBaiduAppToken({
      baidu_app_id,
      access_token,
      expires_in,
      token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
      tenant_id,
    });
    return access_token;
  }
  
  let access_token = baidu_app_token_model.access_token;
  const expires_in = baidu_app_token_model.expires_in ?? 0;
  const token_time = dayjs(baidu_app_token_model.token_time);
  
  if (
    force
    || !(expires_in > 0)
    || !access_token
    || !baidu_app_token_model.token_time
    || token_time.add(expires_in, "s").add(2, "h").isBefore(dateNow)
  ) {
    log(`百度应用 ${ baidu_app_model.lbl } 的 access_token 已过期，重新获取`);
    const data = await fetchBaiduAppToken(baidu_app_model);
    access_token = data.access_token;
    await updateByIdBaiduAppToken(
      baidu_app_token_model.id,
      {
        access_token,
        expires_in: data.expires_in,
        token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
      },
    );
  }
  
  return access_token;
}

const license_plate_url = "https://aip.baidubce.com/rest/2.0/ocr/v1/license_plate";

/**
 * 车牌识别
 * https://cloud.baidu.com/doc/OCR/s/ck3h7y191
 * 
{
  words_result: {
    number: "粤ED72239",
    vertexes_location: [
      { x: 176, y: 524 },
      { x: 305, y: 539 },
      { x: 301, y: 585 },
      { x: 172, y: 569 }
    ],
    color: "green",
    probability: [
      0.9999997616,
      0.9999655485,
      0.999997735,
      1,
      0.9999990463,
      0.9999884367,
      0.9999995232,
      0.9999963045
    ]
  },
  log_id: 1803636818624460000
}

{
  log_id: 1803637597990919200,
  error_msg: "target recognize error",
  error_code: 282103
}
 */
export async function ocrLicensePlate(
  input: OcrLicensePlateInput,
) {
  
  const form_url = input.url;
  let form_image: string | undefined;
  
  if (!form_url && !input.image) {
    throw new Error("image 或 url 必须有一个");
  }
  
  if (!form_url) {
    
    const content = input.image!;
    
    const content2 = await resizeImage(
      new Uint8Array(content),
      "jpeg",
      1920,
      1080,
      100,
    );
    
    form_image = encodeBase64(content2);
  }
  
  const params = new URLSearchParams();
  if (form_url) {
    params.append("url", form_url);
  } else {
    params.append("image", form_image!);
  }
  const lbl = "xh车牌识别通知";
  const baidu_app_model = await findOneBaiduApp({
    lbl,
  });
  if (!baidu_app_model) {
    throw `未找到百度应用 ${ lbl } 的配置`;
  }
  const baidu_app_id = baidu_app_model.id;
  const access_token = await getAccessToken(baidu_app_id);
  const url = license_plate_url + `?access_token=${ access_token }`;
  log(url);
  try {
    const res = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
        },
        body: params,
      },
    );
    const data = await res.json();
    log(data);
    const words_result = data.words_result;
    if (!words_result) {
      return;
    }
    return {
      color: words_result.color,
      number: words_result.number,
    };
  } catch (err) {
    error(err);
    return;
  }
}

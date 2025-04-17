import pages from "@/pages.json";

import type {
  Pinia,
} from "pinia";

let host = "";
let port: string | undefined = undefined;
let protocol = "http:";
let domain = "";
let wsProt = "ws:";
const appid = "wxd4b24c53a1813485";
const agentid = "";

const homePage = `/${pages.pages[0]?.path}`;

const accountInfo = uni.getAccountInfoSync?.();
const envVersion = accountInfo?.miniProgram.envVersion;

if (import.meta.env.MODE === "development") {
  // #ifndef H5
  host = "localhost";
  port = "4000";
  domain = `${ host }${ port ? `:${ port }` : "" }`;
  protocol = "http:";
  wsProt = "ws:";
  // #endif
  // #ifdef H5
  host = location.hostname;
  port = location.port;
  domain = location.host;
  protocol = location.protocol;
  if(protocol === "https:") {
    wsProt = "wss:";
  } else {
    wsProt = "ws:";
  }
  // #endif
} else if (import.meta.env.MODE === "production") {
  // #ifndef H5
  if (envVersion === "develop") {
    host = "localhost";
    port = "4000";
    domain = `${ host }${ port ? `:${ port }` : "" }`;
    protocol = "http:";
    wsProt = "ws:";
  } else if (envVersion === "trial") {
    host = "localhost";
    port = "4000";
    domain = `${ host }${ port ? `:${ port }` : "" }`;
    protocol = "https:";
    wsProt = "wss:";
  } else if (envVersion === "release") {
    host = "localhost";
    port = "4000";
    domain = `${ host }${ port ? `:${ port }` : "" }`;
    protocol = "https:";
    wsProt = "wss:";
  }
  // #endif
  // #ifdef H5
  host = location.hostname;
  port = location.port;
  domain = location.host;
  protocol = location.protocol;
  if(protocol === "https:") {
    wsProt = "wss:";
  } else {
    wsProt = "ws:";
  }
  // #endif
} else {
  uni.showModal({
    title: "错误",
    content: `Unknown import.meta.env.MODE: ${ import.meta.env.MODE }`,
  });
}

let urlBase = `${protocol}//${host}`;
if(port) {
  urlBase += `:${port}`;
}
const url = `${urlBase}/api`;
let wss = `${wsProt}//${host}`;
if(port) {
  wss += `:${port}`;
}

const config: {
  urlBase: string;
  url: string;
  wss: string;
  host: string;
  port: string | undefined;
  protocol: string;
  wsProt: string;
  homePage: string;
  domain: string;
  appid: string;
  agentid: string;
  pinia: Pinia | undefined;
} = {
  urlBase,
  url,
  wss,
  host,
  port,
  protocol,
  wsProt,
  homePage,
  domain,
  appid,
  agentid,
  pinia: undefined,
};

export default config;

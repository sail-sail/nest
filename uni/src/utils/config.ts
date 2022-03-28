let host = "";
let port = undefined;
let protocol = "http:";
let wsProt = "ws:";

if(process.env.NODE_ENV === 'development') {
  // #ifndef H5
  host = "localhost";
  port = 4001;
  protocol = "http:";
  wsProt = "ws:";
  // #endif
  // #ifdef H5
  host = location.hostname;
  port = location.port;
  protocol = location.protocol;
  if(protocol === "https:") {
    wsProt = "wss:";
  } else {
    wsProt = "ws:";
  }
  // #endif
} else {
  // #ifndef H5
  host = "localhost";
  port = undefined;
  protocol = "https:";
  wsProt = "wss:";
  // #endif
  // #ifdef H5
  host = location.hostname;
  port = location.port;
  protocol = location.protocol;
  if(protocol === "https:") {
    wsProt = "wss:";
  } else {
    wsProt = "ws:";
  }
  // #endif
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
const config = {
  urlBase, url, wss, host, port, protocol, wsProt,
  pinia: undefined,
};
export default config;

import terminal from "virtual:terminal";

if (process.env.NODE_ENV === "development") {
  
  function getVueScriptLine(ph: string, method: string): number {
    let vueScriptLine = 0;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${ window.location.origin }/graphql`, false);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          vueScriptLine = JSON.parse(xhr.responseText)?.data?.getVueScriptLine || 0;
        }
      }
    };
    xhr.send(JSON.stringify({
      query: `query($ph: String!, $method: String!) { getVueScriptLine(ph: $ph, method: $method) }`,
      variables: { ph: "pc/" + ph, method },
    }));
    return vueScriptLine;
  }
  
  const oldStringify = JSON.stringify;
  
  function stringify2(o: any) {
    let cache = [ ];
    const str = oldStringify(o, function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          return `[Circular(${ key })]`;
        }
        cache.push(value);
      }
      return value;
    }, "\t");
    cache = null;
    return str;
  }
  
  function getStackTrace() {
    const obj = Object.create(null);
    Error.captureStackTrace(obj, getStackTrace);
    return <string>obj.stack || "";
  };
  
  const log = console.log;
  
  console.log = function(...args: any[]) {
    if (args[0] && args[0].toString && args[0].toString().startsWith("[vite] ")) {
      return log.apply(console, args);
    }
    const stack = getStackTrace();
    let arr2 = [ ];
    let termArr = [ ];
    const arr = stack.split("\n");
    if (
      (args[0] && args[0].startsWith && args[0].startsWith("🍍")) ||
      (arr.length === 3 && arr[2].startsWith("    at <anonymous>:"))
    ) {
      log.apply(console, args);
      return;
    }
    let start = false;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i].trim().replace("at ", "");
      if (item.startsWith("console.log ")) {
        start = true;
        continue;
      }
      if (!start) continue;
      item = item.replace("ObjectRefImpl.", "").replace("async ", "");
      const method = item.substring(0, item.indexOf("(")-1);
      let url = item.substring(item.indexOf("(")+1);
      url = url.substring(0, url.indexOf(")"));
      if (!url) continue;
      termArr.push({ method, url });
      arr2.push(` -- ${ method } ${ url }`);
    }
    const rvObj = log.apply(console, args);
    log(arr2.join("\n") + "\n");
    let args2 = [ ...args ];
    let str = "";
    for (let k = 0; k < termArr.length; k++) {
      const itemTmp = termArr[k];
      const url = new URL(itemTmp.url);
      let pathname = url.pathname;
      if (pathname.startsWith("/node_modules/")) {
        continue;
      }
      let pathname0 = pathname;
      if (pathname.lastIndexOf(":") !== -1) {
        pathname0 = pathname.substring(0, pathname.lastIndexOf(":"));
        pathname0 = pathname0.substring(0, pathname0.lastIndexOf(":"));
      }
      let tmpArr = pathname.match(/:\d+:\d+$/gm);
      if (!tmpArr) {
        tmpArr = url.search.match(/:\d+:\d+$/gm);
      }
      if (tmpArr && tmpArr.length > 0) {
        const numArr: any[] = tmpArr[0].split(":").filter((item) => item);
        const vueScriptLine = getVueScriptLine(pathname0, itemTmp.method);
        numArr[0] = vueScriptLine;
        if (pathname0.startsWith("/")) {
          pathname0 = pathname0.substring(1);
        }
        str += ` -- ${ itemTmp.method } ${ pathname0 }${ `:${ numArr.join(":") }` }\n`;
      }
    }
    args2.push("\n" + str + "\n");
    JSON.stringify = stringify2;
    args2 = args2.filter((item) => item != null);
    terminal.log(...args2);
    JSON.stringify = oldStringify;
    return rvObj;
  };
}

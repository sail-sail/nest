let UID = Date.now();

export function uniqueID(): string {
  return (UID++).toString(36);
}

export function isEmpty(str: any): boolean {
  if (str === undefined || str === null || str === "") return true;
  const type = typeof(str);
  if (type === "string" && str.trim() === "") return true;
  if (Array.isArray(type) && str.length === 0) return true;
  return false;
}

/**
 * 格式化消息
 * @param  {string} msg
 * @param  {any} args
 */
export function formatMsg(msg: string, args: any[]) {
	return msg.replace(/\{\{.*?\}\}/gm ,(str) => {
		return args[str.substring(2, str.length-2)];
	});
}

export function includeFtl(htmlStr: string, open?: string, close?: string) {
  const debug_open = open || "<%";
  const debug_close = close || "%>";
  const uuidStr = "29ce888385c9de594b790798e81332ae";
  const uuidStr1 = "29ce888385c9de594b790798e8131ae";
  htmlStr = htmlStr.replace(/'/g, uuidStr);
  function escapeRegExp(str: string) {
    return str.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
  }
  const reg = new RegExp(escapeRegExp(debug_open)+"([\\s\\S]*?)"+escapeRegExp(debug_close), "gm");
  htmlStr = htmlStr.replace(reg, function(str) {
    str = str.trim();
    const len = str.length;
    const openLen = debug_open.length;
    const closeLen = debug_close.length;
    str = str.substring(openLen, len-closeLen).trim();
    str = str.replace(new RegExp(uuidStr, "gm"), "'");
    str = str.replace(/\n/g, uuidStr1).replace(/\r/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    if (str.startsWith("=")) {
      str = str.substring(1);
      str = `'+(${ str } || \'\').toString()+'`;
    } else if (str.startsWith("~")) {
      str = str.substring(1);
      str = `'+(Number(${ str }) || 0)+'`;
    } else {
      str = `';${ str };_out_+='`;
    }
    return str;
  });
  htmlStr = htmlStr.replace(new RegExp(uuidStr, "gm"), "\\'").replace(/\n/g, "\\n").replace(/\r/g, "").replace(new RegExp(uuidStr1, "gm"), "\n");
  htmlStr = `
  var _out_='';
  _out_+='${ htmlStr }';
  _out_;
  `;
  return htmlStr;
}

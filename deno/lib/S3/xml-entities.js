const ALPHA_INDEX = {
  "&lt": "<",
  "&gt": ">",
  "&quot": '"',
  "&apos": "'",
  "&amp": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&amp;": "&"
};

const CHAR_INDEX = {
  60: "lt",
  62: "gt",
  34: "quot",
  39: "apos",
  38: "amp"
};

const CHAR_S_INDEX = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
  "&": "&amp;"
};

/**
 * @param {String} str
 * @returns {String}
 */
export function encode(str) {
  if (!str || !str.length) {
    return "";
  }
  return str.replace(/<|>|"|'|&/g, function(s) {
    return CHAR_S_INDEX[s];
  });
}

/**
 * @param {String} str
 * @returns {String}
 */
export function decode(str) {
  if (!str || !str.length) {
    return "";
  }
  return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
    if (s.charAt(1) === "#") {
      const code = s.charAt(2).toLowerCase() === "x"
        ? parseInt(s.substr(3), 16)
        : parseInt(s.substr(2));

      if (isNaN(code) || code < -32768 || code > 65535) {
        return "";
      }
      return String.fromCharCode(code);
    }
    return ALPHA_INDEX[s] || s;
  });
}

/**
 * @param {String} str
 * @returns {String}
 */
export function encodeNonUTF(str) {
  if (!str || !str.length) {
    return "";
  }
  const strLength = str.length;
  let result = "";
  let i = 0;
  while (i < strLength) {
    const c = str.charCodeAt(i);
    const alpha = CHAR_INDEX[c];
    if (alpha) {
      result += "&" + alpha + ";";
      i++;
      continue;
    }
    if (c < 32 || c > 126) {
      result += "&#" + c + ";";
    } else {
      result += str.charAt(i);
    }
    i++;
  }
  return result;
}

/**
 * @param {String} str
 * @returns {String}
 */
export function encodeNonASCII(str) {
  if (!str || !str.length) {
    return "";
  }
  const strLength = str.length;
  let result = "";
  let i = 0;
  while (i < strLength) {
    const c = str.charCodeAt(i);
    if (c <= 255) {
      result += str[i++];
      continue;
    }
    result += "&#" + c + ";";
    i++;
  }
  return result;
}

export default {
  encode,
  decode,
  encodeNonUTF,
  encodeNonASCII
};

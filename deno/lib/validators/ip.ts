import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

// IP地址正则表达式
const REG = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/gm;

export async function ip(
  value?: string | null,
  label?: string,
) {
  if (value == null) {
    return;
  }
  if (REG.test(value)) {
    return;
  }
  label = label || "";
  const err_msg = await ns(
    "IP地址格式不正确",
  );
  throw new ServiceException(`${ label } ${ err_msg }`, "validate_ip");
}

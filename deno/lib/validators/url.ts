import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

const REG = /^https?:\/\/[a-zA-Z0-9_\-\.]+$/gm;

export async function url(
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
    "网址格式不正确",
  );
  throw new ServiceException(`${ label } ${ err_msg }`, "validate_url");
}

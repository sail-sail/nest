import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

export async function regex(
  value?: string | null,
  reg?: string | null,
  label?: string,
) {
  if (value == null) {
    return;
  }
  if (reg == null) {
    return;
  }
  const regex = new RegExp(reg, "gm");
  if (regex.test(value)) {
    return;
  }
  label = label || "";
  const err_msg = await ns(
    "格式不正确",
  );
  throw new ServiceException(`${ label } ${ err_msg }`, "regex");
}

import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

export async function multiple_of(
  value?: number | null,
  len?: number,
  label?: string
) {
  if (value == null) {
    return;
  }
  if (len == null) {
    return;
  }
  label = label || "";
  if (value % len === 0) {
    return;
  }
  const err_msg = await ns(
    "必须为 {0} 的整数倍",
    len,
  );
  throw new ServiceException(`${ label } ${ err_msg }`, "multiple_of");
}

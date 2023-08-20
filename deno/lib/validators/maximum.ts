import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

export async function maximum(
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
  if (value <= len) {
    return;
  }
  const err_msg = await ns(
    "不能大于 {0}",
    len,
  );
  throw new ServiceException(`${ label } ${ err_msg }`, "maximum");
}

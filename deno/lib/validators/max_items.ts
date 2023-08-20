import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

export async function max_items(
  // deno-lint-ignore no-explicit-any
  value?: any[] | null,
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
  const value_len = value.length;
  if (value_len <= len) {
    return;
  }
  const err_msg = await ns(
    "数量不能超过 {0}",
    len,
  );
  throw new ServiceException(`${ label } ${ err_msg }`, "max_items");
}

import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

/**
 * 校验字符串长度不能超过指定长度
 * @param value 被校验的字符串
 * @param len 最大长度
 * @param label 字段名称描述
 */
export async function chars_max_length(
  // deno-lint-ignore no-explicit-any
  value?: any | null,
  len?: number,
  label?: string,
) {
  if (value == null) {
    return;
  }
  if (len == null) {
    return;
  }
  const value_len = value.length || 0;
  if (value_len <= len) {
    return;
  }
  label = label || "";
  const err_msg = await ns(
    "长度不能超过 {0}",
    len,
  );
  throw new ServiceException(`${ label } ${ err_msg }`, "validate_chars_max_length");
}

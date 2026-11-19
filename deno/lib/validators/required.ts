import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

/**
 * 校验必填
 * @param value 被校验的值, 空字符串和空数组也视为未填写
 * @param label 字段名称描述
 */
export async function required(
  value?: unknown,
  label?: string,
) {
  if (Array.isArray(value)) {
    if (value.length > 0) {
      return;
    }
  } else if (value != null && value !== "") {
    return;
  }
  label = label || "";
  const err_msg = await ns(
    "不能为空",
  );
  throw new ServiceException(`${ label } ${ err_msg }`, "validate_required");
}

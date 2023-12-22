import { useContext } from "/lib/context.ts";

import type {
  PayNowInput,
} from "/gen/types.ts";

import * as orderService from "./order.service.ts";

/** 立即支付 */
export async function payNow(
  input: PayNowInput,
) {
  const context = useContext();
  
  context.is_tran = true;
  return await orderService.payNow(input);
}

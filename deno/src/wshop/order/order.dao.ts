import {
  SortOrderEnum,
} from "/gen/types.ts";

import {
  findOneOrder,
} from "/gen/wshop/order/order.dao.ts";

import dayjs from "dayjs";

/** 自动生成订单号 */
export async function getLblSeq() {
  const now = dayjs();
  const order_model = await findOneOrder(
    undefined,
    [
      {
        prop: "lbl_date_seq",
        order: SortOrderEnum.Desc,
      },
      {
        prop: "lbl_seq",
        order: SortOrderEnum.Desc,
      },
    ],
  );
  const nowDate = now.startOf("day");
  if (order_model && dayjs(order_model.lbl_date_seq).isSame(nowDate)) {
    // 当天已有订单
    const lbl_seq = order_model.lbl_seq + 1;
    const lbl = "DD" + nowDate.format("YYYYMMDD") + lbl_seq.toString().padStart(3, "0");
    return {
      lbl,
      lbl_seq,
      lbl_date_seq: nowDate.format("YYYY-MM-DD"),
    };
  }
  // 当天无订单
  const lbl_seq = 1;
  const lbl = "DD" + nowDate.format("YYYYMMDD") + lbl_seq.toString().padStart(3, "0");
  return {
    lbl,
    lbl_seq,
    lbl_date_seq: nowDate.format("YYYY-MM-DD"),
  };
}

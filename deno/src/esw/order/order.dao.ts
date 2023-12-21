import {
  SortOrderEnum,
} from "/gen/types.ts";

import {
  findOne as findOneOrder,
  updateById as updateByIdOrder,
} from "/gen/esw/order/order.dao.ts";

import type {
  OrderId,
} from "/gen/esw/order/order.model.ts";

import dayjs from "dayjs";

/** 自动生成订单号 */
export async function updateSeqLbl(id: OrderId) {
  const now = dayjs();
  const orderModel = await findOneOrder(
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
  if (orderModel && dayjs(orderModel.lbl_date_seq).isSame(nowDate)) {
    // 当天已有订单
    const lbl_seq = orderModel.lbl_seq + 1;
    const lbl = "DD" + nowDate.format("YYYYMMDD") + lbl_seq.toString().padStart(3, "0");
    await updateByIdOrder(
      id,
      {
        lbl,
        lbl_seq,
      },
    );
    return;
  }
  // 当天无订单
  const lbl_seq = 1;
  const lbl = "DD" + nowDate.format("YYYYMMDD") + lbl_seq.toString().padStart(3, "0");
  await updateByIdOrder(
    id,
    {
      lbl,
      lbl_seq,
      lbl_date_seq: nowDate.format("YYYY-MM-DD"),
    },
  );
}

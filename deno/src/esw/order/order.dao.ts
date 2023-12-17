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
        prop: "date_lbl",
        order: SortOrderEnum.Desc,
      },
      {
        prop: "seq_lbl",
        order: SortOrderEnum.Desc,
      },
    ],
  );
  const nowDate = now.startOf("day");
  if (orderModel && dayjs(orderModel.date_lbl).isSame(nowDate)) {
    // 当天已有订单
    const seq_lbl = orderModel.seq_lbl + 1;
    const lbl = "DD" + nowDate.format("YYYYMMDD") + seq_lbl.toString().padStart(3, "0");
    await updateByIdOrder(
      id,
      {
        lbl,
        seq_lbl,
      },
    );
    return;
  }
  // 当天无订单
  const seq_lbl = 1;
  const lbl = "DD" + nowDate.format("YYYYMMDD") + seq_lbl.toString().padStart(3, "0");
  await updateByIdOrder(
    id,
    {
      lbl,
      seq_lbl,
      date_lbl: nowDate.format("YYYY-MM-DD"),
    },
  );
}

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
    {
      prop: "seq_lbl",
      order: SortOrderEnum.Desc,
    },
  );
  let seq_lbl = 1;
  if (orderModel) {
    seq_lbl = orderModel.seq_lbl + 1;
  }
  const lbl = "DD" + now.format("YYYYMMDD") + seq_lbl.toString().padStart(3, "0");
  await updateByIdOrder(
    id,
    {
      lbl,
      seq_lbl,
    },
  );
}

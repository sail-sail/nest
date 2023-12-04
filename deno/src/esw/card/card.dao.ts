import {
  SortOrderEnum,
} from "/gen/types.ts";

import {
  findOne as findOneCard,
  updateById as updateByIdCard,
} from "/gen/esw/card/card.dao.ts";

import type {
  CardId,
} from "/gen/esw/card/card.model.ts";

/** 自动生成会员卡卡号 */
export async function updateSeqLbl(id: CardId) {
  const cardModel = await findOneCard(
    undefined,
    {
      prop: "seq_lbl",
      order: SortOrderEnum.Desc,
    },
  );
  let seq_lbl = 1;
  if (cardModel) {
    seq_lbl = cardModel.seq_lbl + 1;
  }
  const lbl = seq_lbl.toString().padStart(6, "0");
  await updateByIdCard(
    id,
    {
      lbl,
      seq_lbl,
    },
  );
}

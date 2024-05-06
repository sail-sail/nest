import {
  SortOrderEnum,
} from "/gen/types.ts";

import {
  findOne as findOneCard,
  updateById as updateByIdCard,
} from "/gen/wshop/card/card.dao.ts";

/** 自动生成会员卡卡号 */
export async function updateSeqLbl(id: CardId) {
  const cardModel = await findOneCard(
    undefined,
    {
      prop: "lbl_seq",
      order: SortOrderEnum.Desc,
    },
  );
  let lbl_seq = 1;
  if (cardModel) {
    lbl_seq = cardModel.lbl_seq + 1;
  }
  const lbl = lbl_seq.toString().padStart(6, "0");
  await updateByIdCard(
    id,
    {
      lbl,
      lbl_seq,
    },
  );
}

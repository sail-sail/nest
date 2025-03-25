import {
  SortOrderEnum,
} from "/gen/types.ts";

import {
  findOneCard,
} from "/gen/wshop/card/card.dao.ts";

/** 自动生成会员卡卡号 */
export async function getLblSeq() {
  const model = await findOneCard(
    undefined,
    [
      {
        prop: "lbl_seq",
        order: SortOrderEnum.Desc,
      },
    ],
  );
  const lbl_seq = (model?.lbl_seq || 0) + 1;
  const lbl = lbl_seq.toString().padStart(6, "0");
  return {
    lbl,
    lbl_seq,
  };
}

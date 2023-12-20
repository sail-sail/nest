import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  create as createOrder,
} from "/gen/esw/order/order.dao.ts";

import {
  findOne as findOneCard,
  updateById as updateByIdCard,
  validateIsEnabled as validateIsEnabledCard,
} from "/gen/esw/card/card.dao.ts";

import {
  create as createCardConsume,
} from "/gen/esw/card_consume/card_consume.dao.ts"

import {
  findById as findByIdPt,
  validateOption as validateOptionPt,
  validateIsEnabled as validateIsEnabledPt,
} from "/gen/esw/pt/pt.dao.ts";

import {
  SortOrderEnum,
  OrderStatus,
  OrderType,
  type PayNowInput,
} from "/gen/types.ts";

import { Decimal } from "decimal.js";

/** 立即支付 */
export async function payNow(
  input: PayNowInput,
) {
  const authModel = await getAuthModel();
  const usr_id = authModel.id;
  const cardModel = await findOneCard(
    {
      usr_id: [ usr_id ],
      is_default: [ 1 ],
      is_enabled: [ 1 ],
      is_deleted: 0,
    },
    {
      prop: "seq_lbl",
      order: SortOrderEnum.Asc,
    },
  );
  if (!cardModel) {
    return false;
  }
  await validateIsEnabledCard(cardModel);
  
  const pt_id = input.pt_id;
  
  const ptModel = await validateOptionPt(
    await findByIdPt(pt_id),
  );
  await validateIsEnabledPt(ptModel);
  
  const price = ptModel.price;
  
  let balance = cardModel.balance;
  let give_balance = cardModel.give_balance;
  
  // 校验余额是否足够购买产品
  if (balance.add(give_balance).lt(price)) {
    throw `余额不足, 当前可用余额: ${ balance.add(give_balance).toFixed(2) } 元`;
  }
  
  let amt = new Decimal(0);
  let give_amt = new Decimal(0);
  const integral = Math.floor(price.toNumber());
  const growth_amt = cardModel.growth_amt.add(price);
  
  if (balance.gte(price)) {
    balance = balance.sub(price);
    amt = balance;
  } else {
    amt = balance;
    give_balance = balance.add(give_balance).sub(price);
    give_amt = price.sub(balance);
    balance = new Decimal(0);
  }
  
  await updateByIdCard(
    cardModel.id,
    {
      balance,
      give_balance,
      integral: cardModel.integral + integral,
      growth_amt,
    },
  );
  
  await createOrder({
    usr_id,
    card_id: cardModel.id,
    status: OrderStatus.InProgress,
    type: OrderType.Pay,
    company: input.company,
    phone: input.phone,
    rem: input.rem,
    price,
    amt,
    give_amt,
    integral,
    balance,
    give_balance,
  });
  
  // 会员卡消费记录
  await createCardConsume({
    card_id: cardModel.id,
    usr_id,
    amt,
    give_amt,
    integral,
    balance,
    give_balance,
  });
  return true;
}

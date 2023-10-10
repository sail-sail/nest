import type {
  Query,
  Mutation,
} from "#/types";

/**
 * 确认工资条
 */
export async function confirmPayslip(
  id: string,
  opt?: GqlOpt,
) {
  const data: {
    confirmPayslip: Mutation["confirmPayslip"],
  } = await mutation({
    query: `
      mutation($id: String!) {
        confirmPayslip(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  return data.confirmPayslip;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
) {
  const data: {
    findByIdPayslip: Query["findByIdPayslip"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
        findByIdPayslip(id: $id) {
          id
          pay_month
          pay_month_lbl
          lbl
          job_num
          company
          gross_pay
          social_security
          individual_tax
          self_pay
          net_pay
          is_send
          is_send_lbl
          is_confirm
          is_confirm_lbl
          is_locked
          is_locked_lbl
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.findByIdPayslip;
  return res;
}


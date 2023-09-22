import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  PayslipInput as PayslipInputType,
  PayslipModel as PayslipModelType,
  PayslipSearch as PayslipSearchType,
} from "/gen/types.ts";

export interface PayslipSearch extends PayslipSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface PayslipModel extends PayslipModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface PayslipInput extends PayslipInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface PayslipFieldComment {
  id: string;
  pay_date: string;
  pay_date_lbl: string;
  usr_id: string;
  usr_id_lbl: string;
  job_num: string;
  company: string;
  gross_pay: string;
  social_security: string;
  individual_tax: string;
  self_pay: string;
  net_pay: string;
  is_send: string;
  is_send_lbl: string;
  is_confirm: string;
  is_confirm_lbl: string;
  is_locked: string;
  is_locked_lbl: string;
  rem: string;
  create_usr_id: string;
  create_usr_id_lbl: string;
  create_time: string;
  create_time_lbl: string;
  update_usr_id: string;
  update_usr_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
}

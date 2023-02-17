import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type PermitModel as PermitModelType,
  type PermitSearch as PermitSearchType,
} from "/gen/types.ts";

export interface PermitSearch extends PermitSearchType {
  $extra?: SearchExtra[],
}

export interface PermitModel extends PermitModelType {
}

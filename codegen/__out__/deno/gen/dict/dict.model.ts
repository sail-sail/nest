import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type DictModel as DictModelType,
  type DictSearch as DictSearchType,
} from "/gen/types.ts";

export interface DictSearch extends DictSearchType {
  $extra?: SearchExtra[],
}

export interface DictModel extends DictModelType {
}

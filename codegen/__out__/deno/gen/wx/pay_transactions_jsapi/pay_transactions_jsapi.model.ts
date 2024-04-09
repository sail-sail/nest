import type {
  PayTransactionsJsapiInput as PayTransactionsJsapiInputType,
  PayTransactionsJsapiModel as PayTransactionsJsapiModelType,
  PayTransactionsJsapiSearch as PayTransactionsJsapiSearchType,
  PayTransactionsJsapiFieldComment as PayTransactionsJsapiFieldCommentType,
} from "/gen/types.ts";

declare const payTransactionsJsapiId: unique symbol;

declare global {
  
  type PayTransactionsJsapiId = Distinct<string, typeof payTransactionsJsapiId>;

  interface PayTransactionsJsapiSearch extends PayTransactionsJsapiSearchType {
    tenant_id?: string | null;
    org_id?: string | null;
  }

  interface PayTransactionsJsapiModel extends PayTransactionsJsapiModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
    tenant_id: TenantId;
    org_id: OrgId;
  }

  interface PayTransactionsJsapiInput extends PayTransactionsJsapiInputType {
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    is_deleted?: number | null;
    tenant_id?: TenantId | null;
    org_id?: OrgId | null;
  }

  interface PayTransactionsJsapiFieldComment extends PayTransactionsJsapiFieldCommentType {
  }
  
}

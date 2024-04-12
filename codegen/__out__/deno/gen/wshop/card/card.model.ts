import type {
  CardInput as CardInputType,
  CardModel as CardModelType,
  CardSearch as CardSearchType,
  CardFieldComment as CardFieldCommentType,
} from "/gen/types.ts";

declare const cardId: unique symbol;

declare global {
  
  type CardId = Distinct<string, typeof cardId>;

  interface CardSearch extends CardSearchType {
    /** 卡号-序列号 */
    lbl_seq?: number[];
    tenant_id?: string | null;
    org_id?: string | null;
  }

  interface CardModel extends CardModelType {
    /** 卡号-序列号 */
    lbl_seq: number;
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

  interface CardInput extends CardInputType {
    /** 卡号-序列号 */
    lbl_seq?: number;
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

  interface CardFieldComment extends CardFieldCommentType {
  }
  
}

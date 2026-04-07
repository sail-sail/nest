import { defineConfig } from "../../config.ts";

export default defineConfig({
  // SEO优化
  nuxt_seo: {
    opts: {
      cache: true,
    },
    columns: [
      {
        COLUMN_NAME: "domain_ids",
        COLUMN_COMMENT: "所属域名",
        require: true,
        align: "left",
        width: 280,
        search: true,
        foreignKey: {
          hasSelectAdd: true,
          multipleSetDefault: true,
          isSearchByLbl: true,
        },
        many2many: {
          mod: "nuxt",
          table: "seo_domain",
        },
      },
      {
        COLUMN_NAME: "ico",
        fixed: false,
        isImg: true,
        isPublicAtt: true,
      },
      {
        COLUMN_NAME: "lbl",
        fixed: false,
      },
      {
        COLUMN_NAME: "description",
        width: 280,
        align: "left",
        require: true,
      },
      {
        COLUMN_NAME: "keywords",
        width: 180,
        align: "left",
      },
      {
        COLUMN_NAME: "og_image",
        isImg: true,
        isPublicAtt: true,
      },
      {
        COLUMN_NAME: "og_title",
        width: 180,
        align: "left",
      },
      {
        COLUMN_NAME: "og_description",
        width: 280,
        align: "left",
      },
      {
        COLUMN_NAME: "is_locked",
      },
      {
        COLUMN_NAME: "order_by",
      },
      {
        COLUMN_NAME: "rem",
      },
      {
        COLUMN_NAME: "create_usr_id",
      },
      {
        COLUMN_NAME: "create_time",
      },
      {
        COLUMN_NAME: "update_usr_id",
      },
      {
        COLUMN_NAME: "update_time",
      },
    ],
  },
});

import { defineConfig } from "../../config.ts";

export default defineConfig({
  // SEO优化
  nuxt_seo: {
    opts: {
      cache: true,
    },
    columns: [
      {
        COLUMN_NAME: "title",
        width: 180,
        align: "left",
        require: true,
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
        COLUMN_NAME: "is_default",
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

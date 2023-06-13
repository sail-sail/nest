import { RouteRecordRaw } from "vue-router";
import Layout1 from "@/layout/layout1/index.vue";

export const routesGen: Array<RouteRecordRaw> = [<#
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    let table_name = record.TABLE_NAME;
    if (!optTables[table_name]) continue;
    const table_nameUp = table_name.substring(0, 1).toUpperCase() + table_name.substring(1);
    let table_comment = record.TABLE_COMMENT;
    if (table_comment.includes("[")) {
      table_comment = table_comment.substring(0, table_comment.indexOf("["));
    }
    const mod = table_name.substring(0, table_name.indexOf("_"));
    const mod_slash_table = table_name.replace("_", "/");
    table_name = table_name.substring(table_name.indexOf("_") + 1);
    record.opts = record.opts || { };
    const list_tree = record.opts.list_tree;
    let fileNameVue = "List.vue";
    if (list_tree) {
      fileNameVue = "TreeList.vue";
    }
  #>
  {
    path: "/<#=mod_slash_table#>",
    component: Layout1,
    children: [
      {
        path: "",
        name: "<#=table_comment || mod+'_'+table_name#>",
        component: () => import("@/views/<#=mod#>/<#=table_name#>/<#=fileNameVue#>"),
        props: (route) => route.query,
      },
    ],
  },<#
  }
  #>
];

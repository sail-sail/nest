import {
  getFieldPermit as getFieldPermitApi,
} from "./Api";

export default defineStore("field_permit", function() {
  
  let field_permits = $ref<{
    [route_path: string]: string[];
  }>({ });
  
  function getFieldPermit(route_path?: string) {
    if (!route_path) {
      const route = useRoute();
      route_path = route.path;
    }
    return function(code: string) {
      const fields = field_permits[route_path];
      if (fields) {
        if (fields.length === 0) {
          return true;
        }
        return fields.includes(code);
      }
      let has = $ref(true);
      field_permits[route_path] = [ ];
      (async () => {
        const fields = await getFieldPermitApi(route_path);
        field_permits[route_path] = fields || [ ];
        if (fields.length === 0) {
          has = true;
        } else {
          has = fields.includes(code);
        }
      })();
      return has;
    };
  }
  
  async function setTableColumnsFieldPermit(
    tableColumns: Ref<ColumnType[]>,
    route_path?: string,
  ) {
    if (!route_path) {
      const route = useRoute();
      route_path = route.path;
    }
    const fields = field_permits[route_path];
    if (fields) {
      if (fields.length === 0) {
        return;
      }
      tableColumns.value = tableColumns.value.filter((column) => {
        return fields.includes(column.prop);
      });
    }
    field_permits[route_path] = [ ];
    const fields2 = await getFieldPermitApi(route_path);
    field_permits[route_path] = fields2 || [ ];
    if (fields2.length > 0) {
      tableColumns.value = tableColumns.value.filter((column) => {
        return fields2.includes(column.prop);
      });
    }
  }
  
   return $$({
    getFieldPermit,
    setTableColumnsFieldPermit,
  });
},
{
  persist: {
    key: "field_permits",
  },
});

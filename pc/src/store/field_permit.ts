import {
  getFieldPermit as getFieldPermitApi,
} from "./Api";

export default defineStore("field_permit", function() {
  
  let field_permits = $ref<{
    [route_path: string]: string[] | null;
  }>({ });
  
  function getFieldPermit(route_path?: string) {
    if (!route_path) {
      const route = useRoute();
      route_path = route.path;
    }
    return function(code: string) {
      const fields = field_permits[route_path];
      if (fields !== undefined) {
        if (fields == null) {
          return true;
        }
        if (fields.length === 0) {
          return false;
        }
        return fields.includes(code);
      }
      let has = $ref(true);
      field_permits[route_path] = [ ];
      (async () => {
        const fields = await getFieldPermitApi(route_path);
        field_permits[route_path] = fields;
        if (fields != null) {
          if (fields.length === 0) {
            has = false;
          } else {
            has = fields.includes(code);
          }
        }
      })();
      return has;
    };
  }
  
  async function setTableColumnsFieldPermit(
    tableColumns: Ref<ColumnType[]>,
    permitFields: string[],
    route_path?: string,
  ) {
    if (!route_path) {
      const route = useRoute();
      route_path = route.path;
    }
    const fields = field_permits[route_path];
    if (fields !== undefined) {
      if (fields === null) {
        return;
      }
      tableColumns.value = tableColumns.value.filter((column) => {
        return fields.includes(column.prop) || !permitFields.includes(column.prop);
      });
    }
    field_permits[route_path] = [ ];
    const fields2 = await getFieldPermitApi(route_path);
    field_permits[route_path] = fields2;
    if (fields2 == null) {
      return;
    }
    tableColumns.value = tableColumns.value.filter((column) => {
      return fields2.includes(column.prop) || !permitFields.includes(column.prop);
    });
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

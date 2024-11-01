import {
  getFieldPermit as getFieldPermitApi,
} from "./Api";

export default defineStore("field_permit", function() {
  
  let field_permits = ref<{
    [route_path: string]: string[] | null;
  }>({ });
  
  function getFieldPermit(route_path?: string) {
    if (!route_path) {
      const route = useRoute();
      route_path = route.path;
    }
    return function(code: string) {
      const fields = field_permits.value[route_path];
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
      field_permits.value[route_path] = [ ];
      (async () => {
        const fields = await getFieldPermitApi(route_path);
        field_permits.value[route_path] = fields;
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
    permitFields: (string | string[])[],
    route_path?: string,
  ) {
    if (!route_path) {
      const route = useRoute();
      route_path = route.path;
    }
    const permitFieldsFlat = permitFields.flat();
    const fields = field_permits.value[route_path];
    if (fields !== undefined) {
      if (fields === null) {
        return;
      }
      tableColumns.value = tableColumns.value.filter((column) => {
        if (!permitFieldsFlat.includes(column.prop)) {
          return true;
        }
        for (const field of fields) {
          for (const permitField of permitFieldsFlat) {
            if (Array.isArray(permitField)) {
              if (permitField.includes(field)) {
                return true;
              }
              continue;
            }
            if (permitField === field) {
              return true;
            }
          }
        }
        return false;
      });
    }
    field_permits.value[route_path] = [ ];
    const fields2 = await getFieldPermitApi(route_path);
    field_permits.value[route_path] = fields2;
    if (fields2 == null) {
      return;
    }
    tableColumns.value = tableColumns.value.filter((column) => {
      if (!permitFieldsFlat.includes(column.prop)) {
        return true;
      }
      for (const field of fields2) {
        for (const permitField of permitFieldsFlat) {
          if (Array.isArray(permitField)) {
            if (permitField.includes(field)) {
              return true;
            }
            continue;
          }
          if (permitField === field) {
            return true;
          }
        }
      }
      return false;
    });
  }
  
   return {
    field_permits,
    getFieldPermit,
    setTableColumnsFieldPermit,
  };
});

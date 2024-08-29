
export default defineStore("field_permit", function() {
  
  const usrStore = useUsrStore();
  
  let field_permits = $ref([ ]);
  
  function getFieldPermit(route_path?: string) {
    if (!route_path) {
      const route = useRoute();
      route_path = route.path;
    }
    return function(code: string) {
      if (usrStore.username === "admin") {
        return true;
      }
      return true;
    };
  }
  
  function useTableColumnsFieldPermit(tableColumns: ColumnType[]) {
    return tableColumns.filter((column) => {
      return true;
    });
  }
  
   return $$({
    field_permits,
    getFieldPermit,
    useTableColumnsFieldPermit,
  });
},
{
  persist: {
    key: "field_permits",
  },
});

import {
  getFieldPermit as getFieldPermitApi,
} from "./Api.ts";

type FieldPermitColumn = {
  prop?: string;
  [key: string]: unknown;
};

const field_permits = ref<{
  [route_path: string]: string[] | null;
}>({ });

const routeFieldPermitMap = reactive<Record<string, {
  loaded: boolean;
  fields: string[] | null;
}>>({ });
const routeFieldPermitLoading = reactive<Record<string, Promise<string[] | null> | undefined>>({ });
const routeFieldPermitFailed = reactive<Record<string, boolean>>({ });
const currentFieldPermitScopeKey = ref("");

const usrStore = useUsrStore();

function getFieldPermitScopeKey() {
  return [
    usrStore.getUsername?.() || "",
    usrStore.getTenantId?.() || "",
    usrStore.getAuthorization?.() || "",
    usrStore.isAdmin() ? "admin" : "user",
  ].join("|");
}

function ensureFieldPermitScope() {
  const nextScopeKey = getFieldPermitScopeKey();
  if (currentFieldPermitScopeKey.value === nextScopeKey) {
    return;
  }
  currentFieldPermitScopeKey.value = nextScopeKey;
  Object.keys(field_permits.value).forEach((key) => {
    delete field_permits.value[key];
  });
  Object.keys(routeFieldPermitMap).forEach((key) => {
    delete routeFieldPermitMap[key];
  });
  Object.keys(routeFieldPermitLoading).forEach((key) => {
    delete routeFieldPermitLoading[key];
  });
  Object.keys(routeFieldPermitFailed).forEach((key) => {
    delete routeFieldPermitFailed[key];
  });
}

function getRouteCacheKey(route_path: string) {
  return `${ route_path }::${ getFieldPermitScopeKey() }`;
}

function buildFieldPermitMap(route_path: string, fields: string[] | null) {
  const cacheKey = getRouteCacheKey(route_path);
  routeFieldPermitMap[cacheKey] = {
    loaded: true,
    fields,
  };
  return fields;
}

function getRouteFieldPermitMap(route_path: string) {
  ensureFieldPermitScope();
  const cacheKey = getRouteCacheKey(route_path);
  const cacheState = routeFieldPermitMap[cacheKey];
  if (cacheState?.loaded) {
    return cacheState.fields;
  }
  if (routeFieldPermitFailed[cacheKey]) {
    return null;
  }
  const matchingFields = field_permits.value[route_path];
  if (matchingFields !== undefined) {
    routeFieldPermitMap[cacheKey] = {
      loaded: true,
      fields: matchingFields,
    };
    return matchingFields;
  }
  return undefined;
}

async function requestRouteFieldPermits(route_path: string) {
  ensureFieldPermitScope();
  const cacheKey = getRouteCacheKey(route_path);
  if (routeFieldPermitLoading[cacheKey]) {
    return await routeFieldPermitLoading[cacheKey];
  }
  if (routeFieldPermitFailed[cacheKey]) {
    return null;
  }
  const pending = (async () => {
    try {
      const fields = await getFieldPermitApi(route_path, { notLoading: true });
      field_permits.value[route_path] = fields;
      delete routeFieldPermitFailed[cacheKey];
      return buildFieldPermitMap(route_path, fields);
    } catch (err) {
      routeFieldPermitFailed[cacheKey] = true;
      throw err;
    }
  })();
  routeFieldPermitLoading[cacheKey] = pending;
  try {
    return await pending;
  } finally {
    delete routeFieldPermitLoading[cacheKey];
  }
}

export default function() {

  function getFieldPermit(route_path?: string) {
    // if (!route_path) {
    //   const route = useRoute();
    //   route_path = route.path;
    // }

    function fieldPermit(code: string) {
      ensureFieldPermitScope();
      const fields = getRouteFieldPermitMap(route_path!);
      const cacheKey = getRouteCacheKey(route_path!);
      const isLoaded = Boolean(routeFieldPermitMap[cacheKey]?.loaded);
      if (!isLoaded && !routeFieldPermitLoading[cacheKey] && !routeFieldPermitFailed[cacheKey]) {
        void requestRouteFieldPermits(route_path!).catch(() => undefined);
      }
      if (fields === undefined) {
        return false;
      }
      if (fields === null) {
        return true;
      }
      if (fields.length === 0) {
        return false;
      }
      return fields.includes(code);
    }

    async function fieldPermitAsync(code: string) {
      ensureFieldPermitScope();
      const fields = getRouteFieldPermitMap(route_path!);
      const cacheKey = getRouteCacheKey(route_path!);
      if (routeFieldPermitFailed[cacheKey]) {
        return false;
      }
      if (routeFieldPermitMap[cacheKey]?.loaded || (fields !== undefined && fields !== null && fields.length > 0)) {
        return fieldPermit(code);
      }
      const nextFields = await requestRouteFieldPermits(route_path!);
      if (nextFields === null) {
        return true;
      }
      if (nextFields.length === 0) {
        return false;
      }
      return nextFields.includes(code);
    }

    const fieldPermitFn = ((code: string) => fieldPermit(code)) as typeof fieldPermit & {
      fieldPermit: typeof fieldPermit;
      fieldPermitAsync: typeof fieldPermitAsync;
    };
    fieldPermitFn.fieldPermit = fieldPermit;
    fieldPermitFn.fieldPermitAsync = fieldPermitAsync;
    return fieldPermitFn;
  }

  async function setTableColumnsFieldPermit(
    tableColumns: Ref<FieldPermitColumn[]>,
    permitFields: (string | string[])[],
    route_path?: string,
  ) {
    // if (!route_path) {
    //   const route = useRoute();
    //   route_path = route.path;
    // }
    if (!route_path) {
      return;
    }
    ensureFieldPermitScope();
    const permitFieldsFlat = permitFields.flat();
    const fields = await requestRouteFieldPermits(route_path).catch(() => null);
    if (fields == null) {
      return;
    }
    tableColumns.value = tableColumns.value.filter((column) => {
      if (!permitFieldsFlat.includes(column.prop ?? "")) {
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

  function clear() {
    currentFieldPermitScopeKey.value = "";
    Object.keys(field_permits.value).forEach((key) => {
      delete field_permits.value[key];
    });
    Object.keys(routeFieldPermitMap).forEach((key) => {
      delete routeFieldPermitMap[key];
    });
    Object.keys(routeFieldPermitLoading).forEach((key) => {
      delete routeFieldPermitLoading[key];
    });
    Object.keys(routeFieldPermitFailed).forEach((key) => {
      delete routeFieldPermitFailed[key];
    });
  }

  return {
    get fieldPermit() {
      return field_permits.value;
    },
    set fieldPermit(value: {
      [route_path: string]: string[] | null;
    }) {
      field_permits.value = value || { };
    },
    getFieldPermit,
    setTableColumnsFieldPermit,
    clear,
  };
};

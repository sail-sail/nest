<template>
<CustomDialog
  ref="customDialogRef"
  :before-close="beforeClose"
>
  <div
    un-flex="~ [1_0_0] col basis-[inherit]"
    un-overflow-hidden
    un-h="full"
  >
    
    <div
      un-flex="~ [1_0_0] col"
      un-overflow-hidden
      un-p="x-4"
      un-box-border
      un-gap="y-2"
    >
      <div
        un-flex="~ items-center"
        un-justify="center"
        un-text="sm [var(--el-text-color-regular)]"
      >
        <span class="status-dot" :class="{ 'status-dot--ready': hasCoordinate }"></span>
        <span>{{ statusText }}</span>
      </div>

      <div
        un-flex="~ items-center gap-2"
        un-p="x-2"
      >
        <el-autocomplete
          v-model="searchAddress"
          clearable
          placeholder="请输入完整地址后定位"
          :fetch-suggestions="fetchSearchSuggestions"
          :trigger-on-focus="false"
          value-key="label"
          @keyup.enter="onSearchAddress"
          @select="handleSuggestionSelect"
        >
          <template #default="{ item }">
            <div class="suggest-item">
              <div class="suggest-name">{{ item.name || item.value }}</div>
              <div v-if="item.address" class="suggest-address">
                {{ item.address }}
              </div>
            </div>
          </template>
        </el-autocomplete>

        <el-button
          plain
          type="primary"
          :loading="isSearching"
          @click="onSearchAddress"
        >
          <span>定位地址</span>
        </el-button>
      </div>

      <div
        un-flex="~ [1_0_0]"
        un-overflow-hidden
      >
        <div
          :id="mapContainerId"
          ref="mapContainerRef"
          class="picker-map"
        ></div>
      </div>
      
    </div>

    <div
      un-p="x-6 y-4"
      un-box-border
      un-flex="~ justify-center items-center gap-2"
    >
      <el-button
        plain
        @click="cancelClk"
      >
        <template #icon>
          <ElIconCircleClose />
        </template>
        <span>关闭</span>
      </el-button>

      <el-button
        plain
        type="primary"
        :disabled="!hasCoordinate"
        @click="onConfirm"
      >
        <template #icon>
          <ElIconCircleCheck />
        </template>
        <span>确定</span>
      </el-button>
    </div>
  </div>
</CustomDialog>
</template>

<script lang="ts" setup>
type TiandituLngLat = {
  getLng: () => number;
  getLat: () => number;
  lng?: number;
  lat?: number;
};

type TiandituMapClickEvent = {
  lnglat?: TiandituLngLat;
};

type TiandituPoi = {
  lonlat?: string;
  address?: string;
  phone?: string;
  name?: string;
};

type TiandituSuggest = {
  lonlat?: string;
  address?: string;
  name?: string;
};

type TiandituSearchResult = {
  getPois?: () => TiandituPoi[];
  getResultType?: () => string | number;
};

type SearchSuggestionItem = {
  value: string;
  label: string;
  name: string;
  address: string;
  lonlat?: string;
};

type TiandituGeocoderResponse = {
  result?: {
    formatted_address?: string;
  };
  status?: string | number;
  msg?: string;
};

type TiandituMarker = {
  setLngLat: (lnglat: TiandituLngLat) => void;
  getLngLat?: () => TiandituLngLat;
};

type TiandituZoomControl = {
  setPosition: (anchor: number | string) => void;
};

type TiandituMap = {
  addControl: (control: TiandituZoomControl) => void;
  addEventListener: (eventName: string, handler: (event: TiandituMapClickEvent) => void) => void;
  addOverLay: (overlay: TiandituMarker) => void;
  centerAndZoom: (lnglat: TiandituLngLat, zoom: number) => void;
  getZoom: () => number;
  panTo: (lnglat: TiandituLngLat) => void;
  removeOverLay: (overlay: TiandituMarker) => void;
};

type TiandituLocalSearch = {
  search: (keyword: string) => void;
};

type TiandituApi = {
  Control: {
    Zoom: new () => TiandituZoomControl;
  };
  LngLat: new (lng: number | string, lat: number | string) => TiandituLngLat;
  LocalSearch: new (
    map: TiandituMap,
    config: {
      onSearchComplete?: (result: TiandituSearchResult) => void;
    },
  ) => TiandituLocalSearch;
  Map: new (container: string | HTMLElement) => TiandituMap;
  Marker: new (lnglat: TiandituLngLat) => TiandituMarker;
};

type WindowWithTianditu = Window & {
  T?: TiandituApi;
  T_ANCHOR_TOP_LEFT?: number | string;
};

const tiandituScriptId = "tianditu-js-api-v4";
const defaultZoom = 18;
const defaultCenter = {
  longitude: 116.40769,
  latitude: 39.89945,
};
const searchTimeoutMs = 8000;

let tiandituLoadPromise: Promise<TiandituApi> | undefined;

type OnCloseResolveType = {
  type: "cancel" | "confirm";
  longitude?: number;
  latitude?: number;
  zoom?: number;
};

let onCloseResolve = function(_value: OnCloseResolveType) { };
const customDialogRef = $(useTemplateRef("customDialogRef"));
const mapContainerRef = useTemplateRef<HTMLDivElement>("mapContainerRef");
const mapContainerId = `tianditu-picker-${ Math.random().toString(36).slice(2, 10) }`;

let statusText = $ref("正在加载地图...");
let hasCoordinate = $ref(false);
let coordinate = $ref<{ longitude: number; latitude: number } | undefined>();
let searchAddress = $ref("");
let isSearching = $ref(false);
let zoom = $ref(defaultZoom);

let mapApi: TiandituApi | undefined;
let mapInstance: TiandituMap | undefined;
let markerInstance: TiandituMarker | undefined;
let localSearchInstance: TiandituLocalSearch | undefined;
let pendingSearchResolve: ((result: TiandituSearchResult | undefined) => void) | undefined;
let pendingSearchTimer: ReturnType<typeof setTimeout> | undefined;

function getCoordinateText(longitude: number, latitude: number) {
  return `${ longitude.toFixed(6) }, ${ latitude.toFixed(6) }`;
}

function getTiandituKey() {
  return import.meta.env.VITE_TIANDITU_KEY?.trim() || "";
}

function getTiandituApi() {
  const api = (window as WindowWithTianditu).T;
  if (!api) {
    throw new Error("天地图脚本尚未加载完成");
  }
  return api;
}

async function loadTiandituSdk() {
  if (typeof window === "undefined") {
    throw new Error("当前环境不支持加载地图");
  }
  const loadedApi = (window as WindowWithTianditu).T;
  if (loadedApi) {
    return loadedApi;
  }
  if (tiandituLoadPromise) {
    return await tiandituLoadPromise;
  }

  const key = getTiandituKey();
  if (!key) {
    throw new Error("未配置 VITE_TIANDITU_KEY");
  }

  tiandituLoadPromise = new Promise<TiandituApi>((resolve, reject) => {
    const existingScript = document.getElementById(tiandituScriptId) as HTMLScriptElement | null;
    if (existingScript) {
      const onLoad = function() {
        try {
          resolve(getTiandituApi());
        } catch (err) {
          reject(err);
        }
      };
      const onError = function() {
        reject(new Error("天地图脚本加载失败"));
      };
      existingScript.addEventListener("load", onLoad, { once: true });
      existingScript.addEventListener("error", onError, { once: true });
      return;
    }

    const scriptEl = document.createElement("script");
    scriptEl.id = tiandituScriptId;
    scriptEl.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${ encodeURIComponent(key) }`;
    scriptEl.async = true;
    scriptEl.onload = function() {
      try {
        resolve(getTiandituApi());
      } catch (err) {
        reject(err);
      }
    };
    scriptEl.onerror = function() {
      reject(new Error("天地图脚本加载失败"));
    };
    document.head.appendChild(scriptEl);
  });

  try {
    return await tiandituLoadPromise;
  } catch (err) {
    tiandituLoadPromise = undefined;
    throw err;
  }
}

function clearPendingSearch() {
  if (pendingSearchTimer) {
    clearTimeout(pendingSearchTimer);
    pendingSearchTimer = undefined;
  }
  pendingSearchResolve = undefined;
}

function clearMarker() {
  if (mapInstance && markerInstance) {
    mapInstance.removeOverLay(markerInstance);
  }
  markerInstance = undefined;
}

function updateMarker(longitude: number, latitude: number) {
  if (!mapApi || !mapInstance) {
    return;
  }
  const lnglat = new mapApi.LngLat(longitude, latitude);
  if (!markerInstance) {
    markerInstance = new mapApi.Marker(lnglat);
    mapInstance.addOverLay(markerInstance);
  } else {
    markerInstance.setLngLat(lnglat);
  }
  mapInstance.panTo(lnglat);
}

function getCurrentZoom() {
  if (mapInstance && typeof mapInstance.getZoom === "function") {
    zoom = mapInstance.getZoom();
  }
  return zoom;
}

function setSelectedCoordinate(
  longitude: number,
  latitude: number,
  source: "map" | "search",
) {
  coordinate = {
    longitude,
    latitude,
  };
  hasCoordinate = true;
  updateMarker(longitude, latitude);
  if (mapInstance && typeof mapInstance.getZoom === "function") {
    zoom = mapInstance.getZoom();
  }
  if (source === "search") {
    statusText = `已根据地址定位坐标：${ getCoordinateText(longitude, latitude) }，可点击地图微调。`;
    return;
  }
  statusText = `已选坐标：${ getCoordinateText(longitude, latitude) }`;
}

function parsePoiLngLat(poi?: TiandituPoi) {
  if (!poi?.lonlat) {
    return undefined;
  }
  const [longitudeText, latitudeText] = poi.lonlat.split(",");
  const longitude = Number(longitudeText);
  const latitude = Number(latitudeText);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return undefined;
  }
  return {
    longitude,
    latitude,
  };
}

function handleLocalSearchComplete(result: TiandituSearchResult) {
  const resolve = pendingSearchResolve;
  clearPendingSearch();
  resolve?.(result);
}

async function ensureMapReady() {
  mapApi = await loadTiandituSdk();
  await nextTick();

  if (!mapContainerRef.value) {
    throw new Error("地图容器未就绪");
  }

  if (!mapInstance) {
    mapInstance = new mapApi.Map(mapContainerId);
    mapInstance.centerAndZoom(new mapApi.LngLat(defaultCenter.longitude, defaultCenter.latitude), zoom);
    const zoomControl = new mapApi.Control.Zoom();
    mapInstance.addControl(zoomControl);
    const topLeftAnchor = (window as WindowWithTianditu).T_ANCHOR_TOP_LEFT;
    if (typeof topLeftAnchor !== "undefined") {
      zoomControl.setPosition(topLeftAnchor);
    }
    mapInstance.addEventListener("click", function(event) {
      const lnglat = event.lnglat;
      if (!lnglat) {
        return;
      }
      setSelectedCoordinate(lnglat.getLng(), lnglat.getLat(), "map");
    });
  }

  if (!localSearchInstance) {
    localSearchInstance = new mapApi.LocalSearch(mapInstance, {
      onSearchComplete: handleLocalSearchComplete,
    });
  }

  if (!coordinate) {
    clearMarker();
  }

  const currentPoint = coordinate
    ? new mapApi.LngLat(coordinate.longitude, coordinate.latitude)
    : new mapApi.LngLat(defaultCenter.longitude, defaultCenter.latitude);
  const targetZoom = Number.isFinite(zoom) ? zoom : defaultZoom;
  mapInstance.centerAndZoom(currentPoint, targetZoom);
  if (coordinate) {
    updateMarker(coordinate.longitude, coordinate.latitude);
  }
}

async function searchAddressInMap(keyword: string) {
  if (!localSearchInstance) {
    return undefined;
  }
  clearPendingSearch();
  return await new Promise<TiandituSearchResult | undefined>((resolve) => {
    pendingSearchResolve = resolve;
    pendingSearchTimer = setTimeout(function() {
      if (pendingSearchResolve === resolve) {
        clearPendingSearch();
        resolve(undefined);
      }
    }, searchTimeoutMs);
    localSearchInstance!.search(keyword);
  });
}

function normalizeSearchSuggestion(item: TiandituSuggest): SearchSuggestionItem | undefined {
  const name = item.name?.trim();
  const address = item.address?.trim() || "";
  const value = name || address;
  if (!value) {
    return undefined;
  }
  return {
    value,
    label: name || value,
    name: name || value,
    address,
    lonlat: item.lonlat,
  };
}

async function fetchFormattedAddressByLonLat(longitude: number, latitude: number) {
  const key = getTiandituKey();
  if (!key) {
    return undefined;
  }

  const url = new URL("https://api.tianditu.gov.cn/geocoder");
  url.searchParams.set("postStr", JSON.stringify({
    lon: longitude,
    lat: latitude,
    ver: 1,
  }));
  url.searchParams.set("tk", key);

  const response = await fetch(url.toString());
  if (!response.ok) {
    return undefined;
  }

  const payload = await response.json() as TiandituGeocoderResponse;
  const formattedAddress = payload.result?.formatted_address?.trim();
  return formattedAddress || undefined;
}

async function fetchSearchSuggestions(
  queryString: string,
  cb: (items: SearchSuggestionItem[]) => void,
) {
  const keyword = queryString.trim();
  if (!keyword) {
    cb([ ]);
    return;
  }

  if (!localSearchInstance) {
    cb([ ]);
    return;
  }

  const result = await searchAddressInMap(keyword);
  const suggestions = (result?.getPois?.() || [ ])
    .map((item) => normalizeSearchSuggestion(item))
    .filter((item): item is SearchSuggestionItem => Boolean(item));
  cb(suggestions);
}

async function handleSuggestionSelect(item: Record<string, any>) {
  const suggestion = item as Partial<SearchSuggestionItem>;
  const lonlat = suggestion.lonlat;
  if (lonlat) {
    const parsed = parsePoiLngLat({ lonlat } as TiandituPoi);
    if (parsed) {
      const formattedAddress = await fetchFormattedAddressByLonLat(parsed.longitude, parsed.latitude);
      if (formattedAddress) {
        searchAddress = formattedAddress;
        void onSearchAddress();
        return;
      }
    }
  }

  const fallbackAddress = suggestion.name || suggestion.address || suggestion.value;
  if (!fallbackAddress) {
    return;
  }
  searchAddress = String(fallbackAddress);
  void onSearchAddress();
}

async function onSearchAddress() {
  const keyword = searchAddress.trim();
  if (!keyword) {
    statusText = "请输入完整地址后再定位，或直接点击地图选择坐标。";
    return;
  }

  try {
    await ensureMapReady();
  } catch (err) {
    statusText = err instanceof Error ? err.message : "地图初始化失败";
    return;
  }

  isSearching = true;
  statusText = "正在根据地址定位...";

  try {
    const result = await searchAddressInMap(keyword);
    const poi = result?.getPois?.()?.[0];
    const lnglat = parsePoiLngLat(poi);
    if (!lnglat) {
      statusText = "未找到匹配地址，请点击地图手动选择坐标。";
      return;
    }
    setSelectedCoordinate(lnglat.longitude, lnglat.latitude, "search");
  } finally {
    isSearching = false;
  }
}

async function initializeDialog() {
  statusText = "正在加载地图...";
  try {
    await ensureMapReady();
  } catch (err) {
    statusText = err instanceof Error ? err.message : "地图初始化失败";
    return;
  }

  if (coordinate && Number.isFinite(coordinate.longitude) && Number.isFinite(coordinate.latitude)) {
    setSelectedCoordinate(coordinate.longitude, coordinate.latitude, "search");
    return;
  }

  if (searchAddress.trim()) {
    await onSearchAddress();
    return;
  }

  statusText = "点击地图选择坐标，或输入完整地址后定位。";
}

async function showDialog(arg?: {
  title?: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  zoom?: number;
}) {
  const dialogRes = customDialogRef!.showDialog<OnCloseResolveType>({
    title: arg?.title || "拾取经纬度",
    type: "large",
    fullscreen: true,
  });
  onCloseResolve = dialogRes.onCloseResolve;
  const previousLongitude = typeof arg?.longitude === "number" ? arg.longitude : undefined;
  const previousLatitude = typeof arg?.latitude === "number" ? arg.latitude : undefined;
  const previousZoom = typeof arg?.zoom === "number" && Number.isFinite(arg.zoom) ? arg.zoom : defaultZoom;
  zoom = previousZoom;
  searchAddress = arg?.address || "";
  if (previousLongitude && previousLatitude) {
    coordinate = {
      longitude: previousLongitude,
      latitude: previousLatitude,
    };
    hasCoordinate = true;
  } else {
    coordinate = undefined;
    hasCoordinate = false;
  }
  clearPendingSearch();
  clearMarker();
  await nextTick();
  await initializeDialog();
  return await dialogRes.dialogPrm;
}

function cancelClk() {
  clearPendingSearch();
  onCloseResolve({
    type: "cancel",
    longitude: coordinate?.longitude,
    latitude: coordinate?.latitude,
    zoom: getCurrentZoom(),
  });
}

async function onConfirm() {
  if (!hasCoordinate || !coordinate) {
    return;
  }
  clearPendingSearch();
  onCloseResolve({
    type: "confirm",
    longitude: coordinate.longitude,
    latitude: coordinate.latitude,
    zoom: getCurrentZoom(),
  });
}

async function beforeClose(done: (cancel: boolean) => void) {
  clearPendingSearch();
  done(false);
  onCloseResolve({
    type: "cancel",
    longitude: coordinate?.longitude,
    latitude: coordinate?.latitude,
    zoom: getCurrentZoom(),
  });
}

onUnmounted(() => {
  clearPendingSearch();
  clearMarker();
});

defineExpose({ showDialog });
</script>

<style lang="scss" scoped>
.picker-map {
  width: 100%;
  height: 100%;
  min-height: 60vh;
  border: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f7fa;
}

.status-dot {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 999px;
  background: var(--el-border-color);
  transition: background-color 0.2s ease;
}

.status-dot--ready {
  background: var(--el-color-success);
}

.suggest-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
  padding-top: 4px;
  padding-bottom: 4px;
  box-sizing: border-box;
}

.suggest-name {
  width: 100%;
  line-height: 1.5;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggest-address {
  width: 100%;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>

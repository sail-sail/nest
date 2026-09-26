---
name: address-lnglat
description: 地址字段与经纬度固定规范。凡是地址表需要地图定位时，按此顺序处理。
---

# 地址/经纬度固定规范

## 触发条件

只要表涉及“地址定位 / 地理坐标 / 选点定位”，并且有地址字段，就按此规则处理。

### 必须同时存在的字段

- `province_code` / `province_lbl`
- `city_code` / `city_lbl`
- `county_code` / `county_lbl`
- `address`
- `longitude` / `latitude`

如果业务需要经纬度，`longitude` 和 `latitude` 必须同时存在，不能只留一个。

## 统一行为

### 1. 生成代码后，保留通用地图拾取组件

在详情页里保留通用组件：

```vue
<LngLatPickerDialog
  ref="lngLatPickerDialogRef"
></LngLatPickerDialog>
```

并绑定：

```ts
const lngLatPickerDialogRef = $(useTemplateRef("lngLatPickerDialogRef"));
```

不要在页面内重复造地图选点逻辑，统一使用 `src/components/LngLatPickerDialog.vue`。

### 2. 地址补全时用统一拼接

需要按“省+市+区县+详细地址”组装为定位地址：

```ts
function getPickAddress() {
  return [
    dialogModel.province_lbl,
    dialogModel.city_lbl,
    dialogModel.county_lbl,
    dialogModel.address,
  ].filter((item) => Boolean(item)).join(" ");
}
```

### 3. 统一拾取经纬度逻辑

```ts
async function onPickLngLat() {
  if (!lngLatPickerDialogRef) {
    return;
  }

  const result = await lngLatPickerDialogRef.showDialog({
    title: "拾取经纬度",
    address: getPickAddress(),
    longitude: dialogModel.longitude == null ? undefined : Number(dialogModel.longitude),
    latitude: dialogModel.latitude == null ? undefined : Number(dialogModel.latitude),
  });

  if (result?.type !== "confirm") {
    return;
  }
  if (result.longitude == null || result.latitude == null) {
    ElMessage.warning("请手动粘贴经纬度");
    return;
  }

  dialogModel.longitude = new Decimal(result.longitude);
  dialogModel.latitude = new Decimal(result.latitude);
  ElMessage.success("已获取坐标");
}
```

### 4. 统一数据类型和展示规则

- `longitude` / `latitude` 用 `Decimal` 维护，保留 6 位小数
- 显示时使用 `CustomInputNumber`，并带 `:precision="6"` / `:max="9999.999999"`
- 相关字段不允许只保留一个坐标值

## 生成后必须检查

1. 详情页是否有 “拾取经纬度” 按钮
2. 是否使用了通用 `LngLatPickerDialog.vue`
3. 地址拼接是否包含 `province_lbl + city_lbl + county_lbl + address`
4. `longitude` 和 `latitude` 是否同时保存、展示、校验
5. 是否保留 `Decimal` 精度处理，而不是裸 `number` 直接覆盖

## 固定结论

地址定位能力是固定规范，不属于页面个性化逻辑。只要地址表需要定位，就必须在表字段和详情页中同步补齐：`address + province/city/county + longitude + latitude`，并接入通用 `LngLatPickerDialog.vue`。

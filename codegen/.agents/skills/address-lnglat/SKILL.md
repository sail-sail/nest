---
name: address-lnglat
description: 地址表接入地图定位时，统一字段组、PC 选点组件和经纬度回填规则。
---

# 地址/经纬度

## 适用范围

业务表需要“地址输入 + 地图选点”，且包含 PC 详情页时使用。仅采集当前定位、没有地址字段时不套用本规范。

## 固定要求

### 1. 字段必须成组

- 地址组：`province_code` / `province_lbl`、`city_code` / `city_lbl`、`county_code` / `county_lbl`、`address`
- 经纬度组：`longitude` / `latitude`，数据库用 `decimal(10,6)`，必须同时存在
- 地址字段可使用统一业务前缀，如 `receiver_province_code`、`receiver_address`；页面代码按实际字段名替换

### 2. PC 详情页必须复用公共选点组件

- 使用 `src/components/LngLatPickerDialog.vue`，禁止在页面内重复实现地图选点
- 保留 “拾取经纬度” 按钮，并绑定 `lngLatPickerDialogRef`
- 按“省 + 市 + 区县 + 详细地址”顺序拼接定位地址；过滤空值

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

### 3. 经纬度必须整组成对回填

- 调用 `showDialog({ address, longitude, latitude })`；现有坐标转换为 `number`
- 取消时不改数据；确认时必须同时拿到经纬度，任一缺失就提示手动处理并返回
- 回填时同时 `new Decimal(result.longitude)`、`new Decimal(result.latitude)`
- 表单使用 `CustomInputNumber`，保留 `:precision="6"` 和 `:max="9999.999999"`；保存、展示、校验不得只处理一个坐标

## 完成检查

1. 地址字段、经纬度字段均成组且名称匹配
2. PC 详情页使用公共组件，未重复实现地图逻辑
3. 地址拼接、数值转换、成对回填和 6 位小数处理均正确

# E2 飞线航线

← [用户故事地图](../User-Story-Map.md)

## 背景

地球仪通过默认国际航线展示飞线动画与端点标记。

---

## US-03 默认国际航线飞线

**As a** 浏览用户  
**I want** 看到连接全球城市的动画飞线  
**So that** 我能感知地点之间的路径关系

### 验收标准

1. **Scenario** 加载默认航线  
   **GIVEN** `DEFAULT_ROUTES` 包含六条城市场景  
   **WHEN** `GlobeService.mount` 完成引导  
   **THEN** 每条航线渲染为动画 Tube 飞线  
   **AND** 飞线使用弧线纹理与主题配色

### 状态

已实现

---

## US-04 航线端点 Marker

**As a** 浏览用户  
**I want** 在航线起点与终点看到光点标记  
**So that** 我能识别航线两端城市位置

### 验收标准

1. **Scenario** 端点 Marker  
   **GIVEN** 一条 `FlightRoute` 已创建飞线  
   **WHEN** 调用 `createMarker` 于 origin 与 destination  
   **THEN** 两端显示 disc 纹理平面  
   **AND** 颜色与该航线飞线一致

### 状态

已实现

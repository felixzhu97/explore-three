# E3 主题切换

← [用户故事地图](../User-Story-Map.md)

## 背景

产品提供亮色与科技暗色两套视觉主题，经路由与导航切换。

---

## US-05 亮色主题地球

**As a** 浏览用户  
**I want** 打开亮色主题地球  
**So that** 我能看到暖色渐变陆地点与浅色球体

### 验收标准

1. **Scenario** 访问亮色路由  
   **GIVEN** 用户打开 `/` 或 `/globe-light`  
   **WHEN** 页面挂载 `Globe` 组件  
   **THEN** 使用 `BRIGHT_THEME` 与 `BRIGHT_COLORS`  
   **AND** NavBar 可导航至暗色主题

### 状态

已实现

---

## US-06 科技暗色主题地球

**As a** 浏览用户  
**I want** 打开科技暗色主题地球  
**So that** 我能看到冷色霓虹风格的陆地点与飞线

### 验收标准

1. **Scenario** 访问暗色路由  
   **GIVEN** 用户打开 `/globe-dark`  
   **WHEN** 页面挂载 `GlobeDarkTheme` 组件  
   **THEN** 使用 `TECH_THEME` 与 `TECH_COLORS`  
   **AND** 点光源位置按暗色主题配置

### 状态

已实现

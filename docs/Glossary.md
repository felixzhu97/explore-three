# Glossary | 领域术语表

> Explore Three — Ubiquitous Language（统一语言）

Interactive 3D globe (Three.js) with land dots, twinkling shaders, and
animated flying routes between geographic coordinates.

---

## 1. Purpose | 文档说明

This document defines the project **Ubiquitous Language**. English terms are
the **preferred canonical names** and must align with code and architecture
naming. Chinese labels are for localization and stakeholder communication.

### Maintenance Principles

1. **Glossary first**: Add or update terms here before implementing code
2. **Code sync**: Domain model changes must update the corresponding entry
3. **Preferred term**: Use the **Preferred Term (English)** column for code,
   commits, and technical docs

### Naming | 命名

| Kind | Rule | Example |
| --- | --- | --- |
| Aggregate / Entity / VO / Config | Noun (what it is) | `Globe`, `FlightRoute`, `GeoCoord` |
| Method | Verb + noun (what it does) | `createMarker`, `calculateArcPoints` |
| Factory | `create…` / `createFor…` | `createBrightScheme` |
| Resource cleanup | Keep Three.js `dispose` | `dispose` |

---

## 2. Business Domains | 业务域总览

| Preferred Term | 中文 | TS Module | Frontend Route | Notes |
| --- | --- | --- | --- | --- |
| Globe | 地球仪 | `src/domain/model/Globe.ts` | `/`, `/globe-light`, `/globe-dark` | Aggregate root; scene composition |
| Geography | 地理 | `src/domain/model/GeoCoord.ts` | — | Lat/lon projection onto sphere |
| Route | 航线 | `src/domain/model/FlightRoute.ts`, `FlyingLine.ts` | — | Default international routes |
| Theme | 主题 | `src/domain/model/ThemeConfig.ts`, `ColorScheme.ts`, `GlobeConfig.ts` | `/globe-light`, `/globe-dark` | Bright vs tech palettes |
| Land | 陆地 | `src/domain/model/LandMap.ts` | — | Texture → land dots |
| Scene | 场景 | `src/domain/model/GlobeScene.ts`, `GlobeControls.ts`, `GlobeRenderer.ts`, `GlobePointer.ts` | — | WebGL loop and pointer interaction |

**Frontend route map (canonical)**

| Route | Preferred Term | Theme |
| --- | --- | --- |
| `/`, `/globe-light` | Globe | Bright (`BRIGHT_THEME`) |
| `/globe-dark` | Globe | Tech (`TECH_THEME`) |

---

## 3. Domain Kernel | 领域内核

| Preferred Term | 中文 | Definition | Type | Code Mapping | Notes |
| --- | --- | --- | --- | --- | --- |
| Globe | 地球仪 | Composition root that builds scene, land dots, routes, render loop, and pointer interaction | Aggregate Root | `Globe.create` → `GlobeContext` | Former name `GlobeApp` |
| GlobeContext | 地球仪上下文 | Live handles for scene, materials, interaction, and `dispose` | Value Object / Context | `GlobeContext` | Returned by `Globe.create` |
| GeoCoord | 地理坐标 | Latitude (−90..90) and longitude (−180..180) | Value Object | `GeoCoord.projectToVector3` | Validates bounds on construction |
| FlightRoute | 航线 | Origin and destination geographic coordinates | Entity | `FlightRoute.origin`, `.destination` | Former fields `start` / `end` |
| FlyingLine | 飞线 | Curved tube mesh and endpoint markers for a route | Entity | `FlyingLine.createMesh`, `createMarker` | Uses arc textures |
| DEFAULT_FLIGHT_ROUTES | 默认航线 | Six international city-pair routes | Constant | `DEFAULT_FLIGHT_ROUTES` | Former `DEFAULT_ROUTES` |
| ThemeType | 主题类型 | `bright` or `tech` | Enum / Union | `ThemeType` | Discriminates palettes |
| ThemeConfig | 主题配置 | Dot shaders, lights, CTA stroke, source URL | Value Object | `ThemeConfig` | `BRIGHT_THEME`, `TECH_THEME` |
| GlobeConfig | 地球仪配置 | Radii, density, tube, animation, textures, orbit limits | Value Object | `GlobeConfig` | Methods: `loadArcTextures`, `calculateArcPoints`, `createBaseMaterial`, `createDotMaterial`, `addSceneLights` |
| ColorScheme | 配色方案 | Per-route arc/marker colors | Value Object | `ColorScheme.createBrightScheme`, `createTechScheme`, `resolveColor` | |
| LandMap | 陆地地图 | Extracts land lon/lat from world alpha texture and builds dots | Domain Service | `LandMap.createLandDots` | |
| GlobeScene | 场景工厂 | Creates Scene / Camera / Renderer | Domain Service | `GlobeScene.create` → `SceneContext` | |
| GlobeControls | 轨道控制 | OrbitControls wrapper with auto-rotate limits | Domain Service | `GlobeControls.create` | |
| GlobeRenderer | 渲染循环 | requestAnimationFrame loop updating shader uniforms | Domain Service | `GlobeRenderer.startRenderLoop` | |
| GlobePointer | 指针交互 | Raycast hover and drag callbacks on the base sphere | Domain Service | `GlobePointer.createInteraction` | Former `GlobeEvents` |
| GlobeInteraction | 交互句柄 | Bind callbacks and dispose listeners | Interface | `bindCallbacks`, `dispose` | |

---

## 4. Terms to Avoid | 避免使用的名称

| Avoid | Prefer | Reason |
| --- | --- | --- |
| `GlobeApp` | `Globe` | Aggregate noun without tech suffix |
| `GlobeAppContext` | `GlobeContext` | Align with aggregate |
| `GlobeEvents` | `GlobePointer` | Describes pointer interaction, not an event log |
| `domain.ts` (single file) | `src/domain/model/` | DDD `domain/model` layout |
| `DEFAULT_ROUTES` | `DEFAULT_FLIGHT_ROUTES` | Explicit noun |
| `FlightRoute.start` / `.end` | `.origin` / `.destination` | Route language |
| `toVector3` | `projectToVector3` | Verb + noun |
| `bezierCurvePoints` | `calculateArcPoints` | Verb + noun |
| `bright()` / `tech()` | `createBrightScheme` / `createTechScheme` | Factory naming |
| `FlyingLine.marker` | `FlyingLine.createMarker` | Verb + noun |
| `LandMap.createDots` | `createLandDots` | Explicit noun |
| `GlobeRenderer.start` | `startRenderLoop` | Verb + noun |
| `style-zinc.puml` | `style.puml` | Shared C4 style filename |

---

## 5. Maintenance | 维护

| Related | Path |
| --- | --- |
| C4 model | [docs/developer/c4-model/](./developer/c4-model/) |
| User Story Map | [docs/product-owner/User-Story-Map.md](./product-owner/User-Story-Map.md) |
| Domain source | `src/domain/model/` |

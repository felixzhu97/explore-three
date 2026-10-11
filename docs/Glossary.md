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
| Domain type | Noun (what it is) | `GeoCoord`, `FlightRoute`, `ThemeAppearance` |
| Method | Verb + noun (what it does) | `projectToSpherePoint`, `endpoints` |
| Infra object | Extends `Mesh` / `Group` | `FlightArc`, `GlobeRoot` |
| Infra bootstrap | Verb phrase function | `createGlobe` |
| Resource cleanup | Keep Three.js `dispose` | `dispose` |

### Layers

```
components (UI) → infra/three (WebGL) → domain/model
```

Domain holds product language only — **no** `import 'three'`, no GLSL.
Three.js scene objects live under `src/infra/three/` (Mr.doob style).

---

## 2. Business Domains | 业务域总览

| Preferred Term | 中文 | Path | Frontend Route | Notes |
| --- | --- | --- | --- | --- |
| Geography | 地理 | `src/domain/model/GeoCoord.ts` | — | Lat/lon + sphere projection |
| Route | 航线 | `src/domain/model/FlightRoute.ts` | — | OD pairs + `DEFAULT_ROUTES` |
| Theme | 主题 | `src/domain/model/Theme.ts` | `/`, `/globe-light`, `/globe-dark` | Bright vs tech |
| Globe (UI) | 地球仪页 | `src/components/` | same routes | React mount |
| Three infra | 渲染适配 | `src/infra/three/` | — | Mesh/Group + materials |

**Frontend route map (canonical)**

| Route | Theme |
| --- | --- |
| `/`, `/globe-light` | `BRIGHT_THEME` + `BRIGHT_COLORS` |
| `/globe-dark` | `TECH_THEME` + `TECH_COLORS` |

---

## 3. Domain Kernel | 领域内核

| Preferred Term | 中文 | Definition | Type | Code Mapping |
| --- | --- | --- | --- | --- |
| SpherePoint | 球面点 | Cartesian point on a scaled sphere | Value Object | `SpherePoint` |
| GeoCoord | 地理坐标 | Latitude (−90..90) and longitude (−180..180) | Value Object | `GeoCoord.projectToSpherePoint` |
| FlightRoute | 航线 | Origin and destination coordinates | Entity | `FlightRoute.of` |
| DEFAULT_ROUTES | 默认航线 | Six international city pairs | Constant | `DEFAULT_ROUTES` |
| ThemeId | 主题标识 | `bright` or `tech` | Union | `ThemeId` |
| ThemeAppearance | 主题外观 | Lights, CTA stroke, source URL (no shaders) | Value Object | `ThemeAppearance` |
| RouteColor | 航线色 | RGB 0..1 route color | Value Object | `RouteColor` |
| BRIGHT_THEME / TECH_THEME | 亮色 / 科技主题 | Product theme presets | Constant | `Theme.ts` |
| BRIGHT_COLORS / TECH_COLORS | 航线色板 | Per-route arc colors | Constant | `colors[i % n]` |

---

## 4. Infra (non-domain) | 基础设施

| Name | Path | Role |
| --- | --- | --- |
| `createGlobe` | `src/infra/three/createGlobe.ts` | Scene / Camera / Renderer / Controls / rAF |
| `GlobeRoot` | `src/infra/three/GlobeRoot.ts` | `Group` — lights, base, dots, arcs, markers |
| `LandDotsGroup` | `src/infra/three/LandDotsGroup.ts` | `Group` — texture → land dots |
| `FlightArc` | `src/infra/three/FlightArc.ts` | `Mesh` — animated route tube |
| `RouteMarker` | `src/infra/three/RouteMarker.ts` | `Mesh` — endpoint disc |
| materials | `src/infra/three/materials/` | Dot / arc / marker shaders |
| `defaults` | `src/infra/three/config.ts` | Radii, tube, animation, texture URLs |

---

## 5. Terms to Avoid | 避免使用的名称

| Avoid | Prefer | Reason |
| --- | --- | --- |
| `Globe` / `GlobeApp` as domain aggregate | `GlobeRoot` / `createGlobe` in infra | Bootstrap is not a domain aggregate |
| `GlobeScene` / `GlobeControls` / `GlobeRenderer` | inline in `createGlobe` | Thin Three.js wrappers |
| GLSL / `THREE.*` in `domain/model` | `src/infra/three/materials/` | Domain stays product language |
| `ThemeConfig.dotShader` | `ThemeAppearance` + `DotMaterial` | Shaders are infra |
| `ColorScheme.createBrightScheme()` | `BRIGHT_COLORS` | Simple constants |
| `DEFAULT_FLIGHT_ROUTES` | `DEFAULT_ROUTES` | Shorter Preferred Term |
| `addLandDots` / `createArc` factories | `LandDotsGroup` / `FlightArc` | Align with Object3D model |
| AggregateRoot / DomainService labels on Three helpers | — | Avoid costume DDD |

---

## 6. Maintenance | 维护

| Related | Path |
| --- | --- |
| C4 model | [docs/developer/c4-model/](./developer/c4-model/) |
| User Story Map | [docs/product-owner/User-Story-Map.md](./product-owner/User-Story-Map.md) |
| Domain source | `src/domain/model/` |
| Three infra | `src/infra/three/` |

# Glossary | 领域术语表

> Explore Three — Ubiquitous Language（统一语言）

Interactive 3D globe (Three.js + Angular) with land dots, twinkling shaders,
and animated flying routes between geographic coordinates.

---

## 1. Purpose | 文档说明

This document defines the project **Ubiquitous Language**. English terms are
the **preferred canonical names** and must align with code and architecture
naming. Chinese labels are for localization and stakeholder communication.

### Maintenance Principles

1. **Glossary first**: Add or update terms here before implementing code
2. **Code sync**: Domain language changes must update the corresponding entry
3. **Preferred term**: Use the **Preferred Term (English)** column for code,
   commits, and technical docs

### Naming | 命名

| Kind | Rule | Example |
| --- | --- | --- |
| Product type | Noun | `GeoCoord`, `FlightRoute`, `ThemeAppearance` |
| Angular page | `*.page.ts` / `*PageComponent` | `globe-light.page.ts` |
| Angular service | `*.service.ts` | `globe.service.ts` |
| Angular component | `*.component.ts` | `globe-host.component.ts` |
| Other files | kebab-case matching class | `flight-arc.ts` → `FlightArc` |
| Resource cleanup | Three.js `dispose` | `dispose` |
| Barrel `index.ts` | Avoid | import concrete files |

### Layers (by business domain folder)

```
app (shell) → globe / route / theme / geography
```

No top-level `domain/` or `infra/` packages. Types live in the owning
`*.service.ts` (or `geo-coord.ts` for geography primitives). Theme and
geography files do not import `three`.

---

## 2. Business Domains | 业务域总览

| Preferred Term | 中文 | Path | Frontend Route | Notes |
| --- | --- | --- | --- | --- |
| Geography | 地理 | `src/geography/` | — | Lat/lon + sphere projection |
| Route | 航线 | `src/route/` | — | OD pairs, arcs, markers |
| Theme | 主题 | `src/theme/theme.service.ts` | `/`, `/globe-light`, `/globe-dark` | Bright vs tech |
| Globe | 地球仪 | `src/globe/` | same routes | Pages, host, scene group |

**Frontend route map (canonical)**

| Route | Theme |
| --- | --- |
| `/`, `/globe-light` | bright theme + colors |
| `/globe-dark` | tech theme + colors |

---

## 3. Domain Kernel | 领域内核

| Preferred Term | 中文 | Definition | Type | Code Mapping |
| --- | --- | --- | --- | --- |
| SpherePoint | 球面点 | Cartesian point on a scaled sphere | Value | `geography/geo-coord.ts` |
| GeoCoord | 地理坐标 | Latitude (−90..90) and longitude (−180..180) | Value | `GeoCoord.projectToSpherePoint` |
| FlightRoute | 航线 | Origin and destination coordinates | Entity | `route.service.ts` |
| DEFAULT_ROUTES | 默认航线 | Six international city pairs | Constant | `RouteService.defaultRoutes` |
| ThemeId | 主题标识 | `bright` or `tech` | Union | `theme.service.ts` |
| ThemeAppearance | 主题外观 | Lights, CTA stroke, source URL | Value | `ThemeService` |
| RouteColor | 航线色 | RGB 0..1 route color | Value | `theme.service.ts` |

---

## 4. Globe / Route rendering | 渲染协作

| Name | Path | Role |
| --- | --- | --- |
| `GlobeService.mount` | `src/globe/globe.service.ts` | Scene / Camera / Renderer / Controls / rAF |
| `GlobeGroup` | `src/globe/globe-group.ts` | `Group` — lights, base, dots, arcs, markers |
| `LandDotsGroup` | `src/globe/land-dots-group.ts` | Land mask → dots |
| `FlightArc` | `src/route/flight-arc.ts` | Route tube mesh |
| `RouteMarker` | `src/route/route-marker.ts` | Endpoint disc |
| `globe.config` | `src/globe/globe.config.ts` | Radii, tube, animation, texture URLs |
| `GlobeHostComponent` | `src/globe/globe-host.component.ts` | Canvas mount + GSAP interaction |

---

## 5. Terms to Avoid | 避免使用的名称

| Avoid | Prefer | Reason |
| --- | --- | --- |
| `src/domain/` / `src/infra/` packages | `src/{geography,route,theme,globe}/` | Organize by business domain |
| `create-globe.ts` | `GlobeService.mount` | Angular naming; no verb files |
| `GlobeRoot` | `GlobeGroup` | Noun aligned with Object3D role |
| Barrel `index.ts` | concrete file imports | Explicit dependencies |
| Forced `.mesh` / `.group` suffixes | kebab class names | Only service/component/page use suffixes |

---

## 6. Maintenance | 维护

| Related | Path |
| --- | --- |
| C4 model | [docs/developer/c4-model/](./developer/c4-model/) |
| User Story Map | [docs/product-owner/User-Story-Map.md](./product-owner/User-Story-Map.md) |
| App shell | `src/app/` |
| Domains | `src/geography/`, `src/route/`, `src/theme/`, `src/globe/` |

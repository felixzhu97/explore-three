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
| Domain type | Noun (what it is) | `GeoCoord`, `FlightRoute`, `Theme` |
| Method | Verb + noun (what it does) | `projectToVector3`, `createArc` |
| Infra bootstrap | Verb phrase function | `createGlobe`, `addLandDots` |
| Resource cleanup | Keep Three.js `dispose` | `dispose` |

### Layers

```
components (UI) → infra/three (WebGL) → domain/model
```

Domain holds product language only. Three.js scene wiring lives under
`src/infra/three/`.

---

## 2. Business Domains | 业务域总览

| Preferred Term | 中文 | Path | Frontend Route | Notes |
| --- | --- | --- | --- | --- |
| Geography | 地理 | `src/domain/model/GeoCoord.ts` | — | Lat/lon + sphere projection |
| Route | 航线 | `src/domain/model/FlightRoute.ts` | — | OD pairs + `DEFAULT_ROUTES` |
| Theme | 主题 | `src/domain/model/Theme.ts` | `/`, `/globe-light`, `/globe-dark` | Bright vs tech |
| Globe (UI) | 地球仪页 | `src/components/` | same routes | React mount |
| Three infra | 渲染适配 | `src/infra/three/` | — | Non-domain WebGL |

**Frontend route map (canonical)**

| Route | Theme |
| --- | --- |
| `/`, `/globe-light` | `BRIGHT_THEME` + `BRIGHT_COLORS` |
| `/globe-dark` | `TECH_THEME` + `TECH_COLORS` |

---

## 3. Domain Kernel | 领域内核

| Preferred Term | 中文 | Definition | Type | Code Mapping |
| --- | --- | --- | --- | --- |
| GeoCoord | 地理坐标 | Latitude (−90..90) and longitude (−180..180) | Value Object | `GeoCoord.projectToVector3` |
| FlightRoute | 航线 | Origin and destination coordinates | Entity | `origin`, `destination` |
| DEFAULT_ROUTES | 默认航线 | Six international city pairs | Constant | `DEFAULT_ROUTES` |
| ThemeType | 主题类型 | `bright` or `tech` | Union | `ThemeType` |
| ThemeConfig | 主题配置 | Dot shaders, lights, CTA stroke, source URL | Value Object | `ThemeConfig` |
| BRIGHT_THEME / TECH_THEME | 亮色 / 科技主题 | Product theme presets | Constant | `Theme.ts` |
| BRIGHT_COLORS / TECH_COLORS | 航线色板 | Per-route arc colors | Constant | `colors[i % n]` |

---

## 4. Infra (non-domain) | 基础设施

| Name | Path | Role |
| --- | --- | --- |
| `createGlobe` | `src/infra/three/createGlobe.ts` | Bootstrap scene, land, arcs, loop, pointer |
| `addLandDots` | `src/infra/three/land.ts` | Texture → land dot meshes |
| `createArc` / `createMarker` | `src/infra/three/flyingLine.ts` | Flight arc tube + endpoint marker |
| `defaults` | `src/infra/three/config.ts` | Radii, tube, animation, texture URLs |

---

## 5. Terms to Avoid | 避免使用的名称

| Avoid | Prefer | Reason |
| --- | --- | --- |
| `Globe` / `GlobeApp` as domain aggregate | `createGlobe` in infra | Bootstrap is not a domain aggregate |
| `GlobeScene` / `GlobeControls` / `GlobeRenderer` / `GlobePointer` | inline in `createGlobe` | Thin Three.js wrappers |
| Putting Three factories under `domain/model` | `src/infra/three/` | Domain stays product language |
| `ColorScheme.createBrightScheme()` | `BRIGHT_COLORS` | Simple constants |
| `DEFAULT_FLIGHT_ROUTES` | `DEFAULT_ROUTES` | Shorter Preferred Term |
| `LandMap` / `FlyingLine` classes | `addLandDots` / `createArc` | Verb functions in infra |
| AggregateRoot / DomainService labels on Three helpers | — | Avoid costume DDD |

---

## 6. Maintenance | 维护

| Related | Path |
| --- | --- |
| C4 model | [docs/developer/c4-model/](./developer/c4-model/) |
| User Story Map | [docs/product-owner/User-Story-Map.md](./product-owner/User-Story-Map.md) |
| Domain source | `src/domain/model/` |
| Three infra | `src/infra/three/` |

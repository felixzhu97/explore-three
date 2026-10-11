# C4 模型文档

使用 PlantUML 绘制的 C4 架构模型，描述 Explore Three（交互式 Three.js 地球仪）。

Source of truth: `.puml`。官方 C4: [c4model.com](https://c4model.com/)。库: [C4-PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML)。

## Visual tracks (do not mix)

| Track | Files | Style |
| ----- | ----- | ----- |
| **Structural C4** | C1–C3, Deployment | [`style.puml`](style.puml) tokens **inlined** after C4 include (white / black) |
| **Domain model** | `C4-Code-Domain-Model.puml` | `!theme plain` + white/black class skinparam |
| **Dynamics** | `C4-Dynamic-*` | `!theme plain` sequence |

## 文件

| 文件 | 层级 | 说明 |
| --- | --- | --- |
| `style.puml` | Shared | Structural white/black tokens（结构图内联，勿 `!include`） |
| `C1-Context.puml` | C1 | 系统上下文（Browser User、Vercel、Static Assets） |
| `C2-Container.puml` | C2 | Angular / domain folders / Three.js / GSAP |
| `C3-Component.puml` | C3 | **单图**：UI + geography/route/theme/globe |
| `C4-Code-Domain-Model.puml` | Code | 产品类型（Glossary Preferred Term） |
| `C4-Deployment.puml` | Deployment | **单图**：本地 `ng serve` + 生产 Vercel |
| `C4-Dynamic-Globe-Bootstrap.puml` | Dynamic | 挂载 → 渲染循环 → dispose |

## C1 - 系统上下文图

![C1-Context](png/C1-Context.png)

## C2 - 容器图

![C2-Container](png/C2-Container.png)

## C3 - 组件图

![C3-Component](png/C3-Component.png)

## Code - 领域模型

![C4-Code-Domain-Model](png/C4-Code-Domain-Model.png)

按领域文件夹绘制产品类型（Geography / Route / Theme）。Globe 编排见 C3。术语见 [Glossary](../../Glossary.md)。

## C4 - 部署图

![C4-Deployment](png/C4-Deployment.png)

## Dynamic - 地球仪引导

![C4-Dynamic-Globe-Bootstrap](png/C4-Dynamic-Globe-Bootstrap.png)

## 技术栈

| Layer | Tech |
| --- | --- |
| UI | Angular 22 + router |
| Domains | `src/geography/` · `src/route/` · `src/theme/` · `src/globe/` |
| 3D | Three.js + OrbitControls + GLSL |
| Animation | GSAP |
| Build | Angular application builder |
| Deploy | Vercel SPA (`vercel.json` rewrite) |

## Render

```bash
cd docs/developer/c4-model && mkdir -p png && plantuml -tpng -o png *.puml
```

## 相关

- [Glossary](../../Glossary.md)
- [User Story Map](../../product-owner/User-Story-Map.md)
- [DEPLOYMENT.md](../../DEPLOYMENT.md)

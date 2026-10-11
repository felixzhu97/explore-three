# Explore Three

An interactive 3D globe visualization built with Three.js and Angular, featuring
twinkling land dots and animated flying lines between geographic coordinates.

Package / repo: `explore-three`.

## Features

- **Interactive Globe**: Click and drag to rotate the globe, with dots extruding outward for a scattered effect
- **Twinkling Dots**: Stars twinkle independently using custom shaders
- **Flying Lines**: Animated curved paths connecting global locations with texture-based effects
- **Land Mass Visualization**: Dots cluster to form recognizable continent shapes

## Tech Stack

- Angular 22 — UI, routing, services
- Three.js — 3D rendering
- GSAP — drag extrusion tweens
- Tailwind CSS v4 — layout utilities
- Custom GLSL shaders — twinkling and scatter effects

## Getting Started

Requires Node.js ≥ 22.22.3 (see `.nvmrc`).

```bash
pnpm install
pnpm start
```

## Docs

- [Glossary](docs/Glossary.md) — ubiquitous language
- [C4 model](docs/developer/c4-model/) — context / container / component / domain / deployment
- [User Story Map](docs/product-owner/User-Story-Map.md) — journeys and epics
- [Contributing](CONTRIBUTING.md) — how to develop and open PRs
- [Code of Conduct](CODE_OF_CONDUCT.md) — community standards
- [Security](SECURITY.md) — how to report vulnerabilities
- [License](LICENSE) — MIT

## References

Inspired by GitHub & Stripe's WebGL globe implementations.

View live: [https://three-explore-xi.vercel.app/](https://three-explore-xi.vercel.app/)

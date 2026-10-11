import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import gsap from 'gsap';
import { Vector3 } from 'three';

import type { ThemeId } from '../theme/theme.service';
import { GlobeService, type GlobeSession } from './globe.service';

@Component({
  selector: 'app-globe-host',
  template: `
    <div class="relative h-full w-full" #container>
      <canvas class="absolute inset-0 h-full w-full" #canvas></canvas>
      <button
        type="button"
        class="absolute bottom-8 right-8 z-10 flex cursor-pointer rounded-full border bg-inherit p-2.5"
        [style.border-color]="buttonStroke()"
        [style.color]="buttonStroke()"
        (click)="openSource()"
      >
        <svg width="25" viewBox="0 0 24 24" fill="none" [attr.stroke]="buttonStroke()">
          <path
            d="M15 7L20 12L15 17M9 17L4 12L9 7"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  `,
  host: { class: 'block h-full w-full' },
})
export class GlobeHostComponent implements OnDestroy {
  readonly #globe = inject(GlobeService);
  readonly #zone = inject(NgZone);

  readonly themeId = input.required<ThemeId>();
  readonly lightPos = input<Vector3 | undefined>(undefined);

  protected readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  protected readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  protected readonly buttonStroke = signal('#333333');

  #session: GlobeSession | null = null;
  #mouseDown = false;
  #minMouseDownFlag = false;
  #sourceUrl = '';

  constructor() {
    afterNextRender(() => this.#mount());
  }

  openSource(): void {
    window.open(this.#sourceUrl, '_blank');
  }

  ngOnDestroy(): void {
    this.#session?.dispose();
    this.#session = null;
  }

  #mount(): void {
    const { theme, colors } = this.#globe.themeBundle(this.themeId());
    this.buttonStroke.set(theme.buttonStroke);
    this.#sourceUrl = theme.sourceUrl;

    this.#zone.runOutsideAngular(() => {
      this.#session = this.#globe.mount(
        this.container().nativeElement,
        this.canvas().nativeElement,
        {
          theme,
          colors,
          lightPos: this.lightPos(),
          onHover: (hit) => {
            const session = this.#session;
            if (!session) {
              return;
            }
            document.body.style.cursor = session.state.grabbing
              ? 'grabbing'
              : hit
                ? 'pointer'
                : 'default';
          },
          onDragStart: () => this.#onDragStart(),
          onDragEnd: () => this.#onDragEnd(),
        },
      );
    });
  }

  #onDragStart(): void {
    const session = this.#session;
    if (!session?.state.isIntersecting) {
      return;
    }

    session.materials.forEach((m) =>
      gsap.to(m.uniforms['u_maxExtrusion'], { value: 1.01 }),
    );
    this.#mouseDown = true;
    this.#minMouseDownFlag = false;
    setTimeout(() => {
      this.#minMouseDownFlag = true;
      if (!this.#mouseDown && this.#session) {
        this.#session.materials.forEach((m) =>
          gsap.to(m.uniforms['u_maxExtrusion'], { value: 1.0, duration: 0.15 }),
        );
        this.#session.state.grabbing = false;
        document.body.style.cursor = this.#session.state.isIntersecting
          ? 'pointer'
          : 'default';
      }
    }, 500);
    document.body.style.cursor = 'grabbing';
    session.state.grabbing = true;
  }

  #onDragEnd(): void {
    this.#mouseDown = false;
    if (!this.#minMouseDownFlag || !this.#session) {
      return;
    }
    this.#session.materials.forEach((m) =>
      gsap.to(m.uniforms['u_maxExtrusion'], { value: 1.0, duration: 0.15 }),
    );
    this.#session.state.grabbing = false;
    document.body.style.cursor = this.#session.state.isIntersecting ? 'pointer' : 'default';
  }
}

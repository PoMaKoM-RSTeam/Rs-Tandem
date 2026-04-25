import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { AmbientLight, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three-stdlib';

type AvatarViewportSize = {
  width: number;
  height: number;
};

@Injectable({
  providedIn: 'root',
})
export class TndmAiAvatarSceneService {
  private readonly destroyRef = inject(DestroyRef);

  private _scene: Scene | null = null;
  private camera: PerspectiveCamera | null = null;
  private renderer: WebGLRenderer | null = null;
  private controls: OrbitControls | null = null;

  private host: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;

  private readonly _size = signal<AvatarViewportSize>({ width: 0, height: 0 });
  readonly size = this._size.asReadonly();

  constructor() {
    this.destroyRef.onDestroy(() => this.destroy());
  }

  get scene(): Scene | null {
    return this._scene;
  }

  init(canvas: HTMLCanvasElement, host: HTMLElement, onSizeChange?: (size: AvatarViewportSize) => void): void {
    if (this.renderer) return;

    this.host = host;

    this.initScene();
    this.initRenderer(canvas);
    this.initControls(canvas);
    this.initResizeObserver(onSizeChange);
  }

  render(): void {
    if (!this.scene || !this.camera || !this.renderer) return;

    this.controls?.update();
    this.renderer.render(this.scene, this.camera);
  }

  destroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    this.controls?.dispose();
    this.controls = null;

    this.renderer?.dispose();
    this.renderer = null;

    this._scene = null;
    this.camera = null;
    this.host = null;

    this._size.set({ width: 0, height: 0 });
  }

  private initScene(): void {
    const scene = new Scene();
    scene.add(new AmbientLight(0xffffff, 0.8));

    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const camera = new PerspectiveCamera(35, 1, 0.1, 1000);
    camera.position.set(0, 0.2, 1.2);
    camera.lookAt(0, 0.2, 0);

    this._scene = scene;
    this.camera = camera;
  }

  private initRenderer(canvas: HTMLCanvasElement): void {
    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer = renderer;
  }

  private initControls(canvas: HTMLCanvasElement): void {
    if (!this.camera) return;

    const controls = new OrbitControls(this.camera, canvas);
    controls.target.set(0, 0.2, 0);
    controls.minDistance = 0.3;
    controls.maxDistance = 0.6;
    controls.enablePan = false;
    controls.enabled = false;
    controls.update();

    this.controls = controls;
  }

  private initResizeObserver(onSizeChange?: (size: AvatarViewportSize) => void): void {
    if (!this.host) return;

    const resize = (width: number, height: number): void => {
      if (!this.renderer || !this.camera || width <= 0 || height <= 0) return;

      const prev = this._size();
      if (prev.width === width && prev.height === height) return;

      const size = { width, height };
      this._size.set(size);
      onSizeChange?.(size);

      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    };

    this.resizeObserver = new ResizeObserver(([entry]) => {
      resize(Math.round(entry.contentRect.width), Math.round(entry.contentRect.height));
    });

    this.resizeObserver.observe(this.host);

    const rect = this.host.getBoundingClientRect();
    resize(Math.round(rect.width), Math.round(rect.height));
  }
}

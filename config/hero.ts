// 3D-объекты главного блока. Файлы кладите в public/hero/ (PNG/WebP с прозрачным фоном).
// Нет файла -> показывается CSS-фигура. w — ширина, ratio — ширина/высота, top/right в px.
export interface HeroObj {
  src: string;
  shape: 'sphere' | 'cube' | 'ring';
  w: number;
  ratio: number;
  top: number;
  right: number;
  delay: number;
  dur: number;
}

export const HERO_OBJECTS: HeroObj[] = [
  { src: 'hero/obj1.png', shape: 'sphere', w: 84, ratio: 1, top: 14, right: 10, delay: 0, dur: 5 },
  { src: 'hero/obj2.png', shape: 'cube', w: 58, ratio: 1, top: 112, right: 16, delay: -1.8, dur: 6 },
  { src: 'hero/gamepad.webp', shape: 'ring', w: 210, ratio: 1.5, top: 186, right: -18, delay: -3.4, dur: 5.5 },
];

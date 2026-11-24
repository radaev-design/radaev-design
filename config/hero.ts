// 3D-объекты главного блока. Файлы: public/hero/obj1.png, obj2.png, obj3.png (PNG, прозрачный фон).
// Нет файла -> показывается CSS-фигура (shape). size/top/right в px, dur/delay в секундах.
export interface HeroObj {
  src: string;
  shape: 'sphere' | 'cube' | 'ring';
  size: number;
  top: number;
  right: number;
  delay: number;
  dur: number;
}

export const HERO_OBJECTS: HeroObj[] = [
  { src: 'hero/obj1.png', shape: 'sphere', size: 120, top: 20, right: 10, delay: 0, dur: 5 },
  { src: 'hero/obj2.png', shape: 'cube', size: 96, top: 140, right: 66, delay: -1.8, dur: 6 },
  { src: 'hero/obj3.png', shape: 'ring', size: 84, top: 196, right: 8, delay: -3.4, dur: 5.5 },
];

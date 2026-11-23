// ЕДИНСТВЕННОЕ место, где владелец меняет услуги, описания и опции.
// Цены и подписи карточек: config/pricing.ts.
// active: false -> услуга скрыта из каталога.
import { PITCH, PRICES } from './pricing';

export type CategoryId = 'design' | 'video' | 'ai-photo' | 'telegram';

export interface Category {
  id: CategoryId;
  title: string;
  subtitle: string;
  color: string;
}

export interface Service {
  id: string;
  category: CategoryId;
  title: string;
  description: string;
  priceFrom: number | null;
  unit?: string;
  active: boolean;
  popular?: boolean;
  comingSoon?: boolean; // true -> предзаказ через менеджера
  badge?: string;
  slogan?: string;
  hint?: string;
}

export const BRAND = {
  name: 'RADAEV.DESIGN',
  currency: '₽',
  priceFallback: 'Стоимость рассчитывается индивидуально',
  managerUrl: 'https://t.me/radaev_studio',
  clientBot: 'mododesign_bot',
  adminBot: 'modoadmindesign_bot',
};

export const URGENCY = [
  { id: 'standard', label: 'Стандартно', multiplier: 1 },
  { id: 'rush', label: 'Срочно', multiplier: null as number | null },
];

export const CATEGORIES: Category[] = [
  { id: 'design', title: 'Дизайн', subtitle: 'Бренд, графика, UI/UX', color: '#ff0055' },
  { id: 'video', title: 'Видео', subtitle: 'Монтаж и motion', color: '#c4003f' },
  { id: 'ai-photo', title: 'AI-фотосессии', subtitle: 'Нейрофотографии', color: '#5c0a2a' },
  { id: 'telegram', title: 'Telegram', subtitle: 'Боты, Mini Apps, виджеты', color: '#0d0303' },
];

const s = (
  category: CategoryId,
  id: string,
  title: string,
  description: string,
  extra: Partial<Service> = {},
): Service => ({ id, category, title, description, priceFrom: null, active: true, ...extra });

const BASE: Service[] = [
  // DESIGN
  s('design', 'logo', 'Разработка логотипа', 'Узнаваемый знак для вашего проекта', { popular: true }),
  s('design', 'identity', 'Фирменный стиль', 'Цвета, шрифты, носители, гайд'),
  s('design', 'branding', 'Брендинг', 'Платформа бренда и визуальная система'),
  s('design', 'smm', 'Дизайн социальных сетей', 'Оформление профилей, обложки, шаблоны'),
  s('design', 'ads', 'Рекламные креативы', 'Креативы для таргета и performance'),
  s('design', 'banners', 'Баннеры и презентации', 'Баннеры, питч-деки, презентации'),
  s('design', 'marketplace', 'Карточки для маркетплейсов', 'Инфографика и слайды карточек', { popular: true }),
  s('design', 'uiux', 'UI/UX-дизайн', 'Интерфейсы приложений и сервисов'),
  s('design', 'web', 'Веб-дизайн', 'Лендинги и сайты'),
  s('design', 'print', 'Полиграфия', 'Визитки, буклеты, упаковка'),
  // VIDEO
  s('video', 'reels', 'Монтаж Reels', 'Динамичный монтаж вертикальных видео', { popular: true }),
  s('video', 'shorts', 'Монтаж Shorts', 'Короткие ролики для YouTube'),
  s('video', 'tiktok', 'Монтаж TikTok', 'Трендовый монтаж под TikTok'),
  s('video', 'youtube', 'Монтаж YouTube', 'Монтаж длинных видео'),
  s('video', 'promo', 'Рекламные видеоролики', 'Ролики для рекламы продукта'),
  s('video', 'business-video', 'Видео для бизнеса', 'Презентации, кейсы, обучение'),
  s('video', 'motion', 'Motion Design', 'Графика и анимация в кадре'),
  s('video', 'logo-anim', 'Анимация логотипов', 'Оживим ваш логотип'),
  s('video', 'enhance', 'Обработка и улучшение видео', 'Цвет, звук, стабилизация'),
  // AI PHOTO
  s('ai-photo', 'ai-by-photo', 'AI-фотосессия по фотографии', 'Фотосессия на основе вашего фото', { popular: true }),
  s('ai-photo', 'ai-business', 'Бизнес-портреты', 'Деловые портреты для профиля и сайта'),
  s('ai-photo', 'ai-fashion', 'Fashion-фотосессии', 'Образы в стиле fashion-съёмки'),
  s('ai-photo', 'ai-lifestyle', 'Lifestyle-фотографии', 'Естественные lifestyle-кадры'),
  s('ai-photo', 'ai-commercial', 'Коммерческие фотографии', 'Кадры для товаров и услуг'),
  s('ai-photo', 'ai-social', 'AI-фото для соцсетей', 'Контент для постов и сторис'),
  s('ai-photo', 'ai-ads', 'Генерация рекламных изображений', 'Рекламные визуалы под задачу'),
  s('ai-photo', 'ai-looks', 'Создание визуальных образов', 'Концепты и образы под проект'),
  // TELEGRAM
  s('telegram', 'bot-turnkey', 'Telegram-бот под ключ', 'От идеи до запуска', { popular: true }),
  s('telegram', 'bot-orders', 'Бот для приёма заказов', 'Заявки и заказы в Telegram'),
  s('telegram', 'bot-sales', 'Бот для продаж', 'Воронка продаж внутри бота'),
  s('telegram', 'bot-automation', 'Бот для автоматизации бизнеса', 'Рутина — на бота'),
  s('telegram', 'bot-payments', 'Бот с платёжной системой', 'Приём оплаты в Telegram'),
  s('telegram', 'bot-ai', 'Бот с AI-функциями', 'Умные ответы и генерация'),
  s('telegram', 'miniapp', 'Telegram Mini Apps', 'Полноценные приложения в Telegram', { comingSoon: true }),
  s('telegram', 'widgets', 'Интерактивные Telegram-виджеты', 'Лёгкие интерактивные модули', { comingSoon: true }),
];

export const SERVICES: Service[] = BASE.map((x) => ({
  ...x,
  priceFrom: PRICES[x.id] ?? null,
  ...PITCH[x.id],
}));

export const activeServices = () => SERVICES.filter((x) => x.active);

export function formatPrice(svc: Service): string {
  if (svc.priceFrom == null) return BRAND.priceFallback;
  return `от ${svc.priceFrom.toLocaleString('ru-RU')} ${BRAND.currency}${svc.unit ? ' ' + svc.unit : ''}`;
}

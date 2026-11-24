// Баннеры главной. image: путь в public/ (PNG с прозрачным фоном), стоит справа.
// story: true -> баннер-история (before/after). discount: '' -> цифра скидки скрыта.
import type { CategoryId } from './catalog';

export interface Banner {
  id: string;
  tag: string;
  title: string;
  text: string;
  discount?: string;
  cta: string;
  category: CategoryId;
  from: string;
  to: string;
  image?: string;
  story?: boolean;
  before?: string;
  after?: string;
  author?: string;
  isExample?: boolean;
}

export const BANNERS: Banner[] = [
  { id: 'first-order', tag: 'Скидка на первый заказ', title: 'Логотип и фирменный стиль', text: 'Новым клиентам — приятный бонус на первый заказ.', discount: '', cta: 'Заказать дизайн', category: 'design', from: '#ff0055', to: '#0d0303' },
  {
    id: 'ai-story', tag: 'История клиента', title: 'Нейро-фотосессия', text: '', cta: 'Хочу так же', category: 'ai-photo',
    from: '#7a0030', to: '#0d0303', story: true, image: 'banners/ai-girl.png',
    before: 'Нужны были фото для товара, а студия — дорого и долго.',
    after: 'Серия студийных кадров за один день. Клиентка осталась довольна.',
    author: 'Анна, клиентка', isExample: true,
  },
  { id: 'reels', tag: 'Акция', title: 'Монтаж Reels и Shorts', text: 'Динамичный монтаж, который удерживает внимание.', discount: '', cta: 'Заказать монтаж', category: 'video', from: '#ff3d7f', to: '#5c0a2a' },
  { id: 'bot', tag: 'Специальное предложение', title: 'Telegram-бот под ключ', text: 'Автоматизируйте заявки и продажи прямо в Telegram.', discount: '', cta: 'Заказать бота', category: 'telegram', from: '#0d0303', to: '#ff0055' },
  { id: 'marketplace', tag: 'Для продавцов', title: 'Карточки для маркетплейсов', text: 'Инфографика, которая повышает конверсию.', discount: '', cta: 'Заказать карточки', category: 'design', from: '#d6004a', to: '#2a0510' },
  { id: 'preorder', tag: 'Скоро', title: 'Mini Apps и виджеты', text: 'Оформите предзаказ и расскажите о своей идее первыми.', cta: 'Смотреть', category: 'telegram', from: '#0d0303', to: '#a3003a' },
];

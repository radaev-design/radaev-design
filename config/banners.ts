// Баннеры главной.
// kv — картинка-обложка (public/banners/), kvBlend: true для картинок на чёрном фоне,
// kvH — высота картинки в карточке. image — PNG девушки для баннера-истории.
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
  kv?: string;
  kvBlend?: boolean;
  kvH?: string;
  image?: string;
  story?: boolean;
  before?: string;
  after?: string;
  author?: string;
  isExample?: boolean;
}

export const BANNERS: Banner[] = [
  {
    id: 'first-order', tag: 'Скидка на первый заказ', title: 'Логотип и фирменный стиль',
    text: 'Новым клиентам — приятный бонус на первый заказ.', discount: '', cta: 'Заказать дизайн',
    category: 'design', from: '#4a0620', to: '#0d0303', kv: 'banners/kv-design.webp', kvBlend: true,
  },
  {
    id: 'ai-story', tag: 'История клиента', title: 'Нейро-фотосессия', text: '', cta: 'Хочу так же', category: 'ai-photo',
    from: '#7a0030', to: '#0d0303', story: true, image: 'banners/ai-girl.png',
    before: 'Нужны были фото для товара, а студия — дорого и долго.',
    after: 'Серия студийных кадров за один день. Клиентка осталась довольна.',
    author: 'Анна, клиентка', isExample: true,
  },
  {
    id: 'reels', tag: 'Акция', title: 'Монтаж Reels и Shorts', text: 'Динамичный монтаж, который удерживает внимание.',
    discount: '', cta: 'Заказать монтаж', category: 'video', from: '#5c0a2a', to: '#0d0303',
    kv: 'banners/kv-reels.webp', kvBlend: true,
  },
  {
    id: 'bot', tag: 'Специальное предложение', title: 'Telegram-бот под ключ', text: 'Автоматизируйте заявки и продажи прямо в Telegram.',
    discount: '', cta: 'Заказать бота', category: 'telegram', from: '#2a0a1f', to: '#0d0303',
    kv: 'banners/kv-bot.webp', kvH: '64%',
  },
  { id: 'marketplace', tag: 'Для продавцов', title: 'Карточки для маркетплейсов', text: 'Инфографика, которая повышает конверсию.', discount: '', cta: 'Заказать карточки', category: 'design', from: '#d6004a', to: '#2a0510' },
  { id: 'preorder', tag: 'Скоро', title: 'Mini Apps и виджеты', text: 'Оформите предзаказ и расскажите о своей идее первыми.', cta: 'Смотреть', category: 'telegram', from: '#0d0303', to: '#a3003a' },
];

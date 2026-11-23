// Баннеры главной. discount: '' -> цифра скидки скрыта. story: true -> баннер-история.
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
  story?: boolean;
  quote?: string;
  author?: string;
  isExample?: boolean;
}

export const BANNERS: Banner[] = [
  { id: 'first-order', tag: 'Скидка на первый заказ', title: 'Логотип и фирменный стиль', text: 'Новым клиентам — приятный бонус на первый заказ.', discount: '', cta: 'Заказать дизайн', category: 'design', from: '#ff0055', to: '#0d0303' },
  {
    id: 'ai-story', tag: 'История клиента', title: 'Нейро-фотосессия', text: '', cta: 'Заказать нейро-фотосессию', category: 'ai-photo', from: '#7a0030', to: '#0d0303', story: true,
    quote: 'Загрузила несколько обычных фото, а получила целую серию кадров как со студийной съёмки. Теперь это мои аватарки и контент для соцсетей!',
    author: 'Анна, клиентка', isExample: true,
  },
  { id: 'reels', tag: 'Акция', title: 'Монтаж Reels и Shorts', text: 'Динамичный монтаж, который удерживает внимание.', discount: '', cta: 'Заказать монтаж', category: 'video', from: '#ff3d7f', to: '#5c0a2a' },
  { id: 'bot', tag: 'Специальное предложение', title: 'Telegram-бот под ключ', text: 'Автоматизируйте заявки и продажи прямо в Telegram.', discount: '', cta: 'Заказать бота', category: 'telegram', from: '#0d0303', to: '#ff0055' },
  { id: 'marketplace', tag: 'Для продавцов', title: 'Карточки для маркетплейсов', text: 'Инфографика, которая повышает конверсию.', discount: '', cta: 'Заказать карточки', category: 'design', from: '#d6004a', to: '#2a0510' },
  { id: 'preorder', tag: 'Скоро', title: 'Mini Apps и виджеты', text: 'Оформите предзаказ и расскажите о своей идее первыми.', cta: 'Смотреть', category: 'telegram', from: '#0d0303', to: '#a3003a' },
];

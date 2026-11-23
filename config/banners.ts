// Баннеры главной. Меняйте тексты здесь.
// discount: '' -> большая цифра скидки не показывается. Впишите, например, '−15%', когда определитесь.
// story: true  -> баннер-история клиента. isExample: true -> показывается пометка «Пример».
import type { CategoryId } from './catalog';

export interface Banner {
  id: string;
  tag: string;
  title: string;
  text: string;
  discount?: string;
  cta: string;
  category: CategoryId;
  from: string; // цвет градиента (начало)
  to: string; // цвет градиента (конец)
  story?: boolean;
  quote?: string;
  author?: string;
  isExample?: boolean;
}

export const BANNERS: Banner[] = [
  {
    id: 'first-order',
    tag: 'Скидка на первый заказ',
    title: 'Логотип и фирменный стиль',
    text: 'Новым клиентам — приятный бонус на первый заказ.',
    discount: '',
    cta: 'Заказать дизайн',
    category: 'design',
    from: '#3f66ff',
    to: '#0a1b66',
  },
  {
    id: 'ai-story',
    tag: 'История клиента',
    title: 'Нейро-фотосессия',
    text: '',
    cta: 'Заказать нейро-фотосессию',
    category: 'ai-photo',
    from: '#7a4dff',
    to: '#2a1a80',
    story: true,
    quote:
      'Загрузила несколько обычных фото, а получила целую серию кадров как со студийной съёмки. Теперь это мои аватарки и контент для соцсетей!',
    author: 'Анна, клиентка',
    isExample: true,
  },
  {
    id: 'reels',
    tag: 'Акция',
    title: 'Монтаж Reels и Shorts',
    text: 'Динамичный монтаж, который удерживает внимание.',
    discount: '',
    cta: 'Заказать монтаж',
    category: 'video',
    from: '#ff7a6b',
    to: '#c2362a',
  },
  {
    id: 'bot',
    tag: 'Специальное предложение',
    title: 'Telegram-бот под ключ',
    text: 'Автоматизируйте заявки и продажи прямо в Telegram.',
    discount: '',
    cta: 'Заказать бота',
    category: 'telegram',
    from: '#153cff',
    to: '#080a12',
  },
  {
    id: 'marketplace',
    tag: 'Для продавцов',
    title: 'Карточки для маркетплейсов',
    text: 'Инфографика, которая повышает конверсию.',
    discount: '',
    cta: 'Заказать карточки',
    category: 'design',
    from: '#1fb6a6',
    to: '#0a4a66',
  },
  {
    id: 'preorder',
    tag: 'Скоро',
    title: 'Mini Apps и виджеты',
    text: 'Оформите предзаказ и расскажите о своей идее первыми.',
    cta: 'Смотреть',
    category: 'telegram',
    from: '#0a1b66',
    to: '#7a4dff',
  },
];

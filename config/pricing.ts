// ⚠ ЦЕНЫ-ЗАГЛУШКИ. Замените на свои до запуска: именно эта сумма уходит в оплату.
// Услуга без цены (удалите строку) оформляется через менеджера без онлайн-оплаты.
export const PRICES: Record<string, number> = {
  logo: 5000, identity: 15000, branding: 30000, smm: 6000, ads: 3000, banners: 2500, marketplace: 1500,
  uiux: 25000, web: 30000, print: 3000,
  reels: 1500, shorts: 1200, tiktok: 1200, youtube: 4000, promo: 10000, 'business-video': 8000,
  motion: 7000, 'logo-anim': 3000, enhance: 2500,
  'ai-by-photo': 2500, 'ai-business': 2000, 'ai-fashion': 3500, 'ai-lifestyle': 3000, 'ai-commercial': 4000,
  'ai-social': 2000, 'ai-ads': 3000, 'ai-looks': 3000,
  'bot-turnkey': 20000, 'bot-orders': 12000, 'bot-sales': 18000, 'bot-automation': 25000,
  'bot-payments': 22000, 'bot-ai': 28000,
};

// Подписи в стиле карточек: badge (плашка), slogan (крупная фраза), hint (мелко под ней).
export const PITCH: Record<string, { badge?: string; slogan?: string; hint?: string }> = {
  logo: { badge: 'мега хит', slogan: 'Стать круче всех.', hint: 'Конкуренты уже не будут ими' },
  identity: { slogan: 'Выглядеть дорого.', hint: 'Единый стиль везде' },
  marketplace: { badge: 'хит', slogan: 'Продавать больше.', hint: 'Карточка, которую хочется открыть' },
  reels: { badge: 'хит', slogan: 'Держать внимание.', hint: 'Монтаж, который досматривают' },
  'ai-by-photo': { badge: 'хит', slogan: 'Студия без студии.', hint: 'Один раз загрузили, получили серию' },
  'bot-turnkey': { badge: 'premium', slogan: 'Бот работает за вас.', hint: 'От идеи до запуска' },
  miniapp: { badge: 'скоро', slogan: 'Приложение в Telegram.', hint: 'Предзаказ открыт' },
  widgets: { badge: 'скоро', slogan: 'Лёгко и интерактивно.', hint: 'Предзаказ открыт' },
};

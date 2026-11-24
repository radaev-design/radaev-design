// Экономика баллов и промокодов. Единый источник для приложения и сервера.
export const ECONOMY = {
  dailyCap: 40, // максимум баллов в сутки на человека
  cooldownSec: 8, // минимум секунд между начислениями
  // игра -> результат -> баллы
  awards: {
    ttt: { win: 5, draw: 1 },
    word: { win: 8 },
    g2048: { '128': 3, '256': 6, '512': 12, '1024': 25, '2048': 50 },
  } as Record<string, Record<string, number>>,
  tiers: [
    { id: 't5', cost: 300, percent: 5 },
    { id: 't10', cost: 700, percent: 10 },
  ],
  promoCooldownDays: 14, // как часто можно обменивать баллы на промокод
  promoValidDays: 14, // срок жизни промокода
  minOrder: 3000, // скидка действует от этой суммы
  maxDiscount: 1500, // максимальная скидка в рублях
};

// Ваши промокоды (раздаёте сами). Один код — один раз на человека.
// expires: 'ГГГГ-ММ-ДД', maxUses: общий лимит использований (необязательно).
export const PROMOS: { code: string; percent: number; expires?: string; maxUses?: number }[] = [
  { code: 'WELCOME5', percent: 5, expires: '2027-12-31' },
];

export const calcDiscount = (amount: number, percent: number) =>
  amount >= ECONOMY.minOrder ? Math.min(Math.round((amount * percent) / 100), ECONOMY.maxDiscount) : 0;

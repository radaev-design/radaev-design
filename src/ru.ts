// Все тексты интерфейса. Для английского добавить en.ts с теми же ключами.
export const ru = {
  nav: { home: 'Главная', catalog: 'Услуги', orders: 'Заказы', profile: 'Профиль' },
  home: {
    hello: 'Привет',
    heroTitle: 'Создаём цифровое будущее',
    heroSub: 'Дизайн, видео и технологии для твоих идей и бизнеса',
    cta: 'Выбрать услугу',
    categories: 'Категории',
  },
  catalog: { title: 'Услуги', all: 'Все', soon: 'COMING SOON', empty: 'В этой категории пока ничего нет' },
  orders: {
    title: 'Мои заказы',
    emptyTitle: 'Заказов пока нет',
    emptyText: 'Выберите услугу — оформление займёт 1–3 минуты',
  },
  profile: { title: 'Профиль', support: 'Написать менеджеру', noUsername: 'username не указан' },
};
export type Dict = typeof ru;

import { ReactNode } from 'react';

export type Tab = 'home' | 'catalog' | 'orders' | 'profile';

const svg = (c: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {c}
  </svg>
);

export const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: 'home', label: 'Главная', icon: svg(<path d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1z" />) },
  {
    id: 'catalog',
    label: 'Услуги',
    icon: svg(
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>,
    ),
  },
  {
    id: 'orders',
    label: 'Заказы',
    icon: svg(
      <>
        <path d="M6 7h12l1 14H5z" />
        <path d="M9 7a3 3 0 016 0" />
      </>,
    ),
  },
  {
    id: 'profile',
    label: 'Профиль',
    icon: svg(
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0116 0" />
      </>,
    ),
  },
];

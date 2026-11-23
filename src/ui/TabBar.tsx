import { ru } from '../i18n/ru';
import { haptic } from '../integrations/telegram';

export type Tab = 'home' | 'catalog' | 'orders' | 'profile';

const icons: Record<Tab, JSX.Element> = {
  home: <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  catalog: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  orders: (
    <>
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </>
  ),
};

const order: Tab[] = ['home', 'catalog', 'orders', 'profile'];

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="tabbar">
      {order.map((t) => (
        <button
          key={t}
          className={'tab' + (tab === t ? ' on' : '')}
          onClick={() => {
            haptic();
            onChange(t);
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icons[t]}
          </svg>
          {ru.nav[t]}
        </button>
      ))}
    </nav>
  );
}


import { ReactNode, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WebApp from '@twa-dev/sdk';
import { CategoryId } from '../../config/catalog';
import { HomeScreen } from '../modules/home/HomeScreen';
import { CatalogScreen } from '../modules/catalog/CatalogScreen';
import { OrdersScreen } from '../modules/orders/OrdersScreen';
import { ProfileScreen } from '../modules/profile/ProfileScreen';
import { SettingsScreen } from '../modules/profile/SettingsScreen';
import { CartProvider, useCart } from '../storage/cart';
import { Splash } from '../ui/Splash';
import { ToastProvider } from '../ui/Toast';
import './extra.css';
import './mascot-theme.css';

type Tab = 'home' | 'catalog' | 'orders' | 'profile';

const svg = (c: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {c}
  </svg>
);

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  {
    id: 'home',
    label: 'Главная',
    icon: svg(
      <path d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1z" />
    ),
  },
  {
    id: 'catalog',
    label: 'Услуги',
    icon: svg(
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
  },
  {
    id: 'orders',
    label: 'Заказы',
    icon: svg(
      <>
        <path d="M6 7h12l1 14H5z" />
        <path d="M9 7a3 3 0 016 0" />
      </>
    ),
  },
  {
    id: 'profile',
    label: 'Профиль',
    icon: svg(
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0116 0" />
      </>
    ),
  },
];

function applyTheme(dark: boolean) {
  const bg = dark ? '#05030F' : '#F3F1FF';

  document.documentElement.dataset.theme = dark ? 'dark' : 'light';

  try {
    WebApp.setHeaderColor(bg as any);
    WebApp.setBackgroundColor(bg as any);
  } catch {
    // Telegram API недоступен вне Telegram
  }
}

function Shell() {
  const [splash, setSplash] = useState(true);
  const [tab, setTab] = useState<Tab>('home');
  const [sub, setSub] = useState<'settings' | null>(null);
  const [cat, setCat] = useState<CategoryId | undefined>();

  const [dark, setDark] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('theme');

      if (savedTheme) {
        return savedTheme === 'dark';
      }

      return WebApp.colorScheme === 'dark';
    } catch {
      return false;
    }
  });

  const { ids } = useCart();

  useEffect(() => {
    applyTheme(dark);
  }, [dark]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const go = (t: Tab) => {
    setTab(t);
    setSub(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCatalog = (c?: CategoryId) => {
    setCat(c);
    go('catalog');
  };

  const setTheme = (d: boolean) => {
    setDark(d);

    try {
      localStorage.setItem('theme', d ? 'dark' : 'light');
    } catch {
      // localStorage недоступен
    }
  };

  return (
    <>
      <AnimatePresence>
        {splash && <Splash key="splash" />}
      </AnimatePresence>

      <div className="app">
        {tab === 'home' && (
          <HomeScreen
            onOpenCatalog={openCatalog}
            onOpenProfile={() => go('profile')}
          />
        )}

        {tab === 'catalog' && (
          <CatalogScreen
            key={cat ?? 'all'}
            initial={cat}
          />
        )}

        {tab === 'orders' && (
          <OrdersScreen
            onCatalog={() => openCatalog()}
          />
        )}

        {tab === 'profile' && !sub && (
          <ProfileScreen
            onOrders={() => go('orders')}
            onSettings={() => setSub('settings')}
          />
        )}

        {tab === 'profile' && sub === 'settings' && (
          <SettingsScreen
            dark={dark}
            onTheme={setTheme}
            onBack={() => setSub(null)}
          />
        )}
      </div>

      <nav className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={'tab-' + t.id}
            className={'tab' + (tab === t.id ? ' on' : '')}
            onClick={() => go(t.id)}
          >
            {t.icon}
            <span>{t.label}</span>

            {t.id === 'orders' && ids.length > 0 && (
              <span className="tab-badge">
                {ids.length}
              </span>
            )}
          </button>
        ))}
      </nav>
    </>
  );
}

export function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </CartProvider>
  );
}

export default App;

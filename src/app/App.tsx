import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { CategoryId } from '../../config/catalog';
import { setTelegramColors, startParam, systemTheme } from '../integrations/telegram';
import { CatalogScreen } from '../modules/catalog/CatalogScreen';
import { HomeScreen } from '../modules/home/HomeScreen';
import { OrdersScreen } from '../modules/orders/OrdersScreen';
import { ProfileScreen } from '../modules/profile/ProfileScreen';
import { SettingsScreen } from '../modules/profile/SettingsScreen';
import { CartProvider, useCart } from '../storage/cart';
import { read, write } from '../storage/ls';
import { Splash } from '../ui/Splash';
import { ToastProvider } from '../ui/Toast';
import { Onboarding, TOUR } from './Onboarding';
import { Tab, TABS } from './tabs';

type Theme = 'light' | 'dark';
const TOUR_KEY = 'modo_onboarding_done';
const BG: Record<Theme, string> = { light: '#eff8ff', dark: '#0d0303' };

function Shell() {
  const [splash, setSplash] = useState(true);
  const [tab, setTab] = useState<Tab>(startParam() === 'orders' ? 'orders' : 'home');
  const [settings, setSettings] = useState(false);
  const [cat, setCat] = useState<CategoryId | undefined>();
  const [step, setStep] = useState<number | null>(null);
  const [theme, setTheme] = useState<Theme>(() => read<Theme>('modo:theme', systemTheme()));
  const { ids } = useCart();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setTelegramColors(BG[theme]);
    write('modo:theme', theme);
  }, [theme]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSplash(false);
      if (!read(TOUR_KEY, false) && startParam() !== 'orders') setStep(0);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const target = step === null ? undefined : TOUR[step].tab;
    if (target) {
      setTab(target);
      setSettings(false);
      setCat(undefined);
    }
  }, [step]);

  const go = (t: Tab) => {
    setTab(t);
    setSettings(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openCatalog = (c?: CategoryId) => {
    setCat(c);
    go('catalog');
  };
  const finishTour = () => {
    write(TOUR_KEY, true);
    setStep(null);
    go('home');
  };
  const nextStep = () => (step !== null && step < TOUR.length - 1 ? setStep(step + 1) : finishTour());

  return (
    <>
      <AnimatePresence>{splash && <Splash key="splash" />}</AnimatePresence>

      <div className="app">
        {tab === 'home' && <HomeScreen onOpenCatalog={openCatalog} onOpenProfile={() => go('profile')} />}
        {tab === 'catalog' && <CatalogScreen key={cat ?? 'all'} initial={cat} />}
        {tab === 'orders' && <OrdersScreen onCatalog={() => openCatalog()} />}
        {tab === 'profile' &&
          (settings ? (
            <SettingsScreen dark={theme === 'dark'} onTheme={(d) => setTheme(d ? 'dark' : 'light')} onBack={() => setSettings(false)} />
          ) : (
            <ProfileScreen onOrders={() => go('orders')} onSettings={() => setSettings(true)} />
          ))}
      </div>

      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} id={'tab-' + t.id} className={'tab' + (tab === t.id ? ' on' : '')} onClick={() => go(t.id)}>
            {t.icon}
            <span>{t.label}</span>
            {t.id === 'orders' && ids.length > 0 && <span className="tab-badge">{ids.length}</span>}
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {!splash && step !== null && <Onboarding key="tour" step={step} onNext={nextStep} onSkip={finishTour} />}
      </AnimatePresence>
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

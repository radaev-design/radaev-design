import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SERVICES, type CategoryId } from '../../config/catalog';
import { haptic, setTelegramColors, startParam, systemTheme } from '../integrations/telegram';
import { CatalogScreen } from '../modules/catalog/CatalogScreen';
import { Games } from '../modules/games/Games';
import { HomeScreen } from '../modules/home/HomeScreen';
import { OrdersScreen } from '../modules/orders/OrdersScreen';
import { ProfileScreen } from '../modules/profile/ProfileScreen';
import { SettingsScreen } from '../modules/profile/SettingsScreen';
import { CartProvider, useCart } from '../storage/cart';
import { read, write } from '../storage/ls';
import { MeProvider } from '../storage/me';
import { Mascot } from '../ui/Mascot';
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
  const [games, setGames] = useState(false);
  const [cat, setCat] = useState<CategoryId | undefined>();
  const [svc, setSvc] = useState<string | undefined>();
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
      setSvc(undefined);
    }
  }, [step]);

  const go = (t: Tab) => {
    setTab(t);
    setSettings(false);
    setSvc(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openCatalog = (c?: CategoryId, sv?: string) => {
    setCat(c ?? SERVICES.find((x) => x.id === sv)?.category);
    go('catalog');
    setSvc(sv);
  };
  const finishTour = () => {
    write(TOUR_KEY, true);
    setStep(null);
    go('home');
  };
  const nextStep = () => (step !== null && step < TOUR.length - 1 ? setStep(step + 1) : finishTour());

  const tabBtn = (t: (typeof TABS)[number]) => (
    <button key={t.id} id={'tab-' + t.id} className={'tab' + (tab === t.id ? ' on' : '')} onClick={() => go(t.id)}>
      {t.icon}
      <span>{t.label}</span>
      {t.id === 'orders' && ids.length > 0 && <span className="tab-badge">{ids.length}</span>}
    </button>
  );

  return (
    <>
      <AnimatePresence>{splash && <Splash key="splash" />}</AnimatePresence>

      <div className="app">
        {tab === 'home' && <HomeScreen onOpenCatalog={openCatalog} onOpenProfile={() => go('profile')} />}
        {tab === 'catalog' && <CatalogScreen key={(cat ?? 'all') + (svc ?? '')} initial={cat} openId={svc} />}
        {tab === 'orders' && <OrdersScreen onCatalog={() => openCatalog()} />}
        {tab === 'profile' &&
          (settings ? (
            <SettingsScreen dark={theme === 'dark'} onTheme={(d) => setTheme(d ? 'dark' : 'light')} onBack={() => setSettings(false)} />
          ) : (
            <ProfileScreen onOrders={() => go('orders')} onSettings={() => setSettings(true)} onGames={() => setGames(true)} />
          ))}
      </div>

      <nav className="tabbar">
        {TABS.slice(0, 2).map(tabBtn)}
        <div className="modo-slot">
          <button
            className="modo-fab"
            aria-label="MODO: игры и баллы"
            onClick={() => {
              haptic('medium');
              setGames(true);
            }}
          >
            <Mascot pose="hello" size={46} />
          </button>
          <span className="modo-lbl">MODO</span>
        </div>
        {TABS.slice(2).map(tabBtn)}
      </nav>

      <AnimatePresence>{games && <Games key="games" onClose={() => setGames(false)} />}</AnimatePresence>

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
        <MeProvider>
          <Shell />
        </MeProvider>
      </ToastProvider>
    </CartProvider>
  );
}

export default App;

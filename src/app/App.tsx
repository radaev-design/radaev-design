
import { ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
type TourStep = 0 | 1 | 2 | 3 | 4 | 5;

const TOUR_KEY = 'modo_onboarding_done';

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

const TOUR_CONTENT: Record<
  1 | 2 | 3 | 4,
  { tab: Tab; pose: string; title: string; text: string }
> = {
  1: {
    tab: 'home',
    pose: 'point',
    title: 'Главная',
    text: 'Это главная страница! Здесь ты узнаешь о студии, увидишь наши предложения и новинки.',
  },
  2: {
    tab: 'catalog',
    pose: 'point',
    title: 'Услуги',
    text: 'Здесь собраны наши услуги. Выбирай то, что тебе нужно, и добавляй в свой заказ!',
  },
  3: {
    tab: 'orders',
    pose: 'think',
    title: 'Заказы',
    text: 'Здесь собраны выбранные услуги. Когда будешь готов, отправь заявку нашему менеджеру.',
  },
  4: {
    tab: 'profile',
    pose: 'hello',
    title: 'Профиль',
    text: 'А здесь твой профиль, полезные ссылки, настройки и возможность пригласить друга!',
  },
};

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

function Onboarding({
  step,
  onNext,
  onSkip,
}: {
  step: TourStep;
  onNext: () => void;
  onSkip: () => void;
}) {
  const isWelcome = step === 0;
  const isFarewell = step === 5;

  const content = isWelcome
    ? {
        pose: 'hello',
        title: 'Привет! Я MODO!',
        text: 'И я хочу помочь тебе разобраться в этом приложении!',
      }
    : isFarewell
      ? {
          pose: 'hello',
          title: '',
          text: 'Я вижу, что ты знаешь толк в хороших приложениях и не первый раз тут! Удачного пользования!',
        }
      : TOUR_CONTENT[step as 1 | 2 | 3 | 4];

  const imagePath = `/mascot/${content.pose}.png`;

  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [step]);

  return (
    <motion.div
      className="modo-tour-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="modo-tour-panel"
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.3 }}
      >
        <div className="modo-tour-mascot">
          {!imageFailed ? (
            <motion.img
              key={imagePath}
              src={imagePath}
              alt="MODO"
              onError={() => setImageFailed(true)}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ) : (
            <motion.div
              className="modo-tour-emoji"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {content.pose === 'hello'
                ? '👋'
                : content.pose === 'point'
                  ? '👉'
                  : '🤔'}
            </motion.div>
          )}
        </div>

        <div className="modo-tour-bubble">
          {content.title && (
            <h2>{content.title}</h2>
          )}

          <p>{content.text}</p>
        </div>

        {!isWelcome && !isFarewell && (
          <div className="modo-tour-progress">
            <span>Знакомство с приложением</span>
            <span>{step} / 4</span>
          </div>
        )}

        <div className="modo-tour-actions">
          {isWelcome ? (
            <>
              <button
                className="modo-tour-primary"
                onClick={onNext}
              >
                Давай познакомимся!
              </button>

              <button
                className="modo-tour-secondary"
                onClick={onSkip}
              >
                Не нужна помощь
              </button>
            </>
          ) : isFarewell ? (
            <button
              className="modo-tour-primary"
              onClick={onNext}
            >
              Начать пользоваться
            </button>
          ) : (
            <>
              <button
                className="modo-tour-primary"
                onClick={onNext}
              >
                {step === 4 ? 'Завершить' : 'Далее'}
              </button>

              <button
                className="modo-tour-secondary"
                onClick={onSkip}
              >
                Пропустить обучение
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Shell() {
  const [splash, setSplash] = useState(true);
  const [tab, setTab] = useState<Tab>('home');
  const [sub, setSub] = useState<'settings' | null>(null);
  const [cat, setCat] = useState<CategoryId | undefined>();
  const [tourStep, setTourStep] = useState<TourStep | null>(null);

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

      try {
        if (localStorage.getItem(TOUR_KEY) !== 'true') {
          setTourStep(0);
        }
      } catch {
        setTourStep(0);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const go = (t: Tab) => {
    setTab(t);
    setSub(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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

  const startTour = () => {
    setSub(null);
    setCat(undefined);
    setTab('home');
    setTourStep(0);
  };

  const finishTour = () => {
    try {
      localStorage.setItem(TOUR_KEY, 'true');
    } catch {
      // localStorage недоступен
    }

    setTourStep(null);
    setTab('home');
    setSub(null);
    setCat(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const skipTour = () => {
    setTourStep(5);
  };

  const nextTourStep = () => {
    if (tourStep === 0) {
      setTab('home');
      setSub(null);
      setTourStep(1);
      return;
    }

    if (tourStep === 1) {
      setTab('catalog');
      setCat(undefined);
      setSub(null);
      setTourStep(2);
      return;
    }

    if (tourStep === 2) {
      setTab('orders');
      setSub(null);
      setTourStep(3);
      return;
    }

    if (tourStep === 3) {
      setTab('profile');
      setSub(null);
      setTourStep(4);
      return;
    }

    if (tourStep === 4 || tourStep === 5) {
      finishTour();
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

      <AnimatePresence>
        {!splash && tourStep !== null && (
          <Onboarding
            key="modo-tour"
            step={tourStep}
            onNext={nextTourStep}
            onSkip={skipTour}
          />
        )}
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

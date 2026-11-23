import WebApp from '@twa-dev/sdk';

const BG = '#F4F8FC';

export function initTelegram() {
  try {
    WebApp.ready();
    WebApp.expand();
    WebApp.setHeaderColor(BG);
    WebApp.setBackgroundColor(BG);
  } catch {
    /* запуск вне Telegram (браузер) — просто работаем без SDK */
  }
}

export interface TgUser {
  id?: number;
  firstName: string;
  username?: string;
  photoUrl?: string;
}

export function getUser(): TgUser {
  const u = WebApp.initDataUnsafe?.user;
  return {
    id: u?.id,
    firstName: u?.first_name || 'Гость',
    username: u?.username,
    photoUrl: u?.photo_url,
  };
}

// Строка initData для серверной проверки подписи (используется с Этапа 7).
export const getInitData = () => WebApp.initData || '';

export function haptic(style: 'light' | 'medium' = 'light') {
  try {
    WebApp.HapticFeedback.impactOccurred(style);
  } catch {
    /* no-op */
  }
}

export function openTelegramLink(url: string) {
  try {
    if (WebApp.initData) return WebApp.openTelegramLink(url);
  } catch {
    /* fallthrough */
  }
  window.open(url, '_blank', 'noopener');
}

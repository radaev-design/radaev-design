import WebApp from '@twa-dev/sdk';

export const inTelegram = () => !!WebApp.initData;

export function initTelegram() {
  document.documentElement.style.overscrollBehavior = 'none';
  if (!inTelegram()) return;
  try {
    WebApp.ready();
    WebApp.expand();
    WebApp.disableVerticalSwipes();
  } catch {
    /* старый клиент */
  }
}

export function setTelegramColors(bg: string) {
  if (!inTelegram()) return;
  try {
    WebApp.setHeaderColor(bg as `#${string}`);
    WebApp.setBackgroundColor(bg as `#${string}`);
  } catch {
    /* no-op */
  }
}

export function systemTheme(): 'light' | 'dark' {
  if (inTelegram()) return WebApp.colorScheme === 'dark' ? 'dark' : 'light';
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export interface TgUser {
  id?: number;
  firstName: string;
  username?: string;
  photoUrl?: string;
}

export function getUser(): TgUser {
  const u = WebApp.initDataUnsafe?.user;
  return { id: u?.id, firstName: u?.first_name || 'Гость', username: u?.username, photoUrl: u?.photo_url };
}

// Для серверной проверки подписи (этап 7).
export const getInitData = () => WebApp.initData || '';

export function haptic(style: 'light' | 'medium' = 'light') {
  try {
    WebApp.HapticFeedback.impactOccurred(style);
  } catch {
    /* no-op */
  }
}

export function openLink(url: string) {
  if (!url) return;
  try {
    if (inTelegram()) {
      return url.includes('t.me/') ? WebApp.openTelegramLink(url) : WebApp.openLink(url);
    }
  } catch {
    /* fallthrough */
  }
  window.open(url, '_blank', 'noopener');
}

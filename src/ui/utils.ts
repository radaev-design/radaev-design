import WebApp from '@twa-dev/sdk';
import { openTelegramLink } from '../integrations/telegram';

export function openLink(url: string) {
  if (!url) return;
  if (url.includes('t.me/')) return openTelegramLink(url);
  try {
    if (WebApp.initData) return WebApp.openLink(url);
  } catch { /* fallthrough */ }
  window.open(url, '_blank', 'noopener');
}

// Анимация: кружок летит от кнопки к вкладке «Заказы».
export function fly(from: HTMLElement) {
  const to = document.getElementById('tab-orders');
  if (!to) return;
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2;
  const dx = b.left + b.width / 2 - x0, dy = b.top + b.height / 2 - y0;
  const d = document.createElement('div');
  Object.assign(d.style, {
    position: 'fixed', left: x0 - 14 + 'px', top: y0 - 14 + 'px', width: '28px', height: '28px',
    borderRadius: '50%', background: '#FF5B4D', zIndex: '300', pointerEvents: 'none',
    boxShadow: '0 6px 16px rgba(255,91,77,.5)',
  });
  document.body.appendChild(d);
  d.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.55}px,${dy * 0.35 - 70}px) scale(1.15)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px,${dy}px) scale(0.3)`, opacity: 0.2 },
    ],
    { duration: 750, easing: 'cubic-bezier(.45,.05,.4,1)' },
  ).onfinish = () => {
    d.remove();
    to.classList.add('bump');
    setTimeout(() => to.classList.remove('bump'), 400);
  };
}

export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '');

// Кружок летит от кнопки к вкладке «Заказы».
export function fly(from: HTMLElement) {
  const to = document.getElementById('tab-orders');
  if (!to || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const x0 = a.left + a.width / 2;
  const y0 = a.top + a.height / 2;
  const dx = b.left + b.width / 2 - x0;
  const dy = b.top + b.height / 2 - y0;
  const d = document.createElement('div');
  d.className = 'fly-dot';
  d.style.left = x0 - 14 + 'px';
  d.style.top = y0 - 14 + 'px';
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

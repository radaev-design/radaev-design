
import { BRAND } from '../../../config/catalog';
import { LINKS } from '../../../config/links';
import { getUser, haptic } from '../../integrations/telegram';
import { useCart } from '../../storage/cart';
import { openLink } from '../../ui/utils';
import { useToast } from '../../ui/Toast';

interface Props {
  onOrders: () => void;
  onSettings: () => void;
}

export function ProfileScreen({ onOrders, onSettings }: Props) {
  const u = getUser();
  const { ids } = useCart();
  const { toast } = useToast();

  const firstName = u.firstName || 'Пользователь';

  const share = `https://t.me/share/url?url=${encodeURIComponent(
    'https://t.me/' + BRAND.clientBot
  )}&text=${encodeURIComponent(
    'Студия RADAEV.DESIGN: дизайн, видео, AI-фото и Telegram-боты'
  )}`;

  const items: {
    ico: string;
    t: string;
    s?: string;
    on: () => void;
  }[] = [
    {
      ico: '🛍️',
      t: 'Мои заказы',
      s: ids.length ? `Выбрано: ${ids.length}` : undefined,
      on: onOrders,
    },
    ...(LINKS.channel
      ? [
          {
            ico: '📣',
            t: 'Канал студии',
            on: () => openLink(LINKS.channel),
          },
        ]
      : []),
    ...(LINKS.portfolio
      ? [
          {
            ico: '🎨',
            t: 'Портфолио',
            on: () => openLink(LINKS.portfolio),
          },
        ]
      : []),
    ...(LINKS.reviews
      ? [
          {
            ico: '⭐',
            t: 'Отзывы',
            on: () => openLink(LINKS.reviews),
          },
        ]
      : []),
    {
      ico: '💬',
      t: 'Написать менеджеру',
      on: () => {
        toast('Открываем менеджера в Telegram', 'info');
        openLink(BRAND.managerUrl);
      },
    },
    {
      ico: '🎁',
      t: 'Пригласить друга',
      on: () => openLink(share),
    },
    {
      ico: '⚙️',
      t: 'Настройки',
      on: onSettings,
    },
  ];

  return (
    <div className="screen">
      <div className="card pf">
        <div
          className="avatar big"
          style={
            u.photoUrl
              ? { backgroundImage: `url(${u.photoUrl})` }
              : undefined
          }
        >
          {u.photoUrl ? '' : firstName[0]}
        </div>

        <div>
          <h3>{firstName}</h3>
          <p>{u.username ? '@' + u.username : 'без username'}</p>
        </div>
      </div>

      <div className="menu">
        {items.map((i) => (
          <button
            key={i.t}
            className="mi"
            onClick={() => {
              haptic();
              i.on();
            }}
          >
            <span className="mi-ico">{i.ico}</span>

            <span className="mi-t">
              {i.t}
              {i.s && <small>{i.s}</small>}
            </span>

            <span className="mi-ch">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

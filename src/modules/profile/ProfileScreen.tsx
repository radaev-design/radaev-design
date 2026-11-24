import { BRAND } from '../../../config/catalog';
import { LINKS } from '../../../config/links';
import { getUser, haptic, openLink } from '../../integrations/telegram';
import { useCart } from '../../storage/cart';
import { useMe } from '../../storage/me';
import { MenuItem } from '../../ui/MenuItem';
import { useToast } from '../../ui/Toast';
import { PromoCard } from './PromoCard';

interface Props {
  onOrders: () => void;
  onSettings: () => void;
  onGames: () => void;
}

export function ProfileScreen({ onOrders, onSettings, onGames }: Props) {
  const u = getUser();
  const { ids } = useCart();
  const { me } = useMe();
  const { toast } = useToast();

  const share =
    `https://t.me/share/url?url=${encodeURIComponent('https://t.me/' + BRAND.clientBot)}` +
    `&text=${encodeURIComponent('Студия RADAEV.DESIGN: дизайн, видео, AI-фото и Telegram-боты')}`;

  const links = [
    { ico: '📣', t: 'Канал студии', url: LINKS.channel },
    { ico: '🎨', t: 'Портфолио', url: LINKS.portfolio },
    { ico: '⭐', t: 'Отзывы', url: LINKS.reviews },
  ].filter((l) => l.url);

  const run = (fn: () => void) => () => {
    haptic();
    fn();
  };

  return (
    <div className="screen">
      <div className="card pf">
        <div className="avatar big" style={u.photoUrl ? { backgroundImage: `url(${u.photoUrl})` } : undefined}>
          {u.photoUrl ? '' : u.firstName[0]}
        </div>
        <div>
          <h3>{u.firstName}</h3>
          <p>{u.username ? '@' + u.username : 'без username'}</p>
        </div>
      </div>

      <PromoCard />

      <div className="menu">
        <MenuItem ico="🛍️" title="Мои заказы" sub={ids.length ? `Выбрано: ${ids.length}` : undefined} onClick={run(onOrders)} />
        <MenuItem ico="🎮" title="Игры и баллы" sub={me ? `${me.points} баллов` : 'Играйте и получайте скидки'} onClick={run(onGames)} />
        {links.map((l) => (
          <MenuItem key={l.t} ico={l.ico} title={l.t} onClick={run(() => openLink(l.url))} />
        ))}
        <MenuItem
          ico="💬"
          title="Написать менеджеру"
          onClick={run(() => {
            toast('Открываем менеджера в Telegram', 'info');
            openLink(BRAND.managerUrl);
          })}
        />
        <MenuItem ico="🎁" title="Пригласить друга" onClick={run(() => openLink(share))} />
        <MenuItem ico="⚙️" title="Настройки" onClick={run(onSettings)} />
      </div>
    </div>
  );
}

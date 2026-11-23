import { activeServices, CATEGORIES, CategoryId } from '../../../config/catalog';
import { ADVANTAGES, STEPS } from '../../../config/home';
import { ru } from '../../i18n/ru';
import { getUser } from '../../integrations/telegram';
import { Button } from '../../ui/Button';
import { Mascot } from '../../ui/Mascot';
import { ServiceCard } from '../catalog/ServiceCard';
import { Banners } from './Banners';
import { Stories } from './Stories';

interface Props {
  onOpenCatalog: (cat?: CategoryId) => void;
  onOpenProfile: () => void;
}

export function HomeScreen({ onOpenCatalog, onOpenProfile }: Props) {
  const user = getUser();
  const all = activeServices();
  const popular = all.filter((s) => s.popular && !s.comingSoon);
  const soon = all.filter((s) => s.comingSoon);

  return (
    <div className="screen">
      <header className="top">
        <div>
          <div className="logo">
            RADAEV<b>.DESIGN</b>
          </div>
          <div className="hello">
            {ru.home.hello}, {user.firstName}
          </div>
        </div>
        <button
          className="avatar"
          aria-label="Профиль"
          onClick={onOpenProfile}
          style={user.photoUrl ? { backgroundImage: `url(${user.photoUrl})` } : undefined}
        >
          {user.photoUrl ? '' : user.firstName[0]}
        </button>
      </header>

      <Stories />

      <section className="hero">
        <div className="obj sphere" />
        <div className="obj cube" />
        <div className="obj ring" />
        <h1>{ru.home.heroTitle}</h1>
        <p>{ru.home.heroSub}</p>
        <Button onClick={() => onOpenCatalog()}>{ru.home.cta}</Button>
      </section>

      <Banners onOpen={onOpenCatalog} />

      <h2>{ru.home.categories}</h2>
      <div className="grid2">
        {CATEGORIES.map((c) => (
          <button key={c.id} className="cat" style={{ background: c.color }} onClick={() => onOpenCatalog(c.id)}>
            <b>{c.title}</b>
            <span>{c.subtitle}</span>
          </button>
        ))}
      </div>

      {popular.length > 0 && (
        <>
          <h2>Популярное</h2>
          <div className="hscroll">
            {popular.map((s, i) => (
              <ServiceCard key={s.id} s={s} n={i + 1} className="svc-h" />
            ))}
          </div>
        </>
      )}

      <h2>Как мы работаем</h2>
      <div className="card steps">
        {STEPS.map((x, i) => (
          <div key={x.t} className="step">
            <span className="step-n">{i + 1}</span>
            <div>
              <b>{x.t}</b>
              <p>{x.d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Почему мы</h2>
      <div className="grid2">
        {ADVANTAGES.map((a) => (
          <div key={a.t} className="card adv">
            <span>{a.ico}</span>
            <b>{a.t}</b>
            <p>{a.d}</p>
          </div>
        ))}
      </div>

      {soon.length > 0 && (
        <>
          <div className="soon-head">
            <Mascot pose="coin" size={64} />
            <div>
              <h2>Скоро</h2>
              <p className="muted">Оформите предзаказ первыми</p>
            </div>
          </div>
          {soon.map((s, i) => (
            <ServiceCard key={s.id} s={s} n={i + 1} />
          ))}
        </>
      )}
    </div>
  );
}

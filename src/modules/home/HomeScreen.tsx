import { CATEGORIES, CategoryId } from '../../../config/catalog';
import { ru } from '../../i18n/ru';
import { getUser } from '../../integrations/telegram';
import { Banners } from './Banners';
import { Stories } from './Stories';

interface Props {
  onOpenCatalog: (cat?: CategoryId) => void;
  onOpenProfile: () => void;
}

export function HomeScreen({ onOpenCatalog, onOpenProfile }: Props) {
  const user = getUser();
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
        <button className="btn" onClick={() => onOpenCatalog()}>
          {ru.home.cta}
        </button>
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
    </div>
  );
}

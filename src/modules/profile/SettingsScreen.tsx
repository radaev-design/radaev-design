import { BRAND } from '../../../config/catalog';
import { LINKS } from '../../../config/links';
import { openLink } from '../../ui/utils';

interface Props { dark: boolean; onTheme: (dark: boolean) => void; onBack: () => void }

export function SettingsScreen({ dark, onTheme, onBack }: Props) {
  const doc = (ico: string, t: string, url: string) => (
    <button className="mi" disabled={!url} onClick={() => openLink(url)}>
      <span className="mi-ico">{ico}</span>
      <span className="mi-t">{t}{!url && <small>Ссылка пока не добавлена</small>}</span>
      <span className="mi-ch">›</span>
    </button>
  );
  return (
    <div className="screen">
      <button className="back" onClick={onBack}>‹ Назад</button>
      <h1>Настройки</h1>
      <div className="menu">
        <div className="mi">
          <span className="mi-ico">{dark ? '🌙' : '☀️'}</span>
          <span className="mi-t">Тёмный режим<small>{dark ? 'Включён' : 'Выключен'}</small></span>
          <button className={'sw' + (dark ? ' on' : '')} role="switch" aria-checked={dark} aria-label="Тёмный режим" onClick={() => onTheme(!dark)}><i /></button>
        </div>
        {doc('🔒', 'Политика конфиденциальности', LINKS.privacy)}
        {doc('📄', 'Пользовательское соглашение', LINKS.terms)}
        <button className="mi" onClick={() => openLink(BRAND.managerUrl)}>
          <span className="mi-ico">🛟</span><span className="mi-t">Поддержка</span><span className="mi-ch">›</span>
        </button>
      </div>
      <button className="btn secondary" style={{ width: '100%', marginTop: 16 }} onClick={onBack}>‹ Назад в профиль</button>
    </div>
  );
}

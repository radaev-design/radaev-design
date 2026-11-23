import { BRAND } from '../../../config/catalog';
import { LINKS } from '../../../config/links';
import { openLink } from '../../integrations/telegram';
import { MenuItem } from '../../ui/MenuItem';

interface Props {
  dark: boolean;
  onTheme: (dark: boolean) => void;
  onBack: () => void;
}

export function SettingsScreen({ dark, onTheme, onBack }: Props) {
  return (
    <div className="screen">
      <button className="back" onClick={onBack}>
        ‹ Назад
      </button>
      <h1>Настройки</h1>
      <div className="menu">
        <MenuItem
          ico={dark ? '🌙' : '☀️'}
          title="Тёмный режим"
          sub={dark ? 'Включён' : 'Выключен'}
          role="switch"
          aria-checked={dark}
          onClick={() => onTheme(!dark)}
          right={
            <span className={'sw' + (dark ? ' on' : '')}>
              <i />
            </span>
          }
        />
        <MenuItem
          ico="🔒"
          title="Политика конфиденциальности"
          sub={LINKS.privacy ? undefined : 'Ссылка пока не добавлена'}
          disabled={!LINKS.privacy}
          onClick={() => openLink(LINKS.privacy)}
        />
        <MenuItem
          ico="📄"
          title="Пользовательское соглашение"
          sub={LINKS.terms ? undefined : 'Ссылка пока не добавлена'}
          disabled={!LINKS.terms}
          onClick={() => openLink(LINKS.terms)}
        />
        <MenuItem ico="🛟" title="Поддержка" onClick={() => openLink(BRAND.managerUrl)} />
      </div>
    </div>
  );
}

import { BRAND } from '../../../config/catalog';
import { ru } from '../../i18n/ru';
import { getUser, openTelegramLink } from '../../integrations/telegram';

export function ProfileScreen() {
  const user = getUser();
  return (
    <div className="screen">
      <h1>{ru.profile.title}</h1>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div className="avatar" style={user.photoUrl ? { backgroundImage: `url(${user.photoUrl})` } : undefined}>
          {user.photoUrl ? '' : user.firstName[0]}
        </div>
        <div>
          <b>{user.firstName}</b>
          <div className="hello">{user.username ? '@' + user.username : ru.profile.noUsername}</div>
        </div>
      </div>
      <button className="btn" style={{ width: '100%' }} onClick={() => openTelegramLink(BRAND.managerUrl)}>
        {ru.profile.support}
      </button>
    </div>
  );
}

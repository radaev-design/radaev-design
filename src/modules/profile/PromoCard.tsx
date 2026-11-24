import { useState } from 'react';
import { ECONOMY } from '../../../config/economy';
import { haptic } from '../../integrations/telegram';
import { useMe } from '../../storage/me';
import { Button } from '../../ui/Button';

export function PromoCard() {
  const { me, activate } = useMe();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const codes = (me?.codes ?? []).filter((c) => !c.used && c.expiresAt > Date.now());

  const submit = async () => {
    if (!code.trim()) return;
    haptic('medium');
    setBusy(true);
    if (await activate(code)) setCode('');
    setBusy(false);
  };

  return (
    <div className="card promo">
      <h3>Промокод</h3>
      <p className="muted" style={{ margin: 0 }}>
        Скидка на заказы от {ECONOMY.minOrder.toLocaleString('ru-RU')} ₽
      </p>
      <div className="promo-row">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ВВЕДИТЕ КОД" maxLength={20} autoCapitalize="characters" />
        <Button disabled={busy || !code.trim()} onClick={submit}>
          Применить
        </Button>
      </div>
      {me?.activePromo && (
        <div className="promo-active">
          ✓ Активен: {me.activePromo.code} · −{me.activePromo.percent}%
        </div>
      )}
      {codes.length > 0 && (
        <div className="promo-codes">
          {codes.map((c) => (
            <div key={c.code} className="promo-code">
              <span>
                {c.code} · −{c.percent}% · до {new Date(c.expiresAt).toLocaleDateString('ru-RU')}
              </span>
              <button onClick={() => activate(c.code)}>Применить</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

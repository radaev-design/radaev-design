import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, Me } from '../api';
import { useToast } from '../ui/Toast';
import { read, write } from './ls';

interface Ctx {
  me: Me | null;
  reactions: Record<string, string>;
  refresh: () => Promise<void>;
  award: (game: string, result: string) => Promise<void>;
  buy: (tier: string) => Promise<boolean>;
  activate: (code: string) => Promise<boolean>;
  react: (story: string, emoji: string) => void;
}

const C = createContext<Ctx | null>(null);

const ERR: Record<string, string> = {
  invalid: 'Промокод не найден',
  expired: 'Срок действия промокода истёк',
  used: 'Промокод уже использован',
  max: 'Лимит использований исчерпан',
  points: 'Недостаточно баллов',
  cooldown: 'Следующий промокод будет доступен позже',
  auth: 'Откройте приложение в Telegram',
  '401': 'Откройте приложение в Telegram',
};
const msg = (e: unknown) => ERR[(e as Error).message] ?? 'Не удалось. Попробуйте позже';

export function MeProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [me, setMe] = useState<Me | null>(null);
  const [local, setLocal] = useState<Record<string, string>>(() => read('rx1', {}));

  const refresh = useCallback(async () => {
    try {
      setMe(await api.me());
    } catch {
      /* вне Telegram или сервер недоступен */
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const award = useCallback(
    async (game: string, result: string) => {
      try {
        const r = await api.award(game, result);
        setMe((m) => (m ? { ...m, points: r.points, todayPts: r.todayPts } : m));
        if (r.gained > 0) toast(`+${r.gained} баллов MODO`, 'success');
        else if (r.capped) toast('Дневной лимит баллов достигнут', 'info');
      } catch {
        /* баллы только в Telegram */
      }
    },
    [toast],
  );

  const activate = useCallback(
    async (code: string) => {
      try {
        const r = await api.activate(code);
        await refresh();
        toast(`Промокод применён: −${r.percent}%`, 'success');
        return true;
      } catch (e) {
        toast(msg(e), 'error');
        return false;
      }
    },
    [refresh, toast],
  );

  const buy = useCallback(
    async (tier: string) => {
      try {
        const { code } = await api.buy(tier);
        await api.activate(code);
        await refresh();
        toast(`Промокод ${code} получен и применён`, 'success');
        return true;
      } catch (e) {
        toast(msg(e), 'error');
        return false;
      }
    },
    [refresh, toast],
  );

  const react = useCallback((story: string, emoji: string) => {
    setLocal((l) => {
      if (l[story]) return l;
      const n = { ...l, [story]: emoji };
      write('rx1', n);
      return n;
    });
    api.react(story, emoji).catch(() => {});
  }, []);

  const reactions = useMemo(() => ({ ...local, ...(me?.reactions ?? {}) }), [local, me]);
  const value = useMemo(() => ({ me, reactions, refresh, award, buy, activate, react }), [me, reactions, refresh, award, buy, activate, react]);
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useMe() {
  const c = useContext(C);
  if (!c) throw new Error('useMe outside MeProvider');
  return c;
}

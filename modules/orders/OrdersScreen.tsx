import { ru } from '../../i18n/ru';

export function OrdersScreen({ onOpenCatalog }: { onOpenCatalog: () => void }) {
  // Список заказов подключится на Этапе 7 (API + D1).
  return (
    <div className="screen">
      <h1>{ru.orders.title}</h1>
      <div className="empty card">
        <div className="ico">📦</div>
        <h3>{ru.orders.emptyTitle}</h3>
        <p>{ru.orders.emptyText}</p>
        <button className="btn" onClick={onOpenCatalog}>
          {ru.home.cta}
        </button>
      </div>
    </div>
  );
}

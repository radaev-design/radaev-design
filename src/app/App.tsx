import { useState } from 'react';
import type { CategoryId } from '../../config/catalog';
import { TabBar, Tab } from '../ui/TabBar';
import { HomeScreen } from '../modules/home/HomeScreen';
import { CatalogScreen } from '../modules/catalog/CatalogScreen';
import { OrdersScreen } from '../modules/orders/OrdersScreen';
import { ProfileScreen } from '../modules/profile/ProfileScreen';

export function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [cat, setCat] = useState<CategoryId | undefined>();

  const openCatalog = (c?: CategoryId) => {
    setCat(c);
    setTab('catalog');
  };

  return (
    <div className="app">
      {tab === 'home' && <HomeScreen onOpenCatalog={openCatalog} onOpenProfile={() => setTab('profile')} />}
      {tab === 'catalog' && <CatalogScreen key={cat ?? 'all'} initial={cat} />}
      {tab === 'orders' && <OrdersScreen onOpenCatalog={() => openCatalog()} />}
      {tab === 'profile' && <ProfileScreen />}
      <TabBar tab={tab} onChange={(t) => (t === 'catalog' ? openCatalog() : setTab(t))} />
    </div>
  );
}

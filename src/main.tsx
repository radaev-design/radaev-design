import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/onest';
import '@fontsource-variable/unbounded';
import { App } from './app/App';
import { initTelegram } from './integrations/telegram';
import './ui/theme.css';
import './ui/brand.css';
import './ui/extra.css';
import './ui/kv.css';

initTelegram();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

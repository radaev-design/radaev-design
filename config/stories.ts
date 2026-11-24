// Истории. Картинки/видео: public/stories/, путь 'stories/имя.jpg' (или .mp4).
// cta — кнопка на слайде: category открывает раздел, service открывает карточку услуги (id из catalog.ts).
import type { CategoryId } from './catalog';

export const REACTIONS = ['🔥', '🎉', '🏆', '👏', '🥳', '❤️'];

export interface Cta { label: string; category?: CategoryId; service?: string }
export interface Slide { src?: string; caption?: string; duration?: number; cta?: Cta }
export interface Story { id: string; name: string; color: string; avatar?: string; slides: Slide[] }

export const STORIES: Story[] = [
  { id: 's1', name: 'Пример 1', color: '#ff0055', slides: [{ caption: 'Здесь будет история клиента', cta: { label: 'Хочу так же', category: 'design' } }, { caption: 'Второй слайд истории' }] },
  { id: 's2', name: 'Пример 2', color: '#7a0030', slides: [{ caption: 'Нейро-фотосессия: до и после', cta: { label: 'Хочу так же', service: 'ai-by-photo' } }] },
  { id: 's3', name: 'Пример 3', color: '#c4003f', slides: [{ caption: 'Монтаж Reels', cta: { label: 'Заказать монтаж', service: 'reels' } }] },
  { id: 's4', name: 'Пример 4', color: '#5c0a2a', slides: [{ caption: 'Telegram-бот под ключ', cta: { label: 'Заказать бота', service: 'bot-turnkey' } }] },
];

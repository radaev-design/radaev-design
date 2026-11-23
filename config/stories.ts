// Истории клиентов. Картинки/видео кладите в папку public/stories/ и пишите путь 'stories/имя.jpg' (или .mp4).
// avatar — маленькое фото в кружке. Без src слайд показывается цветным фоном с подписью.
export interface Slide { src?: string; caption?: string; duration?: number } // duration в мс, по умолчанию 5000
export interface Story { id: string; name: string; color: string; avatar?: string; slides: Slide[] }

export const STORIES: Story[] = [
  { id: 's1', name: 'Пример 1', color: '#153cff', slides: [{ caption: 'Здесь будет история клиента' }, { caption: 'Второй слайд истории' }] },
  { id: 's2', name: 'Пример 2', color: '#7a4dff', slides: [{ caption: 'Нейро-фотосессия: до и после' }] },
  { id: 's3', name: 'Пример 3', color: '#ff5b4d', slides: [{ caption: 'Монтаж Reels' }] },
  { id: 's4', name: 'Пример 4', color: '#1fb6a6', slides: [{ caption: 'Telegram-бот под ключ' }] },
];

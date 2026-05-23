/**
 * Telegram Service
 * Получает проповеди из закрытого Telegram-канала
 */

interface TelegramMessage {
  message_id: number;
  date: number;
  text?: string;
  caption?: string;
  audio?: {
    file_id: string;
    file_size: number;
    duration: number;
  };
  video?: {
    file_id: string;
    file_size: number;
    duration: number;
    width: number;
    height: number;
  };
  document?: {
    file_id: string;
    file_size: number;
    mime_type: string;
  };
}

export interface Sermon {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'audio' | 'video' | 'document';
  fileId: string;
  duration?: number;
  fileSize?: number;
}

class TelegramService {
  private botToken: string;
  private channelId: string;
  private apiUrl = 'https://api.telegram.org/bot';

  constructor(botToken: string, channelId: string) {
    this.botToken = botToken;
    this.channelId = channelId;
  }

  /**
   * Получить все сообщения из канала
   */
  async getChannelMessages(): Promise<TelegramMessage[]> {
    try {
      const url = `${this.apiUrl}${this.botToken}/getUpdates`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!data.ok) {
        console.error('Telegram API error:', data.description);
        return [];
      }

      // Фильтруем сообщения из нашего канала
      const messages = data.result
        .filter((update: any) => update.channel_post?.chat?.id?.toString() === this.channelId)
        .map((update: any) => update.channel_post);

      return messages;
    } catch (error) {
      console.error('Error fetching Telegram messages:', error);
      return [];
    }
  }

  /**
   * Получить сообщения канала через getChatHistory
   */
  async getChannelHistory(limit: number = 100): Promise<Sermon[]> {
    try {
      const url = `${this.apiUrl}${this.botToken}/getChat`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: this.channelId }),
      });

      const data = await response.json();

      if (!data.ok) {
        console.error('Error getting chat info:', data.description);
        return [];
      }

      // Получаем сообщения через getChatHistory (требует специального доступа)
      return await this.fetchSermons(limit);
    } catch (error) {
      console.error('Error fetching channel history:', error);
      return [];
    }
  }

  /**
   * Получить проповеди из канала
   */
  async fetchSermons(limit: number = 50): Promise<Sermon[]> {
    try {
      const sermons: Sermon[] = [];
      
      // Получаем последние сообщения из канала
      const url = `${this.apiUrl}${this.botToken}/getUpdates?limit=${limit}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!data.ok) {
        console.error('Telegram API error:', data.description);
        return [];
      }

      // Обрабатываем сообщения
      data.result.forEach((update: any) => {
        const message = update.channel_post;
        
        if (!message) return;

        // Проверяем, что это сообщение из нашего канала
        if (message.chat?.id?.toString() !== this.channelId) return;

        // Извлекаем информацию о проповеди
        const sermon = this.parseMessage(message);
        if (sermon) {
          sermons.push(sermon);
        }
      });

      // Сортируем по дате (новые сверху)
      return sermons.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error fetching sermons:', error);
      return [];
    }
  }

  /**
   * Парсить сообщение Telegram и извлечь информацию о проповеди
   */
  private parseMessage(message: TelegramMessage): Sermon | null {
    let type: 'audio' | 'video' | 'document' | null = null;
    let fileId: string | null = null;
    let duration: number | undefined;
    let fileSize: number | undefined;

    // Определяем тип контента
    if (message.audio) {
      type = 'audio';
      fileId = message.audio.file_id;
      duration = message.audio.duration;
      fileSize = message.audio.file_size;
    } else if (message.video) {
      type = 'video';
      fileId = message.video.file_id;
      duration = message.video.duration;
      fileSize = message.video.file_size;
    } else if (message.document) {
      type = 'document';
      fileId = message.document.file_id;
      fileSize = message.document.file_size;
    }

    // Если нет медиа-файла, пропускаем
    if (!type || !fileId) {
      return null;
    }

    // Извлекаем название и описание
    const title = message.caption || message.text || 'Проповедь';
    const description = message.text || message.caption || '';

    // Форматируем дату
    const date = new Date(message.date * 1000).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      id: `${message.message_id}`,
      title: title.split('\n')[0], // Первая строка как название
      description: description.substring(0, 200), // Первые 200 символов как описание
      date,
      type,
      fileId,
      duration,
      fileSize,
    };
  }

  /**
   * Получить URL для скачивания файла
   */
  getFileUrl(fileId: string): string {
    return `${this.apiUrl}${this.botToken}/getFile?file_id=${fileId}`;
  }

  /**
   * Получить информацию о файле
   */
  async getFileInfo(fileId: string): Promise<any> {
    try {
      const url = `${this.apiUrl}${this.botToken}/getFile`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_id: fileId }),
      });

      const data = await response.json();
      
      if (!data.ok) {
        console.error('Error getting file info:', data.description);
        return null;
      }

      return data.result;
    } catch (error) {
      console.error('Error getting file info:', error);
      return null;
    }
  }
}

// Экспортируем функцию для создания сервиса
export const createTelegramService = (botToken: string, channelId: string) => {
  return new TelegramService(botToken, channelId);
};

export default TelegramService;

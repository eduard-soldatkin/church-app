/**
 * Telegram Configuration
 * Ключи доступа к Telegram Bot API и каналу
 */

// ВАЖНО: Эти значения должны быть заменены на реальные
// В production используйте переменные окружения

export const TELEGRAM_CONFIG = {
  // Bot Token от @BotFather
  BOT_TOKEN: '8957414613:AAEFOs-4xAA6YUetbNHA16id5_14Ku2-JJU',
  
  // Channel ID (закрытый канал для хранения проповедей)
  CHANNEL_ID: '-3565559545',
  
  // Максимальное количество проповедей для загрузки
  MAX_SERMONS: 50,
  
  // Интервал обновления (в миллисекундах)
  UPDATE_INTERVAL: 5 * 60 * 1000, // 5 минут
};

export default TELEGRAM_CONFIG;

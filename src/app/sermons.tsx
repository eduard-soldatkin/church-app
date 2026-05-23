import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { createTelegramService, Sermon } from '@/services/telegramService';
import TELEGRAM_CONFIG from '@/config/telegram';

export default function SermonsScreen() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  // Загружаем проповеди при открытии экрана
  useEffect(() => {
    loadSermons();
  }, []);

  const loadSermons = async () => {
    try {
      setLoading(true);
      setError(null);

      // Создаём сервис Telegram
      const telegramService = createTelegramService(
        TELEGRAM_CONFIG.BOT_TOKEN,
        TELEGRAM_CONFIG.CHANNEL_ID
      );

      // Получаем проповеди из канала
      const fetchedSermons = await telegramService.fetchSermons(TELEGRAM_CONFIG.MAX_SERMONS);

      if (fetchedSermons.length === 0) {
        setError('Проповеди не найдены. Убедитесь, что канал содержит аудио или видео файлы.');
      } else {
        setSermons(fetchedSermons);
      }
    } catch (err) {
      console.error('Error loading sermons:', err);
      setError('Ошибка при загрузке проповедей. Проверьте интернет-соединение.');
    } finally {
      setLoading(false);
    }
  };

  const handleSermonPress = (sermon: Sermon) => {
    // TODO: Implement sermon player
    console.log('Opening sermon:', sermon.title);
  };

  const handleRefresh = () => {
    loadSermons();
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">🎙️ Проповеди</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            Слушайте и смотрите проповеди нашей церкви
          </ThemedText>
        </ThemedView>

        {loading ? (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.text} />
            <ThemedText style={styles.loadingText}>
              Загрузка проповедей...
            </ThemedText>
          </ThemedView>
        ) : error ? (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
            <TouchableOpacity
              onPress={handleRefresh}
              style={styles.retryButton}
            >
              <ThemedText style={styles.retryButtonText}>
                Попробовать снова
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : sermons.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              📭 Проповеди пока не загружены
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Загружайте аудио и видео в Telegram-канал, и они появятся здесь
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.sermonsList}>
            {sermons.map((sermon) => (
              <TouchableOpacity
                key={sermon.id}
                onPress={() => handleSermonPress(sermon)}
                activeOpacity={0.7}
              >
                <ThemedView type="backgroundElement" style={styles.sermonCard}>
                  <View style={styles.sermonHeader}>
                    <View style={styles.typeIndicator}>
                      <ThemedText style={styles.typeIcon}>
                        {sermon.type === 'audio' ? '🎵' : '🎬'}
                      </ThemedText>
                    </View>
                    <View style={styles.headerInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.sermonTitle}>
                        {sermon.title}
                      </ThemedText>
                      <ThemedText style={styles.speaker}>
                        {sermon.type === 'audio' ? 'Аудиопроповедь' : 'Видеопроповедь'}
                      </ThemedText>
                    </View>
                  </View>

                  {sermon.description && (
                    <ThemedText style={styles.description}>
                      {sermon.description}
                    </ThemedText>
                  )}

                  <View style={styles.footer}>
                    <ThemedText style={styles.date}>
                      📅 {sermon.date}
                    </ThemedText>
                    {sermon.duration && (
                      <ThemedText style={styles.duration}>
                        ⏱️ {formatDuration(sermon.duration)}
                      </ThemedText>
                    )}
                  </View>

                  <ThemedText style={styles.playButton}>
                    {sermon.type === 'audio' ? 'Слушать' : 'Смотреть'} →
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ThemedView>
        )}

        <ThemedView style={styles.infoBox}>
          <ThemedText style={styles.infoText}>
            💡 Совет: Новые проповеди загружаются автоматически из Telegram-канала.
          </ThemedText>
          {!loading && (
            <TouchableOpacity onPress={handleRefresh} style={styles.refreshLink}>
              <ThemedText style={styles.refreshLinkText}>
                Обновить
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

/**
 * Форматирует длительность в минуты и секунды
 */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
  loadingText: {
    marginTop: Spacing.three,
    fontSize: 14,
  },
  errorContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.three,
    color: '#d32f2f',
  },
  retryButton: {
    backgroundColor: '#208AEF',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  emptySubtext: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
  },
  sermonsList: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  sermonCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  sermonHeader: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  typeIndicator: {
    width: 50,
    height: 50,
    borderRadius: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  typeIcon: {
    fontSize: 24,
  },
  headerInfo: {
    flex: 1,
  },
  sermonTitle: {
    fontSize: 16,
    marginBottom: Spacing.one,
  },
  speaker: {
    fontSize: 12,
    opacity: 0.7,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  duration: {
    fontSize: 12,
    opacity: 0.6,
  },
  playButton: {
    fontSize: 13,
    fontWeight: '600',
    color: '#208AEF',
    marginTop: Spacing.one,
  },
  infoBox: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.four,
    padding: Spacing.three,
    backgroundColor: '#FFF3CD',
    borderRadius: Spacing.two,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: Spacing.two,
  },
  refreshLink: {
    paddingVertical: Spacing.one,
  },
  refreshLinkText: {
    fontSize: 12,
    color: '#208AEF',
    fontWeight: '600',
  },
});

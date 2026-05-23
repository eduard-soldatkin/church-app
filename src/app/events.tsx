import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  icon: string;
}

const upcomingEvents: Event[] = [
  {
    id: '1',
    title: '5 Взрослый Альфа Курс',
    date: 'Июнь 2026',
    time: 'Уточняется',
    location: 'Главный зал',
    description: 'Ежегодная программа для всех желающих познакомиться с основами веры',
    icon: '📚',
  },
  {
    id: '2',
    title: 'Летний лагерь для молодежи',
    date: 'Июль 2026',
    time: 'Уточняется',
    location: 'За городом',
    description: 'Духовное развитие и общение для молодых людей',
    icon: '⛺',
  },
  {
    id: '3',
    title: 'Праздник урожая',
    date: 'Сентябрь 2026',
    time: 'Уточняется',
    location: 'Храм и двор',
    description: 'Благодарственное богослужение и общая трапеза',
    icon: '🌾',
  },
];

const regularServices: Event[] = [
  {
    id: 'r1',
    title: 'Общее собрание церкви',
    date: 'Каждое воскресенье',
    time: '10:00-12:00',
    location: 'Главный зал',
    description: 'Основное богослужение с проповедью',
    icon: '⛪',
  },
  {
    id: 'r2',
    title: 'Молитвенное собрание',
    date: 'Каждую пятницу',
    time: '19:00-20:00',
    location: 'Молитвенный зал',
    description: 'Совместная молитва и поддержка',
    icon: '🙏',
  },
  {
    id: 'r3',
    title: 'Утренняя молитва',
    date: 'Пн-Пт',
    time: '08:00-08:30',
    location: 'Молитвенный зал',
    description: 'Короткая утренняя молитва перед днем',
    icon: '🌅',
  },
  {
    id: 'r4',
    title: 'Чтение Библии по плану',
    date: 'Пн-Пи',
    time: '12:00-13:00',
    location: 'Библиотека',
    description: 'Совместное изучение Священного Писания',
    icon: '📖',
  },
];

export default function EventsScreen() {
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

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">📅 События и расписание</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            Все мероприятия нашей церкви
          </ThemedText>
        </ThemedView>

        {/* Upcoming Events */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Предстоящие события
          </ThemedText>
          <ThemedView style={styles.eventsList}>
            {upcomingEvents.map((event) => (
              <ThemedView key={event.id} type="backgroundElement" style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <ThemedText style={styles.eventIcon}>{event.icon}</ThemedText>
                  <View style={styles.eventTitleContainer}>
                    <ThemedText type="defaultSemiBold" style={styles.eventTitle}>
                      {event.title}
                    </ThemedText>
                    <ThemedText style={styles.eventDate}>
                      {event.date}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.eventDescription}>
                  {event.description}
                </ThemedText>

                <View style={styles.eventDetails}>
                  <ThemedText style={styles.detailText}>
                    🕐 {event.time}
                  </ThemedText>
                  <ThemedText style={styles.detailText}>
                    📍 {event.location}
                  </ThemedText>
                </View>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Regular Services */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Регулярные служения
          </ThemedText>
          <ThemedView style={styles.eventsList}>
            {regularServices.map((service) => (
              <ThemedView key={service.id} type="backgroundElement" style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <ThemedText style={styles.eventIcon}>{service.icon}</ThemedText>
                  <View style={styles.eventTitleContainer}>
                    <ThemedText type="defaultSemiBold" style={styles.eventTitle}>
                      {service.title}
                    </ThemedText>
                    <ThemedText style={styles.eventDate}>
                      {service.date}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.eventDescription}>
                  {service.description}
                </ThemedText>

                <View style={styles.eventDetails}>
                  <ThemedText style={styles.detailText}>
                    🕐 {service.time}
                  </ThemedText>
                  <ThemedText style={styles.detailText}>
                    📍 {service.location}
                  </ThemedText>
                </View>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.noteBox}>
          <ThemedText style={styles.noteText}>
            ℹ️ Для получения уведомлений о новых событиях подпишитесь на наш Telegram-канал.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
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
  section: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.five,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: Spacing.three,
  },
  eventsList: {
    gap: Spacing.three,
  },
  eventCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  eventHeader: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  eventIcon: {
    fontSize: 28,
    marginTop: Spacing.one,
  },
  eventTitleContainer: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    marginBottom: Spacing.one,
  },
  eventDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  eventDescription: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  eventDetails: {
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  detailText: {
    fontSize: 12,
    opacity: 0.7,
  },
  noteBox: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.four,
    padding: Spacing.three,
    backgroundColor: '#E8F5E9',
    borderRadius: Spacing.two,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
  },
});

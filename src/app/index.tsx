import { Platform, StyleSheet, ScrollView, View, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

interface ServiceItem {
  day: string;
  time: string;
  title: string;
}

const services: ServiceItem[] = [
  { day: 'ВС', time: '10:00-12:00', title: 'Общее собрание церкви' },
  { day: 'ПТ', time: '19:00-20:00', title: 'Молитвенное собрание' },
  { day: 'ПН-ПТ', time: '08:00-08:30', title: 'Утренняя молитва' },
  { day: 'ПН-ПИ', time: '12:00-13:00', title: 'Чтение Библии по плану' },
];

export default function HomeScreen() {
  const handleCall = () => {
    Linking.openURL('tel:+77292525997');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:info@revival.kz');
  };

  const handleWebsite = () => {
    Linking.openURL('https://www.revival.kz');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.churchName}>
              Церковь ВОЗРОЖДЕНИЕ
            </ThemedText>
            <ThemedText style={styles.location}>
              г. Актау, Казахстан
            </ThemedText>
          </ThemedView>

          {/* Services Schedule */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              📅 Расписание служений
            </ThemedText>
            <ThemedView style={styles.servicesList}>
              {services.map((service, index) => (
                <ThemedView 
                  key={index} 
                  style={[
                    styles.serviceItem,
                    index !== services.length - 1 && styles.serviceBorder
                  ]}
                >
                  <ThemedView style={styles.serviceDay}>
                    <ThemedText type="code" style={styles.dayText}>
                      {service.day}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.serviceDetails}>
                    <ThemedText style={styles.serviceTitle}>
                      {service.title}
                    </ThemedText>
                    <ThemedText style={styles.serviceTime}>
                      {service.time}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>

          {/* About Section */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              ℹ️ О нас
            </ThemedText>
            <ThemedView style={styles.aboutBox}>
              <ThemedText style={styles.aboutText}>
                Добро пожаловать в нашу церковь! Мы рады видеть вас на наших служениях и мероприятиях.
              </ThemedText>
              <ThemedText style={styles.aboutText}>
                Ежегодно мы проводим занятия Альфа Курса, куда приглашаем всех желающих принять участие.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Contact Section */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              📞 Контакты
            </ThemedText>
            <ThemedView style={styles.contactsList}>
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={handleCall}
              >
                <ThemedText style={styles.contactLabel}>Телефон:</ThemedText>
                <ThemedText style={styles.contactValue}>+7 (729) 252-5997</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactItem}
                onPress={handleEmail}
              >
                <ThemedText style={styles.contactLabel}>Email:</ThemedText>
                <ThemedText style={styles.contactValue}>info@revival.kz</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactItem}
                onPress={handleWebsite}
              >
                <ThemedText style={styles.contactLabel}>Сайт:</ThemedText>
                <ThemedText style={styles.contactValue}>www.revival.kz</ThemedText>
              </TouchableOpacity>

              <View style={styles.contactItem}>
                <ThemedText style={styles.contactLabel}>Адрес:</ThemedText>
                <ThemedText style={styles.contactValue}>
                  3 микрорайон, зд. 78{'\n'}
                  г. Актау, 130000{'\n'}
                  Мангисиауская область{'\n'}
                  Республика Казахстан
                </ThemedText>
              </View>
            </ThemedView>
          </ThemedView>

          {/* Navigation Info */}
          <ThemedView style={styles.navInfo}>
            <ThemedText style={styles.navText}>
              Используйте вкладки внизу для доступа к проповедям, событиям и другим разделам.
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.four,
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  churchName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: Spacing.two,
    opacity: 0.7,
  },
  location: {
    fontSize: 12,
    opacity: 0.6,
  },
  section: {
    marginBottom: Spacing.four,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.three,
  },
  servicesList: {
    borderRadius: Spacing.two,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  serviceItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  serviceBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  serviceDay: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#208AEF',
    borderRadius: Spacing.two,
    marginRight: Spacing.three,
  },
  dayText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  serviceDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.one,
  },
  serviceTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  aboutBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.two,
  },
  contactsList: {
    gap: Spacing.three,
  },
  contactItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    marginBottom: Spacing.one,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  navInfo: {
    marginTop: Spacing.four,
    padding: Spacing.three,
    backgroundColor: '#E3F2FD',
    borderRadius: Spacing.two,
    marginBottom: Spacing.four,
  },
  navText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
});

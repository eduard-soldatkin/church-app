import { Platform, ScrollView, StyleSheet, TouchableOpacity, View, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AboutScreen() {
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

  const handleCall = () => Linking.openURL('tel:+77292525997');
  const handleEmail = () => Linking.openURL('mailto:info@revival.kz');
  const handleWebsite = () => Linking.openURL('https://www.revival.kz');
  const handleTelegram = () => Linking.openURL('https://t.me/revival_church');

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">ℹ️ О нас</ThemedText>
        </ThemedView>

        {/* Church Info */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Церковь ВОЗРОЖДЕНИЕ
          </ThemedText>
          <ThemedText style={styles.officialName}>
            Официальное название: МРОХМ «ВОЗРОЖДЕНИЕ»
          </ThemedText>
          <ThemedView type='backgroundElement' style={styles.infoBox}>
            <ThemedText style={styles.bodyText}>
              Добро пожаловать в нашу церковь! Мы - община верующих, объединённых верой в Иисуса Христа и стремлением служить Богу и людям.
            </ThemedText>
            <ThemedText style={[styles.bodyText, styles.marginTop]}>
              Наша миссия - проповедовать Евангелие, помогать нуждающимся и создавать духовную общину, где каждый может найти поддержку, утешение и руководство.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Our Values */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Наши ценности
          </ThemedText>
          <ThemedView style={styles.valuesList}>
            <ThemedView type='backgroundElement' style={styles.valueCard}>
              <ThemedText style={styles.valueIcon}>✝️</ThemedText>
              <View style={styles.valueContent}>
                <ThemedText type="defaultSemiBold">Вера в Христа</ThemedText>
                <ThemedText style={styles.valueDescription}>
                  Основание нашей жизни и служения
                </ThemedText>
              </View>
            </ThemedView>

            <ThemedView type='backgroundElement' style={styles.valueCard}>
              <ThemedText style={styles.valueIcon}>❤️</ThemedText>
              <View style={styles.valueContent}>
                <ThemedText type="defaultSemiBold">Любовь к людям</ThemedText>
                <ThemedText style={styles.valueDescription}>
                  Служение ближним с состраданием
                </ThemedText>
              </View>
            </ThemedView>

            <ThemedView type='backgroundElement' style={styles.valueCard}>
              <ThemedText style={styles.valueIcon}>📖</ThemedText>
              <View style={styles.valueContent}>
                <ThemedText type="defaultSemiBold">Слово Божье</ThemedText>
                <ThemedText style={styles.valueDescription}>
                  Изучение и применение Священного Писания
                </ThemedText>
              </View>
            </ThemedView>

            <ThemedView type='backgroundElement' style={styles.valueCard}>
              <ThemedText style={styles.valueIcon}>🤝</ThemedText>
              <View style={styles.valueContent}>
                <ThemedText type="defaultSemiBold">Единство</ThemedText>
                <ThemedText style={styles.valueDescription}>
                  Сильная и поддерживающая община
                </ThemedText>
              </View>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Programs */}
        <ThemedView style={styles.section}>
          <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
            Наши программы
          </ThemedText>
          <ThemedView type='backgroundElement' style={styles.programBox}>
            <ThemedText style={styles.programTitle}>📚 Альфа Курс</ThemedText>
            <ThemedText style={styles.bodyText}>
              Ежегодная программа для всех желающих познакомиться с основами христианской веры. Курс включает обсуждение, видеолекции и время для вопросов.
            </ThemedText>
          </ThemedView>

          <ThemedView type='backgroundElement' style={styles.programBox}>
            <ThemedText style={styles.programTitle}>🙏 Молитвенные группы</ThemedText>
            <ThemedText style={styles.bodyText}>
              Небольшие группы для совместной молитвы, поддержки и духовного роста. Встречаются регулярно для укрепления веры.
            </ThemedText>
          </ThemedView>

          <ThemedView type='backgroundElement' style={styles.programBox}>
            <ThemedText style={styles.programTitle}>👨‍👩‍👧‍👦 Семейные служения</ThemedText>
            <ThemedText style={styles.bodyText}>
              Специальные программы для семей, включая детские служения и молодежные встречи.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Contact Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Свяжитесь с нами
          </ThemedText>

          <TouchableOpacity onPress={handleCall} activeOpacity={0.7}>
            <ThemedView type='backgroundElement' style={styles.contactButton}>
              <ThemedText style={styles.contactIcon}>📞</ThemedText>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactLabel}>Позвонить</ThemedText>
                <ThemedText style={styles.contactValue}>+7 (729) 252-5997</ThemedText>
              </View>
            </ThemedView>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleEmail} activeOpacity={0.7}>
            <ThemedView type='backgroundElement' style={styles.contactButton}>
              <ThemedText style={styles.contactIcon}>✉️</ThemedText>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactLabel}>Email</ThemedText>
                <ThemedText style={styles.contactValue}>info@revival.kz</ThemedText>
              </View>
            </ThemedView>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleTelegram} activeOpacity={0.7}>
            <ThemedView type='backgroundElement' style={styles.contactButton}>
              <ThemedText style={styles.contactIcon}>📱</ThemedText>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactLabel}>Telegram</ThemedText>
                <ThemedText style={styles.contactValue}>@revival_church</ThemedText>
              </View>
            </ThemedView>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleWebsite} activeOpacity={0.7}>
            <ThemedView type='backgroundElement' style={styles.contactButton}>
              <ThemedText style={styles.contactIcon}>🌐</ThemedText>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactLabel}>Сайт</ThemedText>
                <ThemedText style={styles.contactValue}>www.revival.kz</ThemedText>
              </View>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>

        {/* Address */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Адрес
          </ThemedText>
          <ThemedView type='backgroundElement' style={styles.addressBox}>
            <ThemedText style={styles.addressText}>
              3 микрорайон, здание 78{'\n'}
              г. Актау, 130000{'\n'}
              Мангистауская область{'\n'}
              Республика Казахстан
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Спасибо, что вы с нами!{'\n'}
            Да благословит вас Господь.
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
  section: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.five,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: Spacing.three,
  },
  officialName: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: Spacing.three,
    fontStyle: 'italic',
  },
  infoBox: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  marginTop: {
    marginTop: Spacing.two,
  },
  valuesList: {
    gap: Spacing.two,
  },
  valueCard: {
    flexDirection: 'row',
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  valueIcon: {
    fontSize: 24,
    marginTop: Spacing.one,
  },
  valueContent: {
    flex: 1,
  },
  valueDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: Spacing.one,
  },
  programBox: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  programTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  contactButton: {
    flexDirection: 'row',
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
    marginBottom: Spacing.two,
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 24,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: Spacing.one,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  addressBox: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
});

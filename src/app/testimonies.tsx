import { Platform, ScrollView, StyleSheet, TouchableOpacity, View, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Testimony {
  id: string;
  title: string;
  author: string;
  date: string;
  category: 'healing' | 'salvation' | 'family' | 'work' | 'other';
  type: 'text' | 'video' | 'document';
  content: string;
  image?: string;
  videoUrl?: string;
  documentUrl?: string;
}

const MOCK_TESTIMONIES: Testimony[] = [
  {
    id: '1',
    title: 'Чудесное исцеление от рака',
    author: 'Мария К.',
    date: '2026-05-15',
    category: 'healing',
    type: 'text',
    content: 'Врачи сказали, что у меня неизлечимый рак. Я молилась каждый день. Через три месяца анализы показали, что опухоль исчезла. Это чудо Божье!',
    image: '🙏',
  },
  {
    id: '2',
    title: 'Спасение моей семьи',
    author: 'Иван П.',
    date: '2026-05-10',
    category: 'family',
    type: 'text',
    content: 'Мой брак был на грани развода. Мы пришли в церковь и нашли помощь. Теперь мы счастливы и служим Богу вместе.',
    image: '❤️',
  },
  {
    id: '3',
    title: 'От наркомании к новой жизни',
    author: 'Петр С.',
    date: '2026-05-05',
    category: 'salvation',
    type: 'text',
    content: 'Я был зависим от наркотиков 10 лет. Встретил Иисуса в молитве. Бог дал мне силу избавиться. Сейчас я 3 года чист и помогаю другим.',
    image: '✨',
  },
  {
    id: '4',
    title: 'Работа моей мечты',
    author: 'Анна В.',
    date: '2026-04-28',
    category: 'work',
    type: 'text',
    content: 'Я молилась о работе 6 месяцев. Бог открыл дверь в компанию, где я всегда хотела работать. Слава Богу!',
    image: '💼',
  },
];

const CATEGORY_LABELS = {
  healing: '🏥 Исцеление',
  salvation: '✝️ Спасение',
  family: '👨‍👩‍👧‍👦 Семья',
  work: '💼 Работа',
  other: '✨ Другое',
};

const CATEGORY_COLORS = {
  healing: '#FF6B6B',
  salvation: '#4ECDC4',
  family: '#FFE66D',
  work: '#95E1D3',
  other: '#A8E6CF',
};

export default function TestimoniesScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [testimonies, setTestimonies] = useState<Testimony[]>(MOCK_TESTIMONIES);

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

  const filteredTestimonies = selectedCategory
    ? testimonies.filter(t => t.category === selectedCategory)
    : testimonies;

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">✨ Свидетельства</ThemedText>
          <ThemedText style={styles.subtitle}>
            Истории о славе Божьей в наших жизнях
          </ThemedText>
        </ThemedView>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            activeOpacity={0.7}
          >
            <ThemedView
              type={selectedCategory === null ? 'backgroundElement' : undefined}
              style={[
                styles.categoryButton,
                selectedCategory === null && styles.categoryButtonActive,
              ]}
            >
              <ThemedText
                style={[
                  styles.categoryButtonText,
                  selectedCategory === null && styles.categoryButtonTextActive,
                ]}
              >
                Все
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>

          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setSelectedCategory(key)}
              activeOpacity={0.7}
            >
              <ThemedView
                type={selectedCategory === key ? 'backgroundElement' : undefined}
                style={[
                  styles.categoryButton,
                  selectedCategory === key && styles.categoryButtonActive,
                ]}
              >
                <ThemedText
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === key && styles.categoryButtonTextActive,
                  ]}
                >
                  {label}
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Testimonies List */}
        <ThemedView style={styles.testimoniesList}>
          {filteredTestimonies.length > 0 ? (
            filteredTestimonies.map((testimony) => (
              <ThemedView
                key={testimony.id}
                type='backgroundElement'
                style={styles.testimonyCard}
              >
                {/* Header */}
                <View style={styles.testimonyHeader}>
                  <View style={styles.testimonyHeaderLeft}>
                    <ThemedText style={styles.testimonyIcon}>
                      {testimony.image}
                    </ThemedText>
                    <View style={styles.testimonyHeaderInfo}>
                      <ThemedText style={styles.testimonyTitle}>
                        {testimony.title}
                      </ThemedText>
                      <ThemedText style={styles.testimonyAuthor}>
                        {testimony.author}
                      </ThemedText>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.categoryBadge,
                      {
                        backgroundColor: CATEGORY_COLORS[testimony.category],
                      },
                    ]}
                  >
                    <ThemedText style={styles.categoryBadgeText}>
                      {CATEGORY_LABELS[testimony.category]}
                    </ThemedText>
                  </View>
                </View>

                {/* Content */}
                <ThemedText style={styles.testimonyContent}>
                  {testimony.content}
                </ThemedText>

                {/* Date */}
                <ThemedText style={styles.testimonyDate}>
                  {new Date(testimony.date).toLocaleDateString('ru-RU')}
                </ThemedText>

                {/* Actions */}
                <View style={styles.testimonyActions}>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <ThemedText style={styles.actionButtonText}>🙏 Молиться</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <ThemedText style={styles.actionButtonText}>❤️ Поддержать</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <ThemedText style={styles.actionButtonText}>📤 Поделиться</ThemedText>
                  </TouchableOpacity>
                </View>
              </ThemedView>
            ))
          ) : (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                Нет свидетельств в этой категории
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Info Section */}
        <ThemedView style={styles.infoSection}>
          <ThemedText type='defaultSemiBold' style={styles.infoTitle}>
            📝 Поделитесь своим свидетельством
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Если Бог совершил чудо в вашей жизни, поделитесь этим со своей общиной. Ваша история может вдохновить других!
          </ThemedText>
          <TouchableOpacity activeOpacity={0.7}>
            <ThemedView type='backgroundElement' style={styles.submitButton}>
              <ThemedText style={styles.submitButtonText}>
                Отправить свидетельство
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
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
    gap: Spacing.two,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: Spacing.four,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  categoryButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryButtonActive: {
    borderColor: 'transparent',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    fontWeight: '600',
  },
  testimoniesList: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  testimonyCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  testimonyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  testimonyHeaderLeft: {
    flexDirection: 'row',
    gap: Spacing.two,
    flex: 1,
  },
  testimonyIcon: {
    fontSize: 32,
  },
  testimonyHeaderInfo: {
    flex: 1,
  },
  testimonyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  testimonyAuthor: {
    fontSize: 12,
    opacity: 0.6,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
  testimonyContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  testimonyDate: {
    fontSize: 12,
    opacity: 0.5,
  },
  testimonyActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    backgroundColor: '#F0F0F0',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
  emptyStateText: {
    fontSize: 14,
    opacity: 0.6,
  },
  infoSection: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    marginBottom: Spacing.four,
  },
  infoTitle: {
    fontSize: 14,
    marginBottom: Spacing.two,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.three,
    opacity: 0.7,
  },
  submitButton: {
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

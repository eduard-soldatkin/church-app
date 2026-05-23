import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Audio, Video } from 'expo-av';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Spacing } from '@/constants/theme';

interface SermonPlayerProps {
  fileId: string;
  type: 'audio' | 'video';
  title: string;
  onClose?: () => void;
}

export const SermonPlayer: React.FC<SermonPlayerProps> = ({
  fileId,
  type,
  title,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoRef = type === 'video' ? React.useRef<Video>(null) : null;
  const audioRef = type === 'audio' ? React.useRef<Audio.Sound>(null) : null;

  useEffect(() => {
    if (type === 'audio') {
      loadAudio();
    }

    return () => {
      if (type === 'audio' && audioRef.current) {
        audioRef.current.unloadAsync();
      }
    };
  }, [fileId]);

  const loadAudio = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Получить URL файла из Telegram
      // const url = await getTelegramFileUrl(fileId);
      
      // Пока используем заглушку
      const url = `https://example.com/audio/${fileId}`;

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: false }
      );

      audioRef.current = sound;

      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading audio:', err);
      setError('Ошибка при загрузке аудио');
      setLoading(false);
    }
  };

  const togglePlayPause = async () => {
    try {
      if (type === 'audio' && audioRef.current) {
        if (isPlaying) {
          await audioRef.current.pauseAsync();
        } else {
          await audioRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (err) {
      console.error('Error toggling playback:', err);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (type === 'video') {
    return (
      <ThemedView style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: `https://example.com/video/${fileId}` }}
          useNativeControls
          resizeMode="contain"
          onLoad={(status) => {
            setDuration(status.durationMillis || 0);
            setLoading(false);
          }}
          onError={(err) => {
            console.error('Video error:', err);
            setError('Ошибка при загрузке видео');
          }}
        />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <ThemedText style={styles.closeButtonText}>✕</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // Audio Player
  return (
    <ThemedView style={styles.audioContainer}>
      <ThemedView style={styles.playerHeader}>
        <ThemedText type="defaultSemiBold" style={styles.playerTitle}>
          {title}
        </ThemedText>
        <TouchableOpacity onPress={onClose}>
          <ThemedText style={styles.closeIcon}>✕</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}

      {loading ? (
        <ThemedText style={styles.loadingText}>Загрузка...</ThemedText>
      ) : (
        <>
          <ThemedView style={styles.playerControls}>
            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.playButton}
              disabled={loading || error !== null}
            >
              <ThemedText style={styles.playButtonText}>
                {isPlaying ? '⏸' : '▶'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.progressContainer}>
            <ThemedText style={styles.timeText}>
              {formatTime(position)}
            </ThemedText>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${duration > 0 ? (position / duration) * 100 : 0}%`,
                  },
                ]}
              />
            </View>
            <ThemedText style={styles.timeText}>
              {formatTime(duration)}
            </ThemedText>
          </ThemedView>
        </>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  audioContainer: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    marginVertical: Spacing.two,
  },
  videoContainer: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
    marginVertical: Spacing.two,
  },
  video: {
    width: '100%',
    height: 300,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  playerTitle: {
    flex: 1,
    fontSize: 14,
  },
  closeIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 24,
    color: 'white',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#208AEF',
  },
  timeText: {
    fontSize: 12,
    opacity: 0.7,
    minWidth: 40,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
    paddingVertical: Spacing.three,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 13,
    marginBottom: Spacing.two,
  },
});

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Image,
  Alert,
  Platform
} from 'react-native';
import { CheckCircle, MapPin, Clock, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Milestone } from '@/types/challenge';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

interface CompleteMilestoneModalProps {
  milestone: Milestone | null;
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
  userDistance?: number;
}

export default function CompleteMilestoneModal({
  milestone,
  visible,
  onClose,
  onComplete,
  userDistance
}: CompleteMilestoneModalProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  if (!milestone) return null;

  const formatDistance = (distance?: number): string => {
    if (!distance) return 'Unknown distance';
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours} hours`;
  };

  const handleComplete = async () => {
    if (userDistance && userDistance > 100) {
      Alert.alert(
        'Too Far Away',
        'You need to be within 100 meters of the milestone to complete it.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsCompleting(true);
    
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setTimeout(() => {
      onComplete();
      setIsCompleting(false);
      onClose();
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    return colors.difficulty[difficulty as keyof typeof colors.difficulty] || colors.difficulty.medium;
  };

  const canComplete = !userDistance || userDistance <= 100;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.text.secondary} />
          </TouchableOpacity>

          <View style={styles.imageContainer}>
            <Image source={{ uri: milestone.image }} style={styles.image} />
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(milestone.difficulty) }]}>
              <Text style={styles.difficultyText}>{milestone.difficulty.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{milestone.name}</Text>
            <Text style={styles.description}>{milestone.description}</Text>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <MapPin size={16} color={colors.text.secondary} />
                <Text style={styles.infoText}>
                  {milestone.coordinates.latitude.toFixed(6)}, {milestone.coordinates.longitude.toFixed(6)}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Clock size={16} color={colors.text.secondary} />
                <Text style={styles.infoText}>
                  Estimated time: {formatTime(milestone.estimatedTime)}
                </Text>
              </View>

              {userDistance !== undefined && (
                <View style={styles.infoRow}>
                  <View style={[
                    styles.distanceIndicator,
                    { backgroundColor: canComplete ? colors.success : colors.warning }
                  ]} />
                  <Text style={[
                    styles.infoText,
                    { color: canComplete ? colors.success : colors.warning }
                  ]}>
                    {formatDistance(userDistance)}
                  </Text>
                </View>
              )}
            </View>

            {!canComplete && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                  You need to be within 100m of the milestone to complete it.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.completeButton,
                !canComplete && styles.disabledButton,
                isCompleting && styles.completingButton
              ]}
              onPress={handleComplete}
              disabled={!canComplete || isCompleting}
            >
              {isCompleting ? (
                <View style={styles.completingContent}>
                  <CheckCircle size={20} color={colors.text.white} />
                  <Text style={styles.completeButtonText}>Completing...</Text>
                </View>
              ) : (
                <Text style={[
                  styles.completeButtonText,
                  !canComplete && styles.disabledButtonText
                ]}>
                  Complete Milestone
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: spacing.sm,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  difficultyBadge: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  difficultyText: {
    ...typography.caption,
    color: colors.text.white,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  infoContainer: {
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    flex: 1,
  },
  distanceIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
  },
  warningContainer: {
    backgroundColor: colors.warning + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  warningText: {
    ...typography.bodySmall,
    color: colors.warning,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.text.light,
  },
  completingButton: {
    backgroundColor: colors.success,
  },
  completeButtonText: {
    ...typography.button,
    color: colors.text.white,
  },
  disabledButtonText: {
    color: colors.text.secondary,
  },
  completingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
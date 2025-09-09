import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CheckCircle, Circle, MapPin, Clock, Navigation } from 'lucide-react-native';
import { Milestone } from '@/types/challenge';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

interface MilestoneCardProps {
  milestone: Milestone;
  onPress: () => void;
  showDistance?: boolean;
}

export default function MilestoneCard({ milestone, onPress, showDistance = false }: MilestoneCardProps) {
  const formatDistance = (distance?: number): string => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    return colors.difficulty[difficulty as keyof typeof colors.difficulty] || colors.difficulty.medium;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        milestone.isCompleted && styles.completedContainer
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: milestone.image }} style={styles.image} />
        {milestone.isCompleted && (
          <View style={styles.completedOverlay}>
            <CheckCircle size={32} color={colors.success} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.statusIcon}>
              {milestone.isCompleted ? (
                <CheckCircle size={20} color={colors.success} />
              ) : (
                <Circle size={20} color={colors.text.secondary} />
              )}
            </View>
            <Text style={[
              styles.title,
              milestone.isCompleted && styles.completedTitle
            ]}>
              {milestone.name}
            </Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(milestone.difficulty) }]}>
            <Text style={styles.difficultyText}>{milestone.difficulty}</Text>
          </View>
        </View>

        <Text style={[
          styles.description,
          milestone.isCompleted && styles.completedDescription
        ]} numberOfLines={2}>
          {milestone.description}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Clock size={14} color={colors.text.secondary} />
            <Text style={styles.infoText}>{formatTime(milestone.estimatedTime)}</Text>
          </View>
          
          {showDistance && milestone.distance !== undefined && (
            <View style={styles.infoItem}>
              <Navigation size={14} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.primary }]}>
                {formatDistance(milestone.distance)}
              </Text>
            </View>
          )}
        </View>

        {milestone.isCompleted && milestone.completedAt && (
          <View style={styles.completedInfo}>
            <Text style={styles.completedText}>
              Completed on {new Date(milestone.completedAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
  },
  completedContainer: {
    opacity: 0.8,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderTopLeftRadius: borderRadius.md,
    borderBottomLeftRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  statusIcon: {
    marginRight: spacing.xs,
  },
  title: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    ...typography.caption,
    color: colors.text.white,
    fontWeight: '600',
    fontSize: 10,
  },
  description: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 11,
  },
  completedInfo: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  completedText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '500',
    fontSize: 11,
  },
});
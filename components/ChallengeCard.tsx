import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Clock, Users, Trophy } from 'lucide-react-native';
import { Challenge } from '@/types/challenge';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: () => void;
  showEnrollButton?: boolean;
  onEnroll?: () => void;
}

export default function ChallengeCard({ 
  challenge, 
  onPress, 
  showEnrollButton = false, 
  onEnroll 
}: ChallengeCardProps) {
  const progressPercentage = challenge.totalMilestones > 0 
    ? (challenge.completedMilestones / challenge.totalMilestones) * 100 
    : 0;

  const getDifficultyColor = (difficulty: string) => {
    return colors.difficulty[difficulty as keyof typeof colors.difficulty] || colors.difficulty.medium;
  };

  const getCategoryColor = (category: string) => {
    return colors.category[category as keyof typeof colors.category] || colors.primary;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: challenge.image }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />
        <View style={styles.imageContent}>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
              <Text style={styles.badgeText}>{challenge.difficulty.toUpperCase()}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: getCategoryColor(challenge.category) }]}>
              <Text style={styles.badgeText}>{challenge.category.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {challenge.description}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MapPin size={16} color={colors.text.secondary} />
            <Text style={styles.infoText}>{challenge.location}</Text>
          </View>
          <View style={styles.infoItem}>
            <Clock size={16} color={colors.text.secondary} />
            <Text style={styles.infoText}>{challenge.duration}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Users size={16} color={colors.text.secondary} />
            <Text style={styles.infoText}>{challenge.participants} participants</Text>
          </View>
          {challenge.reward && (
            <View style={styles.infoItem}>
              <Trophy size={16} color={colors.accent} />
              <Text style={[styles.infoText, { color: colors.accent }]}>Reward</Text>
            </View>
          )}
        </View>

        {challenge.isEnrolled && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                Progress: {challenge.completedMilestones}/{challenge.totalMilestones}
              </Text>
              <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
          </View>
        )}

        {showEnrollButton && onEnroll && (
          <TouchableOpacity style={styles.enrollButton} onPress={onEnroll}>
            <Text style={styles.enrollButtonText}>Enroll Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  imageContent: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.caption,
    color: colors.text.white,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  progressContainer: {
    marginTop: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressText: {
    ...typography.bodySmall,
    color: colors.text.primary,
    fontWeight: '600',
  },
  progressPercentage: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  enrollButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  enrollButtonText: {
    ...typography.button,
    color: colors.text.white,
  },
});
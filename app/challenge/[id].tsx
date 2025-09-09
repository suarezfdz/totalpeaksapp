import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Trophy,
  Map,
  CheckCircle,
  Circle
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChallenges } from '@/hooks/challenge-store';
import { useLocation } from '@/hooks/location-store';
import MilestoneCard from '@/components/MilestoneCard';
import CompleteMilestoneModal from '@/components/CompleteMilestoneModal';
import { Milestone } from '@/types/challenge';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getChallengeWithDistances, getSortedMilestones, completeMilestone } = useChallenges();
  const { location } = useLocation();
  const insets = useSafeAreaInsets();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const challenge = getChallengeWithDistances(id!);
  const { completed, pending } = getSortedMilestones(id!);

  if (!challenge) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Challenge not found</Text>
      </View>
    );
  }

  const progressPercentage = challenge.totalMilestones > 0 
    ? (challenge.completedMilestones / challenge.totalMilestones) * 100 
    : 0;

  const handleMilestonePress = (milestone: Milestone) => {
    if (milestone.isCompleted) {
      setSelectedMilestone(milestone);
      setShowMilestoneModal(true);
    } else {
      setSelectedMilestone(milestone);
      setShowCompleteModal(true);
    }
  };

  const handleCompleteMilestone = () => {
    if (selectedMilestone) {
      completeMilestone(challenge.id, selectedMilestone.id);
      setShowCompleteModal(false);
      setShowSuccessModal(true);
    }
  };

  const closeModals = () => {
    setShowCompleteModal(false);
    setShowMilestoneModal(false);
    setShowSuccessModal(false);
    setSelectedMilestone(null);
  };

  const handleMapPress = () => {
    router.push(`/challenge/${id}/map`);
  };

  const getDifficultyColor = (difficulty: string) => {
    return colors.difficulty[difficulty as keyof typeof colors.difficulty] || colors.difficulty.medium;
  };

  const getCategoryColor = (category: string) => {
    return colors.category[category as keyof typeof colors.category] || colors.primary;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: challenge.image }} style={styles.heroImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text.white} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mapButton}
            onPress={handleMapPress}
          >
            <Map size={20} color={colors.text.white} />
            <Text style={styles.mapButtonText}>Map View</Text>
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
                <Text style={styles.badgeText}>{challenge.difficulty.toUpperCase()}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getCategoryColor(challenge.category) }]}>
                <Text style={styles.badgeText}>{challenge.category.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>{challenge.title}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{challenge.description}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <MapPin size={20} color={colors.text.secondary} />
              <Text style={styles.infoText}>{challenge.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Clock size={20} color={colors.text.secondary} />
              <Text style={styles.infoText}>{challenge.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Users size={20} color={colors.text.secondary} />
              <Text style={styles.infoText}>{challenge.participants} participants</Text>
            </View>
            {challenge.reward && (
              <View style={styles.infoItem}>
                <Trophy size={20} color={colors.accent} />
                <Text style={[styles.infoText, { color: colors.accent }]}>{challenge.reward}</Text>
              </View>
            )}
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Challenge Progress</Text>
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
            <Text style={styles.progressText}>
              {challenge.completedMilestones} of {challenge.totalMilestones} milestones completed
            </Text>
          </View>

          {pending.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Circle size={20} color={colors.text.secondary} />
                <Text style={styles.sectionTitle}>Pending Milestones</Text>
                <Text style={styles.sectionCount}>({pending.length})</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Sorted by distance from your current location
              </Text>
              {pending.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onPress={() => handleMilestonePress(milestone)}
                  showDistance={!!location}
                />
              ))}
            </View>
          )}

          {completed.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <CheckCircle size={20} color={colors.success} />
                <Text style={styles.sectionTitle}>Completed Milestones</Text>
                <Text style={styles.sectionCount}>({completed.length})</Text>
              </View>
              {completed.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onPress={() => handleMilestonePress(milestone)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <CompleteMilestoneModal
        milestone={selectedMilestone}
        visible={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          setSelectedMilestone(null);
        }}
        onComplete={handleCompleteMilestone}
        userDistance={selectedMilestone?.distance}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: spacing.sm,
  },
  mapButton: {
    position: 'absolute',
    top: 50,
    right: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  mapButtonText: {
    ...typography.bodySmall,
    color: colors.text.white,
    fontWeight: '600',
  },
  heroContent: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.caption,
    color: colors.text.white,
    fontWeight: '600',
  },
  heroTitle: {
    ...typography.h1,
    color: colors.text.white,
    fontWeight: '700',
  },
  content: {
    padding: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  infoGrid: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  progressSection: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
  },
  progressPercentage: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  sectionCount: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    marginLeft: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
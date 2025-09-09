import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Target, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChallenges } from '@/hooks/challenge-store';
import { mockUser } from '@/mocks/challenges';
import ChallengeCard from '@/components/ChallengeCard';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

export default function MyChallengesScreen() {
  const { enrolledChallenges, isLoading } = useChallenges();
  const insets = useSafeAreaInsets();

  const handleChallengePress = (challengeId: string) => {
    router.push(`/challenge/${challengeId}`);
  };



  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.welcomeCard}
      >
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>Welcome back, {mockUser.name}!</Text>
          <Text style={styles.welcomeSubtitle}>Ready for your next adventure?</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Trophy size={20} color={colors.text.white} />
            <Text style={styles.statNumber}>{mockUser.totalChallengesCompleted}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Target size={20} color={colors.text.white} />
            <Text style={styles.statNumber}>{mockUser.totalMilestonesCompleted}</Text>
            <Text style={styles.statLabel}>Milestones</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Active Challenges</Text>
        <Text style={styles.sectionSubtitle}>
          {enrolledChallenges.length} challenge{enrolledChallenges.length !== 1 ? 's' : ''} in progress
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MapPin size={64} color={colors.text.light} />
      <Text style={styles.emptyTitle}>No Active Challenges</Text>
      <Text style={styles.emptySubtitle}>
        Explore new challenges to start your outdoor adventure!
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => router.push('/(tabs)/explore')}
      >
        <Text style={styles.exploreButtonText}>Explore Challenges</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={enrolledChallenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChallengeCard
            challenge={item}
            onPress={() => handleChallengePress(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.md,
  },
  welcomeCard: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  welcomeContent: {
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    ...typography.h2,
    color: colors.text.white,
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    ...typography.body,
    color: colors.text.white,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  statNumber: {
    ...typography.h2,
    color: colors.text.white,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.white,
    opacity: 0.9,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  exploreButtonText: {
    ...typography.button,
    color: colors.text.white,
  },
});
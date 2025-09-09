import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Trophy, 
  Target, 
  MapPin, 
  Calendar,
  Award,
  Mountain,
  Settings
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockUser } from '@/mocks/challenges';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  
  const achievements = [
    { id: '1', title: 'First Steps', description: 'Complete your first milestone', icon: Target, earned: true },
    { id: '2', title: 'Summit Seeker', description: 'Complete a hard difficulty challenge', icon: Mountain, earned: true },
    { id: '3', title: 'Explorer', description: 'Complete 5 different challenges', icon: MapPin, earned: true },
    { id: '4', title: 'Adventurer', description: 'Complete 10 challenges', icon: Trophy, earned: true },
    { id: '5', title: 'Legend', description: 'Complete 25 challenges', icon: Award, earned: false },
  ];

  const stats = [
    { id: 'challenges', label: 'Challenges Completed', value: mockUser.totalChallengesCompleted, icon: Trophy },
    { id: 'milestones', label: 'Milestones Reached', value: mockUser.totalMilestonesCompleted, icon: Target },
    { id: 'days', label: 'Days Active', value: 45, icon: Calendar },
    { id: 'distance', label: 'Distance Covered', value: '234 km', icon: MapPin },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.headerGradient}
        >
          <View style={styles.profileHeader}>
            <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{mockUser.name}</Text>
            <Text style={styles.title}>Outdoor Enthusiast</Text>
            
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={20} color={colors.text.white} />
              <Text style={styles.settingsText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <View key={stat.id} style={styles.statCard}>
                  <stat.icon size={24} color={colors.primary} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsContainer}>
              {achievements.map((achievement) => (
                <View 
                  key={achievement.id} 
                  style={[
                    styles.achievementCard,
                    !achievement.earned && styles.achievementCardLocked
                  ]}
                >
                  <View style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.earned ? colors.primary : colors.text.light }
                  ]}>
                    <achievement.icon 
                      size={20} 
                      color={achievement.earned ? colors.text.white : colors.text.secondary} 
                    />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={[
                      styles.achievementTitle,
                      !achievement.earned && styles.achievementTitleLocked
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={[
                      styles.achievementDescription,
                      !achievement.earned && styles.achievementDescriptionLocked
                    ]}>
                      {achievement.description}
                    </Text>
                  </View>
                  {achievement.earned && (
                    <View style={styles.earnedBadge}>
                      <Trophy size={16} color={colors.accent} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
    borderWidth: 4,
    borderColor: colors.text.white,
  },
  name: {
    ...typography.h2,
    color: colors.text.white,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.body,
    color: colors.text.white,
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  settingsText: {
    ...typography.button,
    color: colors.text.white,
  },
  content: {
    flex: 1,
    marginTop: -spacing.xl,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  achievementsContainer: {
    gap: spacing.md,
  },
  achievementCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  achievementTitleLocked: {
    color: colors.text.secondary,
  },
  achievementDescription: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  achievementDescriptionLocked: {
    color: colors.text.light,
  },
  earnedBadge: {
    marginLeft: spacing.sm,
  },
});
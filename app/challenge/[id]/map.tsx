import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, MapPin, CheckCircle, Circle, Navigation } from 'lucide-react-native';
import { useChallenges } from '@/hooks/challenge-store';
import { useLocation } from '@/hooks/location-store';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

export default function ChallengeMapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getChallengeWithDistances } = useChallenges();
  const { location } = useLocation();

  const challenge = getChallengeWithDistances(id!);

  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Challenge not found</Text>
      </SafeAreaView>
    );
  }

  const formatDistance = (distance?: number): string => {
    if (!distance) return 'Unknown distance';
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const getDifficultyColor = (difficulty: string) => {
    return colors.difficulty[difficulty as keyof typeof colors.difficulty] || colors.difficulty.medium;
  };

  const handleMilestonePress = (milestone: any) => {
    Alert.alert(
      milestone.name,
      `${milestone.description}\n\nCoordinates: ${milestone.coordinates.latitude.toFixed(6)}, ${milestone.coordinates.longitude.toFixed(6)}${
        milestone.distance ? `\nDistance: ${formatDistance(milestone.distance)}` : ''
      }`,
      [
        { text: 'OK' },
        {
          text: 'Navigate',
          onPress: () => {
            // In a real app, this would open the device's navigation app
            Alert.alert('Navigation', 'This would open your navigation app to guide you to the milestone.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Challenge Map</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.mapPlaceholder}>
        <MapPin size={64} color={colors.text.light} />
        <Text style={styles.mapPlaceholderTitle}>Interactive Map</Text>
        <Text style={styles.mapPlaceholderText}>
          In a real app, this would show an interactive map with all milestone locations.
          For now, see the milestone list below.
        </Text>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Map Legend</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <CheckCircle size={16} color={colors.success} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <Circle size={16} color={colors.text.secondary} />
            <Text style={styles.legendText}>Pending</Text>
          </View>
          {location && (
            <View style={styles.legendItem}>
              <Navigation size={16} color={colors.primary} />
              <Text style={styles.legendText}>Your Location</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.milestonesList} showsVerticalScrollIndicator={false}>
        <Text style={styles.milestonesTitle}>All Milestones</Text>
        {challenge.milestones.map((milestone, index) => (
          <TouchableOpacity
            key={milestone.id}
            style={styles.milestoneItem}
            onPress={() => handleMilestonePress(milestone)}
          >
            <View style={styles.milestoneNumber}>
              <Text style={styles.milestoneNumberText}>{index + 1}</Text>
            </View>
            
            <View style={styles.milestoneContent}>
              <View style={styles.milestoneHeader}>
                <Text style={[
                  styles.milestoneName,
                  milestone.isCompleted && styles.completedText
                ]}>
                  {milestone.name}
                </Text>
                <View style={styles.milestoneStatus}>
                  {milestone.isCompleted ? (
                    <CheckCircle size={20} color={colors.success} />
                  ) : (
                    <Circle size={20} color={colors.text.secondary} />
                  )}
                </View>
              </View>
              
              <Text style={styles.milestoneCoords}>
                {milestone.coordinates.latitude.toFixed(6)}, {milestone.coordinates.longitude.toFixed(6)}
              </Text>
              
              <View style={styles.milestoneInfo}>
                <View style={[
                  styles.difficultyBadge, 
                  { backgroundColor: getDifficultyColor(milestone.difficulty) }
                ]}>
                  <Text style={styles.difficultyText}>{milestone.difficulty}</Text>
                </View>
                
                {milestone.distance !== undefined && (
                  <View style={styles.distanceInfo}>
                    <Navigation size={14} color={colors.primary} />
                    <Text style={styles.distanceText}>
                      {formatDistance(milestone.distance)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
  },
  mapPlaceholderTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  mapPlaceholderText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  legendContainer: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  legendTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  milestonesList: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  milestonesTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  milestoneItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  milestoneNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  milestoneNumberText: {
    ...typography.bodySmall,
    color: colors.text.white,
    fontWeight: '600',
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  milestoneName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  milestoneStatus: {
    marginLeft: spacing.sm,
  },
  milestoneCoords: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  milestoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    ...typography.caption,
    color: colors.text.white,
    fontWeight: '600',
    fontSize: 10,
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  distanceText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
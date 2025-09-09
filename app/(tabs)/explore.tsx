import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Compass, Search, CheckCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChallenges } from '@/hooks/challenge-store';
import ChallengeCard from '@/components/ChallengeCard';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

export default function ExploreScreen() {
  const { availableChallenges, enrollInChallenge, isLoading } = useChallenges();
  const insets = useSafeAreaInsets();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleEnroll = (challengeId: string) => {
    setSelectedChallengeId(challengeId);
    setShowEnrollModal(true);
  };

  const confirmEnroll = () => {
    if (selectedChallengeId) {
      enrollInChallenge(selectedChallengeId);
      setShowEnrollModal(false);
      setShowSuccessModal(true);
    }
  };

  const closeModals = () => {
    setShowEnrollModal(false);
    setShowSuccessModal(false);
    setSelectedChallengeId(null);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={[colors.secondary, colors.accent]}
        style={styles.heroCard}
      >
        <View style={styles.heroContent}>
          <Compass size={48} color={colors.text.white} />
          <Text style={styles.heroTitle}>Discover New Adventures</Text>
          <Text style={styles.heroSubtitle}>
            Find exciting outdoor challenges that match your skill level and interests
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Challenges</Text>
        <Text style={styles.sectionSubtitle}>
          {availableChallenges.length} challenge{availableChallenges.length !== 1 ? 's' : ''} waiting for you
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Search size={64} color={colors.text.light} />
      <Text style={styles.emptyTitle}>No Challenges Available</Text>
      <Text style={styles.emptySubtitle}>
        Check back later for new outdoor adventures!
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={availableChallenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChallengeCard
            challenge={item}
            onPress={() => {}}
            showEnrollButton={true}
            onEnroll={() => handleEnroll(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      <Modal
        visible={showEnrollModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModals}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enroll in Challenge</Text>
            <Text style={styles.modalText}>Are you ready to start this outdoor adventure?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModals}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.enrollButton} onPress={confirmEnroll}>
                <Text style={styles.enrollButtonText}>Enroll</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModals}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CheckCircle size={48} color={colors.success} />
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalText}>You have been enrolled in the challenge. Check your active challenges to start!</Text>
            <TouchableOpacity style={styles.successButton} onPress={closeModals}>
              <Text style={styles.successButtonText}>Great!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  heroCard: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.text.white,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.text.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 280,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  enrollButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  enrollButtonText: {
    ...typography.button,
    color: colors.text.white,
    textAlign: 'center',
  },
  successButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    backgroundColor: colors.success,
  },
  successButtonText: {
    ...typography.button,
    color: colors.text.white,
    textAlign: 'center',
  },
});
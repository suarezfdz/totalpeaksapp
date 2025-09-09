import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Challenge, Milestone } from '@/types/challenge';
import { mockChallenges, mockAvailableChallenges } from '@/mocks/challenges';
import { useLocation } from './location-store';

const STORAGE_KEY = 'totalpeaks_challenges';

export const [ChallengeProvider, useChallenges] = createContextHook(() => {
  const [enrolledChallenges, setEnrolledChallenges] = useState<Challenge[]>([]);
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { location, calculateDistance } = useLocation();

  const loadChallenges = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setEnrolledChallenges(data.enrolled || mockChallenges);
        setAvailableChallenges(data.available || mockAvailableChallenges);
      } else {
        setEnrolledChallenges(mockChallenges);
        setAvailableChallenges(mockAvailableChallenges);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
      setEnrolledChallenges(mockChallenges);
      setAvailableChallenges(mockAvailableChallenges);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChallenges = async (enrolled: Challenge[], available: Challenge[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        enrolled,
        available,
      }));
    } catch (error) {
      console.error('Error saving challenges:', error);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const enrollInChallenge = (challengeId: string) => {
    const challenge = availableChallenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const updatedChallenge = { ...challenge, isEnrolled: true };
    const newEnrolled = [...enrolledChallenges, updatedChallenge];
    const newAvailable = availableChallenges.filter(c => c.id !== challengeId);

    setEnrolledChallenges(newEnrolled);
    setAvailableChallenges(newAvailable);
    saveChallenges(newEnrolled, newAvailable);
  };

  const completeMilestone = (challengeId: string, milestoneId: string) => {
    const updatedChallenges = enrolledChallenges.map(challenge => {
      if (challenge.id === challengeId) {
        const updatedMilestones = challenge.milestones.map(milestone => {
          if (milestone.id === milestoneId && !milestone.isCompleted) {
            return {
              ...milestone,
              isCompleted: true,
              completedAt: new Date().toISOString(),
            };
          }
          return milestone;
        });

        const completedCount = updatedMilestones.filter(m => m.isCompleted).length;

        return {
          ...challenge,
          milestones: updatedMilestones,
          completedMilestones: completedCount,
        };
      }
      return challenge;
    });

    setEnrolledChallenges(updatedChallenges);
    saveChallenges(updatedChallenges, availableChallenges);
  };

  const getChallengeWithDistances = (challengeId: string): Challenge | undefined => {
    const challenge = enrolledChallenges.find(c => c.id === challengeId);
    if (!challenge || !location) return challenge;

    const milestonesWithDistance = challenge.milestones.map(milestone => ({
      ...milestone,
      distance: calculateDistance(
        location.latitude,
        location.longitude,
        milestone.coordinates.latitude,
        milestone.coordinates.longitude
      ),
    }));

    return {
      ...challenge,
      milestones: milestonesWithDistance,
    };
  };

  const getSortedMilestones = (challengeId: string): { completed: Milestone[], pending: Milestone[] } => {
    const challenge = getChallengeWithDistances(challengeId);
    if (!challenge) return { completed: [], pending: [] };

    const completed = challenge.milestones.filter(m => m.isCompleted);
    const pending = challenge.milestones
      .filter(m => !m.isCompleted)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));

    return { completed, pending };
  };

  return {
    enrolledChallenges,
    availableChallenges,
    isLoading,
    enrollInChallenge,
    completeMilestone,
    getChallengeWithDistances,
    getSortedMilestones,
  };
});
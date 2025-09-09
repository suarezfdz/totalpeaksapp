import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { UserLocation } from '@/types/challenge';

export const [LocationProvider, useLocation] = createContextHook(() => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setIsLoading(false);
        return false;
      }
      return true;
    } catch (err) {
      setError('Failed to request location permission');
      setIsLoading(false);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy || undefined,
      });
      setError(null);
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Failed to get current location');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    calculateDistance,
  };
});
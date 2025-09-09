export interface User {
    id: string;
    name: string;
    avatar: string;
    totalChallengesCompleted: number;
    totalMilestonesCompleted: number;
  }
  
  export interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  export interface Milestone {
    id: string;
    name: string;
    description: string;
    coordinates: Coordinates;
    isCompleted: boolean;
    completedAt?: string;
    qrCode?: string;
    image: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number; // minutes
    distance?: number; // meters from user location
  }
  
  export interface Challenge {
    id: string;
    title: string;
    description: string;
    image: string;
    difficulty: 'easy' | 'medium' | 'hard';
    duration: string;
    location: string;
    totalMilestones: number;
    completedMilestones: number;
    isEnrolled: boolean;
    category: 'hiking' | 'cycling' | 'running' | 'climbing' | 'adventure';
    milestones: Milestone[];
    startDate: string;
    endDate: string;
    participants: number;
    reward?: string;
  }
  
  export interface UserLocation {
    latitude: number;
    longitude: number;
    accuracy?: number;
  }
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  avatar: string;
  photos: string[];
  bio: string;
  location: string;
  distance: number;
  occupation: string;
  interests: string[];
  verified: boolean;
  online: boolean;
  vip: boolean;
  lastActive: string;
}

export interface Match {
  id: string;
  user: UserProfile;
  matchedAt: string;
  lastMessage?: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'gift';
}

export interface Gift {
  id: string;
  name: string;
  emoji: string;
  price: number;
}

export type PageType = 'discover' | 'matches' | 'chat' | 'profile' | 'premium' | 'conversation' | 'user-detail' | 'deploy-guide' | 'pwa-guide';

export type VibeTag =
  | 'house'
  | 'hip-hop'
  | 'R&B'
  | 'techno'
  | 'indie'
  | 'reggaeton'
  | 'afrobeats'
  | 'top 40'
  | 'drill'
  | 'amapiano'

export const ALL_VIBES: VibeTag[] = [
  'house',
  'hip-hop',
  'R&B',
  'techno',
  'indie',
  'reggaeton',
  'afrobeats',
  'top 40',
  'drill',
  'amapiano',
]

export interface User {
  id: string
  username: string
  avatarUrl: string
  vibeTags: VibeTag[]
  homeNeighborhood: string
  isPublic: boolean
}

export interface Venue {
  id: string
  name: string
  address: string
  neighborhood: string
  borough: string
  lat: number
  lng: number
  vibeTags: VibeTag[]
  priceLevel: 1 | 2 | 3
  openNow: boolean
  crowdScore: number // 0..100 live busyness
  rating: number // 0..5
  matchScore: number // 0..100 vibe match for current user
  distanceMi: number
}

export interface Checkin {
  id: string
  userId: string
  venueId: string
  checkedInAt: string
  isLive: boolean
  nightDate: string
  rated: boolean
}

export type RatingAttribute =
  | 'music'
  | 'crowd'
  | 'energy'
  | 'price'
  | 'vibe'
  | 'late-night'
  | 'intimate'
  | 'chill'
  | 'rowdy'

export const ALL_ATTRIBUTES: RatingAttribute[] = [
  'music',
  'crowd',
  'energy',
  'price',
  'vibe',
  'late-night',
  'intimate',
  'chill',
  'rowdy',
]

export interface Rating {
  id: string
  userId: string
  venueId: string
  checkinId: string
  wouldReturn: boolean
  attributes: RatingAttribute[]
  note: string
  createdAt: string
}

export type LeaderboardMetric = 'barsPerNight' | 'streak' | 'uniqueSpots' | 'hoods'

export interface LeaderboardEntry {
  user: User
  rank: number
  stats: Record<LeaderboardMetric, number>
  isYou: boolean
}

export interface CityLeaderboardEntry {
  rank: number
  neighborhood: string
  nights: number
  isYou: boolean
}

export type BadgeType =
  | 'bar-crawl-king'
  | 'night-owl'
  | 'borough-hopper'
  | 'regular'
  | 'trendsetter'
  | 'crew-leader'
  | 'streak-master'
  | 'vibe-curator'
  | 'explorer'
  | 'summer-legend'

export interface BadgeDef {
  type: BadgeType
  name: string
  description: string
  target: number
}

export interface BadgeState {
  def: BadgeDef
  unlocked: boolean
  unlockedAt: string | null
  progress: number // 0..target
}

export interface ProfileStats {
  totalNights: number
  uniqueVenues: number
  neighborhoods: number
  longestStreak: number
  friendsCount: number
  topVenueIds: string[]
  vibeBreakdown: { vibe: string; count: number }[]
  /** day index (0 = oldest of 105 days) -> checkin count */
  activityByDay: number[]
}

export interface GroupNight {
  id: string
  name: string
  venueId: string | null
  memberIds: string[]
  nightDate: string
}

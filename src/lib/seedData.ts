import type {
  BadgeDef,
  BadgeState,
  Checkin,
  CityLeaderboardEntry,
  LeaderboardEntry,
  ProfileStats,
  Rating,
  RatingAttribute,
  User,
  Venue,
} from '@/types'

const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`

export const CURRENT_USER: User = {
  id: 'u-you',
  username: 'prabhav',
  avatarUrl: avatar('prabhav'),
  vibeTags: ['techno', 'house', 'hip-hop'],
  homeNeighborhood: 'Williamsburg',
  isPublic: true,
}

export const SEED_USERS: User[] = [
  { id: 'u-maya', username: 'maya.k', avatarUrl: avatar('maya'), vibeTags: ['house', 'afrobeats'], homeNeighborhood: 'LES', isPublic: true },
  { id: 'u-dev', username: 'dev_p', avatarUrl: avatar('dev'), vibeTags: ['techno', 'drill'], homeNeighborhood: 'Bushwick', isPublic: true },
  { id: 'u-sof', username: 'sofia', avatarUrl: avatar('sofia'), vibeTags: ['reggaeton', 'top 40'], homeNeighborhood: 'Astoria', isPublic: true },
  { id: 'u-jordan', username: 'jrdn', avatarUrl: avatar('jordan'), vibeTags: ['hip-hop', 'R&B'], homeNeighborhood: 'Crown Heights', isPublic: true },
  { id: 'u-lena', username: 'lena.w', avatarUrl: avatar('lena'), vibeTags: ['indie', 'house'], homeNeighborhood: 'West Village', isPublic: true },
  { id: 'u-theo', username: 'theo', avatarUrl: avatar('theo'), vibeTags: ['techno', 'amapiano'], homeNeighborhood: 'Williamsburg', isPublic: true },
  { id: 'u-nia', username: 'nia.b', avatarUrl: avatar('nia'), vibeTags: ['afrobeats', 'amapiano'], homeNeighborhood: 'Chelsea', isPublic: true },
  { id: 'u-marc', username: 'marcus', avatarUrl: avatar('marcus'), vibeTags: ['hip-hop', 'drill'], homeNeighborhood: 'Midtown', isPublic: false },
]

export const SEED_VENUES: Venue[] = [
  { id: 'v-mehanata', name: 'Mehanata', address: '113 Ludlow St', neighborhood: 'LES', borough: 'Manhattan', lat: 40.7196, lng: -73.9883, vibeTags: ['top 40', 'reggaeton'], priceLevel: 2, openNow: true, crowdScore: 88, rating: 4.2, matchScore: 71, distanceMi: 2.1 },
  { id: 'v-pianos', name: 'Pianos', address: '158 Ludlow St', neighborhood: 'LES', borough: 'Manhattan', lat: 40.7218, lng: -73.9874, vibeTags: ['indie', 'hip-hop'], priceLevel: 2, openNow: true, crowdScore: 74, rating: 4.0, matchScore: 78, distanceMi: 2.2 },
  { id: 'v-lebain', name: 'Le Bain', address: '848 Washington St', neighborhood: 'West Village', borough: 'Manhattan', lat: 40.7409, lng: -74.008, vibeTags: ['house', 'top 40'], priceLevel: 3, openNow: true, crowdScore: 92, rating: 4.4, matchScore: 84, distanceMi: 3.4 },
  { id: 'v-littlebranch', name: 'Little Branch', address: '20 7th Ave S', neighborhood: 'West Village', borough: 'Manhattan', lat: 40.7313, lng: -74.0036, vibeTags: ['R&B', 'indie'], priceLevel: 2, openNow: true, crowdScore: 41, rating: 4.6, matchScore: 62, distanceMi: 3.1 },
  { id: 'v-output', name: 'Superior Ingredients', address: '74 Wythe Ave', neighborhood: 'Williamsburg', borough: 'Brooklyn', lat: 40.7221, lng: -73.9587, vibeTags: ['techno', 'house'], priceLevel: 2, openNow: true, crowdScore: 95, rating: 4.7, matchScore: 96, distanceMi: 0.4 },
  { id: 'v-schimanski', name: 'Black Flamingo', address: '168 Borinquen Pl', neighborhood: 'Williamsburg', borough: 'Brooklyn', lat: 40.7106, lng: -73.9536, vibeTags: ['house', 'amapiano'], priceLevel: 2, openNow: true, crowdScore: 67, rating: 4.3, matchScore: 88, distanceMi: 0.9 },
  { id: 'v-tba', name: 'TBA Brooklyn', address: '395 Wythe Ave', neighborhood: 'Williamsburg', borough: 'Brooklyn', lat: 40.7128, lng: -73.9658, vibeTags: ['techno', 'indie'], priceLevel: 1, openNow: true, crowdScore: 58, rating: 4.1, matchScore: 90, distanceMi: 0.6 },
  { id: 'v-basement', name: 'Basement', address: '52-19 Flushing Ave', neighborhood: 'Bushwick', borough: 'Brooklyn', lat: 40.7146, lng: -73.9235, vibeTags: ['techno'], priceLevel: 2, openNow: true, crowdScore: 90, rating: 4.8, matchScore: 94, distanceMi: 2.4 },
  { id: 'v-houseofyes', name: 'House of Yes', address: '2 Wyckoff Ave', neighborhood: 'Bushwick', borough: 'Brooklyn', lat: 40.7066, lng: -73.9237, vibeTags: ['house', 'top 40'], priceLevel: 2, openNow: true, crowdScore: 82, rating: 4.5, matchScore: 80, distanceMi: 2.7 },
  { id: 'v-elsewhere', name: 'Elsewhere', address: '599 Johnson Ave', neighborhood: 'Bushwick', borough: 'Brooklyn', lat: 40.7093, lng: -73.9304, vibeTags: ['indie', 'techno'], priceLevel: 2, openNow: true, crowdScore: 76, rating: 4.4, matchScore: 86, distanceMi: 2.2 },
  { id: 'v-gallow', name: 'Gallow Green', address: '542 W 27th St', neighborhood: 'Chelsea', borough: 'Manhattan', lat: 40.7503, lng: -74.0028, vibeTags: ['indie', 'R&B'], priceLevel: 3, openNow: false, crowdScore: 12, rating: 4.3, matchScore: 55, distanceMi: 3.8 },
  { id: 'v-marquee', name: 'Marquee', address: '289 10th Ave', neighborhood: 'Chelsea', borough: 'Manhattan', lat: 40.7507, lng: -74.0027, vibeTags: ['top 40', 'hip-hop'], priceLevel: 3, openNow: true, crowdScore: 71, rating: 3.9, matchScore: 64, distanceMi: 3.8 },
  { id: 'v-230fifth', name: '230 Fifth', address: '230 5th Ave', neighborhood: 'Midtown', borough: 'Manhattan', lat: 40.7440, lng: -73.9889, vibeTags: ['top 40'], priceLevel: 3, openNow: true, crowdScore: 49, rating: 3.7, matchScore: 48, distanceMi: 3.3 },
  { id: 'v-bohemian', name: 'Bohemian Hall', address: '29-19 24th Ave', neighborhood: 'Astoria', borough: 'Queens', lat: 40.7745, lng: -73.9181, vibeTags: ['indie', 'top 40'], priceLevel: 1, openNow: true, crowdScore: 55, rating: 4.2, matchScore: 58, distanceMi: 4.6 },
  { id: 'v-friends', name: 'Friends and Lovers', address: '641 Classon Ave', neighborhood: 'Crown Heights', borough: 'Brooklyn', lat: 40.6764, lng: -73.9602, vibeTags: ['hip-hop', 'afrobeats'], priceLevel: 1, openNow: true, crowdScore: 63, rating: 4.5, matchScore: 75, distanceMi: 3.0 },
]

/** Deterministic pseudo-random so the UI is stable across reloads. */
const rand = (() => {
  let s = 42
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
})()

function generateCheckins(): Checkin[] {
  const checkins: Checkin[] = []
  const allUsers = [CURRENT_USER, ...SEED_USERS]
  const now = new Date()
  let i = 0
  while (checkins.length < 40) {
    const daysAgo = Math.floor(rand() * 90)
    const d = new Date(now)
    d.setDate(d.getDate() - daysAgo)
    const dow = d.getDay()
    // weight toward Fri (5) / Sat (6)
    if (dow !== 5 && dow !== 6 && rand() > 0.3) continue
    const user = allUsers[Math.floor(rand() * allUsers.length)]!
    const venue = SEED_VENUES[Math.floor(rand() * SEED_VENUES.length)]!
    const isoDate = d.toISOString().slice(0, 10)
    checkins.push({
      id: `c-${i++}`,
      userId: user.id,
      venueId: venue.id,
      checkedInAt: new Date(d.setHours(22 + Math.floor(rand() * 4), Math.floor(rand() * 60))).toISOString(),
      isLive: daysAgo === 0,
      nightDate: isoDate,
      rated: daysAgo > 1 || rand() > 0.5,
    })
  }
  return checkins
}

export const SEED_CHECKINS: Checkin[] = generateCheckins()

/** Friends currently out tonight (live), mapped to venues for the map. */
export const LIVE_FRIEND_CHECKINS: { userId: string; venueId: string }[] = [
  { userId: 'u-maya', venueId: 'v-output' },
  { userId: 'u-dev', venueId: 'v-basement' },
  { userId: 'u-theo', venueId: 'v-output' },
  { userId: 'u-jordan', venueId: 'v-friends' },
  { userId: 'u-sof', venueId: 'v-mehanata' },
  { userId: 'u-nia', venueId: 'v-houseofyes' },
]

const attrPool: RatingAttribute[][] = [
  ['music', 'energy', 'late-night'],
  ['crowd', 'vibe'],
  ['intimate', 'chill'],
  ['rowdy', 'energy', 'music'],
  ['price', 'chill'],
  ['vibe', 'late-night', 'crowd'],
]

export const SEED_RATINGS: Rating[] = SEED_CHECKINS.filter((c) => c.rated)
  .slice(0, 24)
  .map((c, i) => ({
    id: `r-${i}`,
    userId: c.userId,
    venueId: c.venueId,
    checkinId: c.id,
    wouldReturn: i % 4 !== 0,
    attributes: attrPool[i % attrPool.length]!,
    note: i % 3 === 0 ? 'Unreal night. Sound system goes crazy.' : '',
    createdAt: c.checkedInAt,
  }))

export const LEADERBOARD: LeaderboardEntry[] = [
  { user: SEED_USERS[1]!, rank: 1, stats: { barsPerNight: 3.4, streak: 6, uniqueSpots: 22, hoods: 9 }, isYou: false },
  { user: CURRENT_USER, rank: 2, stats: { barsPerNight: 3.1, streak: 5, uniqueSpots: 18, hoods: 7 }, isYou: true },
  { user: SEED_USERS[0]!, rank: 3, stats: { barsPerNight: 2.8, streak: 4, uniqueSpots: 19, hoods: 6 }, isYou: false },
  { user: SEED_USERS[5]!, rank: 4, stats: { barsPerNight: 2.5, streak: 7, uniqueSpots: 14, hoods: 5 }, isYou: false },
  { user: SEED_USERS[3]!, rank: 5, stats: { barsPerNight: 2.2, streak: 2, uniqueSpots: 16, hoods: 6 }, isYou: false },
  { user: SEED_USERS[4]!, rank: 6, stats: { barsPerNight: 1.9, streak: 3, uniqueSpots: 11, hoods: 4 }, isYou: false },
  { user: SEED_USERS[2]!, rank: 7, stats: { barsPerNight: 1.7, streak: 1, uniqueSpots: 9, hoods: 3 }, isYou: false },
  { user: SEED_USERS[6]!, rank: 8, stats: { barsPerNight: 1.4, streak: 2, uniqueSpots: 8, hoods: 4 }, isYou: false },
]

export const CITY_LEADERBOARD: CityLeaderboardEntry[] = [
  { rank: 1, neighborhood: 'Bushwick', nights: 61, isYou: false },
  { rank: 2, neighborhood: 'LES', nights: 58, isYou: false },
  { rank: 3, neighborhood: 'Williamsburg', nights: 54, isYou: false },
  { rank: 4, neighborhood: 'East Village', nights: 51, isYou: false },
  { rank: 5, neighborhood: 'Crown Heights', nights: 47, isYou: false },
  { rank: 6, neighborhood: 'West Village', nights: 44, isYou: false },
  { rank: 7, neighborhood: 'Astoria', nights: 40, isYou: false },
  { rank: 847, neighborhood: 'Williamsburg', nights: 23, isYou: true },
]

export const BADGE_DEFS: BadgeDef[] = [
  { type: 'bar-crawl-king', name: 'Bar Crawl King', description: '7+ bars in one night', target: 7 },
  { type: 'night-owl', name: 'Night Owl', description: 'Out past 3am × 3', target: 3 },
  { type: 'borough-hopper', name: 'Borough Hopper', description: '3+ NYC boroughs', target: 3 },
  { type: 'regular', name: 'Regular', description: '5 visits same venue', target: 5 },
  { type: 'trendsetter', name: 'Trendsetter', description: 'First 10 check-ins at new venue', target: 10 },
  { type: 'crew-leader', name: 'Crew Leader', description: '5+ group nights started', target: 5 },
  { type: 'streak-master', name: 'Streak Master', description: '4 consecutive weekends', target: 4 },
  { type: 'vibe-curator', name: 'Vibe Curator', description: '20+ venues rated', target: 20 },
  { type: 'explorer', name: 'Explorer', description: '10+ unique neighborhoods', target: 10 },
  { type: 'summer-legend', name: 'Summer Legend', description: '30+ nights in a summer', target: 30 },
]

export const SEED_BADGES: BadgeState[] = BADGE_DEFS.map((def, i) => {
  const unlocked = ['night-owl', 'borough-hopper', 'regular', 'streak-master'].includes(def.type)
  return {
    def,
    unlocked,
    unlockedAt: unlocked ? new Date(Date.now() - (i + 3) * 86400000 * 5).toISOString() : null,
    progress: unlocked ? def.target : Math.floor(def.target * (0.2 + (i % 4) * 0.18)),
  }
})

function buildActivity(): number[] {
  const days: number[] = []
  const today = new Date()
  for (let i = 104; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    days.push(SEED_CHECKINS.filter((c) => c.userId === CURRENT_USER.id && c.nightDate === iso).length)
  }
  // guarantee a lively grid even with sparse personal check-ins
  return days.map((n, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (104 - i))
    const dow = d.getDay()
    if (n > 0) return n
    if ((dow === 5 || dow === 6) && i % 3 !== 0) return 1 + ((i * 7) % 4)
    return 0
  })
}

export const PROFILE_STATS: ProfileStats = {
  totalNights: 23,
  uniqueVenues: 18,
  neighborhoods: 7,
  longestStreak: 5,
  friendsCount: 8,
  topVenueIds: ['v-output', 'v-basement', 'v-tba', 'v-schimanski', 'v-elsewhere'],
  vibeBreakdown: [
    { vibe: 'techno', count: 12 },
    { vibe: 'house', count: 9 },
    { vibe: 'hip-hop', count: 5 },
    { vibe: 'R&B', count: 3 },
    { vibe: 'indie', count: 2 },
    { vibe: 'other', count: 2 },
  ],
  activityByDay: buildActivity(),
}

export const findVenue = (id: string): Venue | undefined => SEED_VENUES.find((v) => v.id === id)
export const findUser = (id: string): User | undefined =>
  id === CURRENT_USER.id ? CURRENT_USER : SEED_USERS.find((u) => u.id === id)

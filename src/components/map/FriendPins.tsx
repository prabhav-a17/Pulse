import { Avatar } from '@/components/ui/Avatar'
import type { User } from '@/types'

interface FriendPinProps {
  user: User
}

export function FriendPin({ user }: FriendPinProps) {
  return (
    <div className="pointer-events-none -translate-y-1" aria-label={`${user.username} is here`}>
      <Avatar src={user.avatarUrl} alt={user.username} size={30} ring />
    </div>
  )
}

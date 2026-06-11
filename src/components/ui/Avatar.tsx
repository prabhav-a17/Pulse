interface AvatarProps {
  src: string
  alt: string
  size?: number
  ring?: boolean
  className?: string
}

export function Avatar({ src, alt, size = 38, ring = false, className = '' }: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      className={`rounded-full bg-raised object-cover ${
        ring ? 'border-2 border-cyan glow-cyan' : 'border border-white/10'
      } ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

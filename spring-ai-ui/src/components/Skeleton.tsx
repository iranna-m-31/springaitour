interface SkeletonProps {
  /** Number of placeholder lines to render */
  lines?: number
  /** Height of each line (CSS length) */
  height?: string
  /** Optional custom width for the last line (e.g. "60%") */
  lastWidth?: string
  /** Optional className for the wrapping div */
  className?: string
}

/**
 * Skeleton - A shimmering placeholder used while data is loading.
 *
 * Renders N rectangular bars with a CSS-only shimmer animation. Use it
 * instead of "Loading..." text to give users a sense of the content shape
 * before it arrives.
 *
 * @example
 *   if (loading) return <Skeleton lines={4} />
 */
export default function Skeleton({
  lines = 3,
  height = '0.875rem',
  lastWidth,
  className,
}: SkeletonProps) {
  const items = Array.from({ length: lines }, (_, i) => i)
  return (
    <div className={`skeleton ${className ?? ''}`.trim()} role="status" aria-live="polite">
      {items.map((i) => {
        const isLast = i === items.length - 1
        const style: React.CSSProperties = { height }
        if (isLast && lastWidth) {
          style.width = lastWidth
        } else if (isLast) {
          style.width = '60%'
        }
        return <span key={i} className="skeleton-line" style={style} />
      })}
      <span className="sr-only">Loading…</span>
    </div>
  )
}

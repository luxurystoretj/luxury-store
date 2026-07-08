const SKELETON_COUNT = 8

// DESIGN §10: flat bg-surface, no shimmer/animate-pulse.
function ProductGridSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8"
      aria-hidden="true"
    >
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <div key={index} className="aspect-[3/4] w-full bg-surface" />
      ))}
    </div>
  )
}

export { ProductGridSkeleton }

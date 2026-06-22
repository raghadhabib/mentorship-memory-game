import "./skeletonCard.css";

// Skeleton loader
export function SkeletonCard() {
  return (
    <div className="skeleton">
      <div className="rect">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="cards-container">
      {Array.from({ length: 20 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

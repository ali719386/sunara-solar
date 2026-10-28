export function Sunburst({ className, rays = 12 }: { className?: string; rays?: number }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="7" fill="currentColor" />
      {Array.from({ length: rays }, (_, i) => (
        <line
          key={i}
          x1="24"
          y1="5"
          x2="24"
          y2="11"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          transform={`rotate(${(360 / rays) * i} 24 24)`}
        />
      ))}
    </svg>
  );
}

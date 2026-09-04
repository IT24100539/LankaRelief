export function occupancyTone(current, capacity) {
  if (!capacity) return 'urgent'
  const ratio = current / capacity
  if (ratio >= 0.9) return 'urgent'
  if (ratio >= 0.7) return 'medium'
  return 'safe'
}

export default function CapacityBar({ current, capacity, label = 'Occupancy' }) {
  const tone = occupancyTone(current, capacity)
  const pct = capacity ? Math.min(100, Math.round((current / capacity) * 100)) : 100

  return (
    <div className="capacity">
      <div className="capacity__meta">
        <span>{label}</span>
        <span>
          {current} / {capacity} · {pct}%
        </span>
      </div>
      <div
        className="capacity__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={current}
        aria-label={label}
      >
        <div
          className={`capacity__fill capacity__fill--${tone}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

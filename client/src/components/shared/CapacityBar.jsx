import './shared.css'

export default function CapacityBar({
  value = 0,
  max = 0,
  color = 'var(--safe)',
  className = '',
  label = 'Capacity',
  ...props
}) {
  const safeMax = Number(max) > 0 ? Number(max) : 0
  const safeValue = Math.max(0, Number(value) || 0)
  const pct = safeMax ? Math.min(100, (safeValue / safeMax) * 100) : 0
  const classes = ['ui-capacity', className].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      <div
        className="ui-capacity__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
      >
        <div
          className="ui-capacity__fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

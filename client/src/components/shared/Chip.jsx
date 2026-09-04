import './shared.css'

const VARIANT_MAP = {
  high: 'urgent',
  urgent: 'urgent',
  medium: 'medium',
  low: 'safe',
  safe: 'safe',
  available: 'safe',
  limited: 'medium',
  full: 'urgent',
  reserved: 'medium',
  used: 'status',
  status: 'status',
}

export default function Chip({ variant = 'status', className = '', children, ...props }) {
  const tone = VARIANT_MAP[String(variant).toLowerCase()] ?? 'status'
  const classes = ['ui-chip', `ui-chip--${tone}`, className].filter(Boolean).join(' ')

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}

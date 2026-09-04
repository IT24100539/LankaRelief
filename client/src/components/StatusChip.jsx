const LABELS = {
  urgent: 'Urgent',
  medium: 'Filling',
  safe: 'Open',
}

export default function StatusChip({ tone = 'safe', children }) {
  return (
    <span className={`chip chip--${tone}`}>{children ?? LABELS[tone]}</span>
  )
}

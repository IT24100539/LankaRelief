import './shared.css'

const VARIANTS = ['urgent', 'safe']

export default function StatCard({
  number,
  label,
  variant,
  className = '',
  ...props
}) {
  const tone = VARIANTS.includes(variant) ? variant : null
  const classes = ['ui-panel', 'ui-stat', className].filter(Boolean).join(' ')
  const numberClass = [
    'ui-stat__number',
    tone ? `ui-stat__number--${tone}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...props}>
      <p className={numberClass}>{number}</p>
      <p className="ui-stat__label">{label}</p>
    </div>
  )
}

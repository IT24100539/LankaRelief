import { Link } from 'react-router-dom'
import './shared.css'

const VARIANTS = ['urgent', 'dark', 'outline', 'ghost']

export default function Button({
  variant = 'dark',
  type = 'button',
  to,
  className = '',
  children,
  ...props
}) {
  const tone = VARIANTS.includes(variant) ? variant : 'dark'
  const classes = ['ui-btn', `ui-btn--${tone}`, className].filter(Boolean).join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

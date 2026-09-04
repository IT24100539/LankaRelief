import './shared.css'

export default function Panel({ className = '', children, ...props }) {
  const classes = ['ui-panel', className].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

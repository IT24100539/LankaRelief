import './shared.css'

export default function Ticker({
  message = 'Live: Rising water levels — Ratnapura',
}) {
  return (
    <div className="ui-ticker" role="status">
      <span className="ui-ticker__dot" aria-hidden="true" />
      <p className="ui-ticker__message">{message}</p>
    </div>
  )
}

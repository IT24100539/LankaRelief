import { useState } from 'react'
import OfferFeed from '../components/offers/OfferFeed.jsx'
import OfferForm from '../components/offers/OfferForm.jsx'
import './Offer.css'

export default function Offer() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="offer-page">
      <div className="offer-page__wrap">
        <div className="offer-page__intro">
          <h1>Offer Help</h1>
          <p>Share supplies or space, and see what others have already offered.</p>
        </div>
        <div className="offer-page__grid">
          <OfferForm onSubmit={() => setRefreshKey((key) => key + 1)} />
          <OfferFeed refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  )
}
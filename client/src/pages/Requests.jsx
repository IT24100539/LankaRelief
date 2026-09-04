import { useState } from 'react'
import RequestFeed from '../components/requests/RequestFeed.jsx'
import RequestForm from '../components/requests/RequestForm.jsx'
import './Requests.css'

export default function Requests() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="requests-page">
      <div className="requests-page__wrap">
        <div className="requests-page__intro">
          <h1>Help Requests</h1>
          <p>Submit a need or update an existing request.</p>
        </div>
        <div className="requests-page__grid">
          <RequestForm onSubmit={() => setRefreshKey((key) => key + 1)} />
          <RequestFeed refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import ShelterForm from '../components/shelters/ShelterForm.jsx'
import ShelterGrid from '../components/shelters/ShelterGrid.jsx'
import './Shelters.css'

export default function Shelters() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="shelters-page">
      <div className="shelters-page__wrap">
        <div className="shelters-page__intro">
          <h1>Shelters</h1>
          <p>Add a shelter or check remaining capacity before you travel.</p>
        </div>
        <div className="shelters-page__grid">
          <ShelterForm onSubmit={() => setRefreshKey((key) => key + 1)} />
          <ShelterGrid refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  )
}

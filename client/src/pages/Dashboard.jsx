import { useState } from 'react'
import CategoryChart from '../components/dashboard/CategoryChart.jsx'
import NoticeFeed from '../components/dashboard/NoticeFeed.jsx'
import NoticeForm from '../components/dashboard/NoticeForm.jsx'
import StatStrip from '../components/dashboard/StatStrip.jsx'
import './Dashboard.css'

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [latestNotice, setLatestNotice] = useState(null)

  function refresh() {
    setRefreshKey((key) => key + 1)
  }

  function handlePublished(notice) {
    setLatestNotice(notice)
    refresh()
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__wrap">
        <div className="dashboard-page__intro">
          <h1>Emergency Dashboard</h1>
          <p>Live request volume, shelter space, and urgent notices.</p>
        </div>
        <StatStrip refreshKey={refreshKey} />
        <div className="dashboard-page__main">
          <div className="dashboard-page__left">
            <NoticeForm onSubmit={handlePublished} />
            <CategoryChart refreshKey={refreshKey} />
          </div>
          <NoticeFeed
            refreshKey={refreshKey}
            latestNotice={latestNotice}
            onUpdate={refresh}
          />
        </div>
      </div>
    </div>
  )
}

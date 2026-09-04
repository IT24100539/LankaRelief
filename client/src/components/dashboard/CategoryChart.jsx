import { useEffect, useState } from 'react'
import { getRequests } from '../../api/requests.js'
import Panel from '../shared/Panel.jsx'
import './CategoryChart.css'

const CHART_BUCKETS = ['Water', 'Shelter', 'Medicine', 'Food', 'Transport']

const REQUEST_BUCKETS = {
  Water: 'Water',
  'Drinking water': 'Water',
  Shelter: 'Shelter',
  'Temporary shelter': 'Shelter',
  Medicine: 'Medicine',
  Food: 'Food',
  'Dry rations': 'Food',
  'Cooked meals': 'Food',
  Transport: 'Transport',
}

export const CATEGORY_CHART_FALLBACK = [
  { label: 'Water', percent: 32 },
  { label: 'Shelter', percent: 24 },
  { label: 'Medicine', percent: 16 },
  { label: 'Food', percent: 18 },
  { label: 'Transport', percent: 10 },
]

function normalizeRows(rows) {
  const byLabel = new Map(
    (Array.isArray(rows) ? rows : []).map((row) => [
      row.label,
      Math.max(0, Number(row.percent) || 0),
    ]),
  )

  return CHART_BUCKETS.map((label) => ({
    label,
    percent: Math.min(100, Math.round(byLabel.get(label) ?? 0)),
  }))
}

function rowsFromRequests(requests) {
  const counts = Object.fromEntries(CHART_BUCKETS.map((label) => [label, 0]))

  for (const item of requests) {
    const bucket = REQUEST_BUCKETS[item?.category]
    if (bucket) counts[bucket] += 1
  }

  const total = CHART_BUCKETS.reduce((sum, label) => sum + counts[label], 0)

  return CHART_BUCKETS.map((label) => ({
    label,
    percent: total ? Math.round((counts[label] / total) * 100) : 0,
  }))
}

async function loadFromRequests() {
  if (typeof getRequests !== 'function') return null
  const requests = await getRequests()
  if (!Array.isArray(requests)) return null
  return rowsFromRequests(requests)
}

export default function CategoryChart({
  data,
  fallback = CATEGORY_CHART_FALLBACK,
  refreshKey = 0,
}) {
  const [rows, setRows] = useState(() => normalizeRows(data ?? fallback))

  useEffect(() => {
    if (data) {
      setRows(normalizeRows(data))
      return undefined
    }

    let active = true

    loadFromRequests()
      .then((next) => {
        if (active) setRows(normalizeRows(next ?? fallback))
      })
      .catch(() => {
        if (active) setRows(normalizeRows(fallback))
      })

    return () => {
      active = false
    }
  }, [data, fallback, refreshKey])

  return (
    <Panel className="category-chart">
      <h2 className="category-chart__title">Requests by category</h2>
      <ul className="category-chart__list">
        {rows.map((row) => (
          <li className="category-chart__row" key={row.label}>
            <div className="category-chart__meta">
              <span className="category-chart__label">{row.label}</span>
              <span className="category-chart__percent">{row.percent}%</span>
            </div>
            <div
              className="category-chart__track"
              role="progressbar"
              aria-label={`${row.label} requests`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={row.percent}
            >
              <div
                className="category-chart__fill"
                style={{ width: `${row.percent}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

const REQUIRED = [
  'Button',
  'Chip',
  'Panel',
  'StatCard',
  'CapacityBar',
  'Navbar',
  'Ticker',
]

const ROUTES = [
  ['/', 'Home'],
  ['/requests', 'HelpRequests'],
  ['/offer', 'OfferHelp'],
  ['/shelters', 'Shelters'],
  ['/dashboard', 'EmergencyDashboard'],
  ['/about', 'About'],
]

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
})

try {
  const shared = await vite.ssrLoadModule('/src/components/shared/index.js')
  const missing = REQUIRED.filter((name) => typeof shared[name] !== 'function')
  if (missing.length) {
    throw new Error(`Missing shared exports: ${missing.join(', ')}`)
  }

  const pages = {
    Home: (await vite.ssrLoadModule('/src/pages/Home.jsx')).default,
    HelpRequests: (await vite.ssrLoadModule('/src/pages/HelpRequests.jsx')).default,
    OfferHelp: (await vite.ssrLoadModule('/src/pages/OfferHelp.jsx')).default,
    Shelters: (await vite.ssrLoadModule('/src/pages/Shelters.jsx')).default,
    EmergencyDashboard: (await vite.ssrLoadModule('/src/pages/EmergencyDashboard.jsx'))
      .default,
    About: (await vite.ssrLoadModule('/src/pages/About.jsx')).default,
  }

  renderToString(
    h(MemoryRouter, null, [
      h(shared.Ticker, { key: 'ticker' }),
      h(shared.Navbar, { key: 'nav' }),
      h(shared.Button, { key: 'btn', variant: 'urgent' }, 'Request help'),
      h(shared.Chip, { key: 'chip', variant: 'urgent' }, 'Urgent'),
      h(shared.Panel, { key: 'panel' }, 'Panel'),
      h(shared.StatCard, { key: 'stat', number: 0, label: 'Open help requests' }),
      h(shared.CapacityBar, { key: 'bar', value: 1, max: 2 }),
    ]),
  )

  for (const [path, name] of ROUTES) {
    renderToString(
      h(MemoryRouter, { initialEntries: [path] }, [
        h(shared.Navbar, { key: 'nav' }),
        h(pages[name], { key: name }),
      ]),
    )
  }

  console.log('shared exports: ok')
  console.log(`routes rendered: ${ROUTES.map(([path]) => path).join(', ')}`)
} finally {
  await vite.close()
}

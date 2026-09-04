import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/shared/Navbar.jsx'
import Ticker from './components/shared/Ticker.jsx'
import About from './pages/About.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Requests from './pages/Requests.jsx'
import Home from './pages/Home.jsx'
import Offer from './pages/Offer.jsx'
import Shelters from './pages/Shelters.jsx'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="site-chrome">
          <Ticker />
          <Navbar />
        </div>
        <main id="main" className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/offer" element={<Offer />} />
            <Route path="/shelters" element={<Shelters />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

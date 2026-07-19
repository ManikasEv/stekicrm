import { lazy, Suspense, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import logo from './assets/logo.jpeg'
import Icon from './components/Icon'
import LoginPage from './components/LoginPage'
import LogoutButton from './components/LogoutButton'
import { company, truckDetails } from './data/company'
import './App.css'

const OfferBuilder = lazy(() => import('./features/offers/OfferBuilder'))
const MenuView = lazy(() => import('./features/menu/MenuView'))

function App() {
  const { isLoaded, isSignedIn } = useAuth()
  const [activeModule, setActiveModule] = useState('dashboard')

  if (!isLoaded) {
    return <div className="module-loading">Sitzung wird geladen…</div>
  }

  if (!isSignedIn) {
    return <LoginPage />
  }

  if (activeModule === 'offer') {
    return (
      <Suspense fallback={<div className="module-loading">PDF-Generator wird geladen…</div>}>
        <OfferBuilder onBack={() => setActiveModule('dashboard')} />
      </Suspense>
    )
  }

  if (activeModule === 'menu') {
    return (
      <Suspense fallback={<div className="module-loading">Speisekarte wird geladen…</div>}>
        <MenuView onBack={() => setActiveModule('dashboard')} />
      </Suspense>
    )
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo">
            <img src={logo} alt="" />
          </span>
          <span>
            <strong>STEKI</strong>
            <small>Backoffice</small>
          </span>
        </div>
        <div className="header-actions">
          <div className="header-company">
            <span>{company.name}</span>
            <small>{company.email}</small>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="dashboard">
        <section className="dashboard-intro">
          <span className="dashboard-kicker">INTERNER ARBEITSBEREICH</span>
          <h1>Was möchtest du heute machen?</h1>
          <p>
            Erstelle eine professionelle Standortanfrage oder öffne die aktuelle STEKI-Speisekarte.
          </p>
        </section>

        <section className="module-cards">
          <button
            className="module-card offer-card"
            type="button"
            onClick={() => setActiveModule('offer')}
          >
            <span className="module-card-icon">
              <Icon name="document" size={28} />
            </span>
            <span className="module-card-number">01</span>
            <span className="module-card-copy">
              <small>STANDORT-PDF</small>
              <strong>Standortanfrage erstellen</strong>
              <p>
                Eigentümer oder Verwaltungen anfragen, um den Foodtruck auf ihrer Fläche zu
                platzieren. Technische Daten und Pläne werden automatisch ergänzt.
              </p>
            </span>
            <span className="module-card-arrow">
              Öffnen <Icon name="arrow" size={18} />
            </span>
          </button>

          <button
            className="module-card menu-card"
            type="button"
            onClick={() => setActiveModule('menu')}
          >
            <span className="module-card-icon">
              <Icon name="menu" size={28} />
            </span>
            <span className="module-card-number">02</span>
            <span className="module-card-copy">
              <small>QR-MENÜ & PREISE</small>
              <strong>Online-Menü bearbeiten</strong>
              <p>
                Gerichte, Preise und Verfügbarkeit ändern, das QR-Menü veröffentlichen und den
                fertigen QR-Code herunterladen.
              </p>
            </span>
            <span className="module-card-arrow">
              Öffnen <Icon name="arrow" size={18} />
            </span>
          </button>
        </section>

        <section className="dashboard-truck">
          <div className="truck-copy">
            <span className="dashboard-kicker">FOODTRUCK AUF EINEN BLICK</span>
            <h2>Technische Grunddaten</h2>
            <p>Diese Angaben werden automatisch in jedes neue Angebot übernommen.</p>
          </div>
          <div className="dashboard-facts">
            {truckDetails.map((detail) => (
              <div key={detail.label}>
                <span>{detail.label}</span>
                <strong>{detail.value}</strong>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span>STEKI Greek Taste · Internes Backoffice</span>
        <span>{company.website}</span>
      </footer>
    </div>
  )
}

export default App

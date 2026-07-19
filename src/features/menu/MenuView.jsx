import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Icon from '../../components/Icon'
import { extras, menuItems, sauces } from '../../data/menu'

const PUBLIC_MENU_URL = 'https://steki.ch/scanmenu'
const MENU_API_URL = import.meta.env.VITE_MENU_API_URL || 'https://steki.ch/api/menu'
// Same value must be set as MENU_ADMIN_TOKEN in the website Netlify project.
const MENU_ADMIN_TOKEN = import.meta.env.VITE_MENU_ADMIN_TOKEN || 'StekiMenuPublish2026!'

const defaultMenu = {
  notice: 'Alle Gerichte werden frisch für dich zubereitet.',
  sauces,
  items: menuItems.map((item) => ({
    id: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ...item,
    available: true,
  })),
  extras: extras.map((item) => ({
    id: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ...item,
    available: true,
  })),
}

const createId = (prefix) =>
  `${prefix}-${globalThis.crypto?.randomUUID?.() || Date.now()}`

const price = (value) =>
  new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)

export default function MenuView({ onBack }) {
  const [menu, setMenu] = useState(defaultMenu)
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Online-Menü wird geladen…')

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await fetch(MENU_API_URL, { cache: 'no-store' })
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)
        setMenu(await response.json())
        setStatus('ready')
        setMessage('Aktuelles Online-Menü geladen.')
      } catch {
        setStatus('offline')
        setMessage('Online-Menü noch nicht erreichbar. Lokale Grundkarte wird angezeigt.')
      }
    }

    loadMenu()
  }, [])

  const updateItem = (index, field, value) => {
    setMenu((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const updateExtra = (index, field, value) => {
    setMenu((current) => ({
      ...current,
      extras: current.extras.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addItem = () => {
    setMenu((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: createId('item'),
          name: 'Neues Gericht',
          greek: '',
          description: '',
          pita: 0,
          plate: 0,
          available: true,
          featured: false,
        },
      ],
    }))
  }

  const addExtra = () => {
    setMenu((current) => ({
      ...current,
      extras: [
        ...current.extras,
        {
          id: createId('extra'),
          name: 'Neue Beilage',
          description: '',
          price: 0,
          available: true,
        },
      ],
    }))
  }

  const removeItem = (index) => {
    setMenu((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const removeExtra = (index) => {
    setMenu((current) => ({
      ...current,
      extras: current.extras.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const publishMenu = async () => {
    setStatus('saving')
    setMessage('Änderungen werden veröffentlicht…')

    try {
      const response = await fetch(MENU_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${MENU_ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menu),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || `Request failed: ${response.status}`)

      setMenu(result.menu)
      setStatus('success')
      setMessage('Gespeichert! Das QR-Menü auf steki.ch/scanmenu ist jetzt aktuell.')
    } catch (error) {
      setStatus('error')
      setMessage(
        error.message === 'Unauthorized' || error.message?.includes('Unauthorized')
          ? 'Speichern fehlgeschlagen: Setze in Netlify die Variable MENU_ADMIN_TOKEN auf StekiMenuPublish2026!'
          : `Speichern fehlgeschlagen: ${error.message}`,
      )
    }
  }

  const downloadQr = () => {
    const svg = document.getElementById('steki-menu-qr')
    const source = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'STEKI-QR-Speisekarte.svg'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="module-page menu-editor-module">
      <div className="module-toolbar">
        <button className="back-button" type="button" onClick={onBack}>
          <Icon name="back" size={18} /> Übersicht
        </button>
        <div>
          <span className="module-kicker">QR-SPEISEKARTE</span>
          <h1>Online-Menü bearbeiten</h1>
        </div>
        <div className="toolbar-actions">
          <a className="secondary-button" href={PUBLIC_MENU_URL} target="_blank" rel="noreferrer">
            Menü öffnen <Icon name="arrow" size={17} />
          </a>
          <button
            className="primary-button"
            type="button"
            disabled={status === 'saving'}
            onClick={publishMenu}
          >
            <Icon name="check" size={17} />
            {status === 'saving' ? 'Wird gespeichert…' : 'Änderungen speichern'}
          </button>
        </div>
      </div>

      <div className="menu-editor-layout">
        <main className="form-stack">
          <section className="panel">
            <div className="panel-heading">
              <span className="step">01</span>
              <div>
                <h2>Allgemeine Angaben</h2>
                <p>Hinweis und verfügbare Saucen im QR-Menü</p>
              </div>
            </div>
            <div className="textarea-stack">
              <label className="field">
                <span>Hinweis oben im Menü</span>
                <input
                  value={menu.notice}
                  onChange={(event) =>
                    setMenu((current) => ({ ...current, notice: event.target.value }))
                  }
                />
              </label>
              <label className="field">
                <span>Saucen</span>
                <textarea
                  rows="3"
                  value={menu.sauces}
                  onChange={(event) =>
                    setMenu((current) => ({ ...current, sauces: event.target.value }))
                  }
                />
              </label>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading line-heading">
              <div className="heading-with-step">
                <span className="step">02</span>
                <div>
                  <h2>Hauptgerichte</h2>
                  <p>Namen, Beschreibungen, Preise und Verfügbarkeit</p>
                </div>
              </div>
              <button className="add-button" type="button" onClick={addItem}>
                <Icon name="plus" size={17} /> Gericht
              </button>
            </div>

            <div className="menu-editor-list">
              {menu.items.map((item, index) => (
                <article className={`menu-edit-card ${!item.available ? 'is-disabled' : ''}`} key={item.id}>
                  <div className="menu-edit-card-head">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <label className="availability-toggle">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={(event) => updateItem(index, 'available', event.target.checked)}
                      />
                      <span>{item.available ? 'Verfügbar' : 'Ausverkauft'}</span>
                    </label>
                    <label className="availability-toggle">
                      <input
                        type="checkbox"
                        checked={item.featured}
                        onChange={(event) => updateItem(index, 'featured', event.target.checked)}
                      />
                      <span>Beliebt</span>
                    </label>
                    <button
                      className="icon-button"
                      type="button"
                      aria-label={`${item.name} entfernen`}
                      onClick={() => removeItem(index)}
                    >
                      <Icon name="trash" size={17} />
                    </button>
                  </div>
                  <div className="menu-edit-fields">
                    <label className="field">
                      <span>Name</span>
                      <input
                        value={item.name}
                        onChange={(event) => updateItem(index, 'name', event.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span>Griechischer Name</span>
                      <input
                        value={item.greek || ''}
                        onChange={(event) => updateItem(index, 'greek', event.target.value)}
                      />
                    </label>
                    <label className="field wide-editor-field">
                      <span>Beschreibung</span>
                      <input
                        value={item.description}
                        onChange={(event) => updateItem(index, 'description', event.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span>Pita CHF</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={item.pita}
                        onChange={(event) => updateItem(index, 'pita', event.target.value)}
                      />
                    </label>
                    <label className="field">
                      <span>Teller CHF</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={item.plate}
                        onChange={(event) => updateItem(index, 'plate', event.target.value)}
                      />
                    </label>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading line-heading">
              <div className="heading-with-step">
                <span className="step">03</span>
                <div>
                  <h2>Beilagen & Extras</h2>
                  <p>Zusätzliche Produkte und Preise</p>
                </div>
              </div>
              <button className="add-button" type="button" onClick={addExtra}>
                <Icon name="plus" size={17} /> Extra
              </button>
            </div>

            <div className="extras-editor-list">
              {menu.extras.map((item, index) => (
                <article className={!item.available ? 'is-disabled' : ''} key={item.id}>
                  <label className="availability-toggle">
                    <input
                      type="checkbox"
                      checked={item.available}
                      onChange={(event) => updateExtra(index, 'available', event.target.checked)}
                    />
                    <span>{item.available ? 'Verfügbar' : 'Ausverkauft'}</span>
                  </label>
                  <label className="field">
                    <span>Name</span>
                    <input
                      value={item.name}
                      onChange={(event) => updateExtra(index, 'name', event.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Beschreibung</span>
                    <input
                      value={item.description}
                      onChange={(event) => updateExtra(index, 'description', event.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Preis CHF</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={item.price}
                      onChange={(event) => updateExtra(index, 'price', event.target.value)}
                    />
                  </label>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label={`${item.name} entfernen`}
                    onClick={() => removeExtra(index)}
                  >
                    <Icon name="trash" size={17} />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="menu-preview-panel">
            <div>
              <span className="module-kicker">VORSCHAU</span>
              <h2>Aktuell sichtbare Gerichte</h2>
            </div>
            <div className="editor-preview-list">
              {menu.items.filter((item) => item.available).map((item) => (
                <article key={item.id}>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </span>
                  <strong>{price(item.pita)} / {price(item.plate)}</strong>
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className="menu-publish-column">
          <section className="summary-card publish-card">
            <span className="summary-eyebrow">SPEICHERN</span>
            <h3>QR-Menü aktualisieren</h3>
            <p>
              Tippe auf den Button – die Änderungen erscheinen sofort unter{' '}
              <strong>steki.ch/scanmenu</strong>.
            </p>
            <button
              className="primary-button publish-button"
              type="button"
              disabled={status === 'saving'}
              onClick={publishMenu}
            >
              <Icon name="check" size={17} />
              {status === 'saving' ? 'Wird gespeichert…' : 'Änderungen speichern'}
            </button>
            <p className={`publish-status ${status}`}>{message}</p>
          </section>

          <section className="summary-card qr-card">
            <span className="summary-eyebrow">QR-CODE</span>
            <div className="qr-wrap">
              <QRCodeSVG
                id="steki-menu-qr"
                value={PUBLIC_MENU_URL}
                size={205}
                level="H"
                bgColor="#ffffff"
                fgColor="#071d38"
                marginSize={2}
              />
            </div>
            <strong>Aktuelle Speisekarte</strong>
            <a href={PUBLIC_MENU_URL} target="_blank" rel="noreferrer">
              steki.ch/scanmenu
            </a>
            <button className="secondary-button qr-download" type="button" onClick={downloadQr}>
              <Icon name="download" size={16} /> QR-Code herunterladen
            </button>
          </section>
        </aside>
      </div>
    </div>
  )
}

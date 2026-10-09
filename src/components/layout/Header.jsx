import { useState } from 'react'
import { site } from '../../data/site'

const links = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#nosotros', label: 'Quiénes somos' },
  { href: '#info', label: 'Horarios y ubicación' },
  { href: '#faq', label: 'Preguntas' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  function close() {
    setOpen(false)
  }

  return (
    <header className="nav">
      <div className="wrap nav-bar">
        <a className="brand" href="#inicio" onClick={close}>
          <b>{site.name}</b>
          <span>{site.tagline}</span>
        </a>
        <button
          className="burger"
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menú
        </button>
        <nav id="menu" className={open ? 'menu open' : 'menu'} aria-label="Principal">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
          <a className="btn btn--main btn--sm" href="#contacto" onClick={close}>
            Contacto
          </a>
        </nav>
      </div>
    </header>
  )
}

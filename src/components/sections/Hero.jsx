import { highlights } from '../../data/prices'
import { site } from '../../data/site'

export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="wrap">
        <div className="hero-kicker">{site.tagline}</div>
        <h1>
          La
          <br />
          Avenida
        </h1>
        <div className="hero-row">
          <p>{site.description}</p>
          <div className="cta">
            <a className="btn btn--main" href="#servicios">
              Ver lavados
            </a>
            <a className="btn btn--line" href="#servicios">
              Servicios adicionales
            </a>
          </div>
        </div>
        <div className="facts">
          {highlights.map((item) => (
            <div key={item.title}>
              <b>{item.title}</b>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

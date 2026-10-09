import { site } from '../../data/site'

export function Contact() {
  return (
    <section id="contacto">
      <h2>Contacto</h2>
      {site.address ? <p>{site.address}</p> : null}
    </section>
  )
}

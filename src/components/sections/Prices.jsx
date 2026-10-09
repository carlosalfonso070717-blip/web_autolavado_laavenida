import { priceCategories } from '../../data/prices'

export function Prices() {
  return (
    <section id="precios">
      <h2>Precios</h2>
      {priceCategories.length === 0 ? <p>Listado pendiente.</p> : null}
    </section>
  )
}

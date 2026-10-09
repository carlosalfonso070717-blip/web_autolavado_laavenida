import { site } from '../../data/site'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <b>{site.name}</b>
        <p>
          {site.tagline} {site.name}. {site.place}. Est. {site.since}.
        </p>
      </div>
    </footer>
  )
}

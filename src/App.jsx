import { useEffect } from 'react'
import markup from './content/page.html?raw'
import { initSite } from './site/boot'
import { loadCar } from './site/loadCar'

function App() {
  useEffect(() => {
    initSite()
    loadCar()
  }, [])

  return <div dangerouslySetInnerHTML={{ __html: markup }} />
}

export default App

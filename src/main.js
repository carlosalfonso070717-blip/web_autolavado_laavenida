import { initSite } from './site/boot.js'
import { loadCar } from './site/loadCar.js'

requestAnimationFrame(function () {
  initSite()
  window.__ferrariGlb = fetch('/ferrari.glb', { priority: 'low' }).then(function (r) {
    return r.arrayBuffer()
  })
  setTimeout(loadCar, 700)
})

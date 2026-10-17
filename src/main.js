import { initSite } from './site/boot.js'
import { loadCar } from './site/loadCar.js'

function startCar() {
  var host = document.getElementById('car3d')
  if (!host) return
  if (!window.__ferrariGlb) {
    window.__ferrariGlb = fetch('/ferrari.glb', { priority: 'high' }).then(function (r) {
      if (!r.ok) throw new Error('glb')
      return r.arrayBuffer()
    })
  }
  loadCar()
}

startCar()
requestAnimationFrame(function () { initSite() })

import { initSite } from './site/boot.js'
import { loadCar } from './site/loadCar.js'

function startCar() {
  var host = document.getElementById('car3d')
  if (!host) return
  if (!window.__ferrariGlb) {
    window.__ferrariGlb = fetch('/ferrari.glb').then(function (r) {
      if (!r.ok) throw new Error('glb')
      return r.arrayBuffer()
    })
  }
  var run = function () { loadCar() }
  if (!('IntersectionObserver' in window)) { run(); return }
  var watch = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return
    watch.disconnect()
    run()
  }, { rootMargin: '40% 0px' })
  watch.observe(host)
}

requestAnimationFrame(function () {
  initSite()
  startCar()
})

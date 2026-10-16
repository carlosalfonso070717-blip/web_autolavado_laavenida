import { initSite } from './site/boot.js'
import { loadCar } from './site/loadCar.js'

function carLite() {
  var small = Math.min(window.innerWidth, window.innerHeight) < 700
  return small || matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency || 8) <= 4
}

function startCar() {
  if (carLite()) return
  var host = document.getElementById('car3d')
  if (!host) return
  var run = function () {
    if (window.__ferrariGlb) return
    window.__ferrariGlb = fetch('/ferrari.glb', { priority: 'low' }).then(function (r) {
      return r.arrayBuffer()
    })
    loadCar()
  }
  var idle = function () {
    if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 1500 })
    else setTimeout(run, 700)
  }
  if (!('IntersectionObserver' in window)) {
    idle()
    return
  }
  var watch = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return
    watch.disconnect()
    idle()
  }, { rootMargin: '12% 0px' })
  watch.observe(host)
}

requestAnimationFrame(function () {
  initSite()
  startCar()
})
